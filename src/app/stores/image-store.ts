import { makeAutoObservable, runInAction } from 'mobx';
import imagesApi from '@api/media/images.api';
import Image, { ImageCreate } from '@models/media/image.model';
import { arrayMove } from '@dnd-kit/sortable';

export default class ImageStore {
    public ImageMap = new Map<number, Image>();

    public constructor() {
        makeAutoObservable(this);
    }

    public addImage = (image: Image) => {
        this.setItem(image);
    };

    private setInternalMap = (images: Image[]) => {
        images.forEach(this.setItem);
    };

    private setItem = (image: Image) => {
        this.ImageMap.set(image.id, image);
    };

    get getImageArray() {
        return Array.from(this.ImageMap.values());
    }

    static async getImageById(imageId: number): Promise<Image | undefined> {
        let image: Image | undefined;
        await imagesApi.getById(imageId)
            .then((im) => {
                image = im;
            })
            .catch((error) => { });
        return image;
    }

    public getImage = (id: number) => this.ImageMap.get(id);


    public fetchImage = async (id: number) => {
        if (!id || id <= 0) return;

        try {
            const image = await imagesApi.getById(id);
            runInAction(() => {
                this.setItem(this.transformToImage(image));
            });
        } catch (error: unknown) { }
    };

    public fetchImageByStreetcodeId = async (streetcodeId: number) => {
        try {
            const image = await imagesApi.getByStreetcodeId(streetcodeId);
            runInAction(() => {
                this.setInternalMap(image.map(this.transformToImage));
            });
        } catch (error: unknown) { }
    };

    public createImage = async (image: ImageCreate, localUrl?: string) => {
        try {
            const resp = await imagesApi.create(image);
            runInAction(() => {
                const newImage = { ...this.transformToImage(resp), url: localUrl ?? '' };
                this.setItem(newImage);
            });
        } catch (error: unknown) { }
    };

    public updateImage = async (image: Image) => {
        try {
            await imagesApi.update(image);
            runInAction(() => {
                const updatedImage = {
                    ...this.ImageMap.get(image.id),
                    ...image,
                };
                this.setItem(updatedImage as Image);
            });
        } catch (error: unknown) { }
    };

    public deleteImage = async (imageId: number) => {
        try {
            await imagesApi.delete(imageId);
            runInAction(() => {
                this.ImageMap.delete(imageId);
            });
        } catch (error: unknown) { }
    };

    public fetchAll = async () => {
        try {
            const rawImages = await imagesApi.getAll();
            runInAction(() => {
                rawImages.forEach(img => this.setItem(this.transformToImage(img)));
            });
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    public reorderImages = (oldIndex: number, newIndex: number) => {
        runInAction(() => {
            const arr = Array.from(this.ImageMap.values());
            const moved = arrayMove(arr, oldIndex, newIndex);
            this.ImageMap.clear();
            moved.forEach(img => this.setItem(img));
        });
    };

    public moveImageToTemplate = (imageId: number) => {
        runInAction(() => this.ImageMap.delete(imageId));
    };

    public moveImageBackToGallery = (image: Image) => {
        runInAction(() => this.setItem(image));
    };

    public addImageBackToGallery = (image: Image) => {
        runInAction(() => this.setItem(image));
    };

    private readonly transformToImage = (image: Image): Image => {
        return {
            ...image,
            url: image.url ?? `/static-files/${image.id}.png`,
            isPublished: image.isPublished ?? false
        };
    };
}
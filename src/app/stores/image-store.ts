import { makeAutoObservable, runInAction } from 'mobx';
import imagesApi from '@api/media/images.api';
import Image, { ImageCreate } from '@models/media/image.model';
import { arrayMove } from '@dnd-kit/sortable';

export default class ImageStore {
    public ImageMap = new Map<number, Image>();

    public constructor() {
        makeAutoObservable(this);
    }


    public getImage = (id: number) => this.ImageMap.get(id);

    get getImageArray(): Image[] {
        return Array.from(this.ImageMap.values());
    }

    private setItem = (image: Image) => {
        this.ImageMap.set(image.id, image);
    };

    // --- Логика загрузки и API ---
    public fetchAll = async () => {
        try {
            const rawImages = await imagesApi.getAll();
            runInAction(() => {
                rawImages.forEach(img => {
                    this.setItem(this.transformToImage(img));
                });
            });
        } catch (error) {
            console.error('Error fetching all images:', error);
        }
    };

    public fetchImage = async (id: number) => {
        try {
            const image = await imagesApi.getById(id);
            this.setItem(this.transformToImage(image));
        } catch (error: unknown) { }
    };

    public createImage = async (data: ImageCreate, localUrl?: string): Promise<Image | undefined> => {
        try {
            const rawImage = await imagesApi.create(data);
            const image = { ...this.transformToImage(rawImage), url: localUrl ?? '' };
            runInAction(() => this.setItem(image));
            return image;
        } catch (error) {
            console.error('Store error (createImage):', error);
            return undefined;
        }
    };

    public updateImage = async (image: Image) => {
        try {
            await imagesApi.update(image);
            runInAction(() => {
                const updatedImage = { ...this.ImageMap.get(image.id), ...image };
                this.setItem(updatedImage as Image);
            });
        } catch (error: unknown) { }
    };

    public deleteImage = async (imageId: number): Promise<boolean> => {
        try {
            await imagesApi.delete(imageId);
            runInAction(() => this.ImageMap.delete(imageId));
            return true;
        } catch (error) {
            console.error('Store error:', error);
            return false;
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
        runInAction(() => {
            this.ImageMap.set(Number(image.id), image);
        });
    };

    public addImageBackToGallery = (image: Image) => {
        runInAction(() => this.setItem(image));
    };


    private transformToImage = (image: Image): Image => {
        return {
            ...image,
            url: image.url ?? `/static-files/${image.id}.png`,
            isPublished: image.isPublished ?? false
        };
    };
}

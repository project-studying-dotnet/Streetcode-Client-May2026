import { makeAutoObservable, runInAction } from 'mobx';
import imagesApi from '@api/media/images.api';
import Image, { ArtImage, ImageCreate } from '@models/media/image.model';
import { arrayMove } from '@dnd-kit/sortable';

export default class ImageStore {
    public ImageMap: Map<number, ArtImage> = new Map();

    public constructor() {
        makeAutoObservable(this);
    }

    get getImageArray(): ArtImage[] {
        return Array.from(this.ImageMap.values());
    }

    public fetchAll = async () => {
        try {
            const rawImages = await imagesApi.getAll();

            runInAction(() => {
                rawImages.forEach(img => {
                    this.ImageMap.set(Number(img.id), this.transformToArtImage(img));
                });
            });
        } catch (error) {
            console.error('Error fetching all images:', error);
        }
    };

    public createImage = async (
        data: ImageCreate,
        localUrl?: string
    ): Promise<ArtImage | undefined> => {
        try {
            const rawImage = await imagesApi.create(data);

            const artImage: ArtImage = {
                ...this.transformToArtImage(rawImage),
                url: localUrl ?? ''
            };
            console.log("artImage", artImage);
            runInAction(() => {
                this.ImageMap.set(Number(artImage.id), artImage);
            });

            return artImage;
        } catch (error) {
            console.error('Store error (createImage):', error);
            return undefined;
        }
    };

    public addImageBackToGallery = (image: ArtImage) => {
        runInAction(() => {
            this.ImageMap.set(Number(image.id), image);
        });
    };



    public deleteImage = async (imageId: number): Promise<boolean> => {
        try {
            await imagesApi.delete(imageId);

            runInAction(() => {
                this.ImageMap.delete(imageId);
            });

            return true;
        } catch (error) {
            console.error('Store error:', error);
            return false;
        }
    };

    public moveImageToTemplate = (imageId: number) => {
        runInAction(() => {
            this.ImageMap.delete(imageId);
        });
    };

    public moveImageBackToGallery = (image: ArtImage) => {
        runInAction(() => {
            this.ImageMap.set(Number(image.id), image);
        });
    };

    public reorderImages = (oldIndex: number, newIndex: number) => {
        runInAction(() => {
            const arr = Array.from(this.ImageMap.values());
            const moved = arrayMove(arr, oldIndex, newIndex);
            this.ImageMap.clear();
            moved.forEach(img => this.ImageMap.set(Number(img.id), img));
        });
    };

    private transformToArtImage = (image: Image): ArtImage => {
        const path = `/static-files/${image.id}.png`;

        return {
            ...image,
            url: path,
            isPublished: false
        };
    };
}
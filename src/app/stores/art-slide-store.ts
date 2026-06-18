import { makeAutoObservable, runInAction } from 'mobx';
import ArtSlidesApi from '@api/media/art-slide.api';
import { ArtSlide, CreateArtSlide, UpdateArtSlide } from '@models/media/art-slide.model';

export default class ArtSlideStore {
    public artSlides: ArtSlide[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public fetchArtSlidesByStreetcodeId = async (streetcodeId: number) => {
        try {
            const slides = await ArtSlidesApi.getAllByStreetcodeId(streetcodeId);
            runInAction(() => {
                this.artSlides = slides;
            });
        } catch (error) {
            console.error("Error loading slides:", error);
            throw error;
        }
    };

    public createArtSlide = async (dto: CreateArtSlide) => {
        try {
            const newSlide = await ArtSlidesApi.create(dto);
            runInAction(() => {
                this.artSlides.push(newSlide);
            });
            return newSlide;
        } catch (error) {
            console.error("Slide creation error:", error);
            throw error;
        }
    };

    public createAllArtSlides = async (dtos: CreateArtSlide[]) => {
        try {
            const newSlides = await ArtSlidesApi.createAll(dtos);
            runInAction(() => {
                this.artSlides.push(...newSlides);
            });
            return newSlides;
        }
      catch (error: any) {
    console.log('FULL ERROR:', error);
    console.log('ERRORS:', error.errors);
    console.log('ERRORS JSON:', JSON.stringify(error.errors, null, 2));

    throw error;
}
        };

    public updateArtSlide = async (dto: UpdateArtSlide) => {
        try {
            const updatedSlide = await ArtSlidesApi.update(dto);
            runInAction(() => {
                const index = this.artSlides.findIndex(s => s.id === updatedSlide.id);
                if (index !== -1) {
                    this.artSlides[index] = updatedSlide;
                }
            });
        } catch (error) {
            console.error("Error updating slide:", error);
            throw error;
        }
    };

    public deleteArtSlide = async (id: number) => {
        try {
            await ArtSlidesApi.delete(id);
            runInAction(() => {
                this.artSlides = this.artSlides.filter(s => s.id !== id);
            });
        } catch (error) {
            console.error("Error delete slide::", error);
            throw error;
        }
    };
}
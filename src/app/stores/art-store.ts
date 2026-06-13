import { makeAutoObservable, runInAction } from 'mobx';
import ArtsApi from '@api/media/arts.api';
import Art from '@models/media/art.model';

export default class ArtStore {
    public arts: Art[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    public createArt = async (artData: FormData | Art) => {
        try {
            const newArt = await ArtsApi.create(artData as any);

            runInAction(() => {
                this.arts.push(newArt);
            });
            return newArt;
        } catch (error) {
            console.error("Failed to save art:", error);
            throw error;
        }
    };

    public updateArt = async (id: number, data: { title: string; description: string }) => {
        try {
            const updatedArt = await ArtsApi.update(id, data);

            runInAction(() => {
                const index = this.arts.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.arts[index] = { ...this.arts[index], ...updatedArt };
                }
            });
        } catch (error) {
            console.error("Ошибка обновления:", error);
            throw error;
        }
    };
}
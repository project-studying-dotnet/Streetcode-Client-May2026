import type  Image  from '@models/media/image.model';

export interface SlotConfig {
    id: string;
    artId: number;
    image?: Image | null;
}

export interface ArtSlideTemplate {
    id: number;
    name: string;
    templateId: number;
    templateName: string;
    gap: number;
    slots: SlotConfig[];
    isSavedToDb: boolean;
}

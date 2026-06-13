export interface SlotConfig {
    id: string;
}

export interface ArtSlideTemplate {
    id: number;
    name: string;
    gap: number;
    slots: SlotConfig[];
}

export interface ArtSlide {
    id: number;
    index: number;
    templateId: number;
    artSlideItems: ArtSlideItem[];
}


export interface ArtSlideItem {
    id: number;
    artId: number;
    index: number;
}

export interface CreateArtSlide {
    streetcodeId: number;
    index: number;
    templateId: number;
    artSlideItems: CreateArtSlideItem[];
}

export interface CreateArtSlideItem {
    artId: number;
    index: number;
}

export interface UpdateArtSlide {
    id: number;
    index: number;
    templateId: number;
    artSlideItems: ArtSlideItem[];
}
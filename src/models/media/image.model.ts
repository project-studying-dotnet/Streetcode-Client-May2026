import IModelState from '@models/interfaces/IModelState';

export default interface Image {
    id: number;
    base64?: string;
    blobName?: string;
    mimeType?: string;
    imageDetails?: ImageDetails;
}

export enum ImageAssigment {
    animation,
    blackandwhite,
    relatedfigure,
}

export interface ImageCreate {
    title?: string;
    baseFormat: string;
    mimeType: string;
    extension: string;
}
export interface ImageDetails {
    id: number;
    title?: string;
    alt?: string;
    imageId: number;
}

export interface ImageCreateUpdate extends IModelState {
    id: number;
    streetcodeId?: number | null;
    imageDetails?: ImageDetails;
}


export interface ArtImage extends Image {
    id: number; 
    url: string; 
    isPublished: boolean;
}

export interface GalleryListProps {
    images: ArtImage[];
    onUpload: (file: File) => void;
    onDelete: (id: number) => void;
    onEdit: (image: ArtImage) => void;
}

export interface ImageCardProps {
    image: ArtImage;
    attributes: any;
    listeners: any;

    onDelete: (id: string) => void;
    onEdit: (image: ArtImage) => void;
    isConfirming: boolean;
    onConfirmRequest: () => void;
    onCancelRequest: () => void;
}

export interface SortableImageCardProps {
    image: ArtImage;
    onDelete: (id: number) => void;
    onEdit: (image: ArtImage) => void;
    isConfirming: boolean;
    onConfirmRequest: () => void;
    onCancelRequest: () => void;
}





import IModelState from '@models/interfaces/IModelState';

export default interface Image {
    id: number;
    base64?: string;
    blobName?: string;
    mimeType?: string;
    imageDetails?: ImageDetails;
      url?: string; 
    isPublished?: boolean;
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

export interface GalleryListProps {
    images: Image[];
    onUpload: (file: File) => void;
    onDelete: (id: number) => void;
    onEdit: (image: Image) => void;
}

export interface ImageCardProps {
    image: Image;
    attributes: any;
    listeners: any;

    onDelete: (id: string) => void;
    onEdit: (image: Image) => void;
    isConfirming: boolean;
    onConfirmRequest: () => void;
    onCancelRequest: () => void;
}

export interface SortableImageCardProps {
    image: Image;
    onDelete: (id: number) => void;
    onEdit: (image: Image) => void;
    isConfirming: boolean;
    onConfirmRequest: () => void;
    onCancelRequest: () => void;
}





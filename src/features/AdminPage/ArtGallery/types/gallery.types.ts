// export interface ArtImage {
//   id: string;
//   url: string;
//   title?: string;
//   description?: string;
//   isPublished: boolean;
//   offset: number;
// }

// export interface GalleryListProps {
//   images: ArtImage[];
//   onUpload: (file: File) => void;
//   onDelete: (id: string) => void;
//   onEdit: (image: ArtImage) => void;
// }

// export interface ImageCardProps {
//   image: ArtImage;
//   attributes: any; 
//   listeners: any;
// }

// export interface SortableImageCardProps {
//   image: ArtImage;
//   onDelete: (id: string) => void;
//   onEdit: (image: ArtImage) => void;
//   isConfirming: boolean;
//   onConfirmRequest: () => void;
//   onCancelRequest: () => void;
// }

export interface DeleteConfirmationOverlayProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}


export interface AdminArtControlsProps {
  onDelete: () => void;
  onEdit: () => void;
}

export interface Template {
  id: number;
  previewUrl: string; 
}
export interface TemplateHeaderProps {
    onOpenTemplates: () => void; 
}
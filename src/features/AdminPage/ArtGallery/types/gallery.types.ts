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
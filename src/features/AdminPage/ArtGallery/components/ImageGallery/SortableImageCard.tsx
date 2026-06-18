import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageCard } from './ImageCard';
import { SortableImageCardProps } from '@models/media/image.model';


export const SortableImageCard: React.FC<SortableImageCardProps> = ({
    image,
    onDelete,
    onEdit,
    isConfirming,
    onConfirmRequest,
    onCancelRequest
}) => {
    const { attributes, listeners, setNodeRef, transform, transition,isDragging } = useSortable({
        id: `img_${image.id}`
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto'
    };

    return (
        <div ref={setNodeRef} style={style}>
                <ImageCard
                    image={image}
                    onDelete={() => onDelete(image.id)}
                    onEdit={() => onEdit(image)}
                    isConfirming={isConfirming}
                    onConfirmRequest={onConfirmRequest}
                    onCancelRequest={onCancelRequest}
                    attributes={attributes}
                    listeners={listeners}
                />
        </div>
    );
};
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Spin } from 'antd';
import './SortableTemplateCard.styles.scss';

import { TemplateCard } from './TemplateCard';

export const SortableTemplateCard = ({
  template,
  editingTemplateId,
  onEdit,
  onDelete
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: `tmpl_${template.id}`
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true); 
    onDelete(template.id);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      {isDeleting ? (
        <div className="template-card deleting">
          {/* <Spin size="small" /> */}
        </div>
      ) : (
      <TemplateCard
        template={template}
        isActive={template.id === editingTemplateId}
        attributes={attributes}
        listeners={listeners}
        onEdit={onEdit}
        onDelete={handleDelete}
      />
      )}
    </div>
  );
};
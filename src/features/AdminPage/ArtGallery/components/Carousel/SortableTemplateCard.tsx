
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { TemplateCard } from './TemplateCard';

export const SortableTemplateCard = ({
  template,
  onEdit
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
      <TemplateCard
        template={template}
        attributes={attributes}
        listeners={listeners}
        onEdit={onEdit}
      />
    </div>
  );
};
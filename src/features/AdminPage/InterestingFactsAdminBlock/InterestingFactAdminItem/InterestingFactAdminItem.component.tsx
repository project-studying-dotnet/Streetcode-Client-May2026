import { MouseEvent } from 'react';
import { DeleteOutlined, EditOutlined, HolderOutlined } from '@ant-design/icons';
import { Draggable } from 'react-beautiful-dnd';

import { FactUpdate } from '@/models/streetcode/text-contents.model';

import INTERESTING_FACTS_ADMIN_MESSAGES from '../interesting-facts-admin-block.constants';

interface Props {
    fact: FactUpdate;
    index: number;
    onEdit: (factId: number) => void;
    onDelete: (factId: number) => void;
}

const stopMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
};

const InterestingFactAdminItem = ({
    fact,
    index,
    onEdit,
    onDelete,
}: Props) => (
    <Draggable
        draggableId={String(fact.id)}
        index={index}
    >
        {(draggableProvided, snapshot) => (
            <li
                className={`factAdminItem ${snapshot.isDragging ? 'isDragging' : ''}`}
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
            >
                <span
                    className="dragHandle"
                    {...draggableProvided.dragHandleProps}
                    aria-label={INTERESTING_FACTS_ADMIN_MESSAGES.DRAG_HANDLE}
                    role="button"
                    tabIndex={0}
                >
                    <HolderOutlined />
                </span>
                <p className="factTitle">
                    {fact.title?.trim() || INTERESTING_FACTS_ADMIN_MESSAGES.UNTITLED_FACT}
                </p>
                <span className="factActions">
                    <button
                        type="button"
                        aria-label={INTERESTING_FACTS_ADMIN_MESSAGES.EDIT_FACT}
                        onMouseDown={stopMouseDown}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            onEdit(fact.id);
                        }}
                    >
                        <EditOutlined />
                    </button>
                    <button
                        type="button"
                        aria-label={INTERESTING_FACTS_ADMIN_MESSAGES.DELETE_FACT}
                        onMouseDown={stopMouseDown}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            onDelete(fact.id);
                        }}
                    >
                        <DeleteOutlined />
                    </button>
                </span>
            </li>
        )}
    </Draggable>
);

export default InterestingFactAdminItem;

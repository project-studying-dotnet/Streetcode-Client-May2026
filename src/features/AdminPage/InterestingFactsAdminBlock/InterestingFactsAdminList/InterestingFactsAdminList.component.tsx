import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import StrictModeDroppable from '@/app/common/components/StrictModeDroppable';
import { FactUpdate } from '@/models/streetcode/text-contents.model';

import InterestingFactAdminItem from '../InterestingFactAdminItem/InterestingFactAdminItem.component';

interface Props {
    facts: FactUpdate[];
    onDragEnd: (result: DropResult) => void;
    onEdit: (factId: number) => void;
    onDelete: (factId: number) => void;
}

const InterestingFactsAdminList = ({
    facts,
    onDragEnd,
    onEdit,
    onDelete,
}: Props) => (
    <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="facts-admin-list">
            {(provided) => (
                <ul
                    className="factsAdminList"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {facts.map((fact, index) => (
                        <InterestingFactAdminItem
                            key={fact.id}
                            fact={fact}
                            index={index}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {provided.placeholder}
                </ul>
            )}
        </StrictModeDroppable>
    </DragDropContext>
);

export default InterestingFactsAdminList;

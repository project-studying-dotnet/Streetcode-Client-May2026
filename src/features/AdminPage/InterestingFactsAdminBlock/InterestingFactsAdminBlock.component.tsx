import './InterestingFactsAdminBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, MouseEvent } from 'react';
import {
    DeleteOutlined, EditOutlined, HolderOutlined, PlusOutlined,
} from '@ant-design/icons';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import useMobx, { useModalContext } from '@stores/root-store';

import { Button, message } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import StrictModeDroppable from '@/app/common/components/StrictModeDroppable';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import { FactUpdate } from '@/models/streetcode/text-contents.model';

interface Props {
    streetcodeId: number;
}

const InterestingFactsAdminBlock = ({ streetcodeId }: Props) => {
    const { factsStore } = useMobx();
    const { modalStore } = useModalContext();

    useEffect(() => {
        factsStore.setAdminStreetcodeId(streetcodeId);
        return () => factsStore.setAdminStreetcodeId(null);
    }, [streetcodeId, factsStore]);

    useAsync(async () => {
        if (streetcodeId > 0) {
            const facts = await factsStore.fetchFactsByStreetcodeId(streetcodeId);
            await Promise.all(
                facts.map(async (fact) => {
                    if (fact.imageId && !fact.image) {
                        const image = await ImagesApi.getById(fact.imageId);
                        factsStore.updateFactInMap({ ...fact, image } as FactUpdate);
                    }
                }),
            );
        }
    }, [streetcodeId]);

    const openCreateModal = () => {
        modalStore.setModal('adminFacts', undefined, true);
    };

    const openEditModal = (factId: number) => {
        modalStore.setModal('adminFacts', factId, true);
    };

    const handleDeleteClick = (factId: number, event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        modalStore.setConfirmationModal(
            'confirmation',
            async () => {
                try {
                    await factsStore.deleteAdminFact(factId);
                    message.success('Факт видалено');
                } catch {
                    message.error('Не вдалося видалити факт');
                } finally {
                    modalStore.setConfirmationModal('confirmation', undefined, undefined, false);
                }
            },
            'Ви впевнені, що хочете видалити цей факт?',
            true,
            () => modalStore.setConfirmationModal('confirmation', undefined, undefined, false),
        );
    };

    const handleEditClick = (factId: number, event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        openEditModal(factId);
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const { source, destination } = result;
        if (source.index === destination.index) {
            return;
        }
        factsStore.reorderFacts(source.index, destination.index);
        const saved = await factsStore.persistFactsOrder();
        if (!saved) {
            message.error('Не вдалося зберегти порядок фактів');
        }
    };

    const facts = factsStore.getFactArray;

    return (
        <section className="factsAdminBlock">
            <header className="factsAdminHeader">
                <h2>Wow-факти</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="streetcode-custom-button"
                    onClick={openCreateModal}
                    aria-label="Додати факт"
                />
            </header>

            {facts.length === 0 ? (
                <p className="factsAdminEmpty">Фактів ще немає. Натисніть «+», щоб додати перший.</p>
            ) : (
            <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable droppableId="facts-admin-list">
                    {(provided) => (
                        <ul
                            className="factsAdminList"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {facts.map((fact, index) => (
                                <Draggable
                                    key={fact.id}
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
                                                aria-hidden
                                            >
                                                <HolderOutlined />
                                            </span>
                                            <p className="factTitle">{fact.title}</p>
                                            <span className="factActions">
                                                <button
                                                    type="button"
                                                    aria-label="Редагувати"
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => handleEditClick(fact.id, e)}
                                                >
                                                    <EditOutlined />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Видалити"
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onClick={(e) => handleDeleteClick(fact.id, e)}
                                                >
                                                    <DeleteOutlined />
                                                </button>
                                            </span>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </StrictModeDroppable>
            </DragDropContext>
            )}
        </section>
    );
};

export default observer(InterestingFactsAdminBlock);

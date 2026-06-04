import './ChronologyAdminBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Tooltip } from 'antd';

import ChronologyAdminModal from './ChronologyAdminModal.component';
import CHRONOLOGY_ADMIN_MESSAGES from './chronology-admin-block.constants';
import useChronologyAdminBlock from './useChronologyAdminBlock.hook';

interface Props {
    streetcodeId: number;
}

const ChronologyAdminBlock = ({ streetcodeId }: Props) => {
    const {
        timelineItems,
        openCreateModal,
        openEditModal,
        confirmDeleteTimelineItem,
    } = useChronologyAdminBlock(streetcodeId);

    return (
        <section className="chronologyAdminBlock">
            <header className="chronologyAdminHeader">
                <h2>Хронологія</h2>
                <Tooltip title={CHRONOLOGY_ADMIN_MESSAGES.ADD_EVENT}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="streetcode-custom-button"
                        onClick={openCreateModal}
                        aria-label={CHRONOLOGY_ADMIN_MESSAGES.ADD_EVENT}
                    />
                </Tooltip>
            </header>

            {timelineItems.length === 0 ? (
                <Empty description={CHRONOLOGY_ADMIN_MESSAGES.EMPTY} />
            ) : (
                <div className="chronologyAdminList">
                    {timelineItems.map((item) => (
                        <article key={item.id} className="chronologyAdminItem">
                            <div className="chronologyAdminItemContent">
                                <p className="chronologyAdminDate">
                                    {new Date(item.date).toLocaleDateString('uk-UA')}
                                </p>

                                <h3 className="chronologyAdminTitle">
                                    {item.title}
                                </h3>

                                {item.description && (
                                    <p className="chronologyAdminDescription">
                                        {item.description}
                                    </p>
                                )}

                                {item.historicalContexts?.length > 0 && (
                                    <p className="chronologyAdminContext">
                                        {item.historicalContexts
                                            .map((context) => context.title)
                                            .join(', ')}
                                    </p>
                                )}
                            </div>

                            <div className="chronologyAdminActions">
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => openEditModal(item.id)}
                                />
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => confirmDeleteTimelineItem(item.id)}
                                />
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <ChronologyAdminModal streetcodeId={streetcodeId} />
        </section>
    );
};

export default observer(ChronologyAdminBlock);
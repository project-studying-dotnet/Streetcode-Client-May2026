import './InterestingFactsAdminBlock.styles.scss';

import { observer } from 'mobx-react-lite';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Spin, Tooltip } from 'antd';

import InterestingFactsAdminList from './InterestingFactsAdminList/InterestingFactsAdminList.component';
import INTERESTING_FACTS_ADMIN_MESSAGES from './interesting-facts-admin-block.constants';
import useAdminFactsBlock from './useAdminFactsBlock.hook';

interface Props {
    streetcodeId: number;
}

const InterestingFactsAdminBlock = ({ streetcodeId }: Props) => {
    const {
        facts,
        isLoading,
        isSaving,
        openCreateModal,
        openEditModal,
        confirmDeleteFact,
        handleDragEnd,
    } = useAdminFactsBlock(streetcodeId);

    const renderContent = () => {
        if (isLoading && facts.length === 0) {
            return (
                <p className="factsAdminLoading">
                    <Spin size="small" />
                    {' '}
                    {INTERESTING_FACTS_ADMIN_MESSAGES.LOADING}
                </p>
            );
        }

        if (facts.length === 0) {
            return (
                <p className="factsAdminEmpty">
                    {INTERESTING_FACTS_ADMIN_MESSAGES.EMPTY}
                </p>
            );
        }

        return (
            <InterestingFactsAdminList
                facts={facts}
                onDragEnd={handleDragEnd}
                onEdit={openEditModal}
                onDelete={confirmDeleteFact}
            />
        );
    };

    return (
        <section className="factsAdminBlock">
            <header className="factsAdminHeader">
                <h2>Wow-факти</h2>
                <Tooltip title={INTERESTING_FACTS_ADMIN_MESSAGES.ADD_FACT}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="streetcode-custom-button"
                        onClick={openCreateModal}
                        aria-label={INTERESTING_FACTS_ADMIN_MESSAGES.ADD_FACT}
                        loading={isSaving}
                    />
                </Tooltip>
            </header>

            {renderContent()}
        </section>
    );
};

export default observer(InterestingFactsAdminBlock);

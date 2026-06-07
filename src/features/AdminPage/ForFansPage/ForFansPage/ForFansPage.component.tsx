import './ForFansPage.style.scss';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import SourceItem from '@features/AdminPage/ForFansPage/ForFansPage/SourceItem';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import AddSourceModal from './CategoryAdminModal.component';

const ForFansPage = () => {
    const { sourcesAdminStore } = useMobx();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const handleAdd = () => {
        setIsAddModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    return (
        <div className="forFansPage">
            <div className="forFansHeader">
                <Button
                    className="streetcode-custom-button forFansAddButton"
                    onClick={handleAdd}
                >
                    Додати категорію
                </Button>
            </div>

            <div className="forFansGrid">
                {sourcesAdminStore.getSourcesAdmin.map((srcCategory: SourceCategoryAdmin) => (
                    <SourceItem srcCategory={srcCategory} key={srcCategory.id} />
                ))}
            </div>

            <AddSourceModal
                isAddModalVisible={isAddModalVisible}
                handleAddCancel={handleAddCancel}
            />
        </div>
    );
};

export default observer(ForFansPage);
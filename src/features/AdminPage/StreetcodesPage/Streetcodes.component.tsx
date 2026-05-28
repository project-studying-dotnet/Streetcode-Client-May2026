import './Streetcodes.styles.scss';

import { observer } from 'mobx-react-lite';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Streetcode, { StreetcodeCatalogRecord } from "@/models/streetcode/streetcode-types.model";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useMobx, { useModalContext } from '@/app/stores/root-store';
import StreetcodesApi from '@api/streetcode/streetcodes.api';

import AdminBar from '../AdminBar.component';
import { useNavigate } from 'react-router/dist';
import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import { useEffect } from 'react';

const Streetcodes:React.FC = observer(() => {
    const { streetcodeCatalogStore } = useMobx();
    const navigate = useNavigate();
    const { modalStore } = useModalContext();

    useEffect(() => {
        streetcodeCatalogStore.fetchStreetcodesAll();
    }, []);

    const columns: ColumnsType<Streetcode> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            render(value, record) {
                return (
                    <div key={`${value}${record.id}`} className="streetcode-table-item-name">
                        <p>{value}</p>
                    </div>
                );
            },
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (value, streetcode, index) => (
                <div key={`${streetcode.id}${index}`} className="streetcode-page-actions">
                    <EditOutlined
                        key={`${streetcode.id}${index}111`}
                        className="actionButton"
                        onClick={() => navigate(`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/${streetcode.id}`)}
                    />
                    <DeleteOutlined
                        key={`${streetcode.id}${index}222`}
                        className="actionButton"
                        onClick={() => {
                            modalStore.setConfirmationModal(
                                'confirmation',
                                () => {
                                    StreetcodesApi.delete(streetcode.id)
                                        .then(() => {
                                            streetcodeCatalogStore.streetcodesMap.delete(streetcode.id);
                                        }).catch((e) => { });
                                    modalStore.setConfirmationModal('confirmation');
                                },
                                'Ви впевнені, що хочете видалити цей стріткод?',
                            );
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="streetcodes-page">
            <AdminBar />
            <div className="streetcodes-page-container">
                <div className="container-justify-end">
                    <Button
                        className="streetcode-custome-button add-button"
                        onClick={() => navigate(`${FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}`)}
                    >
                        Додати стріткод
                    </Button>
                </div>
                <Table
                    pagination={{ pageSize: 10 }}
                    className="streetcodes-table"
                    columns={columns}
                    dataSource={streetcodeCatalogStore?.getStreetcodesArray}
                    rowKey="id"
                />
            </div>
        </div>
    );
});

export default Streetcodes;

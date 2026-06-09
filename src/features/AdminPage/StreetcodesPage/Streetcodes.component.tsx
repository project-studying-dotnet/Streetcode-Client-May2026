import './Streetcodes.styles.scss';

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Streetcode from "@/models/streetcode/streetcode-types.model";
import { DeleteOutlined, EditOutlined, SearchOutlined, } from "@ant-design/icons";
import useMobx, { useModalContext } from '@/app/stores/root-store';
import StreetcodesApi from '@api/streetcode/streetcodes.api';
import Input from "antd/es/input";
import CustomSortIcon from '@/app/common/components/SortIcon.component';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

export enum StreetcodeStatus {
    Draft = 0,
    Published = 1,
    Archived = 2,
}

const statusLabels: Record<number, string> = {
    [StreetcodeStatus.Draft]: 'Чернетка',
    [StreetcodeStatus.Published]: 'Опублікований',
    [StreetcodeStatus.Archived]: 'Заархівований',
};

const Streetcodes:React.FC = observer(() => {
    const { streetcodeCatalogStore } = useMobx();
    const navigate = useNavigate();
    const { modalStore } = useModalContext();
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<number | undefined>();

    useEffect(() => {
        streetcodeCatalogStore.fetchStreetcodesAll();
    }, []);

    const modalHandler = (streetcode: Streetcode) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => {
                StreetcodesApi.delete(streetcode.id)
                    .then(() => {
                        streetcodeCatalogStore.streetcodesMap.delete(streetcode.id);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                modalStore.setConfirmationModal('confirmation');
            },
            'Ви впевнені, що хочете видалити цей стріткод?',
        );
    };

    const filteredStreetcodes = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();

        return (streetcodeCatalogStore?.getStreetcodesArray ?? []).filter((streetcode) => {
            const author = [
                streetcode.firstName,
                streetcode.lastName,
            ].filter(Boolean).join(' ');

            const matchesSearch = !normalizedSearch
                || [
                    streetcode.title,
                    streetcode.index?.toString(),
                    author || 'Тест',
                ].some((value) => value?.toLowerCase().includes(normalizedSearch));

            const matchesStatus = selectedStatus === undefined
                || streetcode.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [
        searchText,
        selectedStatus,
        streetcodeCatalogStore?.getStreetcodesArray,
    ]);
    
    const columns: ColumnsType<Streetcode> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => (a.title ?? '').localeCompare(b.title ?? ''),
            sortIcon: CustomSortIcon,
            render: (value, record) => (
                <div key={`${value}${record.id}`} className="streetcode-table-item-name">
                    <p>{value}</p>
                </div>
            ),
        },
        {
            title: 'Номер',
            dataIndex: 'index',
            key: 'index',
            width: '12%',
            sortIcon: CustomSortIcon,
            sorter: (a, b) => (a.index ?? 0) - (b.index ?? 0),
            render: (value, record) => value ?? record.id,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: '16%',
            render: (status) => (
                <Select
                    value={status}
                    size="small"
                    options={[
                        { value: StreetcodeStatus.Draft, label: statusLabels[StreetcodeStatus.Draft] },
                        { value: StreetcodeStatus.Published, label: statusLabels[StreetcodeStatus.Published] },
                        { value: StreetcodeStatus.Archived, label: statusLabels[StreetcodeStatus.Archived] },
                    ]}
                />
            ),
        },
        {
            title: 'Автор',
            key: 'author',
            width: '14%',
            render: (_, record) => {
                const author = [
                    record.firstName,
                    record.lastName,
                ].filter(Boolean).join(' ');

                return author || 'Тест';
            },
        },
        {
            title: 'Історія',
            key: 'historyDate',
            width: '16%',
            sorter: (a, b) => {
                const aDate = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
                const bDate = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();

                return aDate - bDate;
            },
            sortIcon: CustomSortIcon,
            render: (_, record) => {
                const date = record.updatedAt ?? record.createdAt;

                if (!date) {
                    return '-';
                }

                return (
                    <div className="streetcode-history-date">
                        <span className="history-date">
                            {new Date(date).toLocaleDateString('uk-UA')}
                        </span>

                        <span className="history-time">
                            {new Date(date).toLocaleTimeString('uk-UA', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                );
            },
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (_, streetcode, index) => (
                <div key={`${streetcode.id}${index}`} className="streetcode-page-actions">
                    <EditOutlined
                        className="actionButton"
                        onClick={() => navigate(`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/${streetcode.id}`)}
                    />

                    <DeleteOutlined
                        className="actionButton"
                        onClick={() => modalHandler(streetcode)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="streetcodes-page">
            <div className="streetcodes-page-container">
                <div className="streetcodes-page-header">
                    <Input
                        placeholder="Пошук по назві, номеру та автору"
                        prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                        className="streetcodes-search-input"
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="streetcodes-header-actions">
                        <Select
                            placeholder="Статус"
                            allowClear
                            className="streetcodes-status-filter"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={[
                                {
                                    value: StreetcodeStatus.Published,
                                    label: statusLabels[StreetcodeStatus.Published],
                                },
                                {
                                    value: StreetcodeStatus.Draft,
                                    label: statusLabels[StreetcodeStatus.Draft],
                                },
                                {
                                    value: StreetcodeStatus.Archived,
                                    label: statusLabels[StreetcodeStatus.Archived],
                                },
                            ]}
                        />
                        <Button
                            className="streetcode-custome-button add-button"
                            onClick={() => navigate(`${FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}`)}
                        >
                            Додати History-код
                        </Button>
                    </div>
                </div>
                <Table
                    pagination={{ pageSize: 10 }}
                    className="streetcodes-table"
                    columns={columns}
                    dataSource={filteredStreetcodes}
                    rowKey="id"
                />
            </div>
        </div>
    );
});

export default Streetcodes;

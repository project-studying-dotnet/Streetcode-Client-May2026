import './NewsPage.styles.scss';

import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import News from '@models/news/news.model';
import Image from '@models/media/image.model';
import useMobx, { useModalContext } from '@stores/root-store';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import CustomSortIcon from '@/app/common/components/SortIcon.component';

import NewsModal from '@features/AdminPage/NewsPage/NewsModal/NewsModal.component';

const NewsPage = () => {
    const { newsStore } = useMobx();
    const { modalStore } = useModalContext();

    const [searchValue, setSearchValue] = useState('');
    const [modalAddOpened, setModalAddOpened] = useState(false);
    const [modalEditOpened, setModalEditOpened] = useState(false);
    const [newsToEdit, setNewsToEdit] = useState<News>();

    useEffect(() => {
        newsStore.getAll();
    }, [newsStore]);

    const filteredNews = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        if (!normalizedSearch) {
            return newsStore.getNewsArray;
        }

        return newsStore.getNewsArray.filter((news) =>
            news.title.toLowerCase().includes(normalizedSearch),
        );
    }, [newsStore.getNewsArray, searchValue]);

    const handleDeleteNews = async (newsId: number) => {
        await newsStore.deleteNews(newsId);
    };

    const openDeleteModal = (news: News) => {
        modalStore.setConfirmationModal(
            'confirmation',
            () => handleDeleteNews(news.id),
            'Ви впевнені, що хочете видалити цю новину?',
            true,
            undefined,
            {
                title: '',
                okText: 'Підтвердити',
                cancelText: 'Скасувати',
                className: 'admin-confirmation-modal',
            },
        );
    };

    const openEditModal = (news: News) => {
        setNewsToEdit(news);
        setModalEditOpened(true);
    };

    const columns: ColumnsType<News> = [
        {
            title: 'Назва',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortIcon: CustomSortIcon,
            render: (title: string) => (
                <span className="news-title">{title}</span>
            ),
        },
        {
            title: 'Зображення',
            dataIndex: 'image',
            key: 'image',
            render: (image: Image | undefined, record) => {
                if (!image?.base64) {
                    return <span>-</span>;
                }

                return (
                    <img
                        key={`${record.id}${image.id}`}
                        className="news-table-image"
                        src={base64ToUrl(image.base64, image.mimeType ?? '')}
                        alt={image.imageDetails?.alt ?? record.title ?? 'News image'}
                    />
                );
            },
        },
        {
            title: 'Дата',
            dataIndex: 'creationDate',
            key: 'creationDate',
            sorter: (a, b) =>
                dayjs(a.creationDate).valueOf() - dayjs(b.creationDate).valueOf(),
            sortIcon: CustomSortIcon,
            render: (creationDate: News['creationDate']) => (
                <div className="news-date">
                    <span>{dayjs(creationDate).format('DD.MM.YYYY')}</span>
                    <span>{dayjs(creationDate).format('HH:mm:ss')}</span>
                </div>
            ),
        },
        {
            title: 'Дії',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (_value, news, index) => (
                <div key={`${news.id}${index}`} className="news-page-actions">
                    <EditOutlined
                        key={`${news.id}${index}edit`}
                        className="actionButton"
                        onClick={() => openEditModal(news)}
                    />

                    <DeleteOutlined
                        key={`${news.id}${index}delete`}
                        className="actionButton"
                        onClick={() => openDeleteModal(news)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="news-page">
            <div className="news-page-container">
                <div className="news-page-header">
                    <Input
                        allowClear
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        placeholder="Назва"
                        className="news-search-input"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />

                    <Button
                        className="admin-page-add-button"
                        onClick={() => setModalAddOpened(true)}
                    >
                        Додати новину
                    </Button>
                </div>

                <Table
                    rowKey="id"
                    className="news-table"
                    columns={columns}
                    dataSource={filteredNews}
                    pagination={{ pageSize: 10 }}
                />
            </div>

            <NewsModal
                open={modalAddOpened}
                setIsModalOpen={setModalAddOpened}
            />

            <NewsModal
                open={modalEditOpened}
                setIsModalOpen={setModalEditOpened}
                newsItem={newsToEdit}
            />
        </div>
    );
};

export default observer(NewsPage);
import './SourcesAdminBlock.styles.scss';

import { useCallback, useEffect, useState } from 'react';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import sourcesApi from '@api/sources/sources.api';
import {
    SourceCategory,
    SourceCategoryName,
    StreetcodeCategoryContent,
} from '@models/sources/sources.model';

import {
    Button,
    Card,
    Empty,
    message,
    Modal,
    Spin,
} from 'antd';

import SourcesAdminModal from './SourcesAdminModal.component';

interface Props {
    streetcodeId: number;
}

type SourceCategoryWithText = SourceCategory & {
    text?: string;
    previewText?: string;
};

const getPreviewText = (html = '', wordsLimit = 100) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const text = doc.body.textContent?.trim() ?? '';
    const words = text.split(/\s+/).filter(Boolean);

    return words.length > wordsLimit
        ? `${words.slice(0, wordsLimit).join(' ')}...`
        : text;
};

const SourcesAdminBlock = ({ streetcodeId }: Props) => {
    const [items, setItems] = useState<SourceCategoryWithText[]>([]);
    const [categories, setCategories] = useState<SourceCategoryName[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingContent, setEditingContent] =
        useState<StreetcodeCategoryContent | null>(null);

    const loadData = useCallback(async (signal?: AbortSignal) => {
        setLoading(true);

        try {
            const [streetcodeCategories, allCategories] = await Promise.all([
                sourcesApi.getCategoriesByStreetcodeId(streetcodeId),
                sourcesApi.getAllNames(),
            ]);

            if (signal?.aborted) return;

            const categoriesWithText = await Promise.all(
                streetcodeCategories.map(async (category) => {
                    const content =
                        await sourcesApi.getCategoryContentByStreetcodeId(
                            streetcodeId,
                            category.id,
                        );

                    const previewText = getPreviewText(content.text);

                    return {
                        ...category,
                        text: content.text,
                        previewText,
                    };
                }),
            );

            if (signal?.aborted) return;

            setItems(categoriesWithText);
            setCategories(allCategories);
        } catch (e) {
            message.error('Не вдалося завантажити блок "Для фанатів"');
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [streetcodeId]);

    useEffect(() => {
        if (streetcodeId <= 0) return;

        const controller = new AbortController();

        loadData(controller.signal);

        return () => controller.abort();
    }, [streetcodeId, loadData]);

    const handleCreate = () => {
        setEditingContent(null);
        setModalOpen(true);
    };

    const handleEdit = async (categoryId: number) => {
        try {
            const content =
                await sourcesApi.getCategoryContentByStreetcodeId(
                    streetcodeId,
                    categoryId,
                );

            setEditingContent(content);
            setModalOpen(true);
        } catch {
            message.error('Не вдалося завантажити контент категорії');
        }
    };

    const handleDelete = (categoryId: number) => {
        Modal.confirm({
            title: 'Видалити блок?',
            content: 'Ви впевнені, що хочете видалити цей блок з "Для фанатів"?',
            okText: 'Видалити',
            cancelText: 'Скасувати',
            async onOk() {
                try {
                    await sourcesApi.deleteContent(streetcodeId, categoryId);
                    message.success('Блок видалено');
                    loadData();
                } catch {
                    message.error('Не вдалося видалити блок');
                }
            },
        });
    };

    const handleSave = async (content: StreetcodeCategoryContent) => {
        try {
            if (editingContent) {
                await sourcesApi.updateContent(content);
                message.success('Блок оновлено');
            } else {
                await sourcesApi.createContent(content);
                message.success('Блок створено');
            }

            setModalOpen(false);
            setEditingContent(null);
            loadData();
        } catch {
            message.error('Не вдалося зберегти блок');
        }
    };

    let content: React.ReactNode;

    if (loading) {
        content = <Spin />;
    } else if (items.length === 0) {
        content = <Empty description="Немає блоків" />;
    } else {
        content = (
            <div className="sourcesAdminList">
                {items.map((item) => (
                    <Card key={item.id} className="sourcesAdminCard">
                        <div className="sourcesAdminContent">
                            <h3 className="sourcesAdminCardTitle">{item.title}</h3>

                            <p className="sourcesAdminPreview">
                                {item.previewText}
                            </p>
                        </div>

                        <div className="sourcesAdminActions">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(item.id)}
                            />

                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(item.id)}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <section className="sourcesAdminBlock">
            <header className="sourcesAdminHeader">
                <h2 className="sourcesAdminTitle">Для фанатів</h2>

                <Button
                    icon={<PlusOutlined className="sourcesAdminAddIcon"/>}
                    className="streetcode-custom-button sourcesAdminAddButton"
                    onClick={handleCreate}
                />
            </header>

            {content}

            <SourcesAdminModal
                open={modalOpen}
                streetcodeId={streetcodeId}
                categories={categories}
                initialContent={editingContent}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingContent(null);
                }}
                onSave={handleSave}
            />
        </section>
    );
};

export default SourcesAdminBlock;
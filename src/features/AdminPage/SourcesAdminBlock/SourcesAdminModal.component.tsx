import { useEffect, useMemo, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {
    SourceCategoryName,
    StreetcodeCategoryContent,
} from '@models/sources/sources.model';

import { Form, Modal, Select, Button, message } from 'antd';

import './SourcesAdminModal.styles.scss';

interface Props {
    open: boolean;
    streetcodeId: number;
    categories: SourceCategoryName[];
    initialContent: StreetcodeCategoryContent | null;
    onCancel: () => void;
    onSave: (content: StreetcodeCategoryContent) => Promise<void>;
}

const TEXT_LIMIT = 4000;

const getPlainText = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
};

const SourcesAdminModal = ({
    open,
    streetcodeId,
    categories,
    initialContent,
    onCancel,
    onSave,
}: Props) => {
    const [form] = Form.useForm();
    const [text, setText] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                sourceLinkCategoryId: initialContent?.sourceLinkCategoryId,
            });

            setText(initialContent?.text ?? '');
        }
    }, [open, initialContent, form]);

    const plainTextLength = useMemo(() => {
        return getPlainText(text).length;
    }, [text]);

    const isOverLimit = plainTextLength > TEXT_LIMIT;

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (!text.trim()) {
                message.error('Текст є обовʼязковим');
                return;
            }

            if (isOverLimit) {
                message.error(`Ліміт — ${TEXT_LIMIT} символів (без HTML тегів)`);
                return;
            }

            setSaving(true);

            await onSave({
                id: initialContent?.id,
                streetcodeId,
                sourceLinkCategoryId: values.sourceLinkCategoryId,
                text,
            });

            onCancel();
        } catch {
            message.error('Не вдалося зберегти блок');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="sourcesAdminModal"
        >
            <h2 className="sourcesAdminModalTitle">Для фанатів</h2>

            <Form form={form} layout="vertical">
                <Form.Item
                    name="sourceLinkCategoryId"
                    label="Категорія"
                    rules={[
                        {
                            required: true,
                            message: 'Оберіть категорію',
                        },
                    ]}
                >
                    <Select
                        disabled={!!initialContent}
                        placeholder="Оберіть категорію"
                        options={categories.map((category) => ({
                            value: category.id,
                            label: category.title,
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Текст">
                    <Editor
                        value={text}
                        onEditorChange={(value) => {
                            setText(value);
                        }}
                        init={{
                            height: 300,
                            menubar: false,
                            branding: false,
                            statusbar: false,
                            plugins: 'link lists',
                            toolbar:
                                'undo redo | blocks | bold italic | link | alignleft aligncenter alignright | bullist numlist',
                            block_formats:
                                'Абзац=p; Заголовок 1=h1; Заголовок 2=h2; Заголовок 3=h3',
                            link_title: false,
                            target_list: false,
                        }}
                    />

                    <div
                        className={`sourcesAdminSymbolsCounter ${isOverLimit ? 'error' : ''
                            }`}
                    >
                        {plainTextLength}/{TEXT_LIMIT}
                    </div>
                </Form.Item>

                <Button
                    type="primary"
                    loading={saving}
                    disabled={saving || isOverLimit}
                    onClick={handleSave}
                    className="sourcesAdminModalSaveBtn"
                >
                    Зберегти
                </Button>
            </Form>
        </Modal>
    );
};

export default SourcesAdminModal;
import { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {
    SourceCategoryName,
    StreetcodeCategoryContent,
} from '@models/sources/sources.model';

import {
    Form, Modal, Select, message,
} from 'antd';

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

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                sourceLinkCategoryId: initialContent?.sourceLinkCategoryId,
            });

            setText(initialContent?.text ?? '');
        }
    }, [open, initialContent, form]);

    const handleSave = async () => {
        const values = await form.validateFields();

        if (!text.trim()) {
            message.error('Текст є обовʼязковим');
            return;
        }

        if (text.length > TEXT_LIMIT) {
            message.error(`Максимальна довжина тексту — ${TEXT_LIMIT} символів`);
            return;
        }

        await onSave({
            id: initialContent?.id,
            streetcodeId,
            sourceLinkCategoryId: values.sourceLinkCategoryId,
            text,
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="sourcesAdminModal"
        >
            <h2 className="sourcesAdminModalTitle">
                Для фанатів
            </h2>

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
                            if (value.length <= TEXT_LIMIT) {
                                setText(value);
                            }
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

                    <div className="sourcesAdminSymbolsCounter">
                        {text.length}
                        /
                        {TEXT_LIMIT}
                    </div>
                </Form.Item>

                <button
                    type="button"
                    className="sourcesAdminModalSaveBtn"
                    onClick={handleSave}
                >
                    Зберегти
                </button>
            </Form>
        </Modal>
    );
};

export default SourcesAdminModal;
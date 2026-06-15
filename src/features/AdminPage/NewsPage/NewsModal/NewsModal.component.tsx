import './NewsModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import CancelBtn from '@images/utils/Cancel_btn.svg';

import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {
    Button,
    DatePicker,
    Form,
    Input,
    Modal,
    UploadFile,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';

import useMobx from '@stores/root-store';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import PreviewFileModal from '@/app/common/components/PreviewFileModal/PreviewFileModal.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import News from '@/models/news/news.model';

type NewsFormValues = {
    title?: string;
    urlSlug?: string;
    text?: string;
    image?: number;
    creationDate?: dayjs.Dayjs;
};

type NewsRequestDto = {
    id: number;
    title: string;
    text: string;
    imageId: number;
    url: string;
    creationDate: string;
};

interface Props {
    newsItem?: News;
    open: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const getNewsUrl = (news: News): string => {
    const urlValue = news as unknown as {
        url?: string | { href?: string };
        URL?: string;
    };

    if (typeof urlValue.url === 'string') {
        return urlValue.url;
    }

    return urlValue.url?.href ?? urlValue.URL ?? '';
};

const NewsModal: React.FC<Props> = observer(({
    newsItem,
    open,
    setIsModalOpen,
}) => {
    const [form] = Form.useForm();
    const { newsStore } = useMobx();

    const [uploadedImageId, setUploadedImageId] = useState<number | undefined>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);

    const handlePreview = (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    useEffect(() => {
        if (newsItem && open) {
            const hasExistingImage = Boolean(newsItem.imageId && newsItem.image?.base64);

            setUploadedImageId(hasExistingImage ? newsItem.imageId : undefined);

            form.setFieldsValue({
                title: newsItem.title,
                urlSlug: getNewsUrl(newsItem),
                text: newsItem.text,
                image: hasExistingImage ? newsItem.imageId : undefined,
                creationDate: newsItem.creationDate
                    ? dayjs(newsItem.creationDate)
                    : undefined,
            });

            return;
        }

        if (open) {
            setUploadedImageId(undefined);
            setFilePreview(null);
            setPreviewOpen(false);
            form.resetFields();
        }
    }, [newsItem, open, form]);

    const closeAndCleanData = () => {
        form.resetFields();
        setUploadedImageId(undefined);
        setFilePreview(null);
        setPreviewOpen(false);
        setIsModalOpen(false);
    };

    const scrollToInvalidField = () => {
        const formElement = document.querySelector('.ant-form') as HTMLElement;
        const firstInvalidField = formElement?.querySelector(
            '.ant-form-item-has-error',
        ) as HTMLElement;

        firstInvalidField?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    const handleOk = async () => {
        if (!uploadedImageId && !newsItem?.imageId) {
            form.setFieldsValue({ image: undefined });
            return;
        }
        try {
            await form.validateFields();
            form.submit();
        } catch {
            scrollToInvalidField();
        }
    };

    const onSuccessfulSubmitNews = async (formValues: NewsFormValues) => {
        const title = formValues.title?.trim();
        const urlSlug = formValues.urlSlug?.trim();
        const text = formValues.text?.trim();

        if (!title || !urlSlug || !text || !formValues.creationDate) {
            return;
        }

        const imageIdToSave = uploadedImageId ?? newsItem?.imageId;

        if (!imageIdToSave) {
            form.setFields([
                {
                    name: 'image',
                    errors: ['Завантажте фото'],
                },
            ]);

            return;
        }

        const newsDto: NewsRequestDto = {
            id: newsItem?.id ?? 0,
            title,
            text,
            imageId: imageIdToSave,
            url: urlSlug,
            creationDate: formValues.creationDate.toISOString(),
        };

        if (newsItem) {
            await newsStore.updateNews(newsDto as unknown as News);
        } else {
            await newsStore.createNews(newsDto as unknown as News);
        }

        closeAndCleanData();
    };

    return (
        <Modal
            open={open}
            onCancel={closeAndCleanData}
            className="modalContainer news-modal"
            footer={null}
            closeIcon={<CancelBtn />}
            destroyOnClose
        >
            <div className="modalContainer-content">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSuccessfulSubmitNews}
                >
                    <div className="center">
                        <h2>
                            {newsItem ? 'Редагувати новину' : 'Додати новину'}
                        </h2>
                    </div>

                    <Form.Item
                        name="title"
                        label="Заголовок"
                        rules={[
                            { required: true, message: 'Введіть заголовок' },
                            { whitespace: true, message: 'Заголовок не може бути порожнім' },
                            { max: 100, message: 'Заголовок не може бути довшим за 100 символів' },
                        ]}
                    >
                        <Input maxLength={100} showCount />
                    </Form.Item>

                    <Form.Item
                        name="urlSlug"
                        label="Транслітерація для URL"
                        rules={[
                            { required: true, message: 'Введіть транслітерацію для URL' },
                            { whitespace: true, message: 'URL не може бути порожнім' },
                            { max: 200, message: 'URL не може бути довшим за 200 символів' },
                            {
                                pattern: /^[a-z0-9-]+$/,
                                message: 'Дозволені тільки латинські літери, цифри та дефіс',
                            },
                        ]}
                    >
                        <Input maxLength={200} showCount />
                    </Form.Item>

                    <Form.Item
                        name="text"
                        label="Текст"
                        rules={[
                            { required: true, message: 'Введіть текст новини' },
                            { whitespace: true, message: 'Текст не може бути порожнім' },
                            { max: 15000, message: 'Текст не може бути довшим за 15000 символів' },
                        ]}
                    >
                        <TextArea
                            maxLength={15000}
                            showCount
                            className="news-modal-textarea"
                        />
                    </Form.Item>

                    <Form.Item name="image" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Фото"
                        required
                        validateStatus={!uploadedImageId ? 'error' : undefined}
                        help={!uploadedImageId ? 'Завантажте фото' : undefined}
                    >
                        <FileUploader
                            className="news-photo-uploader"
                            multiple={false}
                            accept=".jpeg,.png,.jpg"
                            listType="picture-card"
                            maxCount={1}
                            onPreview={handlePreview}
                            uploadTo="image"
                            onSuccessUpload={(uploadedFile) => {
                                setUploadedImageId(uploadedFile.id);
                                form.setFieldsValue({ image: uploadedFile.id });
                            }}
                            defaultFileList={
                                newsItem?.image?.base64
                                    ? [
                                        {
                                            name: '',
                                            thumbUrl: base64ToUrl(
                                                newsItem.image.base64,
                                                newsItem.image.mimeType,
                                            ),
                                            uid: String(newsItem.imageId),
                                            status: 'done',
                                        },
                                    ]
                                    : []
                            }
                        >
                            <p>Перетягніть файл сюди або натисніть для завантаження</p>
                        </FileUploader>
                    </Form.Item>

                    <PreviewFileModal
                        opened={previewOpen}
                        setOpened={setPreviewOpen}
                        file={filePreview}
                    />

                    <Form.Item
                        name="creationDate"
                        label="Дата публікації"
                        rules={[
                            { required: true, message: 'Оберіть дату публікації' },
                        ]}
                    >
                        <DatePicker
                            className="news-date-picker"
                            placeholder="оберіть дату"
                            format="DD.MM.YYYY"
                        />
                    </Form.Item>

                    <Button
                        className="streetcode-custom-button save"
                        onClick={handleOk}
                    >
                        Зберегти
                    </Button>
                </Form>
            </div>
        </Modal>
    );
});

export default NewsModal;
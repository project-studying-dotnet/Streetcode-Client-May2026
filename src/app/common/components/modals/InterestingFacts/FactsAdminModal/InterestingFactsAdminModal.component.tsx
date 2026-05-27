import './InterestingFactsAdminModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx, { useModalContext } from '@stores/root-store';

import {
    Button, Form, Input, Modal,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { UploadFile } from 'antd/lib/upload/interface';

import ImagesApi from '@/app/api/media/images.api';
import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import Image from '@/models/media/image.model';
import { FactCreate } from '@/models/streetcode/text-contents.model';

const TITLE_MAX = 68;
const CONTENT_MAX = 600;
const IMAGE_DESCRIPTION_MAX = 200;

const SymbolsLeft = ({ current, max }: { current: number; max: number }) => (
    <p className="symbolsLeft">
        Залишилось символів:
        {' '}
        {Math.max(0, max - current)}
    </p>
);

const InterestingFactsAdminModal = () => {
    const { factsStore } = useMobx();
    const { modalStore: { setModal, modalsState: { adminFacts } } } = useModalContext();
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const [titleLength, setTitleLength] = useState(0);
    const [contentLength, setContentLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);

    const editingFactId = adminFacts.fromCardId;
    const isEditMode = typeof editingFactId === 'number' && editingFactId > 0;
    const editingFact = isEditMode ? factsStore.factMap.get(editingFactId) : undefined;

    const closeModal = () => setModal('adminFacts', undefined, false);

    useEffect(() => {
        if (!adminFacts.isOpen) {
            form.resetFields();
            imageId.current = 0;
            setTitleLength(0);
            setContentLength(0);
            setDescriptionLength(0);
            return;
        }

        if (editingFact) {
            imageId.current = editingFact.imageId;
            const description = (editingFact as FactCreate).imageDescription
                ?? editingFact.image?.imageDetails?.alt
                ?? '';
            form.setFieldsValue({
                title: editingFact.title,
                factContent: editingFact.factContent,
                imageDescription: description,
                picture: editingFact.image ? [{
                    uid: String(editingFact.imageId),
                    name: editingFact.image.blobName ?? 'image',
                    status: 'done',
                    thumbUrl: base64ToUrl(editingFact.image.base64, editingFact.image.mimeType),
                }] : [],
            });
            setTitleLength(editingFact.title.length);
            setContentLength(editingFact.factContent.length);
            setDescriptionLength(description.length);
        }
    }, [adminFacts.isOpen, editingFact, editingFactId, form]);

    const onFinish = async (values: {
        title: string;
        factContent: string;
        imageDescription?: string;
        picture?: { fileList?: UploadFile[] };
    }) => {
        const streetcodeId = factsStore.adminStreetcodeId;
        if (!streetcodeId) {
            return;
        }

        if (!imageId.current) {
            form.setFields([{
                name: 'picture',
                errors: ['Додайте зображення'],
            }]);
            return;
        }

        const payload: FactCreate = {
            id: editingFact?.id ?? 0,
            title: values.title.trim(),
            factContent: values.factContent.trim(),
            imageId: imageId.current,
            imageDescription: values.imageDescription?.trim() || undefined,
        };

        const existingFactId = isEditMode ? editingFactId : undefined;
        await factsStore.saveAdminFact(
            payload,
            streetcodeId,
            existingFactId,
        );

        closeModal();
    };

    return (
        <Modal
            className="interestingFactsAdminModal modalContainer"
            open={adminFacts.isOpen}
            onCancel={closeModal}
            footer={null}
            maskClosable
            centered
            closeIcon={<CancelBtn />}
            destroyOnClose
        >
            <Form className="factForm" form={form} layout="vertical" onFinish={onFinish}>
                <h2>{isEditMode ? 'Редагувати Wow-факт' : 'Додати Wow-факт'}</h2>

                <p className="fieldLabel">Заголовок *</p>
                <FormItem
                    name="title"
                    rules={[
                        { required: true, message: 'Введіть заголовок' },
                        { max: TITLE_MAX, message: `Максимум ${TITLE_MAX} символів` },
                    ]}
                >
                    <Input
                        maxLength={TITLE_MAX}
                        onChange={(e) => setTitleLength(e.target.value.length)}
                    />
                </FormItem>
                <SymbolsLeft current={titleLength} max={TITLE_MAX} />

                <p className="fieldLabel">Основний текст *</p>
                <FormItem
                    name="factContent"
                    rules={[
                        { required: true, message: 'Введіть текст' },
                        { max: CONTENT_MAX, message: `Максимум ${CONTENT_MAX} символів` },
                    ]}
                >
                    <TextArea
                        rows={5}
                        maxLength={CONTENT_MAX}
                        onChange={(e) => setContentLength(e.target.value.length)}
                    />
                </FormItem>
                <SymbolsLeft current={contentLength} max={CONTENT_MAX} />

                <p className="fieldLabel">Зображення *</p>
                <FormItem
                    name="picture"
                    rules={[{ required: !imageId.current, message: 'Додайте зображення' }]}
                >
                    <FileUploader
                        uploadTo="image"
                        multiple={false}
                        accept=".jpeg,.png,.jpg,.webp"
                        listType="picture-card"
                        maxCount={1}
                        onSuccessUpload={(img: Image) => {
                            imageId.current = img.id;
                        }}
                        onRemove={() => {
                            if (imageId.current > 0) {
                                ImagesApi.delete(imageId.current);
                            }
                            imageId.current = 0;
                        }}
                    >
                        <div className="upload">
                            <InboxOutlined />
                            <p>Виберіть чи перетягніть файл</p>
                        </div>
                    </FileUploader>
                </FormItem>

                <p className="fieldLabel">Опис зображення</p>
                <FormItem
                    name="imageDescription"
                    rules={[{ max: IMAGE_DESCRIPTION_MAX, message: `Максимум ${IMAGE_DESCRIPTION_MAX} символів` }]}
                >
                    <TextArea
                        rows={2}
                        maxLength={IMAGE_DESCRIPTION_MAX}
                        onChange={(e) => setDescriptionLength(e.target.value.length)}
                    />
                </FormItem>
                <SymbolsLeft current={descriptionLength} max={IMAGE_DESCRIPTION_MAX} />

                <Button className="saveButton streetcode-custom-button" htmlType="submit">
                    Зберегти
                </Button>
            </Form>
        </Modal>
    );
};

export default observer(InterestingFactsAdminModal);

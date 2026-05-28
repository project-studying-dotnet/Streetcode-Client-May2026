import './InterestingFactsAdminModal.styles.scss';
import '@features/AdminPage/AdminModal.styles.scss';

import { observer } from 'mobx-react-lite';
import { InboxOutlined } from '@ant-design/icons';
import CancelBtn from '@assets/images/utils/Cancel_btn.svg';
import useMobx, { useModalContext } from '@stores/root-store';

import {
    Button, Form, Input, Modal, message,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { UploadFile } from 'antd/lib/upload/interface';

import FileUploader from '@/app/common/components/FileUploader/FileUploader.component';
import { FactAdminSavePayload } from '@/models/streetcode/text-contents.model';

import INTERESTING_FACTS_ADMIN_MODAL_MESSAGES from './interesting-facts-admin-modal.constants';
import useFactsAdminModalForm from './useFactsAdminModalForm.hook';

const SymbolsLeft = ({ current, max }: { current: number; max: number }) => (
    <p className="symbolsLeft">
        {INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.SYMBOLS_LEFT}
        {' '}
        {Math.max(0, max - current)}
    </p>
);

const InterestingFactsAdminModal = () => {
    const { factsStore } = useMobx();
    const { modalStore: { setModal, modalsState: { adminFacts } } } = useModalContext();

    const editingFactId = adminFacts.fromCardId;
    const isEditMode = typeof editingFactId === 'number' && editingFactId > 0;

    const {
        form,
        imageId,
        titleLength,
        contentLength,
        descriptionLength,
        setTitleLength,
        setContentLength,
        setDescriptionLength,
        onSuccessUpload,
        onRemove,
        validateImageSelected,
        titleMax,
        contentMax,
        descriptionMax,
    } = useFactsAdminModalForm(adminFacts.isOpen, editingFactId, factsStore);

    const closeModal = () => setModal('adminFacts', undefined, false);

    const onFinish = async (values: {
        title: string;
        factContent: string;
        imageDescription?: string;
        picture?: { fileList?: UploadFile[] };
    }) => {
        const streetcodeId = factsStore.adminStreetcodeId;
        if (!streetcodeId) {
            message.error(INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.MISSING_STREETCODE);
            return;
        }

        if (!validateImageSelected() || !imageId) {
            return;
        }

        const payload: FactAdminSavePayload = {
            title: values.title.trim(),
            factContent: values.factContent.trim(),
            imageId,
            imageDescription: values.imageDescription?.trim() || undefined,
        };

        const existingFactId = isEditMode ? editingFactId : undefined;

        try {
            await factsStore.saveAdminFact(
                payload,
                streetcodeId,
                existingFactId,
            );
            message.success(INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.SAVE_SUCCESS);
            closeModal();
        } catch {
            message.error(factsStore.lastError ?? INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.SAVE_FAILED);
        }
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
                <h2>
                    {isEditMode
                        ? INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.EDIT_TITLE
                        : INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.CREATE_TITLE}
                </h2>

                <p className="fieldLabel">Заголовок *</p>
                <div className="factFieldGroup">
                    <FormItem
                        name="title"
                        rules={[
                            { required: true, message: INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.TITLE_REQUIRED },
                            { max: titleMax, message: `Максимум ${titleMax} символів` },
                        ]}
                    >
                        <Input
                            maxLength={titleMax}
                            onChange={(e) => setTitleLength(e.target.value.length)}
                        />
                    </FormItem>
                    <SymbolsLeft current={titleLength} max={titleMax} />
                </div>

                <p className="fieldLabel">Основний текст *</p>
                <div className="factFieldGroup">
                    <FormItem
                        name="factContent"
                        rules={[
                            { required: true, message: INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.CONTENT_REQUIRED },
                            { max: contentMax, message: `Максимум ${contentMax} символів` },
                        ]}
                    >
                        <TextArea
                            rows={5}
                            maxLength={contentMax}
                            onChange={(e) => setContentLength(e.target.value.length)}
                        />
                    </FormItem>
                    <SymbolsLeft current={contentLength} max={contentMax} />
                </div>

                <p className="fieldLabel">Зображення *</p>
                <FormItem
                    name="picture"
                    rules={[{
                        validator: async () => {
                            if (!imageId) {
                                throw new Error(INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.IMAGE_REQUIRED);
                            }
                        },
                    }]}
                >
                    <FileUploader
                        uploadTo="image"
                        multiple={false}
                        accept=".jpeg,.png,.jpg,.webp"
                        listType="picture-card"
                        maxCount={1}
                        onSuccessUpload={onSuccessUpload}
                        onRemove={onRemove}
                    >
                        <div className="upload">
                            <InboxOutlined />
                            <p>{INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.UPLOAD_HINT}</p>
                        </div>
                    </FileUploader>
                </FormItem>

                <p className="fieldLabel">Опис зображення</p>
                <div className="factFieldGroup">
                    <FormItem
                        name="imageDescription"
                        rules={[{
                            max: descriptionMax,
                            message: `Максимум ${descriptionMax} символів`,
                        }]}
                    >
                        <TextArea
                            rows={2}
                            maxLength={descriptionMax}
                            onChange={(e) => setDescriptionLength(e.target.value.length)}
                        />
                    </FormItem>
                    <SymbolsLeft current={descriptionLength} max={descriptionMax} />
                </div>

                <Button
                    className="saveButton streetcode-custom-button"
                    htmlType="submit"
                    loading={factsStore.isSaving}
                    disabled={factsStore.isSaving}
                >
                    {INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.SAVE}
                </Button>
            </Form>
        </Modal>
    );
};

export default observer(InterestingFactsAdminModal);

import './EditImageModal.styles.scss';
import CancelBtn from '@images/utils/Cancel_btn.svg';
import { observer } from 'mobx-react-lite';
import { useModalContext } from '@stores/root-store';
import { Button, Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';

const EditImageModal = observer(() => {
    const [form] = Form.useForm();

    const { artStore, imageTemplateStore, modalStore: { setModal, modalsState: { editImage } } } = useModalContext();
    const [loading, setLoading] = useState(false);

    const data = editImage.image;

    const existingArt = data ? imageTemplateStore.getArtByImageId(data.id) : null;
    const isEditing = !!existingArt;

    useEffect(() => {
        if (editImage.isOpen && data) {
            form.setFieldsValue({
                title: existingArt?.title || data.title,
                description: existingArt?.description || data.description,
            });
        }
    }, [editImage.isOpen, data, form, existingArt]);

    const onSuccessfulSubmit = async (values: any) => {
        if (!data) return;
        setLoading(true);

        setLoading(true);

        try {
            if (isEditing) {
                const updatedArt = await artStore.updateArt(existingArt.id, {
                    ...values,
                    imageId: data.id
                });
                imageTemplateStore.setArtForImage(data.id, updatedArt);
            } else {
                const createdArt = await artStore.createArt({
                    ...values,
                    imageId: data.id
                });
                imageTemplateStore.setArtForImage(data.id, createdArt);
            }

            setModal('editImage', undefined, false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            className="addModal"
            open={editImage.isOpen}
            onCancel={() => setModal('editImage', undefined, false)}
            footer={null}
            closeIcon={<CancelBtn />}
        >
            <h2>Додаткові дані</h2>

            {data && (
                <img
                    src={data.url}
                    alt="art"
                    style={{ width: '100%', marginBottom: '20px', borderRadius: '8px' }}
                />
            )}

            <Form form={form} onFinish={onSuccessfulSubmit} layout="vertical">
                <FormItem name="title" label="Назва">
                    <Input showCount maxLength={150} />
                </FormItem>

                <FormItem name="description" label="Опис">
                    <TextArea rows={4} maxLength={400} showCount />
                </FormItem>

                <div className="button-container">
                    <Button
                        className="save-button"
                        loading={loading}
                        onClick={() => form.submit()}
                    >
                        Зберегти
                    </Button>
                </div>
            </Form>
        </Modal>
    );
});

export default EditImageModal;
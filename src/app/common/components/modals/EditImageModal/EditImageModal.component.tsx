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

    const { 
        artStore, 
        imageTemplateStore,
        modalStore: { setModal, modalsState: { editImage } }
    } = useModalContext();

    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (editImage.isOpen && editImage.image) {
            form.setFieldsValue({
                title: editImage.image.title,
                description: editImage.image.description,
            });
        }
    }, [editImage.isOpen, editImage.image, form]);

    const onSuccessfulSubmit = async (values: { title: string; description: string }) => {
        if (!editImage.image) return;

        setLoading(true);
        try {
            await artStore.updateArt(editImage.image.id, {
                title: values.title,
                description: values.description
            });

            setModal('editImage');
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Modal
            className="addModal"
            open={editImage.isOpen}
            onCancel={() => setModal('editImage')}
            footer={[null]}
            closeIcon={<CancelBtn />}
        >
            <h2>Додаткові дані</h2>
            {editImage.image && (
                <img src={editImage.image.url} alt="art" style={{ width: '100%', marginBottom: '20px', borderRadius: '8px' }} />
            )}
            <Form form={form} onFinish={onSuccessfulSubmit} layout="vertical">
                <FormItem name="title" label="Назва" rules={[{ message: 'Введіть назву' }]}>
                    <Input showCount maxLength={150} />
                </FormItem>
                <FormItem name="description" label="Опис" rules={[{ message: 'Введіть опис' }]}>
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
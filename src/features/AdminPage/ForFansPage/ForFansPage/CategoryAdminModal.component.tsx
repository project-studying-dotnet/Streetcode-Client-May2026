import React, { useRef, useState } from 'react';
import ImagesApi from '@api/media/images.api';
import SourcesImageUploader from './SourcesImageUploader.component';
import { useAsync } from '@hooks/stateful/useAsync.hook';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';

import { Button, Form, Input, Modal } from 'antd';

interface AddSourceModalProps {
  isAddModalVisible: boolean;
  handleAddCancel: () => void;
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({
    isAddModalVisible,
    handleAddCancel,
}) => {
    const { sourcesAdminStore } = useMobx();
    const [form] = Form.useForm();
    const imageId = useRef<number>(0);
    const [image, setImage] = useState<Image>();

    useAsync(() => sourcesAdminStore.fetchSourceCategories(), []);

    async function onSubmit(formData: any) {
    const newSource: SourceCategoryAdmin = {
        title: formData.title,
        imageId: imageId.current,
    };

    await sourcesAdminStore.addSourceCategory(newSource);

    imageId.current = 0;
    setImage(undefined);
    form.resetFields();
    handleAddCancel();
}

    return (
        <Modal
            title="Додати категорію"
            open={isAddModalVisible}
            onCancel={handleAddCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    name="title"
                    label="Назва: "
                    rules={[{ required: true, message: 'Введіть назву' }]}
                >
                    <Input placeholder="Title" />
                </Form.Item>
                <Form.Item
                    name="image"
                    label="Картинка: "
                    rules={[{ required: true, message: 'Додайте зображення' }]}
                >
                <SourcesImageUploader
                multiple={false}
                accept=".jpeg,.png,.jpg"
                listType="picture-card"
                maxCount={1}
                onSuccessUpload={(uploadedImage: Image) => {
                    imageId.current = uploadedImage.id;
                    setImage(uploadedImage);
                }}
                onRemove={() => {
                    if (imageId.current) {
                        ImagesApi.delete(imageId.current);
                    }

                    imageId.current = 0;
                    setImage(undefined);
                }}
                >
                    <p>Виберіть чи перетягніть файл</p>
                </SourcesImageUploader>
                </Form.Item>
                <div className="center">
                    <Button className="streetcode-custom-button" onClick={() => form.submit()}>
                    Зберегти
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddSourceModal;

/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImagesApi from '@api/media/images.api';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import {
    Button, Input, Modal, Space, UploadFile,
} from 'antd';

import PreviewFileModal from '@/app/common/components/PreviewFileModal/PreviewFileModal.component';

import SourcesImageUploader from './SourcesGrayscaleImageUploader.component';

interface Props {
    srcCategory: SourceCategoryAdmin;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { sourcesAdminStore } = useMobx();
    const { deleteSourceCategory, updateSourceCategory } = sourcesAdminStore;
    const [isModalEditVisible, setIsModalEditVisible] = useState(false);
    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
    const [title, setTitle] = useState(srcCategory.title);
    const [image, setImage] = useState(srcCategory.image);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    const imageId = useRef<number>(srcCategory.imageId);

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalDeleteVisible((prevState) => !prevState);
    };

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalEditVisible(true);
    };

    const handleEditOk = () => {
        const updatedCategory: SourceCategoryAdmin = {
            id: srcCategory.id,
            title,
            imageId: imageId.current || srcCategory.imageId,
        };

        updateSourceCategory(updatedCategory);
        setIsModalEditVisible(false);
    };

    const handleEditCancel = () => {
        setTitle(srcCategory.title);
        setIsModalEditVisible(false);
    };

    const handleDeleteOk = () => {
        setIsModalDeleteVisible(false);

        if (srcCategory.id) {
            deleteSourceCategory(srcCategory.id);
        }

        if (srcCategory.imageId) {
            ImagesApi.delete(srcCategory.imageId);
        }
    };

    const handleDeleteCancel = () => {
        setIsModalDeleteVisible(false);
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    useEffect(() => {
        if (imageId.current) {
            ImagesApi.getById(imageId.current)
                .then((image) => setImage(image));
        }
    }, []);
    
    return (
        <div
            className="sourcesSliderItem"
            style={{ backgroundImage: `url(${base64ToUrl(image?.base64, image?.mimeType)})` }}
        >
            <h1>{title}</h1>
            <div className="sourceActions">
                <Button icon={<EditOutlined />} onClick={handleEdit} />
                <Button icon={<DeleteOutlined />} onClick={handleDelete} />
            </div>
            <Modal
                title="Видалити категорію?"
                open={isModalDeleteVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                okText="Видалити"
                cancelText="Скасувати"
                okButtonProps={{ danger: true }}
            >
                <p>Ви впевнені, що хочете видалити дану категорію?</p>
            </Modal>
            <Modal
                title="Редагувати категорію"
                open={isModalEditVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Space direction="vertical" size="middle">
                    <Input placeholder="Title" value={title} onChange={handleChangeTitle} />
                    <SourcesImageUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
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
                        defaultFileList={srcCategory.image ? [{
                            name: '',
                            thumbUrl: base64ToUrl(srcCategory.image.base64, srcCategory.image.mimeType),
                            uid: String(srcCategory.image.id),
                            status: 'done',
                        }] : []}
                    >
                        <p>Виберіть чи перетягніть файл</p>
                    </SourcesImageUploader>
                    <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />
                </Space>
            </Modal>
        </div>
    );
};

export default SourceItem;
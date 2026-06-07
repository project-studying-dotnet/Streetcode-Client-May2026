/* eslint-disable no-param-reassign */
import React, { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ImagesApi from '@api/media/images.api';
import FileUploader from '@components/FileUploader/FileUploader.component';
import Image from '@models/media/image.model';
import { SourceCategoryAdmin } from '@models/sources/sources.model';
import useMobx from '@stores/root-store';
import base64ToUrl from '@utils/base64ToUrl.utility';

import {
    Button, Input, Modal, Space, UploadFile,
} from 'antd';

import PreviewFileModal from '@/app/common/components/PreviewFileModal/PreviewFileModal.component';

interface Props {
    srcCategory: SourceCategoryAdmin;
}

const SourceItem = ({ srcCategory }: Props) => {
    const { sourcesAdminStore } = useMobx();
    const { deleteSourceCategory, updateSourceCategory } = sourcesAdminStore;

    const [isModalEditVisible, setIsModalEditVisible] = useState(false);
    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
    const [title, setTitle] = useState(srcCategory.title);
    const [image, setImage] = useState<Image | undefined>(srcCategory.image);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);

    const imageId = useRef<number>(srcCategory.imageId ?? 0);

    const handlePreview = async (file: UploadFile) => {
        setFilePreview(file);
        setPreviewOpen(true);
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalDeleteVisible(true);
    };

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsModalEditVisible(true);
    };

    const handleEditOk = () => {
        const updatedCategory: SourceCategoryAdmin = {
            ...srcCategory,
            title,
            image,
            imageId: imageId.current,
        };

        updateSourceCategory(updatedCategory);
        setIsModalEditVisible(false);
    };

    const handleEditCancel = () => {
        setTitle(srcCategory.title);
        setImage(srcCategory.image);
        imageId.current = srcCategory.imageId ?? 0;
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
        if (!imageId.current) {
            return;
        }

        ImagesApi.getById(imageId.current).then((img) => {
            setImage(img);
        });
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
                title="Ви впевнені, що хочете видалити дану категорію?"
                open={isModalDeleteVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
            />

            <Modal
                title="Редагувати категорію"
                open={isModalEditVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                <Space direction="vertical" size="middle">
                    <Input placeholder="Title" value={title} onChange={handleChangeTitle} />

                    <FileUploader
                        multiple={false}
                        accept=".jpeg,.png,.jpg"
                        listType="picture-card"
                        maxCount={1}
                        onPreview={handlePreview}
                        uploadTo="image"
                        onSuccessUpload={(value) => {
                            const uploadedImage = value as Image;
                            imageId.current = uploadedImage.id;
                            setImage(uploadedImage);
                        }}
                        onRemove={() => {
                            setImage(undefined);
                            imageId.current = 0;
                        }}
                        defaultFileList={
                            srcCategory.image?.id && srcCategory.image?.base64 && srcCategory.image?.mimeType
                                ? [{
                                    name: srcCategory.image.blobName ?? '',
                                    thumbUrl: base64ToUrl(
                                        srcCategory.image.base64,
                                        srcCategory.image.mimeType,
                                    ),
                                    uid: srcCategory.image.id.toString(),
                                    status: 'done',
                                }]
                                : []
                        }
                    >
                        <p>Виберіть чи перетягніть файл</p>
                    </FileUploader>

                    <PreviewFileModal opened={previewOpen} setOpened={setPreviewOpen} file={filePreview} />
                </Space>
            </Modal>
        </div>
    );
};

export default SourceItem;

import React from 'react';

import Upload, { RcFile, UploadProps } from 'antd/es/upload';
import { message } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import Image, { ImageCreate } from '@/models/media/image.model';

type UploaderWithoutChildren = Omit<UploadProps, 'children' | 'customRequest'>;

interface Props extends UploaderWithoutChildren {
    children: JSX.Element[] | JSX.Element;
    onSuccessUpload?: (value: Image) => void;
}

const MAX_IMAGE_SIZE_MB = 3;

const getBase64FromDataUrl = (dataUrl: string) => (
    dataUrl.substring(dataUrl.indexOf(',') + 1, dataUrl.length)
);

const convertImageToGrayscaleDataUrl = (file: RcFile): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
        const img = new window.Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Canvas is not supported'));
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const { data } = imageData;

            for (let i = 0; i < data.length; i += 4) {
                const gray = Math.round(
                    data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114,
                );

                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
            }

            ctx.putImageData(imageData, 0, 0);

            resolve(canvas.toDataURL(file.type || 'image/png'));
        };

        img.onerror = reject;
        img.src = reader.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const SourcesImageUploader: React.FC<Props> = ({
    children,
    onSuccessUpload,
    beforeUpload,
    ...uploadProps
}) => {
    const handleBeforeUpload: UploadProps['beforeUpload'] = (file, fileList) => {
        const isLessThanMaxSize = file.size / 1024 / 1024 <= MAX_IMAGE_SIZE_MB;

        if (!isLessThanMaxSize) {
            message.error(`Розмір зображення не має перевищувати ${MAX_IMAGE_SIZE_MB} MB`);
            return Upload.LIST_IGNORE;
        }

        if (beforeUpload) {
            return beforeUpload(file, fileList);
        }

        return true;
    };

    const customRequest = async (options: any) => {
        const {
            onSuccess, onError, file,
        } = options;

        const uplFile = file as RcFile;

        try {
            const grayscaleDataUrl = await convertImageToGrayscaleDataUrl(uplFile);

            const image: ImageCreate = {
                baseFormat: getBase64FromDataUrl(grayscaleDataUrl),
                extension: uplFile.name.substring(
                    uplFile.name.lastIndexOf('.') + 1,
                    uplFile.name.length,
                ),
                mimeType: uplFile.type || 'image/png',
                title: uplFile.name,
            };

            const response = await ImagesApi.create(image);

            onSuccess(response);

            if (onSuccessUpload) {
                onSuccessUpload(response);
            }
        } catch (err) {
            message.error('Не вдалося завантажити зображення');
            onError(err);
        }
    };

    return (
        <Upload
            {...uploadProps}
            beforeUpload={handleBeforeUpload}
            customRequest={customRequest}
        >
            {children}
        </Upload>
    );
};

export default SourcesImageUploader;
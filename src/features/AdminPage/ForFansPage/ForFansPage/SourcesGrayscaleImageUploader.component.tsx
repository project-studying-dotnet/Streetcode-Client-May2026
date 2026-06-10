import React from 'react';
import Upload, { RcFile, UploadProps } from 'antd/es/upload';
import { message } from 'antd';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

import ImagesApi from '@/app/api/media/images.api';
import Image from '@/models/media/image.model';

import {
    convertImageToGrayscaleDataUrl,
    getBase64FromDataUrl,
    buildImageCreatePayload,
} from '@/app/common/utils/imageProcessing';

type UploaderWithoutChildren = Omit<UploadProps, 'children' | 'customRequest'>;

interface Props extends UploaderWithoutChildren {
    children: React.ReactNode;
    onSuccessUpload?: (value: Image) => void;
}

const MAX_IMAGE_SIZE_MB = 3;

const SourcesImageUploader: React.FC<Props> = ({
    children,
    onSuccessUpload,
    beforeUpload,
    ...uploadProps
}) => {
    const handleBeforeUpload: UploadProps['beforeUpload'] = (file, fileList) => {
        const isValidSize = file.size / 1024 / 1024 <= MAX_IMAGE_SIZE_MB;

        if (!isValidSize) {
            message.error(`Розмір зображення не має перевищувати ${MAX_IMAGE_SIZE_MB} MB`);
            return Upload.LIST_IGNORE;
        }

        return beforeUpload ? beforeUpload(file, fileList) : true;
    };

    const customRequest = async (options: UploadRequestOption) => {
        const { onSuccess, onError, file } = options;
        const uplFile = file as RcFile;

        try {
            const grayscaleDataUrl =
                await convertImageToGrayscaleDataUrl(uplFile);

            const payload = buildImageCreatePayload(uplFile, grayscaleDataUrl);

            const response = await ImagesApi.create(payload);

            onSuccess?.(response);
            onSuccessUpload?.(response);
        } catch (err: unknown) {
            message.error('Не вдалося завантажити зображення');

            const error =
                err instanceof Error
                    ? err
                    : new Error(String(err));

            onError?.(error);
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
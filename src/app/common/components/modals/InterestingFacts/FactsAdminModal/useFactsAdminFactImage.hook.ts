import { useCallback, useRef, useState } from 'react';
import { FormInstance, message } from 'antd';

import ImagesApi from '@/app/api/media/images.api';
import Image from '@/models/media/image.model';
import { FactUpdate } from '@/models/streetcode/text-contents.model';

import INTERESTING_FACTS_ADMIN_MODAL_MESSAGES from './interesting-facts-admin-modal.constants';

const useFactsAdminFactImage = (form: FormInstance) => {
    const [imageId, setImageId] = useState<number | null>(null);
    const originalImageIdRef = useRef<number | null>(null);
    const pendingUploadIdRef = useRef<number | null>(null);

    const resetImage = useCallback(() => {
        setImageId(null);
        originalImageIdRef.current = null;
        pendingUploadIdRef.current = null;
    }, []);

    const initFromFact = useCallback((fact: FactUpdate) => {
        originalImageIdRef.current = fact.imageId;
        pendingUploadIdRef.current = null;
        setImageId(fact.imageId);
    }, []);

    const clearPictureFieldError = useCallback(() => {
        form.setFields([{ name: 'picture', errors: [] }]);
    }, [form]);

    const onSuccessUpload = useCallback((img: Image) => {
        const previousPendingId = pendingUploadIdRef.current;

        if (
            previousPendingId
            && previousPendingId !== originalImageIdRef.current
            && previousPendingId !== img.id
        ) {
            ImagesApi.delete(previousPendingId).catch(() => {
                // Best-effort cleanup of replaced draft upload
            });
        }

        pendingUploadIdRef.current = img.id;
        setImageId(img.id);
        clearPictureFieldError();
    }, [clearPictureFieldError]);

    const onRemove = useCallback(async () => {
        const removedId = imageId;
        setImageId(null);
        form.setFieldsValue({ picture: [] });

        if (removedId && removedId === pendingUploadIdRef.current) {
            pendingUploadIdRef.current = null;
        }

        if (!removedId || removedId === originalImageIdRef.current) {
            return;
        }

        try {
            await ImagesApi.delete(removedId);
        } catch {
            message.error(INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.IMAGE_DELETE_FAILED);
        }
    }, [form, imageId]);

    const validateImageSelected = useCallback((): boolean => {
        if (imageId) {
            return true;
        }

        form.setFields([{
            name: 'picture',
            errors: [INTERESTING_FACTS_ADMIN_MODAL_MESSAGES.IMAGE_REQUIRED],
        }]);
        return false;
    }, [form, imageId]);

    return {
        imageId,
        resetImage,
        initFromFact,
        onSuccessUpload,
        onRemove,
        validateImageSelected,
    };
};

export default useFactsAdminFactImage;

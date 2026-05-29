import { useEffect, useState } from 'react';
import { Form } from 'antd';

import FactsStore from '@/app/stores/facts-store';

import {
    FACT_ADMIN_CONTENT_MAX,
    FACT_ADMIN_IMAGE_DESCRIPTION_MAX,
    FACT_ADMIN_TITLE_MAX,
} from './interesting-facts-admin-modal.constants';
import { buildFactAdminFormValues } from './interesting-facts-admin-modal.utils';
import useFactsAdminFactImage from './useFactsAdminFactImage.hook';

const useFactsAdminModalForm = (
    isOpen: boolean,
    editingFactId: number | undefined,
    factsStore: FactsStore,
) => {
    const [form] = Form.useForm();
    const [titleLength, setTitleLength] = useState(0);
    const [contentLength, setContentLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);

    const {
        imageId,
        resetImage,
        initFromFact,
        onSuccessUpload,
        onRemove,
        validateImageSelected,
    } = useFactsAdminFactImage(form);

    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
            resetImage();
            setTitleLength(0);
            setContentLength(0);
            setDescriptionLength(0);
            return;
        }

        if (typeof editingFactId !== 'number' || editingFactId <= 0) {
            resetImage();
            return;
        }

        const fact = factsStore.factMap.get(editingFactId);
        if (!fact) {
            return;
        }

        const formValues = buildFactAdminFormValues(fact);
        initFromFact(fact);
        form.setFieldsValue(formValues);
        setTitleLength(formValues.title.length);
        setContentLength(formValues.factContent.length);
        setDescriptionLength(formValues.imageDescription.length);
    }, [isOpen, editingFactId, factsStore, form, initFromFact, resetImage]);

    return {
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
        titleMax: FACT_ADMIN_TITLE_MAX,
        contentMax: FACT_ADMIN_CONTENT_MAX,
        descriptionMax: FACT_ADMIN_IMAGE_DESCRIPTION_MAX,
    };
};

export default useFactsAdminModalForm;

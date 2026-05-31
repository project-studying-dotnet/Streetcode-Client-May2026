import { UploadFile } from 'antd/lib/upload/interface';

import base64ToUrl from '@/app/common/utils/base64ToUrl.utility';
import { Fact, FactUpdate } from '@/models/streetcode/text-contents.model';

export const getFactImageDescription = (fact: Fact | FactUpdate): string => (
    fact.imageDescription ?? fact.image?.imageDetails?.alt ?? ''
);

export const buildFactPictureFileList = (fact: Fact | FactUpdate): UploadFile[] => {
    if (!fact.image) {
        return [];
    }

    return [{
        uid: String(fact.imageId),
        name: fact.image.blobName ?? 'image',
        status: 'done',
        thumbUrl: base64ToUrl(fact.image.base64, fact.image.mimeType),
    }];
};

export interface FactAdminFormValues {
    title: string;
    factContent: string;
    imageDescription: string;
    picture: UploadFile[];
}

export const buildFactAdminFormValues = (fact: Fact | FactUpdate): FactAdminFormValues => {
    const imageDescription = getFactImageDescription(fact);

    return {
        title: fact.title,
        factContent: fact.factContent,
        imageDescription,
        picture: buildFactPictureFileList(fact),
    };
};

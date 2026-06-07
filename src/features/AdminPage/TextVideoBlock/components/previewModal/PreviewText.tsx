import React from 'react';
import DOMPurify from 'dompurify';
import { TextVideoBlock } from '@/models/streetcode/text-video-block/text-video-block';
import { isYoutubeLink } from '@/app/common/utils/text-video-block/validation';

interface Props {
    open: boolean;
    onClose: () => void;
    formData: TextVideoBlock;
    youtubeEmbedUrl: string;
}

export const PreviewText: React.FC<Props> = ({
    open,
    onClose,
    formData,
    youtubeEmbedUrl,
}) => {
    const sanitizedHtml = DOMPurify.sanitize(formData.textContent, {
        ADD_TAGS: ['term'],
        ADD_ATTR: ['data-id', 'class'],
    });

    return (
        <div
            className="text-video-form__preview-wrapper"
        >
            <div className="text-video-form__preview">
                <h1 className="text-video-form__preview-title">
                    {formData.title}
                </h1>

                <div
                    className="text-video-form__preview-content"
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
                {formData.additionalText?.trim() && (
                    <div className="text-video-form__preview-author">
                        <span>Текст підготовлений спільно з </span>
                        <a
                            href="https://example.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {formData.additionalText.trim()}
                        </a>
                    </div>
                )}

                {isYoutubeLink(formData.videoUrl) && youtubeEmbedUrl && (
                    <div className="text-video-form__video-preview">
                        <iframe
                            src={youtubeEmbedUrl}
                            title="YouTube preview"
                            allowFullScreen
                        />
                    </div>
                )}

            </div>
        </div>
    );
};
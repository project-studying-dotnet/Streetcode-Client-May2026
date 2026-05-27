import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { TextVideoBlock } from '../../../models/streetcode/TextVideoBlock/TextVideoBlock';
import { isYoutubeLink } from './validation';
import { ModalCloseButton } from '../../../app/common/components/Button/ModalCloseButton';

interface Props {
    open: boolean;
    onClose: () => void;
    formData: TextVideoBlock;
    youtubeEmbedUrl: string;
}

export const PreviewModal: React.FC<Props> = ({
    open,
    onClose,
    formData,
    youtubeEmbedUrl,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (open) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="text-video-form__preview-wrapper"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-video-form__preview">
                    <ModalCloseButton onClick={onClose} />
                    <h1 className="text-video-form__preview-title">
                        {formData.title}
                    </h1>

                    <div
                        className="text-video-form__preview-content"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(formData.textContent),
                        }}
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
        </div>
    );
};
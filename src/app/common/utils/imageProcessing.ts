import { RcFile } from 'antd/es/upload';
import { ImageCreate } from '@/models/media/image.model';

export const convertImageToGrayscaleDataUrl = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

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
                        data[i] * 0.299 +
                        data[i + 1] * 0.587 +
                        data[i + 2] * 0.114
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

export const getBase64FromDataUrl = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
};

export const buildImageCreatePayload = (
    file: RcFile,
    grayscaleDataUrl: string
): ImageCreate => {
    const extension = file.name.split('.').pop() ?? '';

    return {
        baseFormat: getBase64FromDataUrl(grayscaleDataUrl),
        extension,
        mimeType: file.type || 'image/png',
        title: file.name,
    };
};
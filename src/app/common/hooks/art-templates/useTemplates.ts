import { useEffect, useState } from 'react';
import ArtSlideTemplatesApi from '@api/media/art-slide-templates.api'; 
import { ArtSlideTemplate } from '@models/media/art-slide-template.model';

export const useTemplates = () => {
    const [templates, setTemplates] = useState<ArtSlideTemplate[]>([]);
    
    useEffect(() => {

        ArtSlideTemplatesApi.getAll().then(setTemplates);
    }, []);

    return templates;
};
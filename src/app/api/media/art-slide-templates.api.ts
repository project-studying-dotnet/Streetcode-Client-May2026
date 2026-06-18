import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { ArtSlideTemplate } from '@models/media/art-slide-template.model';

const ArtSlideTemplatesApi = {
    getAll: () => Agent.get<ArtSlideTemplate[]>(API_ROUTES.ART_SLIDE_TEMPLATES.GET_ALL),
};

export default ArtSlideTemplatesApi;
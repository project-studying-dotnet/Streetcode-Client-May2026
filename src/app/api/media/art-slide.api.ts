import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import { ArtSlide, CreateArtSlide, UpdateArtSlide } from '@models/media/art-slide.model';

const ArtSlidesApi = {
    getAllByStreetcodeId: (streetcodeId: number) => 
        Agent.get<ArtSlide[]>(`${API_ROUTES.ART_SLIDES.GET_BY_STREETCODE_ID}/${streetcodeId}`),

    create: (artSlide: CreateArtSlide) => 
        Agent.post<ArtSlide>(`${API_ROUTES.ART_SLIDES.CREATE}`, artSlide),

    update: (artSlide: UpdateArtSlide) => 
        Agent.put<ArtSlide>(`${API_ROUTES.ART_SLIDES.UPDATE}`, artSlide),

    delete: (id: number) => 
        Agent.delete(`${API_ROUTES.ART_SLIDES.DELETE}/${id}`),
};

export default ArtSlidesApi;
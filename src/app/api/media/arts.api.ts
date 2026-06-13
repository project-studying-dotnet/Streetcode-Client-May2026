import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import Art from '@models/media/art.model';

const ArtsApi = {
    getAll: () => Agent.get<Art[]>(`${API_ROUTES.ARTS.GET_ALL}`),

    getById: (id: number) => Agent.get<Art>(`${API_ROUTES.ARTS.GET}/${id}`),

    create: (data: FormData) => Agent.post<Art>(`${API_ROUTES.ARTS.CREATE}`, data),

    update: (id: number, data: { title: string; description: string }) =>
        Agent.put<Art>(`${API_ROUTES.ARTS.UPDATE}/${id}`, data),

    delete: (id: number) => Agent.delete(`${API_ROUTES.ARTS.DELETE}/${id}`),
};

export default ArtsApi;

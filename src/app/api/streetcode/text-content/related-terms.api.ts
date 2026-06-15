import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';

import { CreateRelatedTerm, RelatedTerm } from '@/models/streetcode/text-contents.model';

const RelatedTermApi = {
    getAllByTermId: (id: number) => Agent.get<RelatedTerm[]>(`${API_ROUTES.RELATED_TERMS.GET_ALL_BY_TERM_ID}/${id}`),

    create: (relatedTerm: CreateRelatedTerm) => Agent.post<RelatedTerm>(`${API_ROUTES.RELATED_TERMS.CREATE}`, relatedTerm),

    update: (id: number, relatedTerm: RelatedTerm) => Agent.put<RelatedTerm>(
        `${API_ROUTES.RELATED_TERMS.UPDATE}/${id}`,
        relatedTerm,
    ),

    delete: (word: string, termId: number) => 
    Agent.delete(`${API_ROUTES.RELATED_TERMS.DELETE}/${word}/${termId}`)
};

export default RelatedTermApi;

import Agent from '@api/agent.api';
import { API_ROUTES } from '@constants/api-routes.constants';
import {
    SourceCategory,
    SourceCategoryAdmin,
    SourceCategoryName,
    StreetcodeCategoryContent,
} from '@models/sources/sources.model';

const SourcesApi = {
    getAllCategories: () => Agent.get<SourceCategory[]>(
        API_ROUTES.SOURCE_CATEGORIES.GET_ALL,
    ),

    getAllNames: () => Agent.get<SourceCategoryName[]>(
        API_ROUTES.SOURCE_CATEGORIES.GET_ALL_NAMES,
    ),

    getById: (id: number) => Agent.get<SourceCategory>(
        `${API_ROUTES.SOURCE_CATEGORIES.GET_BY_ID}/${id}`,
    ),

    getCategoriesByStreetcodeId: (streetcodeId: number) => Agent.get<SourceCategory[]>(
        `${API_ROUTES.SOURCE_CATEGORIES.GET_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    createCategory: (source: SourceCategoryAdmin) => Agent.post<SourceCategoryAdmin>(
        API_ROUTES.SOURCE_CATEGORIES.CREATE,
        source,
    ),

    updateCategory: (source: SourceCategoryAdmin) => Agent.put<SourceCategoryAdmin>(
        API_ROUTES.SOURCE_CATEGORIES.UPDATE,
        source,
    ),

    deleteCategory: (id: number) => Agent.delete(
        `${API_ROUTES.SOURCE_CATEGORIES.DELETE}/${id}`,
    ),

    getCategoryContentByStreetcodeId: (streetcodeId: number, categoryId: number) =>
        Agent.get<StreetcodeCategoryContent>(
            `${API_ROUTES.SOURCE_CATEGORIES.GET_CONTENT_BY_STREETCODE_ID}/${categoryId}/${streetcodeId}`,
    ),
    
    createContent: (content: StreetcodeCategoryContent) =>
        Agent.post<StreetcodeCategoryContent>(
            API_ROUTES.SOURCES.CREATE_CONTENT,
            content,
        ),

    updateContent: (content: StreetcodeCategoryContent) =>
        Agent.put<StreetcodeCategoryContent>(
            API_ROUTES.SOURCES.UPDATE_CONTENT,
            content,
        ),

    deleteContent: (streetcodeId: number, categoryId: number) =>
        Agent.delete(`${API_ROUTES.SOURCES.DELETE_CONTENT}/${streetcodeId}/${categoryId}`),
};

export default SourcesApi;
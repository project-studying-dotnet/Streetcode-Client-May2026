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
        API_ROUTES.SOURCES.GET_ALL_CATEGORIES,
    ),

    getAllNames: () => Agent.get<SourceCategoryName[]>(
        API_ROUTES.SOURCES.GET_ALL_CATEGORIES_NAMES,
    ),

    getById: (id: number) => Agent.get<SourceCategory>(
        `${API_ROUTES.SOURCES.GET_CATEGORY_BY_ID}/${id}`,
    ),

    getCategoriesByStreetcodeId: (streetcodeId: number) => Agent.get<SourceCategory[]>(
        `${API_ROUTES.SOURCES.GET_CATEGORIES_BY_STREETCODE_ID}/${streetcodeId}`,
    ),

    getCategoryContentByStreetcodeId: (streetcodeId: number, categoryId: number) =>
        Agent.get<StreetcodeCategoryContent>(
            `${API_ROUTES.SOURCES.GET_CONTENT_BY_STREETCODE_ID}/${categoryId}/${streetcodeId}`,
    ),

    createCategory: (source: SourceCategoryAdmin) => Agent.post<SourceCategoryAdmin>(
        API_ROUTES.SOURCES.CREATE_CATEGORY,
        source,
    ),

    updateCategory: (source: SourceCategoryAdmin) => Agent.put<SourceCategoryAdmin>(
        API_ROUTES.SOURCES.UPDATE_CATEGORY,
        source,
    ),

    deleteCategory: (id: number) => Agent.delete(
        `${API_ROUTES.SOURCES.DELETE_CATEGORY}/${id}`,
    ),

    createContent: (content: StreetcodeCategoryContent) =>
        Agent.post<StreetcodeCategoryContent>(
            API_ROUTES.SOURCES.CREATE,
            content,
        ),

    updateContent: (content: StreetcodeCategoryContent) =>
        Agent.put<StreetcodeCategoryContent>(
            API_ROUTES.SOURCES.UPDATE,
            content,
        ),

    deleteContent: (streetcodeId: number, categoryId: number) =>
        Agent.delete(`${API_ROUTES.SOURCES.DELETE}/${streetcodeId}/${categoryId}`),
};

export default SourcesApi;
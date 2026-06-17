import { toast } from 'react-toastify';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import FRONTEND_ROUTES from '../common/constants/frontend-routes.constants';
import UserLoginStore from '../stores/user-login-store';

const isDevelopment = process.env.NODE_ENV === 'development';

axios.defaults.baseURL =
    process.env.REACT_APP_API_URL ??
    (isDevelopment
        ? 'https://localhost:5001/api'
        : 'https://streetcode-webapp-backend-cabzg9e0dzg5atgf.polandcentral-01.azurewebsites.net/api');

const getErrorMessage = (data: unknown): string | undefined => {
    if (typeof data === 'string') {
        return data || undefined;
    }
    if (Array.isArray(data)) {
        return data[0]?.message;
    }
    if (typeof data === 'object' && data !== null) {
        const obj = data as Record<string, unknown>;
        const candidate = obj.message ?? obj.title ?? obj.detail;
        const isStringable = typeof candidate === 'string'
            || typeof candidate === 'number'
            || typeof candidate === 'boolean';
        if (isStringable) {
            return String(candidate);
        }
    }
    return undefined;
};

axios.interceptors.response.use(
    async (response) => response,
    ({ response, message, config }: AxiosError) => {
        let errorMessage = '';
        if (message === 'Network Error') {
            errorMessage = message;
        }
        const failedUrl = response?.config?.url ?? config?.url ?? '';
        switch (response?.status) {
        case StatusCodes.INTERNAL_SERVER_ERROR:
            errorMessage = failedUrl
                ? `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${failedUrl}`
                : ReasonPhrases.INTERNAL_SERVER_ERROR;
            break;
        case StatusCodes.UNAUTHORIZED:
            errorMessage = ReasonPhrases.UNAUTHORIZED;
            UserLoginStore.clearUserData();
            globalThis.location.href = FRONTEND_ROUTES.ADMIN.LOGIN;
            break;
        case StatusCodes.NOT_FOUND:
            errorMessage = ReasonPhrases.NOT_FOUND;
            break;
        case StatusCodes.BAD_REQUEST:            
            errorMessage = getErrorMessage(response?.data) || ReasonPhrases.BAD_REQUEST;
            break;
        case StatusCodes.FORBIDDEN:
            errorMessage = ReasonPhrases.FORBIDDEN;
            break;
        default:
            break;
        }
        if (errorMessage !== '' && process.env.NODE_ENV === 'development') {
            toast.error(errorMessage);
        }

        return Promise.reject(new Error(getErrorMessage(response?.data) || message));
    },
);

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const Agent = {
    get: async <T> (url: string, params?: URLSearchParams) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.get<T>(url, { params })
            .then(responseBody);
    },

    post: async <T> (url: string, body: object, headers?: object) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.post<T>(url, body, headers)
            .then(responseBody);
    },

    put: async <T> (url: string, body: object) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.put<T>(url, body)
            .then(responseBody);
    },

    delete: async <T>(url: string) => {
        axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
        return axios.delete<T>(url)
            .then(responseBody);
    },
};

export default Agent;

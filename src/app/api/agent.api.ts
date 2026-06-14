import { toast } from 'react-toastify';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import FRONTEND_ROUTES from '../common/constants/frontend-routes.constants';
import UserLoginStore from '../stores/user-login-store';

const isDevelopment = process.env.NODE_ENV === 'development';

axios.defaults.baseURL = isDevelopment
    ? 'https://localhost:5001/api'
    : 'https://app-streetcode-webapi-eu-prop-001-gsbqfwc2fdh6hhaw.polandcentral-01.azurewebsites.net/api';

const getErrorMessage = (data: unknown): string | undefined => {
    if (Array.isArray(data)) {
        return data[0]?.message;
    }

    if (
        typeof data === 'object'
        && data !== null
        && 'message' in data
    ) {
        return String(data['message']);
    }

    return undefined;
};

axios.interceptors.response.use(
    async (response) => response,
    ({ response, message }: AxiosError) => {
        let errorMessage = '';
        if (message === 'Network Error') {
            errorMessage = message;
        }
        switch (response?.status) {
        case StatusCodes.INTERNAL_SERVER_ERROR:
            errorMessage = ReasonPhrases.INTERNAL_SERVER_ERROR;
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

        return Promise.reject(response?.data || message);
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
    // Для отладки: посмотрим, что именно мы отправляем
    console.log("POST request to:", url);
    console.log("Request body:", JSON.stringify(body, null, 2));

    axios.defaults.headers.common.Authorization = `Bearer ${UserLoginStore.getToken()}`;
    
    return axios.post<T>(url, body, headers)
        .then(responseBody)
        .catch(error => {
            // Удобный вывод ошибок валидации от ASP.NET
            if (error.response && error.response.status === 400) {
                console.error("Validation Errors:", error.response.data.errors);
            }
            throw error;
        });
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

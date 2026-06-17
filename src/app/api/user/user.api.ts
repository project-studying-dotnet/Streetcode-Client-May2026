import Agent from '@api/agent.api';
import ChangePasswordDto from '@models/user/user.model';

import { API_ROUTES } from '@/app/common/constants/api-routes.constants';
import {
    RefreshTokenRequest, RefreshTokenResponce,
    UserLoginRequest, UserLoginResponce,
} from '@/models/user/user.model';

const UserApi = {
    login: (loginParams: UserLoginRequest) =>
        Agent.post<UserLoginResponce>(
            API_ROUTES.USERS.LOGIN,
            loginParams,
        ),

    refreshToken: (token: RefreshTokenRequest) =>
        Agent.post<RefreshTokenResponce>(
            API_ROUTES.USERS.REFRESH_TOKEN,
            token,
        ),

    adminLogin: (loginParams: UserLoginRequest) =>
        Agent.post<UserLoginResponce>(
            API_ROUTES.ADMIN_AUTHORIZATION.LOGIN,
            loginParams,
        ),

    adminRefreshToken: (token: RefreshTokenRequest) =>
        Agent.post<RefreshTokenResponce>(
            API_ROUTES.ADMIN_AUTHORIZATION.REFRESH_TOKEN,
            token,
        ),
    adminLogout: () =>
        Agent.post<void>(
            API_ROUTES.ADMIN_AUTHORIZATION.LOGOUT, {},
        ),

    changePassword: (data: ChangePasswordDto) =>
        Agent.post<void>(API_ROUTES.ADMIN_AUTHORIZATION.CHANGE_PASSWORD, data),
};
export default UserApi;

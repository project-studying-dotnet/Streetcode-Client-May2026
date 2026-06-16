import Agent from '@api/agent.api';

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

        googleLogin: (body: { idToken: string }) =>
        Agent.post<UserLoginResponce>(
            API_ROUTES.ADMIN_AUTHORIZATION.GOOGLE_LOGIN,
            body,
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
    };
export default UserApi;

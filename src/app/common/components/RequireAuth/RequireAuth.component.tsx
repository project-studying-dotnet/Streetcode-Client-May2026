import { Navigate, Outlet } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import UserLoginStore from '@stores/user-login-store';

const RequireAuth = () => {
    if (!UserLoginStore.isLoggedIn) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.LOGIN} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
import { observer } from 'mobx-react-lite';
import {
    FC, ReactNode, useEffect, useState,
} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import useMobx from '@/app/stores/root-store';
import UserLoginStore from '@/app/stores/user-login-store';
import { UserRole } from '@/models/user/user.model';

import FRONTEND_ROUTES from '../constants/frontend-routes.constants';

type Props = {
    children: ReactNode;
    allowedRoles?: UserRole[];
};

const ProtectedComponent: FC<Props> = ({ children, allowedRoles }) => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(!UserLoginStore.isLoggedIn);

    useEffect(() => {
        let isMounted = true;

        const verifySession = async () => {
            if (UserLoginStore.isLoggedIn) {
                if (isMounted) {
                    setIsChecking(false);
                }
                return;
            }

            const isRestored = await userLoginStore.restoreSession();
            if (!isMounted) {
                return;
            }

            if (!isRestored) {
                navigate(FRONTEND_ROUTES.ADMIN.LOGIN);
            }

            setIsChecking(false);
        };

        verifySession();

        return () => {
            isMounted = false;
        };
    }, [navigate, userLoginStore]);

    if (isChecking || userLoginStore.isAuthChecking) {
        return null;
    }

    if (!UserLoginStore.isLoggedIn) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.LOGIN} />;
    }

    if (allowedRoles?.length && !userLoginStore.hasRole(...allowedRoles)) {
        return <Navigate to={FRONTEND_ROUTES.ADMIN.LOGIN} replace />;
    }

    return <>{children}</>;
};

export default observer(ProtectedComponent);

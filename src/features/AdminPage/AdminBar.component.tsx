import './AdminBar.styles.scss';

import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';
import useMobx from '@/app/stores/root-store';
import UserLoginStore from '@/app/stores/user-login-store';
import { UserRole } from '@/models/user/user.model';

const roleLabels: Record<UserRole, string> = {
    [UserRole.MainAdministrator]: 'Головний адміністратор',
    [UserRole.Administrator]: 'Адміністратор',
    [UserRole.Moderator]: 'Модератор',
};

const getUserInitials = (name?: string, surname?: string) => {
    const first = name?.trim().charAt(0) ?? '';
    const last = surname?.trim().charAt(0) ?? '';
    return `${first}${last}`.toUpperCase() || '?';
};

const AdminBar = () => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    const currentUser = userLoginStore.currentUser;

    const handleLogout = async () => {
        await userLoginStore.logout();
        navigate(FRONTEND_ROUTES.ADMIN.LOGIN);
    };

    return (
        <>
            <header className="adminBar">
                <nav className="adminBarNav">
                    <Link className="adminBarLink" to={FRONTEND_ROUTES.ADMIN.STREETCODES}>Стріткоди</Link>
                    <Link className="adminBarLink" to={FRONTEND_ROUTES.ADMIN.FOR_FANS}>Для фанів</Link>
                    <Link className="adminBarLink" to={FRONTEND_ROUTES.ADMIN.PARTNERS}>Партнери</Link>
                    <Link className="adminBarLink" to={FRONTEND_ROUTES.ADMIN.TEAM}>Команда</Link>
                </nav>

                {UserLoginStore.isLoggedIn && currentUser && (
                    <div className="adminBarUser">
                        <div className="adminBarUserAvatar" aria-hidden>
                            {getUserInitials(currentUser.name, currentUser.surname)}
                        </div>
                        <div className="adminBarUserDetails">
                            <span className="adminBarUserName">
                                {currentUser.name}
                                {' '}
                                {currentUser.surname}
                            </span>
                            <span className="adminBarUserRole">
                                {roleLabels[currentUser.role]}
                            </span>
                        </div>
                        <Button
                            className="adminBarLogoutBtn"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            Вийти
                        </Button>
                    </div>
                )}
            </header>
            <div className="adminBarSpacer" aria-hidden />
        </>
    );
};

export default observer(AdminBar);

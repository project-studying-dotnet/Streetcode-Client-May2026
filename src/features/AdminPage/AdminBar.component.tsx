import './AdminBar.styles.scss';

import { NavLink } from 'react-router-dom';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

const AdminBar = () => (
    <div className="adminBar">
        <NavLink
            to={FRONTEND_ROUTES.ADMIN.STREETCODES}
            className={({ isActive }) => `Link ${isActive ? 'active' : ''}`}
        >
            Стріткоди
        </NavLink>

        <NavLink
            to={FRONTEND_ROUTES.ADMIN.FOR_FANS}
            className={({ isActive }) => `Link ${isActive ? 'active' : ''}`}
        >
            Для фанатів
        </NavLink>

        <NavLink
            to={FRONTEND_ROUTES.ADMIN.PARTNERS}
            className={({ isActive }) => `Link ${isActive ? 'active' : ''}`}
        >
            Партнери
        </NavLink>

        <NavLink
            to={FRONTEND_ROUTES.ADMIN.TEAM}
            className={({ isActive }) => `Link ${isActive ? 'active' : ''}`}
        >
            Команда
        </NavLink>

        <NavLink
            to={FRONTEND_ROUTES.ADMIN.DICTIONARY}
            className={({ isActive }) => `Link ${isActive ? 'active' : ''}`}
        >
            Словник
        </NavLink>
    </div>
);

export default AdminBar;
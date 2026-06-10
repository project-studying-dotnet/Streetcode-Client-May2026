import './AdminBar.styles.scss';

import { NavLink } from 'react-router-dom';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

const adminLinks = [
    { to: FRONTEND_ROUTES.ADMIN.STREETCODES, label: 'Стріткоди' },
    { to: FRONTEND_ROUTES.ADMIN.FOR_FANS, label: 'Для фанів' },
    { to: FRONTEND_ROUTES.ADMIN.PARTNERS, label: 'Партнери' },
    { to: FRONTEND_ROUTES.ADMIN.TEAM, label: 'Команда' },
    { to: FRONTEND_ROUTES.ADMIN.DICTIONARY, label: 'Словник' },
];

const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `Link ${isActive ? 'active' : ''}`;

const AdminBar = () => (
    <div className="adminBar">
        {adminLinks.map(({ to, label }) => (
            <NavLink
                key={to}
                to={to}
                className={getLinkClassName}
            >
                {label}
            </NavLink>
        ))}
    </div>
);

export default AdminBar;
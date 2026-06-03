import './AdminBar.styles.scss';

import { Link } from 'react-router-dom';

import FRONTEND_ROUTES from '@/app/common/constants/frontend-routes.constants';

const AdminBar = () => (
    <div className="adminBar">
        <Link className="Link" to={FRONTEND_ROUTES.ADMIN.STREETCODES}>Стріткоди</Link>
        <Link className="Link" to={FRONTEND_ROUTES.ADMIN.FOR_FANS}>Для фанів</Link>
        <Link className="Link" to={FRONTEND_ROUTES.ADMIN.PARTNERS}>Партнери</Link>
        <Link className="Link" to={FRONTEND_ROUTES.ADMIN.TEAM}>Команда</Link>
        <Link className="Link" to={FRONTEND_ROUTES.ADMIN.DICTIONARY}>Словник</Link>
    </div>
);

export default AdminBar;

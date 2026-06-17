import './AdminBar.styles.scss';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';

import useMobx from '@/app/stores/root-store';
import useWindowSize from '@/app/common/hooks/stateful/useWindowSize.hook';

import StreetcodeSvg from '@images/header/Streetcode_logo.svg';
import StreetcodeSvgMobile from '@images/header/Streetcode_logo_mobile.svg';

import FRONTEND_ROUTES from '@constants/frontend-routes.constants';

const adminNavItems = [
    {
        title: 'History-коди',
        to: FRONTEND_ROUTES.ADMIN.STREETCODES,
    },
    {
        title: 'Для фанів',
        to: FRONTEND_ROUTES.ADMIN.FOR_FANS,
    },
    {
        title: 'Партнери',
        to: FRONTEND_ROUTES.ADMIN.PARTNERS,
    },
    {
        title: 'Едітор',
        to: FRONTEND_ROUTES.ADMIN.NEW_STREETCODE,
    },
    {
        title: 'Команда',
        to: FRONTEND_ROUTES.ADMIN.TEAM,
    },
    {
        title: 'Календар',
        to: FRONTEND_ROUTES.ADMIN.CALENDAR,
    },
    {
        title: 'Новини',
        to: FRONTEND_ROUTES.ADMIN.NEWS,
    },
    {
        title: 'Вакансії',
        to: FRONTEND_ROUTES.ADMIN.VACANCIES,
    },
    {
        title: 'Словник',
        to: FRONTEND_ROUTES.ADMIN.DICTIONARY,
    },
    {
        title: 'Налаштування',
        to: FRONTEND_ROUTES.ADMIN.SETTINGS,
    },
];

const AdminBar = () => {
    const { userLoginStore } = useMobx();
    const navigate = useNavigate();
    const windowSize = useWindowSize();

    const handleLogout = async () => {
        await userLoginStore.logout();
        navigate(FRONTEND_ROUTES.ADMIN.LOGIN);
    };

    return (
        <nav className="adminBar">
            <div className="adminBarHeader">
                <NavLink to={FRONTEND_ROUTES.BASE} className="adminBarLogoButton">
                    {windowSize.width > 1024 ? (
                        <StreetcodeSvg />
                    ) : (
                        <StreetcodeSvgMobile />
                    )}
                </NavLink>

                <span className="adminBarBeta">Beta</span>
            </div>

            {adminNavItems.map(({ title, to }) => (
                <NavLink
                    key={title}
                    to={to}
                    className="adminBarLink"
                >
                    {title}
                </NavLink>
            ))}

            <Button
                className="logoutButton"
                type="text"
                danger
                icon={<ArrowLeftOutlined />}
                onClick={handleLogout}
            >
                Вихід
            </Button>
        </nav>
    );
};

export default AdminBar;
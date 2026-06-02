import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import ProtectedComponent from '@components/ProtectedComponent.component';
import ForFansMainPage from '@features/AdminPage/ForFansPage/ForFansMainPage.component';
import App from '@layout/app/App.component';
import EditStreetcodePage from '@features/AdminPage/EditStreetcodePage/EditStreetcodePage.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import NotFound from '@/features/AdditionalPages/NotFoundPage/NotFound.component';
import PartnersPage from '@/features/AdditionalPages/PartnersPage/Partners.component';
import AdminPage from '@/features/AdminPage/AdminPage.component';
import AdminLoginPage from '@/features/AdminPage/AdminLoginPage/AdminLoginPage.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import TeamPage from '@/features/AdminPage/TeamPage/TeamPage.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';
import NewsPage from '@/features/AdditionalPages/NewsPage/News.component';
import ContactUs from '@/features/AdditionalPages/ContactUsPage/ContanctUs.component';
import SupportPage from '@/features/AdditionalPages/SupportUsPage/SupportUs.component';
import Streetcodes from '@/features/AdminPage/StreetcodesPage/Streetcodes.component';
import StreetcodeCreate from '@/features/AdminPage/StreetcodesPage/StreetcodeCreate/StreetcodeCreate.component';
import { UserRole } from '@/models/user/user.model';

const adminRoles = [
    UserRole.MainAdministrator,
    UserRole.Administrator,
    UserRole.Moderator,
];

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route
            path={FRONTEND_ROUTES.ADMIN.LOGIN}
            element={<AdminLoginPage />}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.BASE}`}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <AdminPage />
                </ProtectedComponent>
            )}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/:streetcodeId`}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <EditStreetcodePage />
                </ProtectedComponent>
            )}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.BASE}/:id`}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <StreetcodeContent />
                </ProtectedComponent>
            )}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.STREETCODES}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <Streetcodes />
                </ProtectedComponent>
            )}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <StreetcodeCreate />
                </ProtectedComponent>
            )}
        />
        <Route
            path={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/:id`}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <StreetcodeCreate />
                </ProtectedComponent>
            )}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.FOR_FANS}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <ForFansMainPage />
                </ProtectedComponent>
            )}
        />
        <Route
            path={FRONTEND_ROUTES.ADMIN.PARTNERS}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <Partners />
                </ProtectedComponent>
            )}
        />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.CATALOG} element={<StreetcodeCatalog />} />
        <Route
            path={FRONTEND_ROUTES.ADMIN.TEAM}
            element={(
                <ProtectedComponent allowedRoles={adminRoles}>
                    <TeamPage />
                </ProtectedComponent>
            )}
        />
        <Route path="*" element={<NotFound />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS} element={<PartnersPage />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US} element={<ContactUs />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US} element={<SupportPage />} />
        <Route index path="/:id" element={<StreetcodeContent />} />
        <Route index path={`${FRONTEND_ROUTES.OTHER_PAGES.NEWS}/:id`} element={<NewsPage />} />
    </Route>,
));

export default router;

import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import RequireAuth from '@components/RequireAuth/RequireAuth.component';
import FRONTEND_ROUTES from '@constants/frontend-routes.constants';
import EditStreetcodePage from '@features/AdminPage/EditStreetcodePage/EditStreetcodePage.component';
import ForFansMainPage from '@features/AdminPage/ForFansPage/ForFansMainPage.component';
import App from '@layout/app/App.component';
import StreetcodeContent from '@streetcode/Streetcode.component';

import ContactUs from '@/features/AdditionalPages/ContactUsPage/ContanctUs.component';
import NotFound from '@/features/AdditionalPages/NotFoundPage/NotFound.component';
import PartnersPage from '@/features/AdditionalPages/PartnersPage/Partners.component';
import SupportPage from '@/features/AdditionalPages/SupportUsPage/SupportUs.component';
import AdminPage from '@/features/AdminPage/AdminPage.component';
import Dictionary from '@/features/AdminPage/DictionaryPage/Dictionary.component';
import LoginPage from '@/features/AdminPage/LoginPage/LoginPage.component';
import Partners from '@/features/AdminPage/PartnersPage/Partners.component';
import Streetcodes from '@/features/AdminPage/StreetcodesPage/Streetcodes.component';
import TeamPage from '@/features/AdminPage/TeamPage/TeamPage.component';
import StreetcodeCatalog from '@/features/StreetcodeCatalogPage/StreetcodeCatalog.component';
import StreetcodeEditor from '@/features/AdminPage/StreetcodesPage/StreetcodeEditor.component';
import CalendarPage from '@/features/AdminPage/CalendarPage/CalendarPage.component';
import VacanciesPage from '@/features/AdminPage/VacanciesPage/VacanciesPage.component';
import PublicNewsPage from '@/features/AdditionalPages/NewsPage/News.component';
import AdminNewsPage from '@/features/AdminPage/NewsPage/NewsPage.component';
import EditPge from '@/features/AdminPage/EditorPage/Editor.component';

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<App />}>
        <Route path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<LoginPage />} />

        <Route element={<RequireAuth />}>
            <Route path={FRONTEND_ROUTES.ADMIN.BASE} element={<AdminPage />}>
                <Route index element={<Streetcodes />} />
                <Route path="streetcodes" element={<Streetcodes />} />
                <Route path="for-fans" element={<ForFansMainPage />} />
                <Route path="partners" element={<Partners />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="dictionary" element={<Dictionary />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="news" element={<AdminNewsPage />} />
                <Route path="vacancies" element={<VacanciesPage />} />

                <Route path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE} element={<EditPge />} />
            </Route>

        </Route>

        <Route path={FRONTEND_ROUTES.OTHER_PAGES.CATALOG} element={<StreetcodeCatalog />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS} element={<PartnersPage />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US} element={<ContactUs />} />
        <Route path={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US} element={<SupportPage />} />
        <Route index path="/:id" element={<StreetcodeContent />} />
        <Route index path={`${FRONTEND_ROUTES.OTHER_PAGES.NEWS}/:id`} element={<PublicNewsPage />} />
        <Route path="*" element={<NotFound />} />
    </Route>,
));

export default router;

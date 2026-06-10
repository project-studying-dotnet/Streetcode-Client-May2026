import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import RequireAuth from "@components/RequireAuth/RequireAuth.component";
import FRONTEND_ROUTES from "@constants/frontend-routes.constants";
import EditStreetcodePage from "@features/AdminPage/EditStreetcodePage/EditStreetcodePage.component";
import ForFansMainPage from "@features/AdminPage/ForFansPage/ForFansMainPage.component";
import App from "@layout/app/App.component";
import StreetcodeContent from "@streetcode/Streetcode.component";

import ContactUs from "@/features/AdditionalPages/ContactUsPage/ContanctUs.component";
import NewsPage from "@/features/AdditionalPages/NewsPage/News.component";
import NotFound from "@/features/AdditionalPages/NotFoundPage/NotFound.component";
import PartnersPage from "@/features/AdditionalPages/PartnersPage/Partners.component";
import SupportPage from "@/features/AdditionalPages/SupportUsPage/SupportUs.component";
import AdminPage from "@/features/AdminPage/AdminPage.component";
import Dictionary from "@/features/AdminPage/DictionaryPage/Dictionary.component";
import LoginPage from "@/features/AdminPage/LoginPage/LoginPage.component";
import Partners from "@/features/AdminPage/PartnersPage/Partners.component";
import StreetcodeCreate from "@/features/AdminPage/StreetcodesPage/StreetcodeCreate/StreetcodeCreate.component";
import Streetcodes from "@/features/AdminPage/StreetcodesPage/Streetcodes.component";
import TeamPage from "@/features/AdminPage/TeamPage/TeamPage.component";
import StreetcodeCatalog from "@/features/StreetcodeCatalogPage/StreetcodeCatalog.component";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path={FRONTEND_ROUTES.ADMIN.LOGIN} element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route path={FRONTEND_ROUTES.ADMIN.BASE} element={<AdminPage />} />
        <Route path={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/:streetcodeId`} element={<EditStreetcodePage />} />
        <Route path={`${FRONTEND_ROUTES.ADMIN.BASE}/:id`} element={<StreetcodeContent />}>
          <Route path="comments" element={<StreetcodeContent />} />
        </Route>
        <Route path={FRONTEND_ROUTES.ADMIN.STREETCODES} element={<Streetcodes />} />
        <Route path={FRONTEND_ROUTES.ADMIN.NEW_STREETCODE} element={<StreetcodeCreate />} />
        <Route path={`${FRONTEND_ROUTES.ADMIN.EDIT_STREETCODE}/:id`} element={<StreetcodeCreate />} />
        <Route path={FRONTEND_ROUTES.ADMIN.FOR_FANS} element={<ForFansMainPage />} />
        <Route path={FRONTEND_ROUTES.ADMIN.PARTNERS} element={<Partners />} />
        <Route path={FRONTEND_ROUTES.ADMIN.TEAM} element={<TeamPage />} />
        <Route path={FRONTEND_ROUTES.ADMIN.DICTIONARY} element={<Dictionary />} />
      </Route>

      <Route path={FRONTEND_ROUTES.OTHER_PAGES.CATALOG} element={<StreetcodeCatalog />} />
      <Route path={FRONTEND_ROUTES.OTHER_PAGES.PARTNERS} element={<PartnersPage />} />
      <Route path={FRONTEND_ROUTES.OTHER_PAGES.CONTACT_US} element={<ContactUs />} />
      <Route path={FRONTEND_ROUTES.OTHER_PAGES.SUPPORT_US} element={<SupportPage />} />

      <Route path="/:id" element={<StreetcodeContent />}>
        <Route path="comments" element={<StreetcodeContent />} />
      </Route>

      <Route path={`${FRONTEND_ROUTES.OTHER_PAGES.NEWS}/:id`} element={<NewsPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default router;

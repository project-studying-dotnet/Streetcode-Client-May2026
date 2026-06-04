import './AdminPage.styles.scss';

import StreetcodeCatalogComponent from '@features/StreetcodeCatalogPage/StreetcodeCatalog.component';

import AdminBar from './AdminBar.component';

const AdminPage = () => (
    <div className="adminPageContainer">
        <AdminBar />
        <StreetcodeCatalogComponent showAdminActions />
    </div>
);

export default AdminPage;

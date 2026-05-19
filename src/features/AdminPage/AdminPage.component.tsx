import './AdminPage.styles.scss';
import AdminBar from './AdminBar.component';
import StreetcodeCatalogComponent from '../StreetcodeCatalogPage/StreetcodeCatalog.component';

const AdminPage = () => (
    <div className="adminPageContainer" >
        <AdminBar />
        <StreetcodeCatalogComponent showAdminActions />
    </div>
);

export default AdminPage;

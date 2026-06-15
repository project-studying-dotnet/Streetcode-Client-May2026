import './AdminPage.styles.scss';

import { Outlet } from 'react-router-dom';

import AdminBar from './AdminBar.component';
<<<<<<< chore/108/Admin-Art-gallery-block
import  {ArtGallery}  from './ArtGallery/ArtGallery';
import StreetcodeCatalogComponent from '../StreetcodeCatalogPage/StreetcodeCatalog.component';
=======
>>>>>>> dev

const AdminPage = () => (
    <div className="adminPageContainer">
        <AdminBar />
<<<<<<< chore/108/Admin-Art-gallery-block
        <ArtGallery/>
        <StreetcodeCatalogComponent showAdminActions />
=======

        <main className="adminPageContent">
            <Outlet />
        </main>
>>>>>>> dev
    </div>
);

export default AdminPage;

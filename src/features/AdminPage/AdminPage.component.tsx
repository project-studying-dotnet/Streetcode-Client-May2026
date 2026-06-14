import './AdminPage.styles.scss';

import { Outlet } from 'react-router-dom';

import AdminBar from './AdminBar.component';

const AdminPage = () => (
    <div className="adminPageContainer">
        <AdminBar />

        <main className="adminPageContent">
            <Outlet />
        </main>
    </div>
);

export default AdminPage;

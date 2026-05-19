import './EditStreetcodePage.styles.scss';

import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import AdminBar from '@features/AdminPage/AdminBar.component';
import InterestingFactsAdminBlock from '@features/AdminPage/InterestingFactsAdminBlock/InterestingFactsAdminBlock.component';

const EditStreetcodePage = () => {
    const { streetcodeId } = useParams<{ streetcodeId: string }>();
    const parsedId = Number(streetcodeId);

    if (!streetcodeId || Number.isNaN(parsedId) || parsedId <= 0) {
        return (
            <main className="editStreetcodePage">
                <AdminBar />
                <p className="editStreetcodeError">Невірний ідентифікатор стріткоду.</p>
            </main>
        );
    }

    return (
        <main className="editStreetcodePage">
            <AdminBar />
            <InterestingFactsAdminBlock streetcodeId={parsedId} />
        </main>
    );
};

export default observer(EditStreetcodePage);

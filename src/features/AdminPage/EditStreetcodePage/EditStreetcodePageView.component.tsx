import './EditStreetcodePage.styles.scss';

import AdminBar from '@features/AdminPage/AdminBar.component';
import InterestingFactsAdminBlock from '@features/AdminPage/InterestingFactsAdminBlock/InterestingFactsAdminBlock.component';
import ChronologyAdminBlock from '@features/AdminPage/ChronologyAdminBlock/ChronologyAdminBlock.component';

import EDIT_STREETCODE_PAGE_MESSAGES from './edit-streetcode-page.constants';

type EditStreetcodePageViewProps =
    | { viewState: 'loading' }
    | { viewState: 'invalid' }
    | { viewState: 'ready'; streetcodeId: number };

const EditStreetcodePageView = (props: EditStreetcodePageViewProps) => (
    <main className="editStreetcodePage">
        <AdminBar />
        {props.viewState === 'loading' && (
            <p className="editStreetcodeLoading">{EDIT_STREETCODE_PAGE_MESSAGES.LOADING}</p>
        )}
        {props.viewState === 'invalid' && (
            <p className="editStreetcodeError">{EDIT_STREETCODE_PAGE_MESSAGES.INVALID_STREETCODE_ID}</p>
        )}
        {props.viewState === 'ready' && (
            <>
                <InterestingFactsAdminBlock streetcodeId={props.streetcodeId} />
                <ChronologyAdminBlock streetcodeId={props.streetcodeId} />
            </>
        )}
    </main>
);

export default EditStreetcodePageView;

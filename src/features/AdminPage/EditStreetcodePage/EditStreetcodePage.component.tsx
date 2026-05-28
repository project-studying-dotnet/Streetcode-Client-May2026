import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import EditStreetcodePageView from './EditStreetcodePageView.component';
import { parseStreetcodeId } from './edit-streetcode-page.utils';

const EditStreetcodePage = () => {
    const { streetcodeId: rawStreetcodeId } = useParams<{ streetcodeId: string }>();
    const streetcodeId = useMemo(
        () => parseStreetcodeId(rawStreetcodeId),
        [rawStreetcodeId],
    );

    if (rawStreetcodeId === undefined) {
        return <EditStreetcodePageView viewState="loading" />;
    }

    if (streetcodeId === null) {
        return <EditStreetcodePageView viewState="invalid" />;
    }

    return <EditStreetcodePageView viewState="ready" streetcodeId={streetcodeId} />;
};

export default EditStreetcodePage;

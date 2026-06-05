import './StreetcodeEditor.styles.scss';

import { observer } from 'mobx-react-lite';
import StreetcodeCreate from './StreetcodeCreate/StreetcodeCreate.component';
import TextVideoBlockForm from '../TextVideoBlock/TextVideoBlockForm.component';
import AdminBar from '../AdminBar.component';

const StreetcodeEditor:React.FC = observer(() => {
   const streetcodeId = 4; 

    return (
        <div className="streetcode-editor-page">
             <AdminBar />
            <StreetcodeCreate />
            <TextVideoBlockForm  streetcodeId={streetcodeId}/>
           
        </div>
    );
});

export default StreetcodeEditor;

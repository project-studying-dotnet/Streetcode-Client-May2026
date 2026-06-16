import './index.scss';
import '@fonts/fonts.styles.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from 'react-ga4';
import { RouterProvider } from 'react-router-dom';
import router from '@app/router/Routes';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactGA.initialize('G-2RHY04JKG0');

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
            <RouterProvider router={router} />
        </GoogleOAuthProvider>
    </React.StrictMode>,
);
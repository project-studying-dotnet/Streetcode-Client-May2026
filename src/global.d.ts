declare const process: {
    env: {
        NODE_ENV: 'development' | 'production' | 'test';
        readonly REACT_APP_API_URL?: string;
        readonly REACT_APP_BACKEND_URL?: string;
        readonly REACT_APP_TEMPVAL?: string;
        readonly REACT_APP_ENVIRONMENT?: string;
        readonly REACT_APP_BUILD_SHA?: string;
        readonly REACT_APP_BUILD_NUMBER?: string;
    };
};
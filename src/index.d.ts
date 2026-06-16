
export {};

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
declare module "*.css";
declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_GOOGLE_CLIENT_ID: string;
      REACT_APP_API_URL?: string;
      REACT_APP_BACKEND_URL?: string;
    }
  }
}


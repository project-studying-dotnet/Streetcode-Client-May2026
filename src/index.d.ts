declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
<<<<<<< chore/108/Admin-Art-gallery-block
declare module '*.css';
declare module '*.jpeg';
declare module '*.scss' {
=======
declare module "*.css";
declare module "*.scss" {
>>>>>>> dev
  const classes: { [key: string]: string };
  export default classes;
}

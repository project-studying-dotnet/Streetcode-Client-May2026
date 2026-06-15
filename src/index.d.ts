declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.jpeg';
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

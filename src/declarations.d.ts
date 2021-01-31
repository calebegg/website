declare module "*.css" {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export default classNames;
}

declare module "*.glsl" {
  const content: string;
  export default content;
}

// Permitir la importación de archivos JSON
declare module "*.json" {
  const value: any;
  export default value;
}
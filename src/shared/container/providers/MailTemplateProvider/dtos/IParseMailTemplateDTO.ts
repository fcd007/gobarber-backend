
interface ITemplateVariable {
  [key: string]: string | number;
}

export default interface IParseTemplateDTO {
  file: string;
  variables:ITemplateVariable
}

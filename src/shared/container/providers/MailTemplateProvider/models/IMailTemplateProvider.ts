import IParseMalTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
    parse(data:IParseMalTemplateDTO): Promise<string>;
}

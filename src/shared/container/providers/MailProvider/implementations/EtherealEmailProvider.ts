import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealEmailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
          },
        });

        this.client = transporter;
      }
    )};

  public async sendMail({ to, subject, from, templateData }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;
    const info = await this.client.sendMail({
        from: {
          name: from?.name || 'Development Dantas',
          address: from?.name || 'noreply@cdantas.com.br',
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}

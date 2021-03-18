import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import EtherealEmailProvider from './implementations/EtherealEmailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealEmailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);

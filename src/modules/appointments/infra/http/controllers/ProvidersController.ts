import { Request, Response} from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

  //carrega o service se precisar de alguma dependência
  const listProviders = container.resolve(ListProvidersService);

  const provider = await listProviders.execute({
    user_id
  });

    return response.json(provider);
  }
}

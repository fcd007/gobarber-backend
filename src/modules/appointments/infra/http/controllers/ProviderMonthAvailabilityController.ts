import { Request, Response} from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService  from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id }  = request.params;
    const { month, year } = request.body;

  //carrega o service se precisar de alguma dependência
  const listProvidersMonthAvailabilty = container.resolve(ListProviderMonthAvailabilityService);

  const availability = await listProvidersMonthAvailabilty.execute({
    provider_id,
    month,
    year
  });

    return response.json(availability);
  }
}

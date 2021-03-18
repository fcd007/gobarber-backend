import { Request, Response} from 'express';
import { container } from 'tsyringe';

import ListproviderDayAvailabilityService  from '@modules/appointments/services/ListproviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {

  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id }  = request.params;
    const { day, month, year } = request.body;

  //carrega o service se precisar de alguma dependência
  const listProvidersDayAvailabilty = container.resolve(
    ListproviderDayAvailabilityService,
  );

  const availability = await listProvidersDayAvailabilty.execute({
    provider_id,
    day: Number(day),
    month: Number(month),
    year: Number(year)
  });

    return response.json(availability);
  }
}

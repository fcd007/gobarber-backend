import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAutheticaded from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAutheticaded);

profileRouter.get('/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;

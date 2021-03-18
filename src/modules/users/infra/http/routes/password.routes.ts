import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ForgotPasswordController from  '@modules/users/infra/http/controllers/ForgotPasswordController';
import ResetPassWordController from  '@modules/users/infra/http/controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPassWordController = new ResetPassWordController();

passwordRouter.post('/forgot',
celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);

passwordRouter.post('/reset',
celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().uuid().required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password')),
  },
}),
  resetPassWordController.create
);

export default passwordRouter;

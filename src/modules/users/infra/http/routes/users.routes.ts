import { Router } from 'express';
import multer from 'multer';
import { celebrate, Joi, Segments } from 'celebrate';

import uploadConfig from '@config/upload';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import ensureAutheticaded from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/',
celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
}),
 usersController.create);

usersRouter.patch(
  '/avatar',
  ensureAutheticaded,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;

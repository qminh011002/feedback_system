import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { wrapRequestHandler } from '../utils/asyncHandler';

const authRouter: Router = Router();
const AUTH_APIS = '/auth';

authRouter.post(AUTH_APIS + '/login', wrapRequestHandler(UserController.prototype.login));

export default authRouter;

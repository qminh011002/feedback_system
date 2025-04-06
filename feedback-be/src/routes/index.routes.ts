import { Router } from 'express';
import authRouter from './auth.routes';
import categoryRouter from './category.routes';
import feedbackRouter from './feedback.routes';
import commentRouter from './comment.routes';

const appRouter: Router = Router();

appRouter.use(authRouter);
appRouter.use(categoryRouter);
appRouter.use(feedbackRouter);
appRouter.use(commentRouter);

export default appRouter;

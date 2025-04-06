import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { validateCreateComment } from '../middlewares/comment.middleware';
import { wrapRequestHandler } from '../utils/asyncHandler';

const commentRouter: Router = Router();
const COMMENT_APIS = '/comments' as const;

commentRouter.post(
	COMMENT_APIS,
	wrapRequestHandler(validateCreateComment),
	wrapRequestHandler(CommentController.prototype.createComment)
);

export default commentRouter;

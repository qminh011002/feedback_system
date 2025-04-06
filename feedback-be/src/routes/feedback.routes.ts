import { Router } from 'express';
import { wrapRequestHandler } from '../utils/asyncHandler';
import FeedbackController from '../controllers/feedback.controller';
import { validateFeedback, validateUpdateStatusFeedback } from '../middlewares/feedback.middleware';

const feedbackRouter: Router = Router();
const FEEDBACK_APIS = '/feedbacks';

feedbackRouter.get(FEEDBACK_APIS, wrapRequestHandler(FeedbackController.prototype.getListFeedback));

feedbackRouter.get(
	FEEDBACK_APIS + '/:id/comments',
	wrapRequestHandler(FeedbackController.prototype.getListCommentByFeedbackId)
);

feedbackRouter.post(
	FEEDBACK_APIS,
	wrapRequestHandler(validateFeedback),
	wrapRequestHandler(FeedbackController.prototype.createFeedback)
);

feedbackRouter.delete(FEEDBACK_APIS + '/:id', wrapRequestHandler(FeedbackController.prototype.deleteFeedback));

feedbackRouter.get(FEEDBACK_APIS + '/:id', wrapRequestHandler(FeedbackController.prototype.getFeedbackById));

feedbackRouter.patch(
	FEEDBACK_APIS + '/:id/status',
	wrapRequestHandler(validateUpdateStatusFeedback),
	wrapRequestHandler(FeedbackController.prototype.updateStatusFeedback)
);

export default feedbackRouter;

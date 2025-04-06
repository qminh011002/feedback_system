import { Router } from 'express';
import { wrapRequestHandler } from '../utils/asyncHandler';
import CategoryController from '../controllers/category.controller';

const categoryRouter: Router = Router();
const CATEGORIES_API = '/categories' as const;

categoryRouter.get(CATEGORIES_API, wrapRequestHandler(CategoryController.prototype.getListCategory));

export default categoryRouter;

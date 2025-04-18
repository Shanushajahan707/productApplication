import { Router } from "express";
import { productRepository } from "../repositories/iProductRepository";
import { productInteractor } from "../interactor/iProductInteractor";
import { productController } from "../controller/productController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

const repository = new productRepository();
const interactor = new productInteractor(repository);
const controller = new productController(interactor);

router.post("/newproduct",authMiddleware, controller.createProduct.bind(controller));

export default router;

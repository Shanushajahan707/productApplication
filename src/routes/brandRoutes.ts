import { Router } from "express";

import { brandRepository } from "../repositories/iBrandRepository";
import { brandInteractor } from "../interactor/iBrandInteractor";
import { brandController } from "../controller/brandController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

const repository = new brandRepository();
const interactor = new brandInteractor(repository);
const controller = new brandController(interactor);

router.post("/newbrand", authMiddleware, controller.createBrand.bind(controller));
router.get("/getallbrand", authMiddleware, controller.getAllBrands.bind(controller));

export default router;

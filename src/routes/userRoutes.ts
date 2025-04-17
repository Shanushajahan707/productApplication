import { Router } from "express";
import { userRepository } from "../repositories/iUserRepository";
import { userInteractor } from "../interactor/iUserInteractor";
import { userController } from "../controller/userController";
// import auth from "../middleware/auth";
// import authMiddleware from "../middleware/auth";

const router = Router();

const repository = new userRepository();
const interactor = new userInteractor(repository);
const controller = new userController(interactor);

router.post("/loginuser", controller.login.bind(controller));
router.post("/signupuser", controller.signup.bind(controller));
router.post("/otpuser", controller.onCheckOtp.bind(controller));
router.post("/refreshtoken", controller.refreshToken.bind(controller));

export default router;


import { Router } from "express";
import { userRepository } from "../repositories/iUserRepository";
import { userInteractor } from "../interactor/iUserInteractor";
import { userController } from "../controller/userController";
import { authMiddleware } from "../middleware/auth"; // Ensure this middleware is implemented

const router = Router();

const repository = new userRepository();
const interactor = new userInteractor(repository);
const controller = new userController(interactor);

router.post("/loginuser", controller.login.bind(controller));
router.post("/signupuser", controller.signup.bind(controller));
router.post("/otpuser", controller.onCheckOtp.bind(controller));
router.post("/refreshtoken", controller.refreshToken.bind(controller));

// Add routes for user profile
router.get(
  "/profile",
  authMiddleware,
  controller.getUserProfile.bind(controller)
);
router.put(
  "/profile",
  authMiddleware,
  controller.updateUserProfile.bind(controller)
);

router.post(
  "/block/:userId",
  authMiddleware,
  controller.blockUser.bind(controller)
);
router.post(
  "/unblock/:userId",
  authMiddleware,
  controller.unblockUser.bind(controller)
);

// User visibility routes
router.get("/list", authMiddleware, controller.listUsers.bind(controller)); 
// Get all visible users
router.get(
  "/getuserprofile/:userId",
  authMiddleware,
  controller.getOtherUserProfile.bind(controller)
); // Get specific user profile

export default router;

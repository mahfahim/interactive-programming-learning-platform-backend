// src/modules/user/user.route.ts
import { Router } from "express";
import { authRateLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";

const router = Router();

router.post(
	"/register",
	authRateLimiter,
	validateRequest(UserValidation.UserRegistrationZodSchema),
	AuthController.registerPatient,
);
router.post(
	"/verify-email",
	authRateLimiter,
	validateRequest(UserValidation.UserEmailVerifyZodSchema),
	AuthController.verifyPatientEmail,
);
router.post(
	"/login",
	authRateLimiter,
	validateRequest(UserValidation.LoginZodSchema),
	AuthController.loginUser,
);

router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/google", authRateLimiter, AuthController.googleLogin);
router.post(
	"/forgot-password",
	authRateLimiter,
	validateRequest(UserValidation.ForgotPasswordZodSchema),
	AuthController.forgotPassword,
);
router.post(
	"/reset-password",
	authRateLimiter,
	validateRequest(UserValidation.ResetPasswordZodSchema),
	AuthController.resetPassword,
);

export const AuthRoutes = router;

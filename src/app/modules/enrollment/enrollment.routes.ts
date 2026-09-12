import express, { type Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { paymentRateLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentValidation } from "./enrollment.validation";

const router: Router = express.Router();

router.post(
	"/:courseId/enroll",
	paymentRateLimiter,
	auth(Role.STUDENT),
	validateRequest(EnrollmentValidation.enrollCourseValidationSchema),
	EnrollmentController.enrollCourse,
);

// SSLCommerz & bKash Callbacks
router.post("/ssl-success", EnrollmentController.sslSuccess);
router.post("/ssl-fail", EnrollmentController.sslFail);
router.post("/ssl-cancel", EnrollmentController.sslCancel);
router.post("/ssl-ipn", EnrollmentController.sslSuccess);
router.get("/bkash-callback", EnrollmentController.handleBkashCallback);

router.get(
	"/my-courses",
	auth(Role.STUDENT),
	EnrollmentController.getMyEnrolledCourses,
);

export const EnrollmentRoutes = router;

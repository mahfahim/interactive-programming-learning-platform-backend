import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();

router.get("/my-payments", auth(Role.STUDENT), PaymentController.getMyPayments);

router.get("/all-payments", auth(Role.ADMIN), PaymentController.getAllPayments);

router.get(
	"/:paymentId",
	auth(Role.STUDENT, Role.ADMIN, Role.INSTRUCTOR),
	PaymentController.getSinglePayment,
);

// Admin Only Route: Initiate Refund & Cancel Enrollment
router.post(
	"/refund/:paymentId",
	auth(Role.ADMIN),
	validateRequest(PaymentValidation.initiateRefundValidationSchema),
	PaymentController.initiateRefund,
);

export const PaymentRoutes = router;

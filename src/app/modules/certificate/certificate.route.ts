import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { authRateLimiter } from "../../middlewares/rateLimiter";
import { CertificateController } from "./certificate.controller";

const router = Router();

router.get(
	"/my-certificate/:courseId",
	authRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	CertificateController.getMyCertificate,
);

router.get("/verify/:certificateUid", CertificateController.verifyCertificate);

export const CertificateRoutes = router;

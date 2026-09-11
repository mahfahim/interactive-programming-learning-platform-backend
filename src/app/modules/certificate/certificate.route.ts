import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { CertificateController } from "./certificate.controller";

const router = Router();

router.get(
	"/my-certificate/:courseId",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	CertificateController.getMyCertificate,
);

router.get("/verify/:certificateUid", CertificateController.verifyCertificate);

export const CertificateRoutes = router;

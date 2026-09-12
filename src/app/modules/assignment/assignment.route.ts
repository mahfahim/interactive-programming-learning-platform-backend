import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { upload } from "../../lib/multer";
import { auth } from "../../middlewares/checkAuth";
import { authRateLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { AssignmentController } from "./assignment.controller";
import { AssignmentValidation } from "./assignment.validation";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(AssignmentValidation.CreateAssignmentZodSchema),
	AssignmentController.createAssignment,
);

router.get(
	"/lessons/:lessonId",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	AssignmentController.getAssignmentByLessonId,
);

router.post(
	"/submit",
	authRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	upload.array("files", 5),
	validateRequest(AssignmentValidation.SubmitAssignmentZodSchema),
	AssignmentController.submitAssignment,
);

router.get(
	"/my-submission/:assignmentId",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	AssignmentController.getMySubmission,
);

router.patch(
	"/submissions/:submissionId/grade",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(AssignmentValidation.GradeSubmissionZodSchema),
	AssignmentController.gradeSubmission,
);

router.get(
	"/:id/submissions",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	AssignmentController.getAssignmentSubmissions,
);

router.get(
	"/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	AssignmentController.getAssignmentById,
);

router.patch(
	"/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(AssignmentValidation.UpdateAssignmentZodSchema),
	AssignmentController.updateAssignment,
);

router.delete(
	"/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	AssignmentController.deleteAssignment,
);

export const AssignmentRoutes = router;

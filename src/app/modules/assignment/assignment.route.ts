import { Router } from "express";
import { upload } from "../../lib/multer";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { AssignmentController } from "./assignment.controller";
import { AssignmentValidation } from "./assignment.validation";

const router = Router();

router.post(
	"/",
	auth("ADMIN", "INSTRUCTOR"),
	validateRequest(AssignmentValidation.CreateAssignmentZodSchema),
	AssignmentController.createAssignment,
);

router.get(
	"/lessons/:lessonId",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	AssignmentController.getAssignmentByLessonId,
);

router.post(
	"/submit",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	upload.array("files", 5),
	validateRequest(AssignmentValidation.SubmitAssignmentZodSchema),
	AssignmentController.submitAssignment,
);

router.get(
	"/my-submission/:assignmentId",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	AssignmentController.getMySubmission,
);

router.patch(
	"/submissions/:submissionId/grade",
	auth("ADMIN", "INSTRUCTOR"),
	validateRequest(AssignmentValidation.GradeSubmissionZodSchema),
	AssignmentController.gradeSubmission,
);

router.get(
	"/:id/submissions",
	auth("ADMIN", "INSTRUCTOR"),
	AssignmentController.getAssignmentSubmissions,
);

router.get(
	"/:id",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	AssignmentController.getAssignmentById,
);

router.patch(
	"/:id",
	auth("ADMIN", "INSTRUCTOR"),
	validateRequest(AssignmentValidation.UpdateAssignmentZodSchema),
	AssignmentController.updateAssignment,
);

router.delete(
	"/:id",
	auth("ADMIN", "INSTRUCTOR"),
	AssignmentController.deleteAssignment,
);

export const AssignmentRoutes = router;

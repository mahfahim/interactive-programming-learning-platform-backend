import { Role } from "../../../generated/prisma/enums";
import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { QuizController } from "./quiz.controller";
import { QuizValidation } from "./quiz.validation";

const router = Router();

router.post(
	"/",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(QuizValidation.CreateQuizZodSchema),
	QuizController.createQuiz,
);

router.get(
	"/lessons/:lessonId",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	QuizController.getQuizByLessonId,
);

router.post(
	"/submit",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(QuizValidation.SubmitQuizZodSchema),
	QuizController.submitQuiz,
);

router.get(
	"/attempts/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	QuizController.getAttemptById,
);

router.get(
	"/my-attempts/:quizLessonId",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	QuizController.getMyAttempts,
);

router.get(
	"/:id/attempts",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	QuizController.getQuizAttempts,
);

router.get(
	"/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	QuizController.getQuizById,
);

router.patch(
	"/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(QuizValidation.UpdateQuizZodSchema),
	QuizController.updateQuiz,
);

router.delete(
	"/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	QuizController.deleteQuiz,
);

export const QuizRoutes = router;

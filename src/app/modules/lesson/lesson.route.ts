import express, { type Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { LessonController } from "./lesson.controller";
import { LessonValidations } from "./lesson.validation";

const router: Router = express.Router();

// CRITICAL ROUTE ORDERING: Specific lesson sub-resources MUST be declared before GET /lessons/:id

router.get("/:lessonId/video", LessonController.getVideoLesson);

router.patch(
	"/:lessonId/video",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(LessonValidations.upsertVideoLessonSchema),
	LessonController.upsertVideoLesson,
);

router.get("/:lessonId/article", LessonController.getArticleLesson);

router.patch(
	"/:lessonId/article",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(LessonValidations.syncArticleLessonSchema),
	LessonController.syncArticleLesson,
);

router.get(
	"/:lessonId/progress",
	auth(Role.STUDENT),
	LessonController.getLessonProgress,
);

router.patch(
	"/:lessonId/progress",
	auth(Role.STUDENT),
	validateRequest(LessonValidations.updateLessonProgressSchema),
	LessonController.updateLessonProgress,
);

// Generic Lesson Routes
router.post(
	"/",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(LessonValidations.createLessonSchema),
	LessonController.createLesson,
);

router.get("/:id", LessonController.getLessonById);

router.patch(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(LessonValidations.updateLessonSchema),
	LessonController.updateLesson,
);

router.delete(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	LessonController.deleteLesson,
);

export const LessonRoutes = router;

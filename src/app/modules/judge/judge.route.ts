// src/modules/judge/judge.route.ts

import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { JudgeController } from "./judge.controller";
import { JudgeValidation } from "./judge.validation";

const router = Router();

// Static & Execution Endpoints
router.post(
	"/run",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(JudgeValidation.RunCodeZodSchema),
	JudgeController.runCode,
);

router.post(
	"/submit",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(JudgeValidation.SubmitCodeZodSchema),
	JudgeController.submitCode,
);

router.get(
	"/my-submissions/:codingLessonId",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	JudgeController.getMySubmissions,
);

// Problem Management Endpoints (Admin / Instructor)
router.post(
	"/lessons",
	auth("ADMIN", "INSTRUCTOR"),
	validateRequest(JudgeValidation.CreateCodingLessonZodSchema),
	JudgeController.createCodingLesson,
);

router.patch(
	"/lessons/:id/test-cases",
	auth("ADMIN", "INSTRUCTOR"),
	validateRequest(JudgeValidation.UpdateTestCasesZodSchema),
	JudgeController.updateTestCases,
);

router.get(
	"/lessons/:id/submissions",
	auth("ADMIN", "INSTRUCTOR"),
	JudgeController.getCodingLessonSubmissions,
);

router.patch(
	"/lessons/:id",
	auth("ADMIN", "INSTRUCTOR"),
	validateRequest(JudgeValidation.UpdateCodingLessonZodSchema),
	JudgeController.updateCodingLesson,
);

// Problem Retrieval & Specific Submissions
router.get(
	"/lessons/:lessonId",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	JudgeController.getCodingLessonByLessonId,
);

router.get(
	"/submissions/:id",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	JudgeController.getSubmissionById,
);

export const JudgeRoutes = router;

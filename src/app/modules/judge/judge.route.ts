// src/app/modules/judge/judge.route.ts

import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { judgeRateLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { JudgeController } from "./judge.controller";
import { JudgeValidation } from "./judge.validation";

const router = Router();

// Static & Execution Endpoints
router.post(
	"/run",
	judgeRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(JudgeValidation.RunCodeZodSchema),
	JudgeController.runCode,
);

router.post(
	"/submit",
	judgeRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(JudgeValidation.SubmitCodeZodSchema),
	JudgeController.submitCode,
);

router.get(
	"/my-submissions/:codingLessonId",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	JudgeController.getMySubmissions,
);

// Problem Management Endpoints (Admin / Instructor)
router.post(
	"/lessons",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(JudgeValidation.CreateCodingLessonZodSchema),
	JudgeController.createCodingLesson,
);

router.patch(
	"/lessons/:id/test-cases",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(JudgeValidation.UpdateTestCasesZodSchema),
	JudgeController.updateTestCases,
);

router.get(
	"/lessons/:id/submissions",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	JudgeController.getCodingLessonSubmissions,
);

router.patch(
	"/lessons/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR),
	validateRequest(JudgeValidation.UpdateCodingLessonZodSchema),
	JudgeController.updateCodingLesson,
);

// Problem Retrieval & Specific Submissions
router.get(
	"/lessons/:lessonId",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	JudgeController.getCodingLessonByLessonId,
);

router.get(
	"/submissions/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	JudgeController.getSubmissionById,
);

export const JudgeRoutes = router;

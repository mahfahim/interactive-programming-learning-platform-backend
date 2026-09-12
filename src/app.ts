// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Request, Response, NextFunction } from "express";
import express from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import config from "./app/config";
import { globalRateLimiter } from "./app/middlewares/rateLimiter";
import { getBkashIdToken } from "./app/lib/bkash";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

import { AuthRoutes } from "./app/modules/auth/auth.route";
import { UserRoutes } from "./app/modules/user/user.route";
import { CourseRoutes } from "./app/modules/course/course.route";
import { SuperModuleRoutes } from "./app/modules/superModule/superModule.route";
import { ModuleRoutes } from "./app/modules/module/module.route";
import { LessonRoutes } from "./app/modules/lesson/lesson.route";
import { AssignmentRoutes } from "./app/modules/assignment/assignment.route";
import { DiscussionRoutes } from "./app/modules/discussion/discussion.route";
import { JudgeRoutes } from "./app/modules/judge/judge.route";
import { QuizRoutes } from "./app/modules/quiz/quiz.route";
import { PaymentRoutes } from "./app/modules/payment/payment.route";
import { EnrollmentRoutes } from "./app/modules/enrollment/enrollment.routes";
import { CertificateRoutes } from "./app/modules/certificate/certificate.route";

const app: Application = express();

app.set("trust proxy", 1);

app.use(
	helmet({
		crossOriginResourcePolicy: { policy: "cross-origin" },
		crossOriginEmbedderPolicy: false,
	}),
);

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(globalRateLimiter);

app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to Code BD Code backend",
	});
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/courses", CourseRoutes);
app.use("/api/v1/super-modules", SuperModuleRoutes);
app.use("/api/v1/modules", ModuleRoutes);
app.use("/api/v1/lessons", LessonRoutes);
app.use("/api/v1/judge", JudgeRoutes);
app.use("/api/v1/quizzes", QuizRoutes);
app.use("/api/v1/assignments", AssignmentRoutes);
app.use("/api/v1/discussions", DiscussionRoutes);
app.use("/api/v1/certificates", CertificateRoutes);
app.use("/api/v1/payment", PaymentRoutes);
app.use("/api/v1/enrollments", EnrollmentRoutes);

app.get("/test", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const grantIdTokenResult = await getBkashIdToken();

		console.log(grantIdTokenResult);

		res.status(httpStatus.OK).json({
			success: true,
			message: "Welcome to code bd code payment",
			data: null,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;

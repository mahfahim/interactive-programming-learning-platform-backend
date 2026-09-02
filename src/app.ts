// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

import { AuthRoutes } from "./app/modules/auth/auth.route";

// import { AnalyticsRoutes } from "./app/modules/analytics/analytics.route";
// import { AssignmentRoutes } from "./app/modules/assignment/assignment.route";
// import { CourseRoutes } from "./app/modules/course/course.route";
// import { DiscussionRoutes } from "./app/modules/discussion/discussion.route";
// import { JudgeRoutes } from "./app/modules/judge/judge.route";
// import { LessonRoutes } from "./app/modules/lesson/lesson.route";
// import { ModuleRoutes } from "./app/modules/module/module.route";
// import { ProfileRoutes } from "./app/modules/user/user.route";
// import { QuizRoutes } from "./app/modules/quiz/quiz.route";
// import { SuperModuleRoutes } from "./app/modules/superModule/superModule.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);

// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/profiles", ProfileRoutes);
// app.use("/api/v1/courses", CourseRoutes);
// app.use("/api/v1/super-modules", SuperModuleRoutes);
// app.use("/api/v1/modules", ModuleRoutes);
// app.use("/api/v1/lessons", LessonRoutes);
// app.use("/api/v1/judge", JudgeRoutes);
// app.use("/api/v1/quizzes", QuizRoutes);
// app.use("/api/v1/assignments", AssignmentRoutes);
// app.use("/api/v1/discussions", DiscussionRoutes);
// app.use("/api/v1/analytics", AnalyticsRoutes);

app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to Code BD Code",
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;

import express, { type Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { CourseController } from "./course.controller";
import { CourseValidations } from "./course.validation";

const router: Router = express.Router();

router.post(
	"/",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(CourseValidations.createCourseSchema),
	CourseController.createCourse,
);

router.get(
	"/",
	validateRequest(CourseValidations.courseQuerySchema),
	CourseController.getCourses,
);

router.get(
	"/my-courses",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	CourseController.getMyCourses,
);

router.get(
	"/enrolled/my-courses",
	auth(Role.STUDENT),
	CourseController.getMyEnrolledCourses,
);

router.post(
	"/:courseId/enroll",
	auth(Role.STUDENT),
	CourseController.enrollCourse,
);

router.get("/:id", CourseController.getCourseById);

router.patch(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	validateRequest(CourseValidations.updateCourseSchema),
	CourseController.updateCourse,
);

router.delete(
	"/:id",
	auth(Role.INSTRUCTOR, Role.ADMIN),
	CourseController.deleteCourse,
);

export const CourseRoutes = router;

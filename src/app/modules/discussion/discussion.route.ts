import { Router } from "express";
import { Role } from "../../../generated/prisma/client";
import { auth } from "../../middlewares/checkAuth";
import { authRateLimiter } from "../../middlewares/rateLimiter";
import { validateRequest } from "../../middlewares/validateRequest";
import { DiscussionController } from "./discussion.controller";
import { DiscussionValidation } from "./discussion.validation";

const router = Router();

// Thread Creation (Spam Protection)
router.post(
	"/threads",
	authRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(DiscussionValidation.CreateDiscussionThreadZodSchema),
	DiscussionController.createThread,
);

router.get(
	"/threads/lesson/:lessonId",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(DiscussionValidation.ThreadQueryZodSchema),
	DiscussionController.getThreadsByLesson,
);

// Reaction Spam Protection
router.post(
	"/threads/:id/react",
	authRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(DiscussionValidation.ReactionZodSchema),
	DiscussionController.toggleThreadReaction,
);

// Comment Creation (Spam Protection)
router.post(
	"/threads/:threadId/comments",
	authRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(DiscussionValidation.CreateDiscussionCommentZodSchema),
	DiscussionController.createComment,
);

router.get(
	"/threads/:threadId/comments",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	DiscussionController.getThreadComments,
);

router.patch(
	"/comments/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(DiscussionValidation.UpdateDiscussionCommentZodSchema),
	DiscussionController.updateComment,
);

router.delete(
	"/comments/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	DiscussionController.deleteComment,
);

// Comment Reaction Spam Protection
router.post(
	"/comments/:id/react",
	authRateLimiter,
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(DiscussionValidation.ReactionZodSchema),
	DiscussionController.toggleCommentReaction,
);

router.get(
	"/threads/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	DiscussionController.getThreadById,
);

router.patch(
	"/threads/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	validateRequest(DiscussionValidation.UpdateDiscussionThreadZodSchema),
	DiscussionController.updateThread,
);

router.delete(
	"/threads/:id",
	auth(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT),
	DiscussionController.deleteThread,
);

export const DiscussionRoutes = router;

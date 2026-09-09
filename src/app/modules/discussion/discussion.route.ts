// src/modules/discussion/discussion.route.ts

import { Router } from "express";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { DiscussionController } from "./discussion.controller";
import { DiscussionValidation } from "./discussion.validation";

const router = Router();

router.post(
	"/threads",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(DiscussionValidation.CreateDiscussionThreadZodSchema),
	DiscussionController.createThread,
);

router.get(
	"/threads/lesson/:lessonId",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(DiscussionValidation.ThreadQueryZodSchema),
	DiscussionController.getThreadsByLesson,
);

router.post(
	"/threads/:id/react",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(DiscussionValidation.ReactionZodSchema),
	DiscussionController.toggleThreadReaction,
);

router.post(
	"/threads/:threadId/comments",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(DiscussionValidation.CreateDiscussionCommentZodSchema),
	DiscussionController.createComment,
);

router.get(
	"/threads/:threadId/comments",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	DiscussionController.getThreadComments,
);

router.patch(
	"/comments/:id",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(DiscussionValidation.UpdateDiscussionCommentZodSchema),
	DiscussionController.updateComment,
);

router.delete(
	"/comments/:id",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	DiscussionController.deleteComment,
);

router.post(
	"/comments/:id/react",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(DiscussionValidation.ReactionZodSchema),
	DiscussionController.toggleCommentReaction,
);

router.get(
	"/threads/:id",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	DiscussionController.getThreadById,
);

router.patch(
	"/threads/:id",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	validateRequest(DiscussionValidation.UpdateDiscussionThreadZodSchema),
	DiscussionController.updateThread,
);

router.delete(
	"/threads/:id",
	auth("ADMIN", "INSTRUCTOR", "STUDENT"),
	DiscussionController.deleteThread,
);

export const DiscussionRoutes = router;

import { z } from "zod";

export const createSuperModuleSchema = z.object({
	courseId: z.string().uuid("Invalid course ID format"),
	title: z.string().min(1, "Title is required").max(255),
	displayOrder: z.number().int().nonnegative(),
});

export const updateSuperModuleSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	displayOrder: z.number().int().nonnegative().optional(),
});

export const SuperModuleValidations = {
	createSuperModuleSchema,
	updateSuperModuleSchema,
};

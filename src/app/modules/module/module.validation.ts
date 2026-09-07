import { z } from "zod";

export const createModuleSchema = z.object({
	superModuleId: z.string().uuid("Invalid super module ID format"),
	title: z.string().min(1, "Title is required").max(255),
	displayOrder: z.number().int().nonnegative(),
});

export const updateModuleSchema = z.object({
	title: z.string().min(1).max(255).optional(),
	displayOrder: z.number().int().nonnegative().optional(),
});

export const ModuleValidations = {
	createModuleSchema,
	updateModuleSchema,
};

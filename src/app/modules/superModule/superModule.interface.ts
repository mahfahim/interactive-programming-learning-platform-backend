export interface ICreateSuperModuleInput {
	courseId: string;
	title: string;
	displayOrder: number;
}

export interface IUpdateSuperModuleInput {
	title?: string;
	displayOrder?: number;
}

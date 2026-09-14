export interface IAssignmentCreatePayload {
	title: string;
	instructions: string;
	dueDate: string | Date;
	lessonId: string;
}

export interface IAssignmentUpdatePayload {
	title?: string;
	instructions?: string;
	dueDate?: string | Date;
}

export interface IAssignmentSubmitPayload {
	assignmentId: string;
	fileUrls: string[];
}

export interface IAssignmentGradePayload {
	scoreObtained: number;
	instructorFeedback?: string;
}

export interface IRequestUser {
	userId: string;
	role: string;
	email?: string;
}

export interface ICertificateResponse {
	id: string;
	userId: string;
	courseId: string;
	certificateUid: string;
	certificateUrl: string | null;
	issuedAt: Date;
	courseTitle?: string;
	studentName?: string;
}

export interface ICertificateVerificationResponse {
	isValid: boolean;
	certificateUid: string;
	studentName: string;
	courseTitle: string;
	issuedAt: Date;
	certificateUrl: string | null;
}

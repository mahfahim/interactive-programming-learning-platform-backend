// src/modules/user/user.interface.ts
import type { Role } from "../../../generated/prisma/enums";

export interface IRegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface ILoginUserPayload {
	email: string;
	password: string;
}

export interface IForgotPasswordPayload {
	email: string;
}

export interface IVerifyEmailPayload {
	email: string;
	otp: string;
}


export interface IGoogleLoginPayload {
	idToken: string;
}

export interface IForgotPasswordPayload {
	email: string;
}

export interface IResetPasswordPayload {
	email: string;
	newPassword: string;
	otp: string;
}

import crypto from "node:crypto";
import StatusCodes from "http-status-codes";
import PDFDocument from "pdfkit";
import { Prisma } from "@prisma/client";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { getOrSetCache } from "../../utils/cache";
import { certificateCacheKeys } from "../../utils/cacheKey";
import type {
	ICertificateResponse,
	ICertificateVerificationResponse,
} from "./certificate.interface";

const generateUniqueCertificateUid = async (): Promise<string> => {
	const year = new Date().getFullYear();
	let isUnique = false;
	let generatedUid = "";

	while (!isUnique) {
		const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
		generatedUid = `CBC-${year}-${randomHex}`;

		const existing = await prisma.certificate.findUnique({
			where: { certificateUid: generatedUid },
			select: { id: true },
		});

		if (!existing) {
			isUnique = true;
		}
	}

	return generatedUid;
};

// Generate A4 Landscape Certificate PDF in Memory
const createCertificatePdfBuffer = async (data: {
	studentName: string;
	courseTitle: string;
	issuedAt: Date;
	certificateUid: string;
}): Promise<Buffer> => {
	return new Promise((resolve, reject) => {
		// A4 Landscape dimensions in points: 841.89 x 595.28
		const doc = new PDFDocument({
			size: "A4",
			layout: "landscape",
			margin: 40,
		});

		const buffers: Buffer[] = [];
		doc.on("data", (chunk: Buffer) => buffers.push(chunk));
		doc.on("end", () => resolve(Buffer.concat(buffers)));
		doc.on("error", (err: Error) => reject(err));

		const width = doc.page.width;
		const height = doc.page.height;

		// --- Outer Decorative Border ---
		doc
			.rect(20, 20, width - 40, height - 40)
			.lineWidth(3)
			.strokeColor("#1E1B4B") // Dark Indigo
			.stroke();

		doc
			.rect(26, 26, width - 52, height - 52)
			.lineWidth(1)
			.strokeColor("#D97706") // Amber/Gold Accent
			.stroke();

		// Inner background tint
		doc
			.rect(30, 30, width - 60, height - 60)
			.fillColor("#FAFAFA")
			.fill();

		// --- Header Section ---
		doc
			.fillColor("#4F46E5") // Indigo Accent
			.font("Helvetica-Bold")
			.fontSize(28)
			.text("CODE BD CODE", 0, 75, { align: "center" });

		doc
			.fillColor("#6B7280")
			.font("Helvetica")
			.fontSize(10)
			.text("INTERACTIVE PROGRAMMING LEARNING PLATFORM", 0, 110, {
				align: "center",
				characterSpacing: 2,
			});

		// --- Certificate Title ---
		doc
			.fillColor("#1E293B")
			.font("Helvetica-Bold")
			.fontSize(22)
			.text("CERTIFICATE OF COMPLETION", 0, 150, { align: "center" });

		// Decorative Line under title
		const lineWidth = 180;
		const lineX = (width - lineWidth) / 2;
		doc
			.moveTo(lineX, 180)
			.lineTo(lineX + lineWidth, 180)
			.lineWidth(2)
			.strokeColor("#D97706")
			.stroke();

		// --- Student Section ---
		doc
			.fillColor("#475569")
			.font("Helvetica")
			.fontSize(14)
			.text("This certificate is proudly presented to", 0, 210, {
				align: "center",
			});

		doc
			.fillColor("#0F172A")
			.font("Helvetica-Bold")
			.fontSize(26)
			.text(data.studentName.toUpperCase(), 0, 240, { align: "center" });

		// Student Name Line
		const nameLineWidth = 320;
		const nameLineX = (width - nameLineWidth) / 2;
		doc
			.moveTo(nameLineX, 275)
			.lineTo(nameLineX + nameLineWidth, 275)
			.lineWidth(1)
			.strokeColor("#94A3B8")
			.stroke();

		// --- Course Details ---
		doc
			.fillColor("#475569")
			.font("Helvetica")
			.fontSize(14)
			.text("for successfully completing the course", 0, 300, {
				align: "center",
			});

		doc
			.fillColor("#4F46E5")
			.font("Helvetica-Bold")
			.fontSize(20)
			.text(data.courseTitle, 0, 330, { align: "center" });

		// --- Dates & Metadata ---
		const formattedDate = new Intl.DateTimeFormat("en-US", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}).format(data.issuedAt);

		doc
			.fillColor("#64748B")
			.font("Helvetica")
			.fontSize(11)
			.text(`Issued Date: ${formattedDate}`, 0, 385, { align: "center" });

		doc
			.fillColor("#64748B")
			.font("Helvetica-Bold")
			.fontSize(10)
			.text(`Certificate ID: ${data.certificateUid}`, 0, 405, {
				align: "center",
			});

		// --- Signatures Section ---
		const sigY = 460;

		// Left Signature - Code BD Code Platform
		doc
			.moveTo(120, sigY)
			.lineTo(280, sigY)
			.lineWidth(1)
			.strokeColor("#64748B")
			.stroke();

		doc
			.fillColor("#334155")
			.font("Helvetica-Bold")
			.fontSize(12)
			.text("Code BD Code Team", 120, sigY + 10, {
				width: 160,
				align: "center",
			});

		doc
			.fillColor("#94A3B8")
			.font("Helvetica")
			.fontSize(9)
			.text("Authorized Platform", 120, sigY + 26, {
				width: 160,
				align: "center",
			});

		// Right Signature - Instructor / Academic Director
		doc
			.moveTo(width - 280, sigY)
			.lineTo(width - 120, sigY)
			.lineWidth(1)
			.strokeColor("#64748B")
			.stroke();

		doc
			.fillColor("#334155")
			.font("Helvetica-Bold")
			.fontSize(12)
			.text("Course Instructor", width - 280, sigY + 10, {
				width: 160,
				align: "center",
			});

		doc
			.fillColor("#94A3B8")
			.font("Helvetica")
			.fontSize(9)
			.text("Academic Verification", width - 280, sigY + 26, {
				width: 160,
				align: "center",
			});

		// Verification Footer
		doc
			.fillColor("#94A3B8")
			.font("Helvetica")
			.fontSize(8)
			.text(
				`Verify authentic certificate at codebdcode.com/verify/${data.certificateUid}`,
				0,
				height - 55,
				{ align: "center" },
			);

		doc.end();
	});
};

// Upload PDF Buffer to Cloudinary
const uploadCertificateToCloudinary = async (
	pdfBuffer: Buffer,
	certificateUid: string,
): Promise<{ url: string; publicId: string }> => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder: "code_bd_code/certificates",
				public_id: `${certificateUid}.pdf`,
				resource_type: "auto",
			},
			(error, result) => {
				if (error || !result) {
					return reject(
						new AppError(
							StatusCodes.INTERNAL_SERVER_ERROR,
							`Cloudinary PDF upload failed: ${error?.message || "Unknown error"}`,
						),
					);
				}
				resolve({
					url: result.secure_url,
					publicId: result.public_id,
				});
			},
		);

		uploadStream.end(pdfBuffer);
	});
};

// Check Course Completion for Given User & Course
const verifyCourseCompletion = async (
	userId: string,
	courseId: string,
): Promise<void> => {
	const totalLessonsCount = await prisma.lesson.count({
		where: {
			module: {
				superModule: {
					courseId,
				},
			},
		},
	});

	if (totalLessonsCount === 0) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"This course does not have any lesson content configured yet.",
		);
	}

	const completedLessonsCount = await prisma.lessonProgress.count({
		where: {
			userId,
			isCompleted: true,
			lesson: {
				module: {
					superModule: {
						courseId,
					},
				},
			},
		},
	});

	if (completedLessonsCount < totalLessonsCount) {
		const progressPercentage = Math.round(
			(completedLessonsCount / totalLessonsCount) * 100,
		);
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			`Course is not completed yet. You have completed ${completedLessonsCount}/${totalLessonsCount} lessons (${progressPercentage}%).`,
		);
	}
};

// Generate or Retrieve Logged-In Student's Certificate
const getMyCertificate = async (
	userId: string,
	courseId: string,
): Promise<ICertificateResponse> => {
	return getOrSetCache(
		certificateCacheKeys.my(userId, courseId),
		async () => {
			// 1. Validate course existence
			const course = await prisma.course.findUnique({
				where: { id: courseId },
				select: { id: true, title: true, price: true },
			});

			if (!course) {
				throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
			}

			const enrollment = await prisma.enrollment.findUnique({
				where: {
					userId_courseId: { userId, courseId },
				},
				select: { isPaid: true },
			});

			if (!enrollment) {
				throw new AppError(
					StatusCodes.FORBIDDEN,
					"You are not enrolled in this course.",
				);
			}

			if (Number(course.price) > 0 && !enrollment.isPaid) {
				throw new AppError(
					StatusCodes.PAYMENT_REQUIRED,
					"Active paid enrollment required to access certificate.",
				);
			}

			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, name: true, email: true },
			});

			if (!user) {
				throw new AppError(StatusCodes.NOT_FOUND, "User profile not found");
			}

			const existingCertificate = await prisma.certificate.findUnique({
				where: {
					userId_courseId: { userId, courseId },
				},
			});

			if (existingCertificate) {
				return {
					id: existingCertificate.id,
					userId: existingCertificate.userId,
					courseId: existingCertificate.courseId,
					certificateUid: existingCertificate.certificateUid,
					certificateUrl: existingCertificate.certificateUrl,
					issuedAt: existingCertificate.issuedAt,
					courseTitle: course.title,
					studentName: user.name || "Student",
				};
			}

			await verifyCourseCompletion(userId, courseId);

			const certificateUid = await generateUniqueCertificateUid();
			const studentName = user.name || user.email.split("@")[0] || "Student";
			const issuedAt = new Date();

			const pdfBuffer = await createCertificatePdfBuffer({
				studentName,
				courseTitle: course.title,
				issuedAt,
				certificateUid,
			});

			let uploadResult = { url: "", publicId: "" };
			try {
				uploadResult = await uploadCertificateToCloudinary(
					pdfBuffer,
					certificateUid,
				);
			} catch (error) {
				console.error("Cloudinary Upload Notice:", (error as Error).message);
			}

			try {
				const newCertificate = await prisma.certificate.create({
					data: {
						userId,
						courseId,
						certificateUid,
						certificateUrl: uploadResult.url || null,
						certificatePublicId: uploadResult.publicId || null,
						issuedAt,
					},
				});

				return {
					id: newCertificate.id,
					userId: newCertificate.userId,
					courseId: newCertificate.courseId,
					certificateUid: newCertificate.certificateUid,
					certificateUrl: newCertificate.certificateUrl,
					issuedAt: newCertificate.issuedAt,
					courseTitle: course.title,
					studentName,
				};
			} catch (error) {
				// Graceful race condition recovery: if another concurrent request created the record first
				if (
					error instanceof Prisma.PrismaClientKnownRequestError &&
					error.code === "P2002"
				) {
					const duplicateCertificate = await prisma.certificate.findUnique({
						where: { userId_courseId: { userId, courseId } },
					});

					if (duplicateCertificate) {
						return {
							id: duplicateCertificate.id,
							userId: duplicateCertificate.userId,
							courseId: duplicateCertificate.courseId,
							certificateUid: duplicateCertificate.certificateUid,
							certificateUrl: duplicateCertificate.certificateUrl,
							issuedAt: duplicateCertificate.issuedAt,
							courseTitle: course.title,
							studentName,
						};
					}
				}
				throw error;
			}
		},
		600,
	);
};

// Public Certificate Verification
const verifyCertificate = async (
	certificateUid: string,
): Promise<ICertificateVerificationResponse> => {
	return getOrSetCache(
		certificateCacheKeys.verify(certificateUid),
		async () => {
			const certificate = await prisma.certificate.findUnique({
				where: { certificateUid },
				include: {
					user: {
						select: {
							name: true,
							email: true,
						},
					},
					course: {
						select: {
							title: true,
						},
					},
				},
			});

			if (!certificate) {
				throw new AppError(
					StatusCodes.NOT_FOUND,
					"Invalid or non-existent certificate UID.",
				);
			}

			const studentName =
				certificate.user.name ||
				certificate.user.email.split("@")[0] ||
				"Verified Student";

			return {
				isValid: true,
				certificateUid: certificate.certificateUid,
				studentName,
				courseTitle: certificate.course.title,
				issuedAt: certificate.issuedAt,
				certificateUrl: certificate.certificateUrl,
			};
		},
		3600,
	);
};

export const CertificateService = {
	getMyCertificate,
	verifyCertificate,
};

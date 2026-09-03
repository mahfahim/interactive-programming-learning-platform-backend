import { prisma } from "../src/app/lib/prisma";
import {
	Role,
	UserStatus,
	AuthProvider,
	SocialPlatform,
	ProficiencyLevel,
	CourseLevel,
	Language,
	LessonType,
	ReactionType,
	SubmissionStatus,
	ProgrammingLanguage,
	PaymentStatus,
} from "../src/generated/prisma/client";

async function main() {
	console.log("Seeding database...");

	// 1. Geography (findFirst + create ব্যবহার করা হয়েছে যেন Unique Constraint এরর না আসে)
	let country = await prisma.country.findFirst({
		where: { name: "Bangladesh" },
	});
	if (!country) {
		country = await prisma.country.create({
			data: { name: "Bangladesh" },
		});
	}

	let division = await prisma.division.findFirst({
		where: { name: "Dhaka Division" },
	});
	if (!division) {
		division = await prisma.division.create({
			data: {
				name: "Dhaka Division",
				countryId: country.id,
			},
		});
	}

	let district = await prisma.district.findFirst({
		where: { name: "Dhaka District" },
	});
	if (!district) {
		district = await prisma.district.create({
			data: {
				name: "Dhaka District",
				divisionId: division.id,
			},
		});
	}

	let city = await prisma.city.findFirst({
		where: { name: "Dhaka North" },
	});
	if (!city) {
		city = await prisma.city.create({
			data: {
				name: "Dhaka North",
				districtId: district.id,
			},
		});
	}

	// 2. Skills
	let skillJS = await prisma.skill.findFirst({
		where: { name: "JavaScript" },
	});
	if (!skillJS) {
		skillJS = await prisma.skill.create({
			data: { name: "JavaScript" },
		});
	}

	// 3. Users (email ফিল্ডটি Unique হওয়ায় এখানে upsert সঠিকভাবে কাজ করবে)
	const adminUser = await prisma.user.upsert({
		where: { email: "admin@example.com" },
		update: {
			name: "System Admin",
			role: Role.ADMIN,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
		create: {
			name: "System Admin",
			email: "admin@example.com",
			role: Role.ADMIN,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
	});

	const instructorUser = await prisma.user.upsert({
		where: { email: "instructor@example.com" },
		update: {
			name: "John Instructor",
			role: Role.INSTRUCTOR,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
		create: {
			name: "John Instructor",
			email: "instructor@example.com",
			role: Role.INSTRUCTOR,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
	});

	const studentUser = await prisma.user.upsert({
		where: { email: "student@example.com" },
		update: {
			name: "Rahim Student",
			role: Role.STUDENT,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
		create: {
			name: "Rahim Student",
			email: "student@example.com",
			role: Role.STUDENT,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
	});

	// 4. User Description & Sub-models
	const userDescription = await prisma.userDescription.upsert({
		where: { userId: studentUser.id },
		update: {
			bio: "Aspiring Full Stack Web Developer",
			cityId: city.id,
		},
		create: {
			userId: studentUser.id,
			bio: "Aspiring Full Stack Web Developer",
			cityId: city.id,
		},
	});

	// পুনরায় সিড চালানোর জন্য পূর্বের সাব-ডেটা ক্লিন করা হচ্ছে
	await prisma.userSocial.deleteMany({
		where: { userDescriptionId: userDescription.userId },
	});
	await prisma.userEducation.deleteMany({
		where: { userDescriptionId: userDescription.userId },
	});
	await prisma.userExperience.deleteMany({
		where: { userDescriptionId: userDescription.userId },
	});
	await prisma.userWebsite.deleteMany({
		where: { userDescriptionId: userDescription.userId },
	});
	await prisma.userSkill.deleteMany({
		where: { userDescriptionId: userDescription.userId },
	});

	await prisma.userSocial.create({
		data: {
			userDescriptionId: userDescription.userId,
			platform: SocialPlatform.GITHUB,
			url: "https://github.com/rahimstudent",
		},
	});

	await prisma.userEducation.create({
		data: {
			userDescriptionId: userDescription.userId,
			institution: "University of Dhaka",
			degree: "BSc",
			fieldOfStudy: "Computer Science",
			startDate: new Date("2020-01-01"),
		},
	});

	await prisma.userExperience.create({
		data: {
			userDescriptionId: userDescription.userId,
			company: "Tech Solutions Ltd.",
			position: "Junior Developer Intern",
			startDate: new Date("2023-01-01"),
			endDate: new Date("2023-06-30"),
			description: "Worked on React frontend components.",
		},
	});

	await prisma.userWebsite.create({
		data: {
			userDescriptionId: userDescription.userId,
			title: "Portfolio",
			url: "https://rahimdev.com",
		},
	});

	await prisma.userSkill.create({
		data: {
			userDescriptionId: userDescription.userId,
			skillId: skillJS.id,
			proficiencyLevel: ProficiencyLevel.INTERMEDIATE,
		},
	});

	// 5. Course Structure (slug ফিল্ডটি Unique)
	const course = await prisma.course.upsert({
		where: { slug: "full-stack-web-dev" },
		update: {
			title: "Full Stack Web Development",
			enrollmentCount: 1,
		},
		create: {
			title: "Full Stack Web Development",
			slug: "full-stack-web-dev",
			enrollmentCount: 1,
		},
	});

	// পুনরায় সিড দেওয়ার সময় কোর্সের চাইল্ড ডেটা ক্লিয়ার করা
	await prisma.payment.deleteMany({ where: { courseId: course.id } });
	await prisma.enrollment.deleteMany({ where: { courseId: course.id } });
	await prisma.grade.deleteMany({ where: { courseId: course.id } });
	await prisma.certificate.deleteMany({ where: { courseId: course.id } });
	await prisma.feedback.deleteMany({ where: { courseId: course.id } });
	await prisma.superModule.deleteMany({ where: { courseId: course.id } });
	await prisma.courseDescription.deleteMany({ where: { courseId: course.id } });

	const courseDescription = await prisma.courseDescription.create({
		data: {
			courseId: course.id,
			shortDescription: "Learn MERN stack from scratch.",
			fullDescription:
				"Comprehensive guide to building modern full-stack applications.",
			level: CourseLevel.BEGINNER,
			language: Language.BENGALI,
		},
	});

	await prisma.courseLearningOutcome.create({
		data: {
			courseDescriptionId: courseDescription.courseId,
			outcomeText: "Build scalable Node.js backend APIs.",
			displayOrder: 1,
		},
	});

	await prisma.coursePrerequisite.create({
		data: {
			courseDescriptionId: courseDescription.courseId,
			prerequisiteText: "Basic HTML, CSS, and JS knowledge.",
			displayOrder: 1,
		},
	});

	const superModule = await prisma.superModule.create({
		data: {
			courseId: course.id,
			title: "Milestone 1: Fundamentals",
			displayOrder: 1,
		},
	});

	const moduleObj = await prisma.module.create({
		data: {
			superModuleId: superModule.id,
			title: "Module 1: JavaScript Basics",
			displayOrder: 1,
		},
	});

	// 6. Lessons (Demo / Free vs Pro Lessons)

	// Video Lesson (Demo / Free Lesson)
	const videoLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Introduction to Node.js",
			lessonType: LessonType.VIDEO,
			displayOrder: 1,
			isPro: false,
		},
	});

	await prisma.videoLesson.create({
		data: {
			lessonId: videoLessonObj.id,
			videoUrl: "https://youtube.com/watch?v=dummy",
			durationSeconds: 600,
		},
	});

	// Article Lesson (Pro Lesson)
	const articleLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Understanding Async/Await",
			lessonType: LessonType.ARTICLE,
			displayOrder: 2,
			isPro: true,
		},
	});

	const articleLesson = await prisma.articleLesson.create({
		data: {
			lessonId: articleLessonObj.id,
		},
	});

	await prisma.articleSection.create({
		data: {
			articleLessonId: articleLesson.lessonId,
			content: { text: "Promises are building blocks for async flow." },
			displayOrder: 1,
		},
	});

	// Quiz Lesson (Pro Lesson)
	const quizLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "JS Basics Quiz",
			lessonType: LessonType.QUIZ,
			displayOrder: 3,
			isPro: true,
		},
	});

	const quizLesson = await prisma.quizLesson.create({
		data: {
			lessonId: quizLessonObj.id,
		},
	});

	const quizQuestion = await prisma.quizQuestion.create({
		data: {
			quizLessonId: quizLesson.id,
			questionText: "What is the typeof null in JS?",
			displayOrder: 1,
		},
	});

	const quizOptionCorrect = await prisma.quizOption.create({
		data: {
			questionId: quizQuestion.id,
			optionText: "object",
			isCorrect: true,
			displayOrder: 1,
		},
	});

	await prisma.quizOption.create({
		data: {
			questionId: quizQuestion.id,
			optionText: "null",
			isCorrect: false,
			displayOrder: 2,
		},
	});

	// Coding Lesson (Pro Lesson)
	const codingLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Sum of Two Numbers Problem",
			lessonType: LessonType.CODING,
			displayOrder: 4,
			isPro: true,
		},
	});

	const codingLesson = await prisma.codingLesson.create({
		data: {
			lessonId: codingLessonObj.id,
			problemStatement: "Write a program to sum two numbers.",
			inputFormat: "Two space separated integers",
			outputFormat: "Single integer result",
			timeLimitMs: 1000,
			memoryLimitKb: 256000,
		},
	});

	await prisma.codingTestCase.create({
		data: {
			codingLessonId: codingLesson.id,
			inputData: "2 3",
			expectedOutput: "5",
			displayOrder: 1,
		},
	});

	// Assignment Lesson (Pro Lesson)
	const assignmentLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Module 1 Capstone Assignment",
			lessonType: LessonType.ARTICLE,
			displayOrder: 5,
			isPro: true,
		},
	});

	const assignment = await prisma.assignment.create({
		data: {
			lessonId: assignmentLessonObj.id,
			title: "Build a CLI App",
			instructions: "Submit GitHub repository link.",
			dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		},
	});

	// 7. Payment & Enrollment (Course-specific Pro Access)
	await prisma.payment.create({
		data: {
			userId: studentUser.id,
			courseId: course.id,
			status: PaymentStatus.COMPLETED,
			amount: 4500.0,
			currency: "BDT",
			paymentGateway: "bkash",
			merchantInvoiceNumber: `INV-${Date.now()}`,
			bkashPaymentId: "PAY123456789",
			bkashTrxId: "TRX987654321",
			payerReference: studentUser.email,
			paidAt: new Date(),
		},
	});

	await prisma.enrollment.create({
		data: {
			userId: studentUser.id,
			courseId: course.id,
			isPaid: true,
		},
	});

	await prisma.lessonProgress.create({
		data: {
			userId: studentUser.id,
			lessonId: videoLessonObj.id,
			isCompleted: true,
			completedAt: new Date(),
		},
	});

	// 8. User Submissions & Attempts
	await prisma.assignmentSubmission.create({
		data: {
			assignmentId: assignment.id,
			userId: studentUser.id,
			fileUrl: "https://github.com/rahimstudent/cli-app",
			scoreObtained: 95.5,
			instructorFeedback: "Great work on the architecture!",
			gradedByUserId: instructorUser.id,
			gradedAt: new Date(),
		},
	});

	await prisma.codingAnswer.create({
		data: {
			userId: studentUser.id,
			codingLessonId: codingLesson.id,
			language: ProgrammingLanguage.JAVASCRIPT,
			submittedCode:
				'const [a, b] = input.split(" ").map(Number); console.log(a + b);',
			status: SubmissionStatus.ACCEPTED,
			runtimeMs: 45,
			memoryUsedKb: 12000,
			passedTestCasesCount: 1,
		},
	});

	const quizAttempt = await prisma.quizAttempt.create({
		data: {
			userId: studentUser.id,
			quizLessonId: quizLesson.id,
			score: 100,
		},
	});

	await prisma.quizAttemptAnswer.create({
		data: {
			quizAttemptId: quizAttempt.id,
			questionId: quizQuestion.id,
			selectedOptionId: quizOptionCorrect.id,
		},
	});

	// 9. Course Completion & Ratings
	await prisma.grade.create({
		data: {
			userId: studentUser.id,
			courseId: course.id,
			totalScore: 97.75,
		},
	});

	await prisma.certificate.create({
		data: {
			userId: studentUser.id,
			courseId: course.id,
			certificateUid: `CERT-FULLSTACK-2026-${Date.now()}`,
		},
	});

	await prisma.feedback.create({
		data: {
			userId: studentUser.id,
			courseId: course.id,
			rating: 5,
			comment: "Excellent structured course!",
		},
	});

	// 10. Community / Discussion System
	const thread = await prisma.discussionThread.create({
		data: {
			lessonId: videoLessonObj.id,
			userId: studentUser.id,
			title: "Question regarding event loops",
			body: "Can someone explain microtask vs macrotask queues?",
			commentCount: 1,
			reactionCount: 1,
		},
	});

	await prisma.discussionThreadReaction.create({
		data: {
			userId: instructorUser.id,
			threadId: thread.id,
			reactionType: ReactionType.HELPFUL,
		},
	});

	const comment = await prisma.discussionComment.create({
		data: {
			threadId: thread.id,
			userId: instructorUser.id,
			body: "Promises go to the microtask queue, while setTimeout goes to the macrotask queue.",
			reactionCount: 1,
		},
	});

	await prisma.discussionCommentReaction.create({
		data: {
			userId: studentUser.id,
			commentId: comment.id,
			reactionType: ReactionType.LIKE,
		},
	});

	console.log("Seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

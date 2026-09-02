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
} from "../src/generated/prisma/client";

async function main() {
	console.log("Seeding database...");

	// 1. Geography
	const country = await prisma.country.create({
		data: { name: "Bangladesh" },
	});

	const division = await prisma.division.create({
		data: {
			name: "Dhaka Division",
			countryId: country.id,
		},
	});

	const district = await prisma.district.create({
		data: {
			name: "Dhaka District",
			divisionId: division.id,
		},
	});

	const city = await prisma.city.create({
		data: {
			name: "Dhaka North",
			districtId: district.id,
		},
	});

	// 2. Skills
	const skillJS = await prisma.skill.create({
		data: { name: "JavaScript" },
	});

	// 3. Users (Admin, Instructor, Student)
	const adminUser = await prisma.user.create({
		data: {
			name: "System Admin",
			email: "admin@example.com",
			role: Role.ADMIN,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
	});

	const instructorUser = await prisma.user.create({
		data: {
			name: "John Instructor",
			email: "instructor@example.com",
			role: Role.INSTRUCTOR,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
		},
	});

	const studentUser = await prisma.user.create({
		data: {
			name: "Rahim Student",
			email: "student@example.com",
			role: Role.STUDENT,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
			isPro: true,
		},
	});

	// 4. User Description & Sub-models
	const userDescription = await prisma.userDescription.create({
		data: {
			userId: studentUser.id,
			bio: "Aspiring Full Stack Web Developer",
			cityId: city.id,
		},
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

	// 5. Course Structure
	const course = await prisma.course.create({
		data: {
			title: "Full Stack Web Development",
			slug: "full-stack-web-dev",
			enrollmentCount: 1,
		},
	});

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

	// 6. Lessons & Specialized Lesson Types
	// Video Lesson
	const videoLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Introduction to Node.js",
			lessonType: LessonType.VIDEO,
			displayOrder: 1,
		},
	});

	await prisma.videoLesson.create({
		data: {
			lessonId: videoLessonObj.id,
			videoUrl: "https://youtube.com/watch?v=dummy",
			durationSeconds: 600,
		},
	});

	// Article Lesson
	const articleLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Understanding Async/Await",
			lessonType: LessonType.ARTICLE,
			displayOrder: 2,
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

	// Quiz Lesson
	const quizLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "JS Basics Quiz",
			lessonType: LessonType.QUIZ,
			displayOrder: 3,
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

	// Coding Lesson
	const codingLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Sum of Two Numbers Problem",
			lessonType: LessonType.CODING,
			displayOrder: 4,
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

	// Assignment Lesson
	const assignmentLessonObj = await prisma.lesson.create({
		data: {
			moduleId: moduleObj.id,
			title: "Module 1 Capstone Assignment",
			lessonType: LessonType.ARTICLE,
			displayOrder: 5,
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

	// 7. Enrollment & Progress
	await prisma.enrollment.create({
		data: {
			userId: studentUser.id,
			courseId: course.id,
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
			certificateUid: "CERT-FULLSTACK-2026-001",
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

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
	AuditAction,
	PrismaClient,
} from "../src/generated/prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Cast adapter to satisfy strict PrismaClientOptions type constraints
const prisma = new PrismaClient({ adapter: adapter as any });

const DEFAULT_PASSWORD = "Password123!";
const HASH_ROUNDS = 10;

async function main() {
	console.log("🚀 Starting Database Seeding process...");

	const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, HASH_ROUNDS);

	// ---------------------------------------------------------------------------
	// A. LOCATION DATA (Bangladesh Hierarchy)
	// ---------------------------------------------------------------------------
	console.log("📍 Seeding Location Hierarchy...");

	const country = await prisma.country.upsert({
		where: { name: "Bangladesh" },
		update: {},
		create: { name: "Bangladesh" },
	});

	const dhakaDivision = await prisma.division.create({
		data: {
			name: "Dhaka Division",
			countryId: country.id,
			districts: {
				create: [
					{
						name: "Dhaka District",
						cities: {
							create: [
								{ name: "Dhaka North" },
								{ name: "Dhaka South" },
								{ name: "Mirpur" },
								{ name: "Uttara" },
							],
						},
					},
					{
						name: "Gazipur District",
						cities: {
							create: [{ name: "Gazipur Sadar" }, { name: "Tongi" }],
						},
					},
				],
			},
		},
		include: {
			districts: {
				include: { cities: true },
			},
		},
	});

	const chattogramDivision = await prisma.division.create({
		data: {
			name: "Chattogram Division",
			countryId: country.id,
			districts: {
				create: [
					{
						name: "Chattogram District",
						cities: {
							create: [{ name: "Agrabad" }, { name: "Nasirabad" }],
						},
					},
				],
			},
		},
		include: {
			districts: {
				include: { cities: true },
			},
		},
	});

	const dhakaCity = dhakaDivision.districts[0].cities[0];
	const mirpurCity = dhakaDivision.districts[0].cities[2];
	const ctgCity = chattogramDivision.districts[0].cities[0];

	// ---------------------------------------------------------------------------
	// B. SKILLS DATA
	// ---------------------------------------------------------------------------
	console.log("💡 Seeding Skills...");
	const skillNames = [
		"JavaScript",
		"TypeScript",
		"Python",
		"C++",
		"Java",
		"React",
		"Node.js",
		"SQL",
		"Data Structures",
		"Algorithms",
		"Git",
		"Problem Solving",
	];

	const skillRecords: Record<string, string> = {};

	for (const name of skillNames) {
		const skill = await prisma.skill.upsert({
			where: { name },
			update: {},
			create: { name },
		});
		skillRecords[name] = skill.id;
	}

	// ---------------------------------------------------------------------------
	// C. USERS & PROFILES
	// ---------------------------------------------------------------------------
	console.log("👤 Seeding Users & Profiles...");

	// 1 ADMIN
	const admin = await prisma.user.upsert({
		where: { email: "admin@devplatform.com" },
		update: {},
		create: {
			email: "admin@devplatform.com",
			name: "System Admin",
			role: Role.ADMIN,
			password: hashedPassword,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
			imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
			description: {
				create: {
					bio: "Platform Lead Administrator and Infrastructure Engineer.",
					cityId: dhakaCity.id,
					socials: {
						create: [
							{
								platform: SocialPlatform.GITHUB,
								url: "https://github.com/admin-dev",
							},
							{
								platform: SocialPlatform.LINKEDIN,
								url: "https://linkedin.com/in/admin-dev",
							},
						],
					},
				},
			},
		},
	});

	// 2 INSTRUCTORS
	const instructor1 = await prisma.user.upsert({
		where: { email: "tanvir.rahman@devplatform.com" },
		update: {},
		create: {
			email: "tanvir.rahman@devplatform.com",
			name: "Tanvir Rahman",
			role: Role.INSTRUCTOR,
			password: hashedPassword,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
			imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
			description: {
				create: {
					bio: "Senior Full-Stack Architect with 10+ years of experience in Node.js, React, and Enterprise Systems.",
					cityId: dhakaCity.id,
					socials: {
						create: [
							{
								platform: SocialPlatform.GITHUB,
								url: "https://github.com/tanvir-dev",
							},
							{
								platform: SocialPlatform.TWITTER,
								url: "https://twitter.com/tanvir_tech",
							},
						],
					},
					educations: {
						create: [
							{
								institution: "BUET",
								degree: "B.Sc. in Computer Science",
								fieldOfStudy: "Computer Science & Engineering",
								startDate: new Date("2010-01-01"),
								endDate: new Date("2014-01-01"),
							},
						],
					},
					experiences: {
						create: [
							{
								company: "Tech Giant BD",
								position: "Lead Software Architect",
								startDate: new Date("2018-01-01"),
								description: "Leading microservices architecture migration.",
							},
						],
					},
					skills: {
						create: [
							{
								skillId: skillRecords["JavaScript"],
								proficiencyLevel: ProficiencyLevel.EXPERT,
							},
							{
								skillId: skillRecords["TypeScript"],
								proficiencyLevel: ProficiencyLevel.EXPERT,
							},
							{
								skillId: skillRecords["Node.js"],
								proficiencyLevel: ProficiencyLevel.EXPERT,
							},
						],
					},
				},
			},
		},
	});

	const instructor2 = await prisma.user.upsert({
		where: { email: "fahmida.khan@devplatform.com" },
		update: {},
		create: {
			email: "fahmida.khan@devplatform.com",
			name: "Fahmida Khan",
			role: Role.INSTRUCTOR,
			password: hashedPassword,
			status: UserStatus.ACTIVE,
			authProvider: AuthProvider.CREDENTIAL,
			emailVerified: true,
			imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
			description: {
				create: {
					bio: "Competitive Programmer, Candidate Master on Codeforces, specializing in DSA and C++.",
					cityId: ctgCity.id,
					skills: {
						create: [
							{
								skillId: skillRecords["C++"],
								proficiencyLevel: ProficiencyLevel.EXPERT,
							},
							{
								skillId: skillRecords["Data Structures"],
								proficiencyLevel: ProficiencyLevel.EXPERT,
							},
							{
								skillId: skillRecords["Algorithms"],
								proficiencyLevel: ProficiencyLevel.EXPERT,
							},
						],
					},
				},
			},
		},
	});

	// 5 STUDENTS
	const studentData = [
		{
			name: "Arik Hasan",
			email: "arik@student.com",
			cityId: mirpurCity.id,
			primarySkill: "JavaScript",
		},
		{
			name: "Nusrat Jahan",
			email: "nusrat@student.com",
			cityId: dhakaCity.id,
			primarySkill: "Python",
		},
		{
			name: "Siam Ahmed",
			email: "siam@student.com",
			cityId: ctgCity.id,
			primarySkill: "C++",
		},
		{
			name: "Mehedi Hasan",
			email: "mehedi@student.com",
			cityId: mirpurCity.id,
			primarySkill: "React",
		},
		{
			name: "Sabrina Chowdhury",
			email: "sabrina@student.com",
			cityId: dhakaCity.id,
			primarySkill: "TypeScript",
		},
	];

	const students = [];
	for (const s of studentData) {
		const student = await prisma.user.upsert({
			where: { email: s.email },
			update: {},
			create: {
				email: s.email,
				name: s.name,
				role: Role.STUDENT,
				password: hashedPassword,
				status: UserStatus.ACTIVE,
				authProvider: AuthProvider.CREDENTIAL,
				emailVerified: true,
				description: {
					create: {
						bio: `Aspiring developer eager to master programming and software engineering.`,
						cityId: s.cityId,
						skills: {
							create: [
								{
									skillId: skillRecords[s.primarySkill],
									proficiencyLevel: ProficiencyLevel.BEGINNER,
								},
							],
						},
					},
				},
			},
		});
		students.push(student);
	}

	// ---------------------------------------------------------------------------
	// D. COURSES & STRUCTURE
	// ---------------------------------------------------------------------------
	console.log("📚 Seeding Courses and Structural Modules...");

	// Course 1: JS Fundamentals
	const courseJS = await prisma.course.upsert({
		where: { slug: "javascript-fundamentals" },
		update: {},
		create: {
			title: "JavaScript Fundamentals for Beginners",
			slug: "javascript-fundamentals",
			price: 1500.0,
			instructorId: instructor1.id,
			enrollmentCount: 3,
			description: {
				create: {
					shortDescription:
						"Master modern JavaScript from scratch with interactive coding challenges.",
					fullDescription:
						"Comprehensive guide to JS basics, DOM manipulation, async programming, and ES6+ features.",
					level: CourseLevel.BEGINNER,
					language: Language.BENGALI,
					learningOutcomes: {
						create: [
							{
								outcomeText: "Understand JS syntax and data types",
								displayOrder: 1,
							},
							{
								outcomeText: "Master asynchronous JS (Promises, Async/Await)",
								displayOrder: 2,
							},
						],
					},
					prerequisites: {
						create: [
							{
								prerequisiteText: "Basic computer operation literacy",
								displayOrder: 1,
							},
						],
					},
				},
			},
		},
	});

	// Course 2: DSA
	await prisma.course.upsert({
		where: { slug: "data-structures-and-algorithms" },
		update: {},
		create: {
			title: "Data Structures and Algorithms in C++",
			slug: "data-structures-and-algorithms",
			price: 3500.0,
			instructorId: instructor2.id,
			enrollmentCount: 2,
			description: {
				create: {
					shortDescription:
						"Master DSA to crack technical interviews and competitive programming.",
					fullDescription:
						"Deep dive into arrays, linked lists, trees, graphs, sorting, and dynamic programming.",
					level: CourseLevel.INTERMEDIATE,
					language: Language.BENGALI,
					learningOutcomes: {
						create: [
							{
								outcomeText: "Analyze time & space complexity (Big O)",
								displayOrder: 1,
							},
							{
								outcomeText: "Implement complex algorithms in C++",
								displayOrder: 2,
							},
						],
					},
					prerequisites: {
						create: [
							{
								prerequisiteText: "Basic syntax knowledge of C or C++",
								displayOrder: 1,
							},
						],
					},
				},
			},
		},
	});

	// Course 3: Full-Stack Web Development
	await prisma.course.upsert({
		where: { slug: "full-stack-web-development" },
		update: {},
		create: {
			title: "Full-Stack Web Development with TypeScript & React",
			slug: "full-stack-web-development",
			price: 5000.0,
			instructorId: instructor1.id,
			enrollmentCount: 1,
			description: {
				create: {
					shortDescription:
						"Build enterprise-ready web applications using Node.js, Express, React, and PostgreSQL.",
					fullDescription:
						"End-to-end full-stack mastery: backend REST APIs, Prisma ORM, React frontend, and state management.",
					level: CourseLevel.ADVANCED,
					language: Language.ENGLISH,
					learningOutcomes: {
						create: [
							{
								outcomeText: "Architect resilient Node/Express backends",
								displayOrder: 1,
							},
							{
								outcomeText: "Design relational database schemas with Prisma",
								displayOrder: 2,
							},
						],
					},
					prerequisites: {
						create: [
							{ prerequisiteText: "Solid knowledge of JS/TS", displayOrder: 1 },
						],
					},
				},
			},
		},
	});

	// Build SuperModules, Modules, and Lessons for Course 1 (JS)
	const superModule1 = await prisma.superModule.create({
		data: {
			courseId: courseJS.id,
			title: "SuperModule 1: Language Basics",
			displayOrder: 1,
			modules: {
				create: [
					{
						title: "Module 1.1: Syntax & Variables",
						displayOrder: 1,
						lessons: {
							create: [
								{
									title: "Introduction to JavaScript Engine",
									lessonType: LessonType.VIDEO,
									displayOrder: 1,
									isPro: false,
									video: {
										create: {
											videoUrl: "https://vimeo.com/123456789",
											durationSeconds: 600,
										},
									},
								},
								{
									title: "Variables: let, const & var",
									lessonType: LessonType.ARTICLE,
									displayOrder: 2,
									isPro: false,
									article: {
										create: {
											sections: {
												create: [
													{
														displayOrder: 1,
														content: {
															header: "Variable Declarations",
															body: "JavaScript supports var, let, and const for scoping.",
														},
													},
												],
											},
										},
									},
								},
								{
									title: "Quiz: Variable Scope & Types",
									lessonType: LessonType.QUIZ,
									displayOrder: 3,
									isPro: false,
								},
							],
						},
					},
				],
			},
		},
		include: { modules: { include: { lessons: true } } },
	});

	const superModule2 = await prisma.superModule.create({
		data: {
			courseId: courseJS.id,
			title: "SuperModule 2: Practice & Practical Challenges",
			displayOrder: 2,
			modules: {
				create: [
					{
						title: "Module 2.1: Practical Coding",
						displayOrder: 1,
						lessons: {
							create: [
								{
									title: "Coding Task: Sum of Two Numbers",
									lessonType: LessonType.CODING,
									displayOrder: 1,
									isPro: true,
								},
								{
									title: "Assignment 1: Build a Calculator API",
									lessonType: LessonType.ASSIGNMENT,
									displayOrder: 2,
									isPro: true,
								},
							],
						},
					},
				],
			},
		},
		include: { modules: { include: { lessons: true } } },
	});

	// Extract created lesson IDs for references
	const quizLessonId = superModule1.modules[0].lessons.find(
		(l) => l.lessonType === LessonType.QUIZ,
	)!.id;
	const codingLessonId = superModule2.modules[0].lessons.find(
		(l) => l.lessonType === LessonType.CODING,
	)!.id;
	const assignmentLessonId = superModule2.modules[0].lessons.find(
		(l) => l.lessonType === LessonType.ASSIGNMENT,
	)!.id;
	const videoLessonId = superModule1.modules[0].lessons.find(
		(l) => l.lessonType === LessonType.VIDEO,
	)!.id;

	// ---------------------------------------------------------------------------
	// E. SPECIALIZED LESSON CONTENTS
	// ---------------------------------------------------------------------------
	console.log(
		"🧩 Populating Specialized Lesson Details (Quiz, Coding, Assignment)...",
	);

	// Quiz Lesson Details
	const quizLesson = await prisma.quizLesson.create({
		data: {
			lessonId: quizLessonId,
			questions: {
				create: [
					{
						questionText:
							"Which keyword declares a block-scoped variable in ES6?",
						displayOrder: 1,
						options: {
							create: [
								{ optionText: "var", isCorrect: false, displayOrder: 1 },
								{ optionText: "let", isCorrect: true, displayOrder: 2 },
								{ optionText: "global", isCorrect: false, displayOrder: 3 },
								{ optionText: "def", isCorrect: false, displayOrder: 4 },
							],
						},
					},
				],
			},
		},
		include: { questions: { include: { options: true } } },
	});

	// Coding Lesson Details
	const codingLesson = await prisma.codingLesson.create({
		data: {
			lessonId: codingLessonId,
			problemStatement:
				"Write a program that takes two integers separated by space and outputs their sum.",
			inputFormat: "Two space-separated integers: A B",
			outputFormat: "Single integer representing A + B",
			timeLimitMs: 1000,
			memoryLimitKb: 256000,
			testCases: {
				create: [
					{
						inputData: "5 10",
						expectedOutput: "15",
						isHidden: false,
						displayOrder: 1,
					},
					{
						inputData: "-3 8",
						expectedOutput: "5",
						isHidden: false,
						displayOrder: 2,
					},
					{
						inputData: "10000 25000",
						expectedOutput: "35000",
						isHidden: true,
						displayOrder: 3,
					},
				],
			},
		},
	});

	// Assignment Details
	const assignment = await prisma.assignment.create({
		data: {
			lessonId: assignmentLessonId,
			title: "JavaScript DOM & State Project",
			instructions:
				"Build an interactive To-Do App with local storage persistence and submission via GitHub repository URL.",
			dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
		},
	});

	// ---------------------------------------------------------------------------
	// F. ENROLLMENTS & PAYMENTS
	// ---------------------------------------------------------------------------
	console.log("💳 Seeding Payments and Course Enrollments...");

	// Student 0: Paid enrollment via SSLCOMMERZ
	const payment1 = await prisma.payment.create({
		data: {
			userId: students[0].id,
			courseId: courseJS.id,
			amount: courseJS.price,
			currency: "BDT",
			status: PaymentStatus.COMPLETED,
			paymentGateway: "SSLCOMMERZ",
			merchantInvoiceNumber: "INV-20260916-001",
			sslSessionKey: "SSL-SESS-9876543210",
			sslValId: "VAL-1234567890",
			payerReference: students[0].email,
			paidAt: new Date("2026-09-01T10:00:00Z"),
			gatewayResponse: { status: "SUCCESS", tran_id: "INV-20260916-001" },
		},
	});

	await prisma.enrollment.create({
		data: {
			userId: students[0].id,
			courseId: courseJS.id,
			isPaid: true,
			enrolledAt: new Date("2026-09-01T10:05:00Z"),
		},
	});

	// Student 1: Paid enrollment via bKash
	await prisma.payment.create({
		data: {
			userId: students[1].id,
			courseId: courseJS.id,
			amount: courseJS.price,
			currency: "BDT",
			status: PaymentStatus.COMPLETED,
			paymentGateway: "BKASH",
			merchantInvoiceNumber: "INV-20260916-002",
			bkashPaymentId: "BKASH-PAY-88776655",
			bkashTrxId: "TRX9988776655",
			payerReference: students[1].email,
			paidAt: new Date("2026-09-02T11:30:00Z"),
			gatewayResponse: { statusCode: "0000", statusMessage: "Successful" },
		},
	});

	await prisma.enrollment.create({
		data: {
			userId: students[1].id,
			courseId: courseJS.id,
			isPaid: true,
			enrolledAt: new Date("2026-09-02T11:35:00Z"),
		},
	});

	// Student 2: Free / Unpaid Trial Enrollment
	await prisma.enrollment.create({
		data: {
			userId: students[2].id,
			courseId: courseJS.id,
			isPaid: false,
			enrolledAt: new Date("2026-09-10T14:00:00Z"),
		},
	});

	// ---------------------------------------------------------------------------
	// G. PROGRESS, QUIZZES, CODING SUBMISSIONS, ASSIGNMENTS
	// ---------------------------------------------------------------------------
	console.log(
		"📝 Seeding Student Progress, Quiz Attempts, Coding Submissions...",
	);

	// Student 0 Progress
	await prisma.lessonProgress.createMany({
		data: [
			{
				userId: students[0].id,
				lessonId: videoLessonId,
				isCompleted: true,
				completedAt: new Date("2026-09-02T08:00:00Z"),
			},
			{
				userId: students[0].id,
				lessonId: quizLessonId,
				isCompleted: true,
				completedAt: new Date("2026-09-02T09:00:00Z"),
			},
			{
				userId: students[0].id,
				lessonId: codingLessonId,
				isCompleted: true,
				completedAt: new Date("2026-09-03T10:00:00Z"),
			},
		],
	});

	// Student 0 Quiz Attempt
	const quizQuestion = quizLesson.questions[0];
	const correctOption = quizQuestion.options.find((o) => o.isCorrect)!;

	await prisma.quizAttempt.create({
		data: {
			userId: students[0].id,
			quizLessonId: quizLesson.id,
			score: 100.0,
			attemptedAt: new Date("2026-09-02T09:00:00Z"),
			answers: {
				create: [
					{ questionId: quizQuestion.id, selectedOptionId: correctOption.id },
				],
			},
		},
	});

	// Student 0 Coding Submission
	await prisma.codingAnswer.create({
		data: {
			userId: students[0].id,
			codingLessonId: codingLesson.id,
			language: ProgrammingLanguage.JAVASCRIPT,
			submittedCode: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(' ');\nconsole.log(Number(input[0]) + Number(input[1]));`,
			status: SubmissionStatus.ACCEPTED,
			runtimeMs: 42,
			memoryUsedKb: 18400,
			passedTestCasesCount: 3,
			submittedAt: new Date("2026-09-03T10:00:00Z"),
		},
	});

	// Student 0 Assignment Submission & Grading
	await prisma.assignmentSubmission.create({
		data: {
			assignmentId: assignment.id,
			userId: students[0].id,
			fileUrls: ["https://github.com/student0/todo-app-assignment"],
			submittedAt: new Date("2026-09-05T12:00:00Z"),
			scoreObtained: 95.0,
			instructorFeedback:
				"Excellent application layout and clean modular code structure!",
			gradedByUserId: instructor1.id,
			gradedAt: new Date("2026-09-06T15:00:00Z"),
		},
	});

	// ---------------------------------------------------------------------------
	// H. GRADES & CERTIFICATES
	// ---------------------------------------------------------------------------
	console.log("🏆 Generating Course Grade and Certificate...");

	await prisma.grade.create({
		data: {
			userId: students[0].id,
			courseId: courseJS.id,
			totalScore: 97.5,
			calculatedAt: new Date("2026-09-07T10:00:00Z"),
		},
	});

	await prisma.certificate.create({
		data: {
			userId: students[0].id,
			courseId: courseJS.id,
			certificateUid: "CERT-JS-2026-889911",
			certificateUrl:
				"https://devplatform.com/certificates/CERT-JS-2026-889911.pdf",
			issuedAt: new Date("2026-09-07T10:30:00Z"),
		},
	});

	// ---------------------------------------------------------------------------
	// I. DISCUSSIONS
	// ---------------------------------------------------------------------------
	console.log("💬 Seeding Discussion Threads and Comments...");

	await prisma.discussionThread.create({
		data: {
			lessonId: videoLessonId,
			userId: students[1].id,
			title: "Question regarding JavaScript Execution Context",
			body: "Could someone clarify the exact difference between Creation Phase and Execution Phase?",
			commentCount: 1,
			reactionCount: 1,
			reactions: {
				create: [
					{ userId: students[0].id, reactionType: ReactionType.HELPFUL },
				],
			},
			comments: {
				create: [
					{
						userId: instructor1.id,
						body: "In the Creation Phase, memory is allocated for variables and functions (hoisting). In Execution Phase, values are assigned and code is run line by line.",
						replyCount: 0,
						reactionCount: 1,
						reactions: {
							create: [
								{ userId: students[1].id, reactionType: ReactionType.LIKE },
							],
						},
					},
				],
			},
		},
	});

	// ---------------------------------------------------------------------------
	// J. AUDIT LOGS
	// ---------------------------------------------------------------------------
	console.log("🛡️ Writing System Audit Logs...");

	await prisma.auditLog.createMany({
		data: [
			{
				actorId: admin.id,
				action: AuditAction.USER_LOGIN_SUCCESS,
				entityType: "User",
				entityId: admin.id,
				description: "Admin logged in from corporate dashboard.",
				ipAddress: "103.100.10.1",
				userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
			},
			{
				actorId: instructor1.id,
				action: AuditAction.COURSE_CREATED,
				entityType: "Course",
				entityId: courseJS.id,
				description: "Course created: JavaScript Fundamentals for Beginners",
				newValues: { title: courseJS.title, price: 1500 },
				ipAddress: "103.100.10.2",
			},
			{
				actorId: students[0].id,
				action: AuditAction.PAYMENT_COMPLETED,
				entityType: "Payment",
				entityId: payment1.id,
				description: "Payment successful via SSLCOMMERZ",
				ipAddress: "103.100.10.5",
			},
			{
				actorId: instructor1.id,
				action: AuditAction.ASSIGNMENT_GRADED,
				entityType: "AssignmentSubmission",
				description: "Graded student assignment submission with score 95",
				ipAddress: "103.100.10.2",
			},
			{
				actorId: admin.id,
				action: AuditAction.CERTIFICATE_ISSUED,
				entityType: "Certificate",
				description:
					"Certificate issued to student for completing JS Fundamentals",
				ipAddress: "103.100.10.1",
			},
		],
	});

	console.log(" Seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error(" Seeding failed with error:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

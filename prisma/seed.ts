// // prisma/seed.ts
// import {prisma} from "../src/app/lib/prisma";

// async function main() {
// 	console.log("🌱 Seeding started...");

// 	// Role - ২টি
// 	// await prisma.role.createMany({
// 		data: [{ name: "admin" }, { name: "student" }],
// 		skipDuplicates: true,
// 	});

// 	// Country - ১০টি
// 	await prisma.country.createMany({
// 		data: [
// 			{ name: "Bangladesh" },
// 			{ name: "India" },
// 			{ name: "United States" },
// 			{ name: "United Kingdom" },
// 			{ name: "Canada" },
// 			{ name: "Australia" },
// 			{ name: "Germany" },
// 			{ name: "France" },
// 			{ name: "Japan" },
// 			{ name: "Brazil" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// Division - ১০টি
// 	await prisma.division.createMany({
// 		data: [
// 			{ countryId: 1, name: "Dhaka" },
// 			{ countryId: 1, name: "Chittagong" },
// 			{ countryId: 1, name: "Rajshahi" },
// 			{ countryId: 1, name: "Khulna" },
// 			{ countryId: 1, name: "Rangpur" },
// 			{ countryId: 2, name: "Maharashtra" },
// 			{ countryId: 2, name: "Tamil Nadu" },
// 			{ countryId: 3, name: "California" },
// 			{ countryId: 3, name: "Texas" },
// 			{ countryId: 4, name: "England" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// District - ১০টি
// 	await prisma.district.createMany({
// 		data: [
// 			{ divisionId: 1, name: "Dhaka District" },
// 			{ divisionId: 1, name: "Gazipur" },
// 			{ divisionId: 1, name: "Narayanganj" },
// 			{ divisionId: 2, name: "Chittagong District" },
// 			{ divisionId: 2, name: "Cox's Bazar" },
// 			{ divisionId: 3, name: "Rajshahi District" },
// 			{ divisionId: 4, name: "Khulna District" },
// 			{ divisionId: 5, name: "Rangpur District" },
// 			{ divisionId: 6, name: "Mumbai" },
// 			{ divisionId: 7, name: "Chennai" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// City - ১০টি
// 	await prisma.city.createMany({
// 		data: [
// 			{ districtId: 1, name: "Dhaka City" },
// 			{ districtId: 1, name: "Mirpur" },
// 			{ districtId: 1, name: "Gulshan" },
// 			{ districtId: 2, name: "Gazipur City" },
// 			{ districtId: 3, name: "Narayanganj City" },
// 			{ districtId: 4, name: "Chittagong City" },
// 			{ districtId: 5, name: "Cox's Bazar Town" },
// 			{ districtId: 6, name: "Rajshahi City" },
// 			{ districtId: 7, name: "Khulna City" },
// 			{ districtId: 8, name: "Rangpur City" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// SocialPlatform - ১০টি
// 	await prisma.socialPlatform.createMany({
// 		data: [
// 			{ name: "Facebook" },
// 			{ name: "Twitter" },
// 			{ name: "LinkedIn" },
// 			{ name: "Instagram" },
// 			{ name: "YouTube" },
// 			{ name: "GitHub" },
// 			{ name: "Stack Overflow" },
// 			{ name: "Dev.to" },
// 			{ name: "Medium" },
// 			{ name: "Reddit" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// Skill - ১০টি
// 	await prisma.skill.createMany({
// 		data: [
// 			{ name: "JavaScript" },
// 			{ name: "Python" },
// 			{ name: "Java" },
// 			{ name: "C++" },
// 			{ name: "React" },
// 			{ name: "Node.js" },
// 			{ name: "TypeScript" },
// 			{ name: "SQL" },
// 			{ name: "Docker" },
// 			{ name: "AWS" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// CourseLevel - ৩টি
// 	await prisma.courseLevel.createMany({
// 		data: [
// 			{ name: "beginner" },
// 			{ name: "intermediate" },
// 			{ name: "advanced" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// Language - ১০টি
// 	await prisma.language.createMany({
// 		data: [
// 			{ code: "en", name: "English" },
// 			{ code: "bn", name: "Bangla" },
// 			{ code: "hi", name: "Hindi" },
// 			{ code: "es", name: "Spanish" },
// 			{ code: "fr", name: "French" },
// 			{ code: "de", name: "German" },
// 			{ code: "ja", name: "Japanese" },
// 			{ code: "zh", name: "Chinese" },
// 			{ code: "ar", name: "Arabic" },
// 			{ code: "pt", name: "Portuguese" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// LessonType - ৫টি
// 	await prisma.lessonType.createMany({
// 		data: [
// 			{ name: "video" },
// 			{ name: "article" },
// 			{ name: "quiz" },
// 			{ name: "coding" },
// 			{ name: "assignment" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// ReactionType - ১০টি
// 	await prisma.reactionType.createMany({
// 		data: [
// 			{ name: "like" },
// 			{ name: "love" },
// 			{ name: "care" },
// 			{ name: "funny" },
// 			{ name: "insightful" },
// 			{ name: "helpful" },
// 			{ name: "thankful" },
// 			{ name: "curious" },
// 			{ name: "celebrate" },
// 			{ name: "support" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// SubmissionStatus - ১০টি
// 	await prisma.submissionStatus.createMany({
// 		data: [
// 			{ name: "pending" },
// 			{ name: "accepted" },
// 			{ name: "rejected" },
// 			{ name: "processing" },
// 			{ name: "error" },
// 			{ name: "in_review" },
// 			{ name: "completed" },
// 			{ name: "failed" },
// 			{ name: "timeout" },
// 			{ name: "cancelled" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	// ProgrammingLanguage - ১০টি
// 	await prisma.programmingLanguage.createMany({
// 		data: [
// 			{ name: "JavaScript" },
// 			{ name: "Python" },
// 			{ name: "Java" },
// 			{ name: "C++" },
// 			{ name: "Go" },
// 			{ name: "Ruby" },
// 			{ name: "PHP" },
// 			{ name: "Swift" },
// 			{ name: "Kotlin" },
// 			{ name: "Rust" },
// 		],
// 		skipDuplicates: true,
// 	});

// 	console.log("✅ Lookup tables seeded");

// 	// Get all lookup data IDs
// 	const [
// 		allRoles,
// 		allCities,
// 		allSocialPlatforms,
// 		allSkills,
// 		allCourseLevels,
// 		allLanguages,
// 		allLessonTypes,
// 		allReactionTypes,
// 		allProgrammingLanguages,
// 		allSubmissionStatuses,
// 	] = await Promise.all([
// 		prisma.role.findMany(),
// 		prisma.city.findMany(),
// 		prisma.socialPlatform.findMany(),
// 		prisma.skill.findMany(),
// 		prisma.courseLevel.findMany(),
// 		prisma.language.findMany(),
// 		prisma.lessonType.findMany(),
// 		prisma.reactionType.findMany(),
// 		prisma.programmingLanguage.findMany(),
// 		prisma.submissionStatus.findMany(),
// 	]);

// 	// Create Users - ১০টি
// 	await prisma.user.createMany({
// 		data: [
// 			{
// 				roleId: allRoles[0].id,
// 				username: "admin1",
// 				email: "admin1@example.com",
// 				password: "hashed_pass_1",
// 				isPro: true,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student1",
// 				email: "student1@example.com",
// 				password: "hashed_pass_2",
// 				isPro: false,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student2",
// 				email: "student2@example.com",
// 				password: "hashed_pass_3",
// 				isPro: false,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student3",
// 				email: "student3@example.com",
// 				password: "hashed_pass_4",
// 				isPro: true,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student4",
// 				email: "student4@example.com",
// 				password: "hashed_pass_5",
// 				isPro: false,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student5",
// 				email: "student5@example.com",
// 				password: "hashed_pass_6",
// 				isPro: false,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student6",
// 				email: "student6@example.com",
// 				password: "hashed_pass_7",
// 				isPro: false,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student7",
// 				email: "student7@example.com",
// 				password: "hashed_pass_8",
// 				isPro: false,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student8",
// 				email: "student8@example.com",
// 				password: "hashed_pass_9",
// 				isPro: false,
// 			},
// 			{
// 				roleId: allRoles[1].id,
// 				username: "student9",
// 				email: "student9@example.com",
// 				password: "hashed_pass_10",
// 				isPro: false,
// 			},
// 		],
// 	});

// 	const createdUsers = await prisma.user.findMany();

// 	// Create UserDescriptions - ১০টি
// 	await prisma.userDescription.createMany({
// 		data: [
// 			{
// 				userId: createdUsers[0].id,
// 				fullName: "Admin One",
// 				displayName: "Admin1",
// 				bio: "System administrator",
// 				avatarUrl: "https://avatar.com/admin1",
// 				cityId: allCities[0]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				fullName: "Student One",
// 				displayName: "Stu1",
// 				bio: "Learning web development",
// 				avatarUrl: "https://avatar.com/student1",
// 				cityId: allCities[1]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				fullName: "Student Two",
// 				displayName: "Stu2",
// 				bio: "Python enthusiast",
// 				avatarUrl: "https://avatar.com/student2",
// 				cityId: allCities[2]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[3].id,
// 				fullName: "Student Three",
// 				displayName: "Stu3",
// 				bio: "Full-stack developer",
// 				avatarUrl: "https://avatar.com/student3",
// 				cityId: allCities[3]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[4].id,
// 				fullName: "Student Four",
// 				displayName: "Stu4",
// 				bio: "Data science learner",
// 				avatarUrl: "https://avatar.com/student4",
// 				cityId: allCities[4]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[5].id,
// 				fullName: "Student Five",
// 				displayName: "Stu5",
// 				bio: "Mobile app developer",
// 				avatarUrl: "https://avatar.com/student5",
// 				cityId: allCities[5]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[6].id,
// 				fullName: "Student Six",
// 				displayName: "Stu6",
// 				bio: "Backend developer",
// 				avatarUrl: "https://avatar.com/student6",
// 				cityId: allCities[6]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[7].id,
// 				fullName: "Student Seven",
// 				displayName: "Stu7",
// 				bio: "DevOps engineer",
// 				avatarUrl: "https://avatar.com/student7",
// 				cityId: allCities[7]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[8].id,
// 				fullName: "Student Eight",
// 				displayName: "Stu8",
// 				bio: "AI researcher",
// 				avatarUrl: "https://avatar.com/student8",
// 				cityId: allCities[8]?.id || null,
// 			},
// 			{
// 				userId: createdUsers[9].id,
// 				fullName: "Student Nine",
// 				displayName: "Stu9",
// 				bio: "Game developer",
// 				avatarUrl: "https://avatar.com/student9",
// 				cityId: allCities[9]?.id || null,
// 			},
// 		],
// 	});

// 	const createdDescriptions = await prisma.userDescription.findMany();

// 	// Create UserSocials - ১০টি
// 	await prisma.userSocial.createMany({
// 		data: [
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				platformId: allSocialPlatforms[0].id,
// 				url: "https://fb.com/admin1",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				platformId: allSocialPlatforms[1].id,
// 				url: "https://twitter.com/admin1",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				platformId: allSocialPlatforms[0].id,
// 				url: "https://fb.com/student1",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				platformId: allSocialPlatforms[2].id,
// 				url: "https://linkedin.com/student1",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[2].id,
// 				platformId: allSocialPlatforms[3].id,
// 				url: "https://instagram.com/student2",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[2].id,
// 				platformId: allSocialPlatforms[4].id,
// 				url: "https://youtube.com/student2",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[3].id,
// 				platformId: allSocialPlatforms[0].id,
// 				url: "https://fb.com/student3",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[4].id,
// 				platformId: allSocialPlatforms[2].id,
// 				url: "https://linkedin.com/student4",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[5].id,
// 				platformId: allSocialPlatforms[3].id,
// 				url: "https://instagram.com/student5",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[6].id,
// 				platformId: allSocialPlatforms[0].id,
// 				url: "https://fb.com/student6",
// 			},
// 		],
// 	});

// 	// Create UserEducations - ১০টি
// 	await prisma.userEducation.createMany({
// 		data: [
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				institution: "MIT",
// 				degree: "PhD",
// 				fieldOfStudy: "Computer Science",
// 				startDate: new Date("2018-01-01"),
// 				endDate: new Date("2023-12-31"),
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				institution: "Dhaka University",
// 				degree: "BSc",
// 				fieldOfStudy: "CSE",
// 				startDate: new Date("2020-01-01"),
// 				endDate: new Date("2024-12-31"),
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				institution: "Harvard",
// 				degree: "MSc",
// 				fieldOfStudy: "Data Science",
// 				startDate: new Date("2022-01-01"),
// 				endDate: null,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[2].id,
// 				institution: "Oxford",
// 				degree: "BSc",
// 				fieldOfStudy: "Mathematics",
// 				startDate: new Date("2021-01-01"),
// 				endDate: new Date("2025-12-31"),
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[3].id,
// 				institution: "Stanford",
// 				degree: "BSc",
// 				fieldOfStudy: "Engineering",
// 				startDate: new Date("2019-01-01"),
// 				endDate: null,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[4].id,
// 				institution: "Cambridge",
// 				degree: "MSc",
// 				fieldOfStudy: "AI",
// 				startDate: new Date("2020-01-01"),
// 				endDate: new Date("2024-12-31"),
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[5].id,
// 				institution: "MIT",
// 				degree: "BSc",
// 				fieldOfStudy: "CS",
// 				startDate: new Date("2018-01-01"),
// 				endDate: new Date("2022-12-31"),
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[6].id,
// 				institution: "Harvard",
// 				degree: "PhD",
// 				fieldOfStudy: "Computer Science",
// 				startDate: new Date("2015-01-01"),
// 				endDate: new Date("2020-12-31"),
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[7].id,
// 				institution: "Oxford",
// 				degree: "MSc",
// 				fieldOfStudy: "Data Science",
// 				startDate: new Date("2019-01-01"),
// 				endDate: new Date("2021-12-31"),
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[8].id,
// 				institution: "Dhaka University",
// 				degree: "BSc",
// 				fieldOfStudy: "CSE",
// 				startDate: new Date("2017-01-01"),
// 				endDate: new Date("2021-12-31"),
// 			},
// 		],
// 	});

// 	// Create UserExperiences - ১০টি
// 	await prisma.userExperience.createMany({
// 		data: [
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				company: "Google",
// 				position: "Senior Developer",
// 				startDate: new Date("2023-01-01"),
// 				endDate: null,
// 				description: "Working on cloud infrastructure",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				company: "Microsoft",
// 				position: "Junior Developer",
// 				startDate: new Date("2023-01-01"),
// 				endDate: new Date("2024-12-31"),
// 				description: "Worked on web apps",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[2].id,
// 				company: "Amazon",
// 				position: "Intern",
// 				startDate: new Date("2024-01-01"),
// 				endDate: new Date("2024-06-30"),
// 				description: "Internship program",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[3].id,
// 				company: "Facebook",
// 				position: "Developer",
// 				startDate: new Date("2022-01-01"),
// 				endDate: new Date("2023-12-31"),
// 				description: "Frontend development",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[4].id,
// 				company: "Apple",
// 				position: "Data Scientist",
// 				startDate: new Date("2023-01-01"),
// 				endDate: null,
// 				description: "Data analysis",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[5].id,
// 				company: "Google",
// 				position: "Mobile Developer",
// 				startDate: new Date("2022-01-01"),
// 				endDate: new Date("2024-12-31"),
// 				description: "Android development",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[6].id,
// 				company: "Amazon",
// 				position: "Senior Instructor",
// 				startDate: new Date("2020-01-01"),
// 				endDate: null,
// 				description: "Teaching programming courses",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[7].id,
// 				company: "Microsoft",
// 				position: "Data Analyst",
// 				startDate: new Date("2021-01-01"),
// 				endDate: new Date("2023-12-31"),
// 				description: "Data visualization",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[8].id,
// 				company: "GitHub",
// 				position: "Community Manager",
// 				startDate: new Date("2020-01-01"),
// 				endDate: null,
// 				description: "Managing developer community",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[9].id,
// 				company: "Neon",
// 				position: "Guest User",
// 				startDate: new Date("2024-01-01"),
// 				endDate: null,
// 				description: "Testing platform",
// 			},
// 		],
// 	});

// 	// Create UserWebsites - ১০টি
// 	await prisma.userWebsite.createMany({
// 		data: [
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				title: "Personal Blog",
// 				url: "https://admin1.com",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				title: "GitHub",
// 				url: "https://github.com/admin1",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				title: "Portfolio",
// 				url: "https://student1.com",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				title: "Blog",
// 				url: "https://blog.student1.com",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[2].id,
// 				title: "GitHub",
// 				url: "https://github.com/student2",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[3].id,
// 				title: "Portfolio",
// 				url: "https://student3.dev",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[4].id,
// 				title: "Data Blog",
// 				url: "https://datablog.student4.com",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[5].id,
// 				title: "Dev Blog",
// 				url: "https://dev.student5.com",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[6].id,
// 				title: "Instructor Site",
// 				url: "https://instructor1.io",
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[7].id,
// 				title: "Course Site",
// 				url: "https://instructor2.io",
// 			},
// 		],
// 	});

// 	// Create UserSkills - ১০টি
// 	await prisma.userSkill.createMany({
// 		data: [
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				skillId: allSkills[0].id,
// 				proficiencyLevel: 5,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[0].id,
// 				skillId: allSkills[1].id,
// 				proficiencyLevel: 4,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				skillId: allSkills[0].id,
// 				proficiencyLevel: 4,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[1].id,
// 				skillId: allSkills[4].id,
// 				proficiencyLevel: 5,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[2].id,
// 				skillId: allSkills[1].id,
// 				proficiencyLevel: 5,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[2].id,
// 				skillId: allSkills[2].id,
// 				proficiencyLevel: 3,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[3].id,
// 				skillId: allSkills[0].id,
// 				proficiencyLevel: 5,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[3].id,
// 				skillId: allSkills[5].id,
// 				proficiencyLevel: 4,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[4].id,
// 				skillId: allSkills[1].id,
// 				proficiencyLevel: 4,
// 			},
// 			{
// 				userDescriptionId: createdDescriptions[4].id,
// 				skillId: allSkills[7].id,
// 				proficiencyLevel: 5,
// 			},
// 		],
// 	});

// 	console.log("✅ Users and profiles seeded");

// 	// Create Courses - ১০টি
// 	await prisma.course.createMany({
// 		data: [
// 			{
// 				title: "Web Development 101",
// 				slug: "web-dev-101",
// 				enrollmentCount: 15,
// 			},
// 			{
// 				title: "Python for Beginners",
// 				slug: "python-beginners",
// 				enrollmentCount: 20,
// 			},
// 			{ title: "JavaScript Mastery", slug: "js-mastery", enrollmentCount: 25 },
// 			{
// 				title: "Data Science Basics",
// 				slug: "data-science-basics",
// 				enrollmentCount: 12,
// 			},
// 			{ title: "React Advanced", slug: "react-advanced", enrollmentCount: 18 },
// 			{
// 				title: "Node.js API Development",
// 				slug: "nodejs-api-dev",
// 				enrollmentCount: 10,
// 			},
// 			{
// 				title: "TypeScript Fundamentals",
// 				slug: "typescript-fundamentals",
// 				enrollmentCount: 22,
// 			},
// 			{
// 				title: "Docker & Kubernetes",
// 				slug: "docker-kubernetes",
// 				enrollmentCount: 8,
// 			},
// 			{ title: "Machine Learning 101", slug: "ml-101", enrollmentCount: 14 },
// 			{
// 				title: "Cloud Computing with AWS",
// 				slug: "aws-cloud",
// 				enrollmentCount: 16,
// 			},
// 		],
// 	});

// 	const createdCourses = await prisma.course.findMany();

// 	// Create CourseDescriptions - ১০টি
// 	await prisma.courseDescription.createMany({
// 		data: [
// 			{
// 				courseId: createdCourses[0].id,
// 				shortDescription: "Learn web development from scratch",
// 				fullDescription:
// 					"Complete web development course covering HTML, CSS, and JavaScript",
// 				levelId: allCourseLevels[0].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/webdev",
// 			},
// 			{
// 				courseId: createdCourses[1].id,
// 				shortDescription: "Python programming for absolute beginners",
// 				fullDescription:
// 					"Learn Python from zero to hero with hands-on projects",
// 				levelId: allCourseLevels[0].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/python",
// 			},
// 			{
// 				courseId: createdCourses[2].id,
// 				shortDescription: "Become a JavaScript expert",
// 				fullDescription:
// 					"Deep dive into JavaScript, ES6+, and advanced concepts",
// 				levelId: allCourseLevels[2].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/js",
// 			},
// 			{
// 				courseId: createdCourses[3].id,
// 				shortDescription: "Introduction to data science",
// 				fullDescription:
// 					"Learn data science fundamentals with Python and statistics",
// 				levelId: allCourseLevels[1].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/datascience",
// 			},
// 			{
// 				courseId: createdCourses[4].id,
// 				shortDescription: "Master React and its ecosystem",
// 				fullDescription: "Advanced React concepts, hooks, and state management",
// 				levelId: allCourseLevels[2].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/react",
// 			},
// 			{
// 				courseId: createdCourses[5].id,
// 				shortDescription: "Build REST APIs with Node.js",
// 				fullDescription:
// 					"Create production-ready REST APIs using Node.js and Express",
// 				levelId: allCourseLevels[1].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/node",
// 			},
// 			{
// 				courseId: createdCourses[6].id,
// 				shortDescription: "TypeScript for better JavaScript",
// 				fullDescription:
// 					"Learn TypeScript to build scalable JavaScript applications",
// 				levelId: allCourseLevels[1].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/typescript",
// 			},
// 			{
// 				courseId: createdCourses[7].id,
// 				shortDescription: "Containerization and orchestration",
// 				fullDescription: "Learn Docker and Kubernetes for modern DevOps",
// 				levelId: allCourseLevels[2].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/docker",
// 			},
// 			{
// 				courseId: createdCourses[8].id,
// 				shortDescription: "Introduction to machine learning",
// 				fullDescription: "Basic machine learning concepts with Python",
// 				levelId: allCourseLevels[2].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/ml",
// 			},
// 			{
// 				courseId: createdCourses[9].id,
// 				shortDescription: "Cloud computing with AWS",
// 				fullDescription: "Learn AWS cloud computing services and architecture",
// 				levelId: allCourseLevels[2].id,
// 				languageId: allLanguages[0].id,
// 				coverImageUrl: "https://cover.com/aws",
// 			},
// 		],
// 	});

// 	const courseDescriptions = await prisma.courseDescription.findMany();

// 	// Create CourseLearningOutcomes - ১০টি
// 	await prisma.courseLearningOutcome.createMany({
// 		data: [
// 			{
// 				courseDescriptionId: courseDescriptions[0].id,
// 				outcomeText: "Build responsive websites",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[0].id,
// 				outcomeText: "Understand JavaScript basics",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[1].id,
// 				outcomeText: "Write Python scripts",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[1].id,
// 				outcomeText: "Work with Python libraries",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[2].id,
// 				outcomeText: "Master closures and promises",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[2].id,
// 				outcomeText: "Work with ES6+ features",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[3].id,
// 				outcomeText: "Work with Pandas and NumPy",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[3].id,
// 				outcomeText: "Create data visualizations",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[4].id,
// 				outcomeText: "Build complex React components",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[4].id,
// 				outcomeText: "Manage state effectively",
// 				displayOrder: 2,
// 			},
// 		],
// 	});

// 	// Create CoursePrerequisites - ১০টি
// 	await prisma.coursePrerequisite.createMany({
// 		data: [
// 			{
// 				courseDescriptionId: courseDescriptions[0].id,
// 				prerequisiteText: "Basic computer knowledge",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[0].id,
// 				prerequisiteText: "No coding experience needed",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[1].id,
// 				prerequisiteText: "Basic math skills",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[2].id,
// 				prerequisiteText: "Know JavaScript basics",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[3].id,
// 				prerequisiteText: "Python basics required",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[4].id,
// 				prerequisiteText: "React basics needed",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[4].id,
// 				prerequisiteText: "JavaScript fundamentals",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[5].id,
// 				prerequisiteText: "JavaScript basics",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[6].id,
// 				prerequisiteText: "JavaScript knowledge",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseDescriptionId: courseDescriptions[7].id,
// 				prerequisiteText: "Basic Linux knowledge",
// 				displayOrder: 1,
// 			},
// 		],
// 	});

// 	// Create SuperModules - ১০টি
// 	await prisma.superModule.createMany({
// 		data: [
// 			{
// 				courseId: createdCourses[0].id,
// 				title: "Getting Started",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseId: createdCourses[0].id,
// 				title: "HTML & CSS Basics",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseId: createdCourses[0].id,
// 				title: "JavaScript Fundamentals",
// 				displayOrder: 3,
// 			},
// 			{
// 				courseId: createdCourses[1].id,
// 				title: "Python Basics",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseId: createdCourses[1].id,
// 				title: "Python Advanced",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseId: createdCourses[2].id,
// 				title: "JS Fundamentals",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseId: createdCourses[2].id,
// 				title: "ES6+ Features",
// 				displayOrder: 2,
// 			},
// 			{
// 				courseId: createdCourses[3].id,
// 				title: "Data Science Introduction",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseId: createdCourses[4].id,
// 				title: "React Basics",
// 				displayOrder: 1,
// 			},
// 			{
// 				courseId: createdCourses[4].id,
// 				title: "Advanced React",
// 				displayOrder: 2,
// 			},
// 		],
// 	});

// 	const createdSuperModules = await prisma.superModule.findMany();

// 	// Create Modules - ১০টি
// 	await prisma.module.createMany({
// 		data: [
// 			{
// 				superModuleId: createdSuperModules[0].id,
// 				title: "Course Introduction",
// 				displayOrder: 1,
// 			},
// 			{
// 				superModuleId: createdSuperModules[0].id,
// 				title: "Environment Setup",
// 				displayOrder: 2,
// 			},
// 			{
// 				superModuleId: createdSuperModules[1].id,
// 				title: "HTML Basics",
// 				displayOrder: 1,
// 			},
// 			{
// 				superModuleId: createdSuperModules[1].id,
// 				title: "CSS Basics",
// 				displayOrder: 2,
// 			},
// 			{
// 				superModuleId: createdSuperModules[2].id,
// 				title: "JS Basics",
// 				displayOrder: 1,
// 			},
// 			{
// 				superModuleId: createdSuperModules[2].id,
// 				title: "JS Advanced",
// 				displayOrder: 2,
// 			},
// 			{
// 				superModuleId: createdSuperModules[3].id,
// 				title: "Python Introduction",
// 				displayOrder: 1,
// 			},
// 			{
// 				superModuleId: createdSuperModules[3].id,
// 				title: "Python Data Types",
// 				displayOrder: 2,
// 			},
// 			{
// 				superModuleId: createdSuperModules[4].id,
// 				title: "Python OOP",
// 				displayOrder: 1,
// 			},
// 			{
// 				superModuleId: createdSuperModules[4].id,
// 				title: "Python Libraries",
// 				displayOrder: 2,
// 			},
// 		],
// 	});

// 	const createdModules = await prisma.module.findMany();

// 	// Create Lessons - ১০টি
// 	await prisma.lesson.createMany({
// 		data: [
// 			{
// 				moduleId: createdModules[0].id,
// 				title: "Welcome to Web Dev",
// 				lessonTypeId: allLessonTypes[1].id,
// 				displayOrder: 1,
// 				isPro: false,
// 			},
// 			{
// 				moduleId: createdModules[0].id,
// 				title: "Installing VS Code",
// 				lessonTypeId: allLessonTypes[0].id,
// 				displayOrder: 2,
// 				isPro: false,
// 			},
// 			{
// 				moduleId: createdModules[1].id,
// 				title: "HTML Structure",
// 				lessonTypeId: allLessonTypes[1].id,
// 				displayOrder: 1,
// 				isPro: false,
// 			},
// 			{
// 				moduleId: createdModules[1].id,
// 				title: "CSS Styling",
// 				lessonTypeId: allLessonTypes[0].id,
// 				displayOrder: 2,
// 				isPro: false,
// 			},
// 			{
// 				moduleId: createdModules[2].id,
// 				title: "JavaScript Basics",
// 				lessonTypeId: allLessonTypes[1].id,
// 				displayOrder: 1,
// 				isPro: false,
// 			},
// 			{
// 				moduleId: createdModules[2].id,
// 				title: "JavaScript Functions",
// 				lessonTypeId: allLessonTypes[0].id,
// 				displayOrder: 2,
// 				isPro: true,
// 			},
// 			{
// 				moduleId: createdModules[3].id,
// 				title: "Python Introduction",
// 				lessonTypeId: allLessonTypes[1].id,
// 				displayOrder: 1,
// 				isPro: false,
// 			},
// 			{
// 				moduleId: createdModules[3].id,
// 				title: "Python Variables",
// 				lessonTypeId: allLessonTypes[0].id,
// 				displayOrder: 2,
// 				isPro: false,
// 			},
// 			{
// 				moduleId: createdModules[4].id,
// 				title: "Python OOP Basics",
// 				lessonTypeId: allLessonTypes[2].id,
// 				displayOrder: 1,
// 				isPro: true,
// 			},
// 			{
// 				moduleId: createdModules[4].id,
// 				title: "Python Libraries",
// 				lessonTypeId: allLessonTypes[3].id,
// 				displayOrder: 2,
// 				isPro: false,
// 			},
// 		],
// 	});

// 	const createdLessons = await prisma.lesson.findMany();

// 	// VideoLesson - ৫টি
// 	await prisma.videoLesson.createMany({
// 		data: [
// 			{
// 				lessonId: createdLessons[0].id,
// 				videoUrl: "https://video.com/1",
// 				durationSeconds: 300,
// 			},
// 			{
// 				lessonId: createdLessons[1].id,
// 				videoUrl: "https://video.com/2",
// 				durationSeconds: 450,
// 			},
// 			{
// 				lessonId: createdLessons[2].id,
// 				videoUrl: "https://video.com/3",
// 				durationSeconds: 600,
// 			},
// 			{
// 				lessonId: createdLessons[3].id,
// 				videoUrl: "https://video.com/4",
// 				durationSeconds: 750,
// 			},
// 			{
// 				lessonId: createdLessons[4].id,
// 				videoUrl: "https://video.com/5",
// 				durationSeconds: 900,
// 			},
// 		],
// 	});

// 	// ArticleLesson - ৫টি
// 	await prisma.articleLesson.createMany({
// 		data: [
// 			{ lessonId: createdLessons[0].id },
// 			{ lessonId: createdLessons[2].id },
// 			{ lessonId: createdLessons[4].id },
// 			{ lessonId: createdLessons[6].id },
// 			{ lessonId: createdLessons[8].id },
// 		],
// 	});

// 	const articleLessons = await prisma.articleLesson.findMany();

// 	// ArticleSection - ১০টি
// 	await prisma.articleSection.createMany({
// 		data: [
// 			{
// 				articleLessonId: articleLessons[0].id,
// 				content: "Welcome section of the course",
// 				displayOrder: 1,
// 			},
// 			{
// 				articleLessonId: articleLessons[0].id,
// 				content: "Introduction to web development",
// 				displayOrder: 2,
// 			},
// 			{
// 				articleLessonId: articleLessons[1].id,
// 				content: "HTML structure and tags",
// 				displayOrder: 1,
// 			},
// 			{
// 				articleLessonId: articleLessons[1].id,
// 				content: "Semantic HTML",
// 				displayOrder: 2,
// 			},
// 			{
// 				articleLessonId: articleLessons[2].id,
// 				content: "JavaScript basics and syntax",
// 				displayOrder: 1,
// 			},
// 			{
// 				articleLessonId: articleLessons[2].id,
// 				content: "Variables and data types",
// 				displayOrder: 2,
// 			},
// 			{
// 				articleLessonId: articleLessons[3].id,
// 				content: "Python installation",
// 				displayOrder: 1,
// 			},
// 			{
// 				articleLessonId: articleLessons[3].id,
// 				content: "Python syntax basics",
// 				displayOrder: 2,
// 			},
// 			{
// 				articleLessonId: articleLessons[4].id,
// 				content: "OOP concepts in Python",
// 				displayOrder: 1,
// 			},
// 			{
// 				articleLessonId: articleLessons[4].id,
// 				content: "Classes and objects",
// 				displayOrder: 2,
// 			},
// 		],
// 	});

// 	// QuizLesson - ৫টি
// 	await prisma.quizLesson.createMany({
// 		data: [
// 			{ lessonId: createdLessons[1].id },
// 			{ lessonId: createdLessons[3].id },
// 			{ lessonId: createdLessons[5].id },
// 			{ lessonId: createdLessons[7].id },
// 			{ lessonId: createdLessons[9].id },
// 		],
// 	});

// 	const quizLessons = await prisma.quizLesson.findMany();

// 	// CodingLesson - ৫টি
// 	await prisma.codingLesson.createMany({
// 		data: [
// 			{
// 				lessonId: createdLessons[0].id,
// 				problemStatement: "Write a function to add two numbers",
// 				inputFormat: "Two integers",
// 				outputFormat: "Sum of integers",
// 				timeLimitMs: 1000,
// 				memoryLimitKb: 256,
// 			},
// 			{
// 				lessonId: createdLessons[2].id,
// 				problemStatement: "Find the max element in array",
// 				inputFormat: "Array of integers",
// 				outputFormat: "Maximum integer",
// 				timeLimitMs: 2000,
// 				memoryLimitKb: 512,
// 			},
// 			{
// 				lessonId: createdLessons[4].id,
// 				problemStatement: "Reverse a string",
// 				inputFormat: "String",
// 				outputFormat: "Reversed string",
// 				timeLimitMs: 1500,
// 				memoryLimitKb: 256,
// 			},
// 			{
// 				lessonId: createdLessons[6].id,
// 				problemStatement: "Check palindrome",
// 				inputFormat: "Number",
// 				outputFormat: "Boolean",
// 				timeLimitMs: 1000,
// 				memoryLimitKb: 128,
// 			},
// 			{
// 				lessonId: createdLessons[8].id,
// 				problemStatement: "Fibonacci series",
// 				inputFormat: "Number",
// 				outputFormat: "Fibonacci sequence",
// 				timeLimitMs: 3000,
// 				memoryLimitKb: 1024,
// 			},
// 		],
// 	});

// 	const codingLessons = await prisma.codingLesson.findMany();

// 	console.log("✅ Course catalog seeded");

// 	// QuizQuestions - ১০টি
// 	await prisma.quizQuestion.createMany({
// 		data: [
// 			{
// 				quizLessonId: quizLessons[0].id,
// 				questionText: "What is 2+2?",
// 				displayOrder: 1,
// 			},
// 			{
// 				quizLessonId: quizLessons[0].id,
// 				questionText: "What is the capital of Bangladesh?",
// 				displayOrder: 2,
// 			},
// 			{
// 				quizLessonId: quizLessons[1].id,
// 				questionText: "What is HTML?",
// 				displayOrder: 1,
// 			},
// 			{
// 				quizLessonId: quizLessons[1].id,
// 				questionText: "What is CSS used for?",
// 				displayOrder: 2,
// 			},
// 			{
// 				quizLessonId: quizLessons[2].id,
// 				questionText: "What is JavaScript?",
// 				displayOrder: 1,
// 			},
// 			{
// 				quizLessonId: quizLessons[2].id,
// 				questionText: "What is a function in JS?",
// 				displayOrder: 2,
// 			},
// 			{
// 				quizLessonId: quizLessons[3].id,
// 				questionText: "What is Python?",
// 				displayOrder: 1,
// 			},
// 			{
// 				quizLessonId: quizLessons[3].id,
// 				questionText: "What is a variable?",
// 				displayOrder: 2,
// 			},
// 			{
// 				quizLessonId: quizLessons[4].id,
// 				questionText: "What is OOP?",
// 				displayOrder: 1,
// 			},
// 			{
// 				quizLessonId: quizLessons[4].id,
// 				questionText: "What is a class?",
// 				displayOrder: 2,
// 			},
// 		],
// 	});

// 	const createdQuizQuestions = await prisma.quizQuestion.findMany();

// 	// QuizOptions - ১০টি
// 	await prisma.quizOption.createMany({
// 		data: [
// 			{
// 				questionId: createdQuizQuestions[0].id,
// 				optionText: "3",
// 				isCorrect: false,
// 				displayOrder: 1,
// 			},
// 			{
// 				questionId: createdQuizQuestions[0].id,
// 				optionText: "4",
// 				isCorrect: true,
// 				displayOrder: 2,
// 			},
// 			{
// 				questionId: createdQuizQuestions[0].id,
// 				optionText: "5",
// 				isCorrect: false,
// 				displayOrder: 3,
// 			},
// 			{
// 				questionId: createdQuizQuestions[1].id,
// 				optionText: "Dhaka",
// 				isCorrect: true,
// 				displayOrder: 1,
// 			},
// 			{
// 				questionId: createdQuizQuestions[1].id,
// 				optionText: "Chittagong",
// 				isCorrect: false,
// 				displayOrder: 2,
// 			},
// 			{
// 				questionId: createdQuizQuestions[1].id,
// 				optionText: "Rajshahi",
// 				isCorrect: false,
// 				displayOrder: 3,
// 			},
// 			{
// 				questionId: createdQuizQuestions[2].id,
// 				optionText: "Markup language",
// 				isCorrect: true,
// 				displayOrder: 1,
// 			},
// 			{
// 				questionId: createdQuizQuestions[2].id,
// 				optionText: "Programming language",
// 				isCorrect: false,
// 				displayOrder: 2,
// 			},
// 			{
// 				questionId: createdQuizQuestions[3].id,
// 				optionText: "Styling",
// 				isCorrect: true,
// 				displayOrder: 1,
// 			},
// 			{
// 				questionId: createdQuizQuestions[3].id,
// 				optionText: "Programming",
// 				isCorrect: false,
// 				displayOrder: 2,
// 			},
// 		],
// 	});

// 	console.log("✅ Quiz system seeded");

// 	// Enrollments - ১০টি
// 	await prisma.enrollment.createMany({
// 		data: [
// 			{ userId: createdUsers[0].id, courseId: createdCourses[0].id },
// 			{ userId: createdUsers[0].id, courseId: createdCourses[1].id },
// 			{ userId: createdUsers[1].id, courseId: createdCourses[0].id },
// 			{ userId: createdUsers[1].id, courseId: createdCourses[2].id },
// 			{ userId: createdUsers[2].id, courseId: createdCourses[1].id },
// 			{ userId: createdUsers[2].id, courseId: createdCourses[3].id },
// 			{ userId: createdUsers[3].id, courseId: createdCourses[0].id },
// 			{ userId: createdUsers[4].id, courseId: createdCourses[4].id },
// 			{ userId: createdUsers[5].id, courseId: createdCourses[2].id },
// 			{ userId: createdUsers[6].id, courseId: createdCourses[3].id },
// 		],
// 	});

// 	// LessonProgress - ১০টি
// 	await prisma.lessonProgress.createMany({
// 		data: [
// 			{
// 				userId: createdUsers[0].id,
// 				lessonId: createdLessons[0].id,
// 				isCompleted: true,
// 				completedAt: new Date("2026-01-01 10:30:00"),
// 			},
// 			{
// 				userId: createdUsers[0].id,
// 				lessonId: createdLessons[1].id,
// 				isCompleted: false,
// 				completedAt: null,
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				lessonId: createdLessons[0].id,
// 				isCompleted: true,
// 				completedAt: new Date("2026-01-02 11:30:00"),
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				lessonId: createdLessons[2].id,
// 				isCompleted: true,
// 				completedAt: new Date("2026-01-03 12:30:00"),
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				lessonId: createdLessons[3].id,
// 				isCompleted: false,
// 				completedAt: null,
// 			},
// 			{
// 				userId: createdUsers[3].id,
// 				lessonId: createdLessons[0].id,
// 				isCompleted: true,
// 				completedAt: new Date("2026-01-04 13:30:00"),
// 			},
// 			{
// 				userId: createdUsers[4].id,
// 				lessonId: createdLessons[4].id,
// 				isCompleted: true,
// 				completedAt: new Date("2026-01-05 14:30:00"),
// 			},
// 			{
// 				userId: createdUsers[5].id,
// 				lessonId: createdLessons[2].id,
// 				isCompleted: false,
// 				completedAt: null,
// 			},
// 			{
// 				userId: createdUsers[6].id,
// 				lessonId: createdLessons[1].id,
// 				isCompleted: true,
// 				completedAt: new Date("2026-01-06 15:30:00"),
// 			},
// 			{
// 				userId: createdUsers[7].id,
// 				lessonId: createdLessons[3].id,
// 				isCompleted: false,
// 				completedAt: null,
// 			},
// 		],
// 	});

// 	console.log("✅ Enrollments and progress seeded");

// 	// CodingTestCases - ১০টি
// 	await prisma.codingTestCase.createMany({
// 		data: [
// 			{
// 				codingLessonId: codingLessons[0].id,
// 				inputData: "2 3",
// 				expectedOutput: "5",
// 				isHidden: false,
// 				displayOrder: 1,
// 			},
// 			{
// 				codingLessonId: codingLessons[0].id,
// 				inputData: "5 7",
// 				expectedOutput: "12",
// 				isHidden: false,
// 				displayOrder: 2,
// 			},
// 			{
// 				codingLessonId: codingLessons[1].id,
// 				inputData: "1 2 3 4",
// 				expectedOutput: "4",
// 				isHidden: false,
// 				displayOrder: 1,
// 			},
// 			{
// 				codingLessonId: codingLessons[1].id,
// 				inputData: "10 20 30",
// 				expectedOutput: "30",
// 				isHidden: true,
// 				displayOrder: 2,
// 			},
// 			{
// 				codingLessonId: codingLessons[2].id,
// 				inputData: "hello",
// 				expectedOutput: "olleh",
// 				isHidden: false,
// 				displayOrder: 1,
// 			},
// 			{
// 				codingLessonId: codingLessons[2].id,
// 				inputData: "world",
// 				expectedOutput: "dlrow",
// 				isHidden: false,
// 				displayOrder: 2,
// 			},
// 			{
// 				codingLessonId: codingLessons[3].id,
// 				inputData: "121",
// 				expectedOutput: "true",
// 				isHidden: false,
// 				displayOrder: 1,
// 			},
// 			{
// 				codingLessonId: codingLessons[3].id,
// 				inputData: "123",
// 				expectedOutput: "false",
// 				isHidden: true,
// 				displayOrder: 2,
// 			},
// 			{
// 				codingLessonId: codingLessons[4].id,
// 				inputData: "5",
// 				expectedOutput: "0 1 1 2 3",
// 				isHidden: false,
// 				displayOrder: 1,
// 			},
// 			{
// 				codingLessonId: codingLessons[4].id,
// 				inputData: "8",
// 				expectedOutput: "0 1 1 2 3 5 8 13",
// 				isHidden: false,
// 				displayOrder: 2,
// 			},
// 		],
// 	});

// 	// CodingAnswers - ১০টি
// 	await prisma.codingAnswer.createMany({
// 		data: [
// 			{
// 				userId: createdUsers[0].id,
// 				codingLessonId: codingLessons[0].id,
// 				languageId: allProgrammingLanguages[0].id,
// 				submittedCode: "console.log(2+3)",
// 				statusId: allSubmissionStatuses[1].id,
// 				runtimeMs: 100,
// 				memoryUsedKb: 256,
// 				passedTestCasesCount: 2,
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				codingLessonId: codingLessons[0].id,
// 				languageId: allProgrammingLanguages[0].id,
// 				submittedCode: "console.log(5+7)",
// 				statusId: allSubmissionStatuses[1].id,
// 				runtimeMs: 120,
// 				memoryUsedKb: 300,
// 				passedTestCasesCount: 2,
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				codingLessonId: codingLessons[1].id,
// 				languageId: allProgrammingLanguages[0].id,
// 				submittedCode: "Math.max(...array)",
// 				statusId: allSubmissionStatuses[1].id,
// 				runtimeMs: 150,
// 				memoryUsedKb: 400,
// 				passedTestCasesCount: 1,
// 			},
// 			{
// 				userId: createdUsers[3].id,
// 				codingLessonId: codingLessons[2].id,
// 				languageId: allProgrammingLanguages[1].id,
// 				submittedCode: "print(s[::-1])",
// 				statusId: allSubmissionStatuses[1].id,
// 				runtimeMs: 80,
// 				memoryUsedKb: 200,
// 				passedTestCasesCount: 1,
// 			},
// 			{
// 				userId: createdUsers[4].id,
// 				codingLessonId: codingLessons[3].id,
// 				languageId: allProgrammingLanguages[2].id,
// 				submittedCode: "System.out.println(palindrome)",
// 				statusId: allSubmissionStatuses[1].id,
// 				runtimeMs: 200,
// 				memoryUsedKb: 500,
// 				passedTestCasesCount: 1,
// 			},
// 			{
// 				userId: createdUsers[5].id,
// 				codingLessonId: codingLessons[4].id,
// 				languageId: allProgrammingLanguages[1].id,
// 				submittedCode: "def fib(n): ...",
// 				statusId: allSubmissionStatuses[0].id,
// 				runtimeMs: null,
// 				memoryUsedKb: null,
// 				passedTestCasesCount: 0,
// 			},
// 			{
// 				userId: createdUsers[6].id,
// 				codingLessonId: codingLessons[0].id,
// 				languageId: allProgrammingLanguages[0].id,
// 				submittedCode: "console.log(10+20)",
// 				statusId: allSubmissionStatuses[2].id,
// 				runtimeMs: 90,
// 				memoryUsedKb: 250,
// 				passedTestCasesCount: 1,
// 			},
// 			{
// 				userId: createdUsers[7].id,
// 				codingLessonId: codingLessons[1].id,
// 				languageId: allProgrammingLanguages[1].id,
// 				submittedCode: "max(array)",
// 				statusId: allSubmissionStatuses[1].id,
// 				runtimeMs: 110,
// 				memoryUsedKb: 350,
// 				passedTestCasesCount: 2,
// 			},
// 			{
// 				userId: createdUsers[8].id,
// 				codingLessonId: codingLessons[2].id,
// 				languageId: allProgrammingLanguages[2].id,
// 				submittedCode: "StringBuilder.reverse()",
// 				statusId: allSubmissionStatuses[3].id,
// 				runtimeMs: 300,
// 				memoryUsedKb: 600,
// 				passedTestCasesCount: 0,
// 			},
// 			{
// 				userId: createdUsers[9].id,
// 				codingLessonId: codingLessons[3].id,
// 				languageId: allProgrammingLanguages[0].id,
// 				submittedCode: "function isPalindrome(n) {...}",
// 				statusId: allSubmissionStatuses[1].id,
// 				runtimeMs: 130,
// 				memoryUsedKb: 280,
// 				passedTestCasesCount: 2,
// 			},
// 		],
// 	});

// 	console.log("✅ Coding system seeded");

// 	// Assignments - ১০টি
// 	await prisma.assignment.createMany({
// 		data: [
// 			{
// 				title: "Week 1 Assignment",
// 				instructions: "Build a simple webpage using HTML and CSS",
// 			},
// 			{
// 				title: "Week 2 Assignment",
// 				instructions: "Create a calculator using JavaScript",
// 			},
// 			{
// 				title: "Python Assignment 1",
// 				instructions: "Write a script to calculate factorial",
// 			},
// 			{
// 				title: "JS Assignment 1",
// 				instructions: "Implement a function to sort an array",
// 			},
// 			{
// 				title: "React Assignment 1",
// 				instructions: "Build a todo list component",
// 			},
// 			{
// 				title: "Node.js API Assignment",
// 				instructions: "Create a REST API with CRUD operations",
// 			},
// 			{
// 				title: "TypeScript Assignment",
// 				instructions: "Convert a JS project to TypeScript",
// 			},
// 			{
// 				title: "Docker Assignment",
// 				instructions: "Containerize a simple application",
// 			},
// 			{
// 				title: "ML Assignment 1",
// 				instructions: "Build a linear regression model",
// 			},
// 			{ title: "AWS Assignment", instructions: "Deploy a web app on AWS EC2" },
// 		],
// 	});

// 	const createdAssignments = await prisma.assignment.findMany();

// 	// SuperModuleAssignments - ৫টি
// 	await prisma.superModuleAssignment.createMany({
// 		data: [
// 			{
// 				assignmentId: createdAssignments[0].id,
// 				superModuleId: createdSuperModules[0].id,
// 				dueDate: new Date("2026-02-01 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[1].id,
// 				superModuleId: createdSuperModules[1].id,
// 				dueDate: new Date("2026-02-15 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[2].id,
// 				superModuleId: createdSuperModules[2].id,
// 				dueDate: new Date("2026-03-01 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[3].id,
// 				superModuleId: createdSuperModules[3].id,
// 				dueDate: new Date("2026-03-15 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[4].id,
// 				superModuleId: createdSuperModules[4].id,
// 				dueDate: new Date("2026-04-01 23:59:59"),
// 			},
// 		],
// 	});

// 	// ModuleAssignments - ৫টি
// 	await prisma.moduleAssignment.createMany({
// 		data: [
// 			{
// 				assignmentId: createdAssignments[5].id,
// 				moduleId: createdModules[0].id,
// 				dueDate: new Date("2026-01-15 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[6].id,
// 				moduleId: createdModules[1].id,
// 				dueDate: new Date("2026-01-30 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[7].id,
// 				moduleId: createdModules[2].id,
// 				dueDate: new Date("2026-02-15 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[8].id,
// 				moduleId: createdModules[3].id,
// 				dueDate: new Date("2026-03-01 23:59:59"),
// 			},
// 			{
// 				assignmentId: createdAssignments[9].id,
// 				moduleId: createdModules[4].id,
// 				dueDate: new Date("2026-03-15 23:59:59"),
// 			},
// 		],
// 	});

// 	// AssignmentSubmissions - ১০টি
// 	await prisma.assignmentSubmission.createMany({
// 		data: [
// 			{
// 				assignmentId: createdAssignments[0].id,
// 				userId: createdUsers[0].id,
// 				fileUrl: "https://submissions.com/1",
// 				scoreObtained: 85.5,
// 				instructorFeedback: "Good work!",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-02-02 10:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[0].id,
// 				userId: createdUsers[1].id,
// 				fileUrl: "https://submissions.com/2",
// 				scoreObtained: 75.25,
// 				instructorFeedback: "Needs improvement",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-02-03 11:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[1].id,
// 				userId: createdUsers[0].id,
// 				fileUrl: "https://submissions.com/3",
// 				scoreObtained: 90.0,
// 				instructorFeedback: "Excellent!",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-02-16 12:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[1].id,
// 				userId: createdUsers[2].id,
// 				fileUrl: "https://submissions.com/4",
// 				scoreObtained: 80.0,
// 				instructorFeedback: "Good job",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-02-17 13:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[2].id,
// 				userId: createdUsers[1].id,
// 				fileUrl: "https://submissions.com/5",
// 				scoreObtained: 95.0,
// 				instructorFeedback: "Perfect!",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-03-02 14:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[2].id,
// 				userId: createdUsers[3].id,
// 				fileUrl: "https://submissions.com/6",
// 				scoreObtained: 70.5,
// 				instructorFeedback: "Could be better",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-03-03 15:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[3].id,
// 				userId: createdUsers[2].id,
// 				fileUrl: "https://submissions.com/7",
// 				scoreObtained: 88.0,
// 				instructorFeedback: "Very good",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-03-16 16:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[4].id,
// 				userId: createdUsers[4].id,
// 				fileUrl: "https://submissions.com/8",
// 				scoreObtained: 92.5,
// 				instructorFeedback: "Excellent work!",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-04-02 10:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[5].id,
// 				userId: createdUsers[5].id,
// 				fileUrl: "https://submissions.com/9",
// 				scoreObtained: 78.0,
// 				instructorFeedback: "Good, but could improve",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-01-16 11:00:00"),
// 			},
// 			{
// 				assignmentId: createdAssignments[6].id,
// 				userId: createdUsers[0].id,
// 				fileUrl: "https://submissions.com/10",
// 				scoreObtained: 85.0,
// 				instructorFeedback: "Well done",
// 				gradedByUserId: createdUsers[0].id,
// 				gradedAt: new Date("2026-01-31 12:00:00"),
// 			},
// 		],
// 	});

// 	console.log("✅ Assignments seeded");

// 	// DiscussionThreads - ১০টি
// 	await prisma.discussionThread.createMany({
// 		data: [
// 			{
// 				lessonId: createdLessons[0].id,
// 				userId: createdUsers[0].id,
// 				title: "Help needed with setup",
// 				body: "Can someone explain the installation process?",
// 				commentCount: 2,
// 				reactionCount: 1,
// 			},
// 			{
// 				lessonId: createdLessons[1].id,
// 				userId: createdUsers[1].id,
// 				title: "Great lesson!",
// 				body: "I really enjoyed this lesson.",
// 				commentCount: 1,
// 				reactionCount: 2,
// 			},
// 			{
// 				lessonId: createdLessons[2].id,
// 				userId: createdUsers[2].id,
// 				title: "Question about HTML",
// 				body: "How does semantic HTML work?",
// 				commentCount: 3,
// 				reactionCount: 0,
// 			},
// 			{
// 				lessonId: createdLessons[3].id,
// 				userId: createdUsers[3].id,
// 				title: "CSS issue",
// 				body: "Getting error with flexbox layout",
// 				commentCount: 2,
// 				reactionCount: 1,
// 			},
// 			{
// 				lessonId: createdLessons[4].id,
// 				userId: createdUsers[4].id,
// 				title: "JS question",
// 				body: "How do closures work in JavaScript?",
// 				commentCount: 1,
// 				reactionCount: 3,
// 			},
// 			{
// 				lessonId: createdLessons[5].id,
// 				userId: createdUsers[5].id,
// 				title: "Python help",
// 				body: "Getting error in my Python script",
// 				commentCount: 2,
// 				reactionCount: 1,
// 			},
// 			{
// 				lessonId: createdLessons[6].id,
// 				userId: createdUsers[6].id,
// 				title: "React question",
// 				body: "Why use hooks?",
// 				commentCount: 1,
// 				reactionCount: 2,
// 			},
// 			{
// 				lessonId: createdLessons[7].id,
// 				userId: createdUsers[7].id,
// 				title: "Node.js issue",
// 				body: "Port already in use error",
// 				commentCount: 3,
// 				reactionCount: 0,
// 			},
// 			{
// 				lessonId: createdLessons[8].id,
// 				userId: createdUsers[8].id,
// 				title: "TypeScript help",
// 				body: "How to use interfaces?",
// 				commentCount: 2,
// 				reactionCount: 1,
// 			},
// 			{
// 				lessonId: createdLessons[9].id,
// 				userId: createdUsers[9].id,
// 				title: "Docker question",
// 				body: "How to dockerize my app?",
// 				commentCount: 1,
// 				reactionCount: 2,
// 			},
// 		],
// 	});

// 	const createdThreads = await prisma.discussionThread.findMany();

// 	// DiscussionComments - ১০টি
// 	await prisma.discussionComment.createMany({
// 		data: [
// 			{
// 				threadId: createdThreads[0].id,
// 				userId: createdUsers[0].id,
// 				parentCommentId: null,
// 				body: "Let me help you with setup.",
// 				replyCount: 1,
// 				reactionCount: 1,
// 			},
// 			{
// 				threadId: createdThreads[0].id,
// 				userId: createdUsers[1].id,
// 				parentCommentId: 1,
// 				body: "I think its about the environment variables.",
// 				replyCount: 0,
// 				reactionCount: 0,
// 			},
// 			{
// 				threadId: createdThreads[1].id,
// 				userId: createdUsers[2].id,
// 				parentCommentId: null,
// 				body: "Thanks for the feedback!",
// 				replyCount: 0,
// 				reactionCount: 1,
// 			},
// 			{
// 				threadId: createdThreads[2].id,
// 				userId: createdUsers[3].id,
// 				parentCommentId: null,
// 				body: "Semantic HTML is great for accessibility.",
// 				replyCount: 1,
// 				reactionCount: 0,
// 			},
// 			{
// 				threadId: createdThreads[3].id,
// 				userId: createdUsers[4].id,
// 				parentCommentId: null,
// 				body: "Check your flexbox container.",
// 				replyCount: 0,
// 				reactionCount: 0,
// 			},
// 			{
// 				threadId: createdThreads[4].id,
// 				userId: createdUsers[5].id,
// 				parentCommentId: null,
// 				body: "Closures are functions with access to outer scope.",
// 				replyCount: 0,
// 				reactionCount: 1,
// 			},
// 			{
// 				threadId: createdThreads[5].id,
// 				userId: createdUsers[6].id,
// 				parentCommentId: null,
// 				body: "Check your imports.",
// 				replyCount: 0,
// 				reactionCount: 0,
// 			},
// 			{
// 				threadId: createdThreads[6].id,
// 				userId: createdUsers[7].id,
// 				parentCommentId: null,
// 				body: "Hooks let you use state in functional components.",
// 				replyCount: 0,
// 				reactionCount: 1,
// 			},
// 			{
// 				threadId: createdThreads[7].id,
// 				userId: createdUsers[8].id,
// 				parentCommentId: null,
// 				body: "Try killing the process using that port.",
// 				replyCount: 0,
// 				reactionCount: 0,
// 			},
// 			{
// 				threadId: createdThreads[8].id,
// 				userId: createdUsers[9].id,
// 				parentCommentId: null,
// 				body: "Interfaces define the structure of objects.",
// 				replyCount: 0,
// 				reactionCount: 1,
// 			},
// 		],
// 	});

// 	// DiscussionThreadReactions - ১০টি
// 	await prisma.discussionThreadReaction.createMany({
// 		data: [
// 			{
// 				userId: createdUsers[0].id,
// 				threadId: createdThreads[0].id,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				threadId: createdThreads[1].id,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				threadId: createdThreads[2].id,
// 				reactionTypeId: allReactionTypes[1].id,
// 			},
// 			{
// 				userId: createdUsers[3].id,
// 				threadId: createdThreads[3].id,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[4].id,
// 				threadId: createdThreads[4].id,
// 				reactionTypeId: allReactionTypes[2].id,
// 			},
// 			{
// 				userId: createdUsers[5].id,
// 				threadId: createdThreads[5].id,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[6].id,
// 				threadId: createdThreads[6].id,
// 				reactionTypeId: allReactionTypes[3].id,
// 			},
// 			{
// 				userId: createdUsers[7].id,
// 				threadId: createdThreads[7].id,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[8].id,
// 				threadId: createdThreads[8].id,
// 				reactionTypeId: allReactionTypes[1].id,
// 			},
// 			{
// 				userId: createdUsers[9].id,
// 				threadId: createdThreads[9].id,
// 				reactionTypeId: allReactionTypes[4].id,
// 			},
// 		],
// 	});

// 	// DiscussionCommentReactions - ১০টি
// 	await prisma.discussionCommentReaction.createMany({
// 		data: [
// 			{
// 				userId: createdUsers[0].id,
// 				commentId: 1,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				commentId: 2,
// 				reactionTypeId: allReactionTypes[1].id,
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				commentId: 3,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[3].id,
// 				commentId: 4,
// 				reactionTypeId: allReactionTypes[2].id,
// 			},
// 			{
// 				userId: createdUsers[4].id,
// 				commentId: 5,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[5].id,
// 				commentId: 6,
// 				reactionTypeId: allReactionTypes[3].id,
// 			},
// 			{
// 				userId: createdUsers[6].id,
// 				commentId: 7,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 			{
// 				userId: createdUsers[7].id,
// 				commentId: 8,
// 				reactionTypeId: allReactionTypes[1].id,
// 			},
// 			{
// 				userId: createdUsers[8].id,
// 				commentId: 9,
// 				reactionTypeId: allReactionTypes[4].id,
// 			},
// 			{
// 				userId: createdUsers[9].id,
// 				commentId: 10,
// 				reactionTypeId: allReactionTypes[0].id,
// 			},
// 		],
// 	});

// 	console.log("✅ Discussion system seeded");

// 	// Grades - ১০টি
// 	await prisma.grade.createMany({
// 		data: [
// 			{
// 				userId: createdUsers[0].id,
// 				courseId: createdCourses[0].id,
// 				totalScore: 85.5,
// 			},
// 			{
// 				userId: createdUsers[0].id,
// 				courseId: createdCourses[1].id,
// 				totalScore: 90.0,
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				courseId: createdCourses[0].id,
// 				totalScore: 75.25,
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				courseId: createdCourses[2].id,
// 				totalScore: 88.5,
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				courseId: createdCourses[1].id,
// 				totalScore: 92.0,
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				courseId: createdCourses[3].id,
// 				totalScore: 78.5,
// 			},
// 			{
// 				userId: createdUsers[3].id,
// 				courseId: createdCourses[0].id,
// 				totalScore: 95.0,
// 			},
// 			{
// 				userId: createdUsers[4].id,
// 				courseId: createdCourses[4].id,
// 				totalScore: 80.0,
// 			},
// 			{
// 				userId: createdUsers[5].id,
// 				courseId: createdCourses[2].id,
// 				totalScore: 87.5,
// 			},
// 			{
// 				userId: createdUsers[6].id,
// 				courseId: createdCourses[3].id,
// 				totalScore: 93.0,
// 			},
// 		],
// 	});

// 	// Certificates - ১০টি
// 	await prisma.certificate.createMany({
// 		data: [
// 			{
// 				userId: createdUsers[0].id,
// 				courseId: createdCourses[0].id,
// 				certificateUid: "cert_abc123",
// 			},
// 			{
// 				userId: createdUsers[0].id,
// 				courseId: createdCourses[1].id,
// 				certificateUid: "cert_def456",
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				courseId: createdCourses[0].id,
// 				certificateUid: "cert_ghi789",
// 			},
// 			{
// 				userId: createdUsers[1].id,
// 				courseId: createdCourses[2].id,
// 				certificateUid: "cert_jkl012",
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				courseId: createdCourses[1].id,
// 				certificateUid: "cert_mno345",
// 			},
// 			{
// 				userId: createdUsers[2].id,
// 				courseId: createdCourses[3].id,
// 				certificateUid: "cert_pqr678",
// 			},
// 			{
// 				userId: createdUsers[3].id,
// 				courseId: createdCourses[0].id,
// 				certificateUid: "cert_stu901",
// 			},
// 			{
// 				userId: createdUsers[4].id,
// 				courseId: createdCourses[4].id,
// 				certificateUid: "cert_vwx234",
// 			},
// 			{
// 				userId: createdUsers[5].id,
// 				courseId: createdCourses[2].id,
// 				certificateUid: "cert_yz567",
// 			},
// 			{
// 				userId: createdUsers[6].id,
// 				courseId: createdCourses[3].id,
// 				certificateUid: "cert_abc890",
// 			},
// 		],
// 	});

// 	// Feedbacks - ১০টি
// 	await prisma.feedback.createMany({
// 		data: [
// 			{
// 				courseId: createdCourses[0].id,
// 				userId: createdUsers[0].id,
// 				rating: 5,
// 				comment: "Excellent course!",
// 			},
// 			{
// 				courseId: createdCourses[0].id,
// 				userId: createdUsers[1].id,
// 				rating: 4,
// 				comment: "Very good",
// 			},
// 			{
// 				courseId: createdCourses[1].id,
// 				userId: createdUsers[0].id,
// 				rating: 5,
// 				comment: "Loved it!",
// 			},
// 			{
// 				courseId: createdCourses[1].id,
// 				userId: createdUsers[2].id,
// 				rating: 3,
// 				comment: "Could be better",
// 			},
// 			{
// 				courseId: createdCourses[2].id,
// 				userId: createdUsers[1].id,
// 				rating: 5,
// 				comment: "Perfect!",
// 			},
// 			{
// 				courseId: createdCourses[2].id,
// 				userId: createdUsers[5].id,
// 				rating: 4,
// 				comment: "Great content",
// 			},
// 			{
// 				courseId: createdCourses[3].id,
// 				userId: createdUsers[2].id,
// 				rating: 5,
// 				comment: "Amazing!",
// 			},
// 			{
// 				courseId: createdCourses[3].id,
// 				userId: createdUsers[6].id,
// 				rating: 4,
// 				comment: "Very informative",
// 			},
// 			{
// 				courseId: createdCourses[4].id,
// 				userId: createdUsers[3].id,
// 				rating: 5,
// 				comment: "Best course ever!",
// 			},
// 			{
// 				courseId: createdCourses[4].id,
// 				userId: createdUsers[4].id,
// 				rating: 4,
// 				comment: "Good, but challenging",
// 			},
// 		],
// 	});

// 	console.log("✅ Grades, certificates, and feedback seeded");
// 	console.log("🎉 All seeding completed successfully!");
// }

// main()
// 	.catch((e) => {
// 		console.error("❌ Seeding failed:", e);
// 		throw e;
// 	})
// 	.finally(async () => {
// 		await prisma.$disconnect();
// 	});

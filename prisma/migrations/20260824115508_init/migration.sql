-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'DELETED');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'CREDENTIAL');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('GITHUB', 'LINKEDIN', 'TWITTER', 'FACEBOOK', 'YOUTUBE', 'INSTAGRAM', 'WEBSITE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'BENGALI');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'ARTICLE', 'QUIZ', 'CODING');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE', 'LOVE', 'HELPFUL', 'CELEBRATE', 'THINKING');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR');

-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'JAVA', 'CPP', 'C', 'GO', 'RUST', 'PHP', 'CSHARP');

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_module_assignments" (
    "assignmentId" TEXT NOT NULL,
    "superModuleId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_module_assignments_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "module_assignments" (
    "assignmentId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_assignments_pkey" PRIMARY KEY ("assignmentId")
);

-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scoreObtained" DECIMAL(65,30),
    "instructorFeedback" TEXT,
    "gradedByUserId" TEXT,
    "gradedAt" TIMESTAMP(3),

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "totalScore" DECIMAL(65,30) NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateUid" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_lessons" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "inputFormat" TEXT NOT NULL,
    "outputFormat" TEXT NOT NULL,
    "timeLimitMs" INTEGER NOT NULL,
    "memoryLimitKb" INTEGER NOT NULL,

    CONSTRAINT "coding_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_test_cases" (
    "id" TEXT NOT NULL,
    "codingLessonId" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "coding_test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_answers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codingLessonId" TEXT NOT NULL,
    "language" "ProgrammingLanguage" NOT NULL,
    "submittedCode" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "runtimeMs" INTEGER,
    "memoryUsedKb" INTEGER,
    "passedTestCasesCount" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coding_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisions" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "lesson_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "enrollmentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_descriptions" (
    "courseId" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "language" "Language" NOT NULL,

    CONSTRAINT "course_descriptions_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "course_learning_outcomes" (
    "id" TEXT NOT NULL,
    "courseDescriptionId" TEXT NOT NULL,
    "outcomeText" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "course_learning_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_prerequisites" (
    "id" TEXT NOT NULL,
    "courseDescriptionId" TEXT NOT NULL,
    "prerequisiteText" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "course_prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_modules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "super_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "superModuleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lessonType" "LessonType" NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "isPro" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_lessons" (
    "lessonId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,

    CONSTRAINT "video_lessons_pkey" PRIMARY KEY ("lessonId")
);

-- CreateTable
CREATE TABLE "article_lessons" (
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "article_lessons_pkey" PRIMARY KEY ("lessonId")
);

-- CreateTable
CREATE TABLE "article_sections" (
    "id" TEXT NOT NULL,
    "articleLessonId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "article_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_threads" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discussion_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_comments" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "body" TEXT NOT NULL,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "discussion_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_thread_reactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "reactionType" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_thread_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_comment_reactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "reactionType" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "name" TEXT,
    "email" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "password" TEXT,
    "googleId" TEXT,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIAL',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "needPasswordChange" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_descriptions" (
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "cityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_descriptions_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "user_socials" (
    "id" TEXT NOT NULL,
    "userDescriptionId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "user_socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_educations" (
    "id" TEXT NOT NULL,
    "userDescriptionId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "user_educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_experiences" (
    "id" TEXT NOT NULL,
    "userDescriptionId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "user_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_websites" (
    "id" TEXT NOT NULL,
    "userDescriptionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "user_websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "userDescriptionId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiencyLevel" "ProficiencyLevel" NOT NULL DEFAULT 'BEGINNER',

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("userDescriptionId","skillId")
);

-- CreateTable
CREATE TABLE "quiz_lessons" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "quiz_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "quizLessonId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "displayOrder" INTEGER NOT NULL,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizLessonId" TEXT NOT NULL,
    "score" DECIMAL(65,30) NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempt_answers" (
    "id" TEXT NOT NULL,
    "quizAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionId" TEXT NOT NULL,

    CONSTRAINT "quiz_attempt_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "super_module_assignments_superModuleId_idx" ON "super_module_assignments"("superModuleId");

-- CreateIndex
CREATE INDEX "module_assignments_moduleId_idx" ON "module_assignments"("moduleId");

-- CreateIndex
CREATE INDEX "assignment_submissions_assignmentId_idx" ON "assignment_submissions"("assignmentId");

-- CreateIndex
CREATE INDEX "assignment_submissions_userId_idx" ON "assignment_submissions"("userId");

-- CreateIndex
CREATE INDEX "assignment_submissions_gradedByUserId_idx" ON "assignment_submissions"("gradedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_submissions_userId_assignmentId_key" ON "assignment_submissions"("userId", "assignmentId");

-- CreateIndex
CREATE INDEX "grades_userId_idx" ON "grades"("userId");

-- CreateIndex
CREATE INDEX "grades_courseId_idx" ON "grades"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "grades_userId_courseId_key" ON "grades"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateUid_key" ON "certificates"("certificateUid");

-- CreateIndex
CREATE INDEX "certificates_userId_idx" ON "certificates"("userId");

-- CreateIndex
CREATE INDEX "certificates_courseId_idx" ON "certificates"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_userId_courseId_key" ON "certificates"("userId", "courseId");

-- CreateIndex
CREATE INDEX "feedbacks_courseId_idx" ON "feedbacks"("courseId");

-- CreateIndex
CREATE INDEX "feedbacks_userId_idx" ON "feedbacks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_userId_courseId_key" ON "feedbacks"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "coding_lessons_lessonId_key" ON "coding_lessons"("lessonId");

-- CreateIndex
CREATE INDEX "coding_test_cases_codingLessonId_idx" ON "coding_test_cases"("codingLessonId");

-- CreateIndex
CREATE INDEX "coding_answers_userId_idx" ON "coding_answers"("userId");

-- CreateIndex
CREATE INDEX "coding_answers_codingLessonId_idx" ON "coding_answers"("codingLessonId");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE INDEX "divisions_countryId_idx" ON "divisions"("countryId");

-- CreateIndex
CREATE INDEX "districts_divisionId_idx" ON "districts"("divisionId");

-- CreateIndex
CREATE INDEX "cities_districtId_idx" ON "cities"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");

-- CreateIndex
CREATE INDEX "enrollments_courseId_idx" ON "enrollments"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON "enrollments"("userId", "courseId");

-- CreateIndex
CREATE INDEX "lesson_progresses_userId_idx" ON "lesson_progresses"("userId");

-- CreateIndex
CREATE INDEX "lesson_progresses_lessonId_idx" ON "lesson_progresses"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progresses_userId_lessonId_key" ON "lesson_progresses"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "course_learning_outcomes_courseDescriptionId_idx" ON "course_learning_outcomes"("courseDescriptionId");

-- CreateIndex
CREATE INDEX "course_prerequisites_courseDescriptionId_idx" ON "course_prerequisites"("courseDescriptionId");

-- CreateIndex
CREATE INDEX "super_modules_courseId_idx" ON "super_modules"("courseId");

-- CreateIndex
CREATE INDEX "modules_superModuleId_idx" ON "modules"("superModuleId");

-- CreateIndex
CREATE INDEX "lessons_moduleId_idx" ON "lessons"("moduleId");

-- CreateIndex
CREATE INDEX "article_sections_articleLessonId_idx" ON "article_sections"("articleLessonId");

-- CreateIndex
CREATE INDEX "discussion_threads_lessonId_idx" ON "discussion_threads"("lessonId");

-- CreateIndex
CREATE INDEX "discussion_threads_userId_idx" ON "discussion_threads"("userId");

-- CreateIndex
CREATE INDEX "discussion_comments_threadId_idx" ON "discussion_comments"("threadId");

-- CreateIndex
CREATE INDEX "discussion_comments_userId_idx" ON "discussion_comments"("userId");

-- CreateIndex
CREATE INDEX "discussion_comments_parentCommentId_idx" ON "discussion_comments"("parentCommentId");

-- CreateIndex
CREATE INDEX "discussion_thread_reactions_threadId_idx" ON "discussion_thread_reactions"("threadId");

-- CreateIndex
CREATE INDEX "discussion_thread_reactions_userId_idx" ON "discussion_thread_reactions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_thread_reactions_userId_threadId_key" ON "discussion_thread_reactions"("userId", "threadId");

-- CreateIndex
CREATE INDEX "discussion_comment_reactions_commentId_idx" ON "discussion_comment_reactions"("commentId");

-- CreateIndex
CREATE INDEX "discussion_comment_reactions_userId_idx" ON "discussion_comment_reactions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_comment_reactions_userId_commentId_key" ON "discussion_comment_reactions"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "user_descriptions_cityId_idx" ON "user_descriptions"("cityId");

-- CreateIndex
CREATE INDEX "user_socials_userDescriptionId_idx" ON "user_socials"("userDescriptionId");

-- CreateIndex
CREATE INDEX "user_educations_userDescriptionId_idx" ON "user_educations"("userDescriptionId");

-- CreateIndex
CREATE INDEX "user_experiences_userDescriptionId_idx" ON "user_experiences"("userDescriptionId");

-- CreateIndex
CREATE INDEX "user_websites_userDescriptionId_idx" ON "user_websites"("userDescriptionId");

-- CreateIndex
CREATE INDEX "user_skills_skillId_idx" ON "user_skills"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_lessons_lessonId_key" ON "quiz_lessons"("lessonId");

-- CreateIndex
CREATE INDEX "quiz_questions_quizLessonId_idx" ON "quiz_questions"("quizLessonId");

-- CreateIndex
CREATE INDEX "quiz_options_questionId_idx" ON "quiz_options"("questionId");

-- CreateIndex
CREATE INDEX "quiz_attempts_userId_idx" ON "quiz_attempts"("userId");

-- CreateIndex
CREATE INDEX "quiz_attempts_quizLessonId_idx" ON "quiz_attempts"("quizLessonId");

-- CreateIndex
CREATE INDEX "quiz_attempt_answers_quizAttemptId_idx" ON "quiz_attempt_answers"("quizAttemptId");

-- CreateIndex
CREATE INDEX "quiz_attempt_answers_questionId_idx" ON "quiz_attempt_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempt_answers_quizAttemptId_questionId_key" ON "quiz_attempt_answers"("quizAttemptId", "questionId");

-- AddForeignKey
ALTER TABLE "super_module_assignments" ADD CONSTRAINT "super_module_assignments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super_module_assignments" ADD CONSTRAINT "super_module_assignments_superModuleId_fkey" FOREIGN KEY ("superModuleId") REFERENCES "super_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_assignments" ADD CONSTRAINT "module_assignments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_assignments" ADD CONSTRAINT "module_assignments_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_gradedByUserId_fkey" FOREIGN KEY ("gradedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_lessons" ADD CONSTRAINT "coding_lessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_test_cases" ADD CONSTRAINT "coding_test_cases_codingLessonId_fkey" FOREIGN KEY ("codingLessonId") REFERENCES "coding_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_answers" ADD CONSTRAINT "coding_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_answers" ADD CONSTRAINT "coding_answers_codingLessonId_fkey" FOREIGN KEY ("codingLessonId") REFERENCES "coding_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "divisions" ADD CONSTRAINT "divisions_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "divisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progresses" ADD CONSTRAINT "lesson_progresses_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_descriptions" ADD CONSTRAINT "course_descriptions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_learning_outcomes" ADD CONSTRAINT "course_learning_outcomes_courseDescriptionId_fkey" FOREIGN KEY ("courseDescriptionId") REFERENCES "course_descriptions"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_prerequisites" ADD CONSTRAINT "course_prerequisites_courseDescriptionId_fkey" FOREIGN KEY ("courseDescriptionId") REFERENCES "course_descriptions"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super_modules" ADD CONSTRAINT "super_modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_superModuleId_fkey" FOREIGN KEY ("superModuleId") REFERENCES "super_modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_lessons" ADD CONSTRAINT "video_lessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_lessons" ADD CONSTRAINT "article_lessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_sections" ADD CONSTRAINT "article_sections_articleLessonId_fkey" FOREIGN KEY ("articleLessonId") REFERENCES "article_lessons"("lessonId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_comments" ADD CONSTRAINT "discussion_comments_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "discussion_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_comments" ADD CONSTRAINT "discussion_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_comments" ADD CONSTRAINT "discussion_comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "discussion_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_thread_reactions" ADD CONSTRAINT "discussion_thread_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_thread_reactions" ADD CONSTRAINT "discussion_thread_reactions_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "discussion_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_comment_reactions" ADD CONSTRAINT "discussion_comment_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_comment_reactions" ADD CONSTRAINT "discussion_comment_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "discussion_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_descriptions" ADD CONSTRAINT "user_descriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_descriptions" ADD CONSTRAINT "user_descriptions_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_socials" ADD CONSTRAINT "user_socials_userDescriptionId_fkey" FOREIGN KEY ("userDescriptionId") REFERENCES "user_descriptions"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_educations" ADD CONSTRAINT "user_educations_userDescriptionId_fkey" FOREIGN KEY ("userDescriptionId") REFERENCES "user_descriptions"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_experiences" ADD CONSTRAINT "user_experiences_userDescriptionId_fkey" FOREIGN KEY ("userDescriptionId") REFERENCES "user_descriptions"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_websites" ADD CONSTRAINT "user_websites_userDescriptionId_fkey" FOREIGN KEY ("userDescriptionId") REFERENCES "user_descriptions"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_userDescriptionId_fkey" FOREIGN KEY ("userDescriptionId") REFERENCES "user_descriptions"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_lessons" ADD CONSTRAINT "quiz_lessons_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizLessonId_fkey" FOREIGN KEY ("quizLessonId") REFERENCES "quiz_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizLessonId_fkey" FOREIGN KEY ("quizLessonId") REFERENCES "quiz_lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_answers" ADD CONSTRAINT "quiz_attempt_answers_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "quiz_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

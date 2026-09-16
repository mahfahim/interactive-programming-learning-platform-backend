#  Code BD Code backend api

> A scalable, feature-rich RESTful backend API for an **Interactive Programming Learning Platform** built with **Node.js, Express.js, TypeScript, Prisma, PostgreSQL, and SSLCommerz/bKash/Stripe**.

---

DevSphere is an interactive programming learning platform designed to train software engineers. Beyond traditional video and text lessons, DevSphere provides an end-to-end interactive learning environment featuring structured course hierarchies, interactive coding challenges, automated quizzes, assignment workflows, and integrated payment processing.

The system enforces strict **Role-Based Access Control (RBAC)** across three primary user roles:

* 👨‍🎓 **Student:** Browse courses, enroll, track progress, attempt quizzes, submit coding solutions, complete assignments, and claim certificates upon completion.
* 👨‍🏫 **Teacher:** Create and manage courses, design curriculum hierarchies (SuperModules, Modules, Lessons), author coding problems/quizzes, and grade student assignments.
* 👨‍💼 **Admin:** Manage platform users, manage teachers, moderate courses and reviews, monitor transaction history, view audit logs, and access analytics dashboards.

---

# 🚀 Live Links

| Resource | Link |
| --- | --- |
| 🌐 Live API | [https://devsphere-backend.onrender.com/](https://www.google.com/search?q=https://devsphere-backend.onrender.com/) |
| 📮 Postman Documentation | [https://documenter.getpostman.com/view/52004920/2sBY4Qtffz](https://documenter.getpostman.com/view/52004920/2sBY4Qtffz) |
| 💻 GitHub Repository | [https://github.com/mahfahim/DevSphere-backend](https://www.google.com/search?q=https://github.com/mahfahim/DevSphere-backend) |

---

# 👨‍💼 Admin Credentials

```text
Email:
admin@devsphere.com

Password:
123456

```

---

# ✨ Features

## Authentication & Security

* **JWT Authentication:** Secure access token and HTTP-only cookie refresh token flow.
* **Social Auth:** GCP Google OAuth 2.0 integration.
* **RBAC:** Fine-grained role-based access control (`STUDENT`, `TEACHER`, `ADMIN`).
* **Security Middlewares:** Password hashing with `bcrypt`, `helmet` HTTP headers, CORS policies, and rate-limiting.

## Course & Content Management

* **Hierarchical Curriculum Structure:** Courses $\rightarrow$ Super Modules $\rightarrow$ Modules $\rightarrow$ Lessons.
* **Diverse Lesson Types:** Support for Video, Article, Coding Problem, Quiz, and Assignment lessons.
* **Lesson Locking & Prerequisites:** Sequential access unlocking based on progress completion.
* **Search, Filter & Pagination:** Full-text search, level-based filtering, and page-based queries.

## Interactive Assessment & Submissions

* **Coding Engine Integration:** Automated test-case execution for student code submissions with memory and execution time tracking.
* **Dynamic Quiz Engine:** Multi-choice questions with real-time scoring, attempt history, and passing criteria checks.
* **Assignment Submissions:** GitHub repository submission workflow with instructor grading and score tracking.

## Progress, Certification & Payments

* **Progress Tracking:** Granular progress calculation across modules, coding tasks, and quizzes.
* **Certificate Generation:** Automated issuance of unique verifiable certificates upon 100% course completion.
* **Payment Gateway Integration:** Payment processing via Stripe, bKash, and SSLCommerz with secure webhook handlers and transaction logs.
* **Audit Logging:** System-wide tracking of sensitive actions and entity state changes.

---

# 🛠 Tech Stack

## Core Backend

* **Framework:** Express.js with TypeScript
* **Database & ORM:** PostgreSQL & Prisma ORM
* **Authentication:** JWT, bcrypt, Google OAuth (GCP)
* **Validation:** Zod schema validation

## External Integrations & Services

* **Code Execution:** External Code Execution Engine / Judge0 API
* **Payment Gateways:** SSLCommerz, bKash, Stripe
* **Deployment:** Render / Vercel (API & Engine), PostgreSQL Cloud

---

# 📂 Folder Structure

```text
DEVSPHERE-BACKEND/
├── dist/
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── scripts/
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── index.ts
│   │   ├── google.config.ts
│   │   └── payment.config.ts
│   ├── errors/
│   │   └── AppError.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.interface.ts
│   │   │   ├── admin.route.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.validation.ts
│   │   ├── assignment/
│   │   │   ├── assignment.controller.ts
│   │   │   ├── assignment.interface.ts
│   │   │   ├── assignment.route.ts
│   │   │   ├── assignment.service.ts
│   │   │   └── assignment.validation.ts
│   │   ├── auditLog/
│   │   │   ├── auditLog.controller.ts
│   │   │   ├── auditLog.route.ts
│   │   │   └── auditLog.service.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── certificate/
│   │   │   ├── certificate.controller.ts
│   │   │   ├── certificate.route.ts
│   │   │   └── certificate.service.ts
│   │   ├── codingLesson/
│   │   │   ├── codingLesson.controller.ts
│   │   │   ├── codingLesson.interface.ts
│   │   │   ├── codingLesson.route.ts
│   │   │   ├── codingLesson.service.ts
│   │   │   └── codingLesson.validation.ts
│   │   ├── course/
│   │   │   ├── course.controller.ts
│   │   │   ├── course.interface.ts
│   │   │   ├── course.route.ts
│   │   │   ├── course.service.ts
│   │   │   └── course.validation.ts
│   │   ├── discussion/
│   │   │   ├── discussion.controller.ts
│   │   │   ├── discussion.interface.ts
│   │   │   ├── discussion.route.ts
│   │   │   ├── discussion.service.ts
│   │   │   └── discussion.validation.ts
│   │   ├── enrollment/
│   │   │   ├── enrollment.controller.ts
│   │   │   ├── enrollment.interface.ts
│   │   │   ├── enrollment.route.ts
│   │   │   ├── enrollment.service.ts
│   │   │   └── enrollment.validation.ts
│   │   ├── lesson/
│   │   │   ├── lesson.controller.ts
│   │   │   ├── lesson.interface.ts
│   │   │   ├── lesson.route.ts
│   │   │   ├── lesson.service.ts
│   │   │   └── lesson.validation.ts
│   │   ├── module/
│   │   │   ├── module.controller.ts
│   │   │   ├── module.interface.ts
│   │   │   ├── module.route.ts
│   │   │   ├── module.service.ts
│   │   │   └── module.validation.ts
│   │   ├── payment/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.interface.ts
│   │   │   ├── payment.route.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── payment.utils.ts
│   │   │   └── payment.validation.ts
│   │   ├── progress/
│   │   │   ├── progress.controller.ts
│   │   │   ├── progress.route.ts
│   │   │   └── progress.service.ts
│   │   ├── quiz/
│   │   │   ├── quiz.controller.ts
│   │   │   ├── quiz.interface.ts
│   │   │   ├── quiz.route.ts
│   │   │   ├── quiz.service.ts
│   │   │   └── quiz.validation.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.interface.ts
│   │   │   ├── user.route.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.validation.ts
│   │   └── superModule/
│   │       ├── superModule.controller.ts
│   │       ├── superModule.interface.ts
│   │       ├── superModule.route.ts
│   │       ├── superModule.service.ts
│   │       └── superModule.validation.ts
│   ├── utils/
│   │   ├── catchAsync.ts
│   │   ├── jwt.ts
│   │   ├── pick.ts
│   │   └── sendResponse.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── prisma.config.ts
├── README.md
├── tsconfig.json
└── tsup.config.ts

```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/mahfahim/DevSphere-backend.git
cd DevSphere-backend

```

---

## Install Dependencies

```bash
npm install

```

---

## Environment Variables

Create a `.env` file in the root folder.

```env
# Server Configuration
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000

# Database Connection (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/devsphere_db?schema=public

# Security & Secrets
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=YOUR_SUPER_SECRET_ACCESS_KEY
JWT_REFRESH_SECRET=YOUR_SUPER_SECRET_REFRESH_KEY
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth Credentials
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Payment Gateway Setup
PAYMENT_GATEWAY_PROVIDER=BKASH # Options: BKASH, SSLCOMMERZ, STRIPE
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
SSL_STORE_ID=YOUR_SSLCOMMERZ_STORE_ID
SSL_STORE_PASSWORD=YOUR_SSLCOMMERZ_STORE_PASSWORD
BKASH_APP_KEY=YOUR_BKASH_APP_KEY
BKASH_APP_SECRET=YOUR_BKASH_APP_SECRET
BKASH_USERNAME=YOUR_BKASH_USERNAME
BKASH_PASSWORD=YOUR_BKASH_PASSWORD

# Code Execution Engine API
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=YOUR_RAPIDAPI_JUDGE0_KEY

```

---

## Generate Prisma Client

```bash
npx prisma generate

```

---

## Run Migrations

```bash
npx prisma migrate dev

```

---

## Seed Database

```bash
npm run seed

```

---

## Run Development Server

```bash
npm run dev

```

---

## Build Project

```bash
npm run build

```

---

## Run Production Server

```bash
npm start

```

---

# 📚 API Endpoints

## Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register a new user account |
| `POST` | `/api/v1/auth/login` | Authenticate user & issue tokens |
| `POST` | `/api/v1/auth/refresh-token` | Obtain a new access token using refresh token |
| `GET` | `/api/v1/auth/google` | Trigger Google GCP OAuth flow |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user details |
| `PATCH` | `/api/v1/auth/me` | Update authenticated user profile |
| `POST` | `/api/v1/auth/logout` | Revoke session and clear cookies |

---

## Courses & Curriculum

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/courses` | List courses (Supports pagination, search, filter) |
| `GET` | `/api/v1/courses/:id` | Get details of a specific course |
| `POST` | `/api/v1/courses` | Create a new course (Teacher/Admin) |
| `PATCH` | `/api/v1/courses/:id` | Update course details |
| `DELETE` | `/api/v1/courses/:id` | Soft delete a course |
| `POST` | `/api/v1/courses/:id/super-modules` | Add a SuperModule to a course |
| `POST` | `/api/v1/super-modules/:id/modules` | Add a Module to a SuperModule |
| `POST` | `/api/v1/modules/:id/lessons` | Add a Lesson to a Module |

---

## Enrollments & Progress

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/courses/:id/enroll` | Enroll student in a free or paid course |
| `GET` | `/api/v1/enrollments/my-courses` | Get all enrolled courses for logged-in student |
| `GET` | `/api/v1/courses/:id/progress` | Get student progress for a course |
| `POST` | `/api/v1/lessons/:id/complete` | Mark a lesson as completed |

---

## Interactive Coding

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/coding-lessons/:id` | Fetch problem statement & test cases |
| `POST` | `/api/v1/coding-lessons/:id/submit` | Submit code solution for automated evaluation |
| `GET` | `/api/v1/coding-lessons/submissions/me` | View user's past code submissions |

---

## Quizzes & Assignments

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/quizzes/:id` | Retrieve quiz questions |
| `POST` | `/api/v1/quizzes/:id/attempt` | Submit quiz answers for auto-grading |
| `POST` | `/api/v1/assignments/:id/submit` | Submit assignment repository link |
| `PATCH` | `/api/v1/assignments/submissions/:id/grade` | Grade student submission (Teacher/Admin) |

---

## Payments & Certificates

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/payments/initiate` | Initiate payment checkout session |
| `POST` | `/api/v1/payments/webhook` | Webhook endpoint for status confirmation |
| `GET` | `/api/v1/payments/my-payments` | View personal transaction history |
| `GET` | `/api/v1/certificates/:courseId` | Claim/download course completion certificate |

---

## Admin & Auditing

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/admin/users` | Manage all registered users |
| `PATCH` | `/api/v1/admin/users/:id/status` | Update user status (Active/Suspended) |
| `GET` | `/api/v1/admin/audit-logs` | Retrieve platform-wide audit trail logs |
| `GET` | `/api/v1/admin/dashboard-stats` | Fetch aggregate analytics data |

---

# 🗄 Database Schema

## ER Diagram

```mermaid
erDiagram

    User {
        String id PK
        Role role
        String name
        String email UK
        UserStatus status
        String password
        String googleId UK
        AuthProvider authProvider
        Boolean emailVerified
        Boolean needPasswordChange
        String imageUrl
        String imagePublicId
        DateTime createdAt
        DateTime updatedAt
        Boolean isDeleted
        DateTime deletedAt
    }

    UserDescription {
        String userId PK, FK
        String bio
        String cityId FK
        DateTime createdAt
        DateTime updatedAt
    }

    UserSocial {
        String id PK
        String userDescriptionId FK
        SocialPlatform platform
        String url
    }

    UserEducation {
        String id PK
        String userDescriptionId FK
        String institution
        String degree
        String fieldOfStudy
        DateTime startDate
        DateTime endDate
    }

    UserExperience {
        String id PK
        String userDescriptionId FK
        String company
        String position
        DateTime startDate
        DateTime endDate
        String description
    }

    UserWebsite {
        String id PK
        String userDescriptionId FK
        String title
        String url
    }

    UserSkill {
        String userDescriptionId PK, FK
        String skillId PK, FK
        ProficiencyLevel proficiencyLevel
    }

    Skill {
        String id PK
        String name UK
    }

    Country {
        String id PK
        String name UK
    }

    Division {
        String id PK
        String countryId FK
        String name
    }

    District {
        String id PK
        String divisionId FK
        String name
    }

    City {
        String id PK
        String districtId FK
        String name
    }

    Course {
        String id PK
        String title
        String slug UK
        String coverImageUrl
        Decimal price
        Int enrollmentCount
        String instructorId FK
        DateTime createdAt
        DateTime updatedAt
    }

    CourseDescription {
        String courseId PK, FK
        String shortDescription
        String fullDescription
        CourseLevel level
        Language language
    }

    CourseLearningOutcome {
        String id PK
        String courseDescriptionId FK
        String outcomeText
        Int displayOrder
    }

    CoursePrerequisite {
        String id PK
        String courseDescriptionId FK
        String prerequisiteText
        Int displayOrder
    }

    SuperModule {
        String id PK
        String courseId FK
        String title
        Int displayOrder
    }

    Module {
        String id PK
        String superModuleId FK
        String title
        Int displayOrder
    }

    Lesson {
        String id PK
        String moduleId FK
        String title
        LessonType lessonType
        Int displayOrder
        Boolean isPro
    }

    VideoLesson {
        String lessonId PK, FK
        String videoUrl
        Int durationSeconds
    }

    ArticleLesson {
        String lessonId PK, FK
    }

    ArticleSection {
        String id PK
        String articleLessonId FK
        Json content
        Int displayOrder
    }

    Assignment {
        String id PK
        String title
        String instructions
        DateTime dueDate
        String lessonId UK, FK
    }

    AssignmentSubmission {
        String id PK
        String assignmentId FK
        String userId FK
        Decimal scoreObtained
        String instructorFeedback
        String gradedByUserId FK
        DateTime submittedAt
        DateTime gradedAt
    }

    LessonProgress {
        String id PK
        String userId FK
        String lessonId FK
        Boolean isCompleted
        DateTime completedAt
    }

    CodingLesson {
        String id PK
        String lessonId UK, FK
        String problemStatement
        String inputFormat
        String outputFormat
        Int timeLimitMs
        Int memoryLimitKb
    }

    CodingTestCase {
        String id PK
        String codingLessonId FK
        String inputData
        String expectedOutput
        Boolean isHidden
        Int displayOrder
    }

    CodingAnswer {
        String id PK
        String userId FK
        String codingLessonId FK
        ProgrammingLanguage language
        String submittedCode
        SubmissionStatus status
        Int runtimeMs
        Int memoryUsedKb
        Int passedTestCasesCount
        DateTime submittedAt
    }

    QuizLesson {
        String id PK
        String lessonId UK, FK
    }

    QuizQuestion {
        String id PK
        String quizLessonId FK
        String questionText
        Int displayOrder
    }

    QuizOption {
        String id PK
        String questionId FK
        String optionText
        Boolean isCorrect
        Int displayOrder
    }

    QuizAttempt {
        String id PK
        String userId FK
        String quizLessonId FK
        Decimal score
        DateTime attemptedAt
    }

    QuizAttemptAnswer {
        String id PK
        String quizAttemptId FK
        String questionId FK
        String selectedOptionId FK
    }

    Enrollment {
        String id PK
        String userId FK
        String courseId FK
        Boolean isPaid
        DateTime enrolledAt
    }

    Payment {
        String id PK
        String userId FK
        String courseId FK
        PaymentStatus status
        Decimal amount
        String currency
        String paymentGateway
        String merchantInvoiceNumber UK
        String bkashPaymentId UK
        String bkashTrxId
        String sslSessionKey
        String sslValId
        String payerReference
        DateTime paidAt
        DateTime createdAt
        DateTime updatedAt
    }

    Certificate {
        String id PK
        String userId FK
        String courseId FK
        String certificateUid UK
        String certificateUrl
        String certificatePublicId
        DateTime issuedAt
    }

    Grade {
        String id PK
        String userId FK
        String courseId FK
        Decimal totalScore
        DateTime calculatedAt
    }

    DiscussionThread {
        String id PK
        String lessonId FK
        String userId FK
        String title
        String body
        Int commentCount
        Int reactionCount
        DateTime createdAt
        DateTime updatedAt
    }

    DiscussionComment {
        String id PK
        String threadId FK
        String userId FK
        String parentCommentId FK
        String body
        Int replyCount
        Int reactionCount
        Boolean isDeleted
        DateTime createdAt
        DateTime updatedAt
    }

    DiscussionThreadReaction {
        String id PK
        String userId FK
        String threadId FK
        ReactionType reactionType
        DateTime createdAt
    }

    DiscussionCommentReaction {
        String id PK
        String userId FK
        String commentId FK
        ReactionType reactionType
        DateTime createdAt
    }

    AuditLog {
        String id PK
        String actorId FK
        AuditAction action
        String entityType
        String entityId
        String description
        Json oldValues
        Json newValues
        Json metadata
        String ipAddress
        String userAgent
        String requestId
        DateTime createdAt
    }

    %% Relationships

    Country ||--o{ Division : "contains"
    Division ||--o{ District : "contains"
    District ||--o{ City : "contains"
    City ||--o{ UserDescription : "located in"

    User ||--o| UserDescription : "has"
    UserDescription ||--o{ UserSocial : "has"
    UserDescription ||--o{ UserEducation : "has"
    UserDescription ||--o{ UserExperience : "has"
    UserDescription ||--o{ UserWebsite : "has"
    UserDescription ||--o{ UserSkill : "has"
    Skill ||--o{ UserSkill : "belongs to"

    User ||--o{ Course : "instructs"
    Course ||--o| CourseDescription : "described by"
    CourseDescription ||--o{ CourseLearningOutcome : "includes"
    CourseDescription ||--o{ CoursePrerequisite : "requires"

    Course ||--o{ SuperModule : "has"
    SuperModule ||--o{ Module : "has"
    Module ||--o{ Lesson : "has"

    Lesson ||--o| VideoLesson : "content"
    Lesson ||--o| ArticleLesson : "content"
    ArticleLesson ||--o{ ArticleSection : "contains"
    Lesson ||--o| Assignment : "content"
    Lesson ||--o| CodingLesson : "content"
    Lesson ||--o| QuizLesson : "content"

    CodingLesson ||--o{ CodingTestCase : "has"
    CodingLesson ||--o{ CodingAnswer : "submitted for"
    User ||--o{ CodingAnswer : "submits"

    QuizLesson ||--o{ QuizQuestion : "has"
    QuizQuestion ||--o{ QuizOption : "has"
    QuizLesson ||--o{ QuizAttempt : "attempted via"
    User ||--o{ QuizAttempt : "attempts"
    QuizAttempt ||--o{ QuizAttemptAnswer : "contains"
    QuizQuestion ||--o{ QuizAttemptAnswer : "answers"
    QuizOption ||--o{ QuizAttemptAnswer : "selected in"

    Assignment ||--o{ AssignmentSubmission : "has"
    User ||--o{ AssignmentSubmission : "submits"
    User ||--o{ AssignmentSubmission : "grades"

    User ||--o{ LessonProgress : "tracks"
    Lesson ||--o{ LessonProgress : "tracked in"

    User ||--o{ Enrollment : "enrolls"
    Course ||--o{ Enrollment : "enrolled in"

    User ||--o{ Payment : "makes"
    Course ||--o{ Payment : "paid for"

    User ||--o{ Certificate : "awarded"
    Course ||--o{ Certificate : "earned from"

    User ||--o{ Grade : "receives"
    Course ||--o{ Grade : "evaluated in"

    Lesson ||--o{ DiscussionThread : "has"
    User ||--o{ DiscussionThread : "creates"
    DiscussionThread ||--o{ DiscussionComment : "contains"
    User ||--o{ DiscussionComment : "posts"
    DiscussionComment ||--o{ DiscussionComment : "replies to"

    User ||--o{ DiscussionThreadReaction : "reacts"
    DiscussionThread ||--o{ DiscussionThreadReaction : "receives"
    User ||--o{ DiscussionCommentReaction : "reacts"
    DiscussionComment ||--o{ DiscussionCommentReaction : "receives"

    User ||--o{ AuditLog : "triggers"

```

---

## Key Database Tables

* **User / UserDescription / UserSkill:** Authentication details, core profiles, social links, education, work experience, and proficiency levels.
* **Location Entities (Country, Division, District, City):** Hierarchical geographic system for user profiles.
* **Course / CourseDescription / SuperModule / Module / Lesson:** Core course hierarchy structuring all learning materials.
* **Lesson Content Entities (VideoLesson, ArticleLesson, CodingLesson, QuizLesson, Assignment):** Specific content details depending on lesson types.
* **Assessment & Grading (CodingAnswer, QuizAttempt, AssignmentSubmission, Grade):** Detailed storage for code executions, quiz attempts, submitted assignments, and overall course scores.
* **Enrollment, Payment & Certificate:** Handles financial transactions, active course access, and completion certification.
* **Discussions (DiscussionThread, DiscussionComment, Reactions):** Community interaction per lesson.
* **AuditLog:** Tracks system actions for security, compliance, and debugging.

---

## Entity Relationships Summary

| Source Entity | Target Entity | Relationship Type | Description |
| --- | --- | --- | --- |
| **User** | **Course** | One-to-Many `(1 : N)` | An instructor (User) can create and manage multiple courses. |
| **Course** | **SuperModule** | One-to-Many `(1 : N)` | A course contains multiple high-level SuperModules. |
| **SuperModule** | **Module** | One-to-Many `(1 : N)` | A SuperModule groups several granular modules. |
| **Module** | **Lesson** | One-to-Many `(1 : N)` | A module contains multiple learning lessons. |
| **Lesson** | **CodingLesson** | One-to-One `(1 : 0..1)` | A lesson can optionally be an interactive coding problem. |
| **Lesson** | **QuizLesson** | One-to-One `(1 : 0..1)` | A lesson can optionally be a dynamic quiz assessment. |
| **Lesson** | **Assignment** | One-to-One `(1 : 0..1)` | A lesson can optionally be a project assignment. |
| **User** | **CodingAnswer** | One-to-Many `(1 : N)` | A student submits multiple code evaluations over time. |
| **User** | **Enrollment** | One-to-Many `(1 : N)` | A student can enroll in multiple courses. |
| **User** | **Payment** | One-to-Many `(1 : N)` | A user generates payment transactions during course checkout. |
| **User** | **Certificate** | One-to-Many `(1 : N)` | A student receives certificates upon finishing courses. |
| **User** | **AuditLog** | One-to-Many `(1 : N)` | Platform actors record events in system audit logs. |

---

# 🧪 Standard API Error Response Format

```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": [
    {
      "field": "email",
      "message": "Invalid email address format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}

```

---

# ✅ Validation & Security

* **Data Sanitization:** Strict input validation on all request payloads using **Zod**.
* **Role Verification:** Route authorization guards enforcing exact access rights based on JWT token roles.
* **Transaction Safety:** Database operations involving money or user access strictly execute inside **Prisma Transactions**.

---

# 💳 Payment Gateways

Supported payment providers:

* **bKash:** Direct mobile banking checkout and webhook handling.
* **SSLCommerz:** Multi-card and local payment gateway support.
* **Stripe:** International card payments and subscription intents.

---

# 📦 Deployment

* **Backend Platform:** Render / Vercel Node.js Serverless Environment.
* **Database:** Cloud PostgreSQL Instance (Supabase / Neon / Render Postgres).

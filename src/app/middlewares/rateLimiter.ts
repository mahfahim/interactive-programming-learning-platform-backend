import rateLimit from "express-rate-limit";

// 1. General API rate limiter (Course, Lesson, Discussion, etc.)
export const globalRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Allow 100 requests per IP within 15 minutes
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many requests, please try again after 15 minutes",
		errors: [{ path: "", message: "Rate limit exceeded" }],
	},
});

// 2. Sensitive route rate limiter (Auth: Login, Register, Forgot Password)
export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10, // Allow only 10 attempts per IP to prevent brute-force attacks and spam
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message:
			"Too many authentication attempts. Please try again after 15 minutes",
		errors: [{ path: "", message: "Auth rate limit exceeded" }],
	},
});

// 3. Online judge / code execution rate limiter (Highly resource-intensive operations)
export const judgeRateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	limit: 5, // Allow a maximum of 5 code submissions per IP within 1 minute
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message:
			"Too many code execution requests. Please wait a minute before submitting again.",
		errors: [{ path: "", message: "Judge rate limit exceeded" }],
	},
});

// 4. Payment API rate limiter (Prevents spamming of bKash / SSLCommerz payment requests)
export const paymentRateLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 5, // Allow a maximum of 5 payment attempts per IP within 5 minutes
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many payment attempts. Please wait a few minutes.",
		errors: [{ path: "", message: "Payment rate limit exceeded" }],
	},
});

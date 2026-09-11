//src/config/index.ts
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	node_env: process.env.NODE_ENV,
	port: process.env.PORT as string,
	database_url: process.env.DATABASE_URL as string,
	direct_url: process.env.DIRECT_URL as string,
	frontend_url: process.env.FRONTEND_URL as string,
	backend_url: process.env.BACKEND_URL as string,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS as string,
	// jwt
	jwt_access_secret: process.env.JWT_SECRET! as string,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET! as string,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN! as string,
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN! as string,
	//google
	google_client_id: process.env.GOOGLE_CLIENT_ID!,
	// redis
	redis_user: process.env.REDIS_USER!,
	redis_password: process.env.REDIS_PASSWORD!,
	redis_host: process.env.REDIS_HOST!,
	redis_port: process.env.REDIS_PORT!,
	// smtp
	smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	email_sender: process.env.EMAIL_SENDER!,
	// cloudinary
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
	// bkash
	bkash_base_url: process.env.BKASH_BASE_URL!,
	bkash_username: process.env.BKASH_USERNAME!,
	bkash_password: process.env.BKASH_PASSWORD!,
	bkash_app_key: process.env.BKASH_APP_KEY!,
	bkash_app_secret: process.env.BKASH_APP_SECRET!,
	// SSLCommerz Credentials
	ssl_store_id: process.env.SSL_STORE_ID!,
	ssl_store_password: process.env.SSL_STORE_PASSWORD!,
	ssl_is_live: process.env.SSL_IS_LIVE === "true",
	ssl_payment_api: process.env.SSL_PAYMENT_API!,
	ssl_validation_api: process.env.SSL_VALIDATION_API!,
	// judge0
	judge0_api_url: process.env.JUDGE0_API_URL!,
	judge0_api_key: process.env.JUDGE0_KEY!,
	judge0_api_host: process.env.JUDGE0_HOST!,
};

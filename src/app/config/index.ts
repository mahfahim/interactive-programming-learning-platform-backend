//src/config/index.ts
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	node_env: process.env.NODE_ENV,
	port: process.env.PORT as string,
	database_url: process.env.DATABASE_URL as string,
	direct_url: process.env.DIRECT_URL as string,
	frontend_url: process.env.FRONTEND_URL as string,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS as string,
	jwt_access_secret: process.env.JWT_SECRET! as string,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET! as string,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN! as string,
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN! as string,
	google_client_id: process.env.GOOGLE_CLIENT_ID!,
	redis_user: process.env.REDIS_USER!,
	redis_password: process.env.REDIS_PASSWORD!,
	redis_host: process.env.REDIS_HOST!,
	redis_port: process.env.REDIS_PORT!,
	smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	email_sender: process.env.EMAIL_SENDER!,
	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
};

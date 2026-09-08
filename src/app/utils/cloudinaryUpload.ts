import { Readable } from "node:stream";
import { cloudinary } from "../lib/cloudinary";

export const uploadToCloudinary = (
	file: Express.Multer.File,
	folder = "assignments",
): Promise<string> => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder, resource_type: "auto" },
			(error, result) => {
				if (error) return reject(error);
				if (result) resolve(result.secure_url);
			},
		);
		Readable.from(file.buffer).pipe(stream);
	});
};

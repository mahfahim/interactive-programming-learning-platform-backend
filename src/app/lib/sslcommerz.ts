import httpStatus from "http-status";
import config from "../config";
import { AppError } from "../utils/AppError";

interface SSLInitPaymentPayload {
	amount: number;
	transactionId: string;
	customerName: string;
	customerEmail: string;
	customerPhone?: string;
	productName: string;
}

// SSLCommerz payment intiate helper
export const initiateSslPayment = async (payload: SSLInitPaymentPayload) => {
	const formData = new URLSearchParams();
	formData.append("store_id", config.ssl_store_id);
	formData.append("store_passwd", config.ssl_store_password);
	formData.append("total_amount", String(payload.amount));
	formData.append("currency", "BDT");
	formData.append("tran_id", payload.transactionId);
	formData.append(
		"success_url",
		`${config.backend_url}/api/v1/enrollments/ssl-success`,
	);
	formData.append(
		"fail_url",
		`${config.backend_url}/api/v1/enrollments/ssl-fail`,
	);
	formData.append(
		"cancel_url",
		`${config.backend_url}/api/v1/enrollments/ssl-cancel`,
	);
	formData.append(
		"ipn_url",
		`${config.backend_url}/api/v1/enrollments/ssl-ipn`,
	);
	formData.append("cus_name", payload.customerName);
	formData.append("cus_email", payload.customerEmail);
	formData.append("cus_add1", "Dhaka");
	formData.append("cus_city", "Dhaka");
	formData.append("cus_postcode", "1200");
	formData.append("cus_country", "Bangladesh");
	formData.append("cus_phone", payload.customerPhone || "01700000000");
	formData.append("shipping_method", "NO");
	formData.append("product_name", payload.productName);
	formData.append("product_category", "Education");
	formData.append("product_profile", "non-physical-goods");

	const sslResponse = await fetch(config.ssl_payment_api, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: formData.toString(),
	});

	const sslResult = await sslResponse.json();

	if (sslResult.status !== "SUCCESS") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			sslResult.failedreason || "SSLCommerz Payment Initiation Failed",
		);
	}

	return sslResult;
};

// SSLCommerz validation check helper
export const validateSslPayment = async (val_id: string) => {
	const validationUrl = `${config.ssl_validation_api}?val_id=${val_id}&store_id=${config.ssl_store_id}&store_passwd=${config.ssl_store_password}&v=1&format=json`;

	const validationResponse = await fetch(validationUrl);
	return await validationResponse.json();
};

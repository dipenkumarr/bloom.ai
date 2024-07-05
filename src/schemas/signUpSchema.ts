import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(2, "Username must be at least 2 characters")
	.max(20, "Username must be no more than 20 characters")
	.regex(
		/(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/gm,
		"Username must not contain special characters"
	);

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.string().email({ message: "Please use a valid email address" }),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
			"Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number"
		),
});

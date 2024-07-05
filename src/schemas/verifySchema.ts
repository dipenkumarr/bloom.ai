import { z } from "zod";

export const verifySchema = z.object({
	verifyCode: z.string().min(6, "Verification code must be 6 digits"),
});

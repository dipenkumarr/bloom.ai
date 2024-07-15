import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";

// const VerifyCodeSchema = z.object({
// 	verifyCode: verifySchema,
// });

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username } = await request.json();
		const decodeUsername = decodeURIComponent(username);

		// validating verify code with zod if it follows the VerifyCodeSchema
		// const result = VerifyCodeSchema.safeParse(code);
		// if (!result.success) {
		// 	const codeError = result.error.format().verifyCode?._errors || [];
		// 	return Response.json(
		// 		{
		// 			success: false,
		// 			message:
		// 				codeError?.length > 0
		// 					? codeError.join(", ")
		// 					: "Invalid verification code",
		// 		},
		// 		{ status: 400 }
		// 	);
		// }

		const user = await UserModel.findOne({ username: decodeUsername });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			);
		}

		user.isVerified = true;
		console.log(user);
		await user.save();

		return Response.json(
			{
				success: true,
				message: "User account verified successfully!",
			},
			{ status: 200 }
		);
		// const isCodeValid = user.verifyCode === code;
		// const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

		// if (isCodeValid && isCodeExpired) {
		// 	user.isVerified = true;
		// await user.save();

		// return Response.json(
		// 	{
		// 		success: true,
		// 		message: "User account verified successfully!",
		// 	},
		// 	{ status: 200 }
		// );
		// } else if (!isCodeExpired) {
		// 	return Response.json(
		// 		{
		// 			success: false,
		// 			message: "Verification code expired! Please signup again",
		// 		},
		// 		{ status: 400 }
		// 	);
		// } else {
		// 	return Response.json(
		// 		{
		// 			success: false,
		// 			message: "Incorrect verification code!",
		// 		},
		// 		{ status: 400 }
		// 	);
		// }
	} catch (error) {
		console.log("Error verifying user", error);
		return Response.json(
			{
				success: false,
				message: "Error verifying user",
			},
			{ status: 500 }
		);
	}
}

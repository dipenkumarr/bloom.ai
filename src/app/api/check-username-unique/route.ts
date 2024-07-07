import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: Request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);
		const queryParam = {
			username: searchParams.get("username"),
		};

		// validating username with zod if it follows the usernameValidation schema
		const result = UsernameQuerySchema.safeParse(queryParam);

		console.log(result);

		if (!result.success) {
			const usernameError = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					message:
						usernameError?.length > 0
							? usernameError.join(", ")
							: "Invalid username",
				},
				{ status: 400 }
			);
		}

		const { username } = result.data;
		const exisistingVerifiedUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (exisistingVerifiedUser) {
			return Response.json(
				{
					success: false,
					message: "Username is already taken",
				},
				{ status: 400 }
			);
		} else {
			return Response.json(
				{
					success: true,
					message: "Username is available",
				},
				{ status: 200 }
			);
		}
	} catch (error) {
		console.log("Error checking username", error);
		return Response.json(
			{
				success: false,
				message: "Error checking username",
			},
			{ status: 500 }
		);
	}
}

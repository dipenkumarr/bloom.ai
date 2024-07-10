"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debouced = useDebounceCallback(setUsername, 300);
	const { toast } = useToast();
	const router = useRouter();

	// zod implementaion
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage("");

				try {
					const response = await axios.get(
						`/api/check-username-unique?username=${username}`
					);
					setUsernameMessage(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ??
							"An error occurred in checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};

		checkUsernameUnique();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmitting(true);

		try {
			const response = await axios.post<ApiResponse>("/api/signup", data);
			toast({
				title: "Success",
				description: response.data.message,
			});
			router.push(`/verify/${username}`);

			setIsSubmitting(false);
		} catch (error) {
			console.error("Error in signup of user", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage =
				axiosError.response?.data.message ??
				"There was a problem with your sign-up. Please try again.";
			toast({
				title: "Signup failed",
				description: errorMessage,
				variant: "destructive",
			});

			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md lg:max-w-lg p-12 space-y-8 bg-white rounded-3xl shadow-lg">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join{" "}
						<span className="bg-gradient-to-r from-stone-500 to-stone-700 bg-clip-text text-transparent">
							bloom.ai
						</span>
					</h1>
					<p className="mb-4 text-base font-medium">
						Sign up to get started!
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Username"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debouced(e.target.value);
											}}
										/>
									</FormControl>
									{/* {isCheckingUsername && (
										<Loader2 className="animate-spin" />
									)} */}
									{username ? (
										<p
											className={`text-sm ${
												usernameMessage ===
												"Username is available"
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{usernameMessage}
										</p>
									) : (
										""
									)}
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
									Please wait
								</>
							) : (
								"Sign up"
							)}
						</Button>
					</form>
				</Form>

				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link
							href="/signin"
							className="text-blue-600 hover:text-blue-800"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default page;

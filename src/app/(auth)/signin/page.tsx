"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { escape } from "querystring";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

const SignInPage = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { toast } = useToast();
	const router = useRouter();

	// zod implementaion
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setIsSubmitting(true);
		const result = await signIn("credentials", {
			redirect: false,
			identifier: data.identifier,
			password: data.password,
		});

		if (result?.error) {
			if (result.error == "CredentialsSignin") {
				toast({
					title: "Login Failed",
					description: "Incorrect email or password",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			}
		}

		if (result?.url) {
			router.replace("/dashboard");
		}

		setIsSubmitting(false);
	};

	return (
		<div className="flex justify-center items-center w-full ">
			<div className="w-full max-w-md lg:max-w-lg p-12 space-y-8 bg-white rounded-3xl drop-shadow-2xl">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join{" "}
						<span className="bg-gradient-to-r from-stone-500 to-stone-700 bg-clip-text text-transparent">
							bloom.ai
						</span>
					</h1>
					<p className="mb-4 text-lg font-medium">
						Sign in to get started!
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							name="identifier"
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
								"Sign in"
							)}
						</Button>
					</form>
				</Form>

				<div className="text-center mt-4">
					<p>
						Not a member?{" "}
						<Link
							href="/signup"
							className="text-blue-600 hover:text-blue-800"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;

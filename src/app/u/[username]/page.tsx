"use client";

import { useToast } from "@/components/ui/use-toast";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCompletion } from "ai/react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const initialFeedbacks =
	"How can I improve my public speaking skills? I get nervous during presentations.||What's one thing I could do to be a better team player at work?||I'm considering a career change. What questions should I be asking myself?";

const parseFeedbacks = (messageString: string): string[] => {
	return messageString.split("||");
};

const MessagePage = () => {
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);

	const { toast } = useToast();
	const params = useParams<{ username: string }>();

	const { completion, isLoading, error, complete } = useCompletion({
		api: "/api/suggest-messages",
		initialCompletion: initialFeedbacks,
	});

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
		},
	});

	// const { watch, setValue } = form;
	// const acceptMessages = watch("acceptMessages");

	const fetchIsAcceptingMessages = useCallback(async () => {
		try {
			const response = await axios.get<ApiResponse>(
				"/api/accept-messages"
			);
			setIsAcceptingMessage(response.data.isAcceptingMessage || false);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Failed to fetch if user is accepting messages settings",
				variant: "destructive",
			});
		}
	}, [toast, isSendingMessage, isAcceptingMessage]);

	useEffect(() => {
		fetchIsAcceptingMessages();
	}, [toast, fetchIsAcceptingMessages, isAcceptingMessage]);

	const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
		setIsSendingMessage(true);

		try {
			const response = await axios.post<ApiResponse>(
				"/api/send-message",
				{
					username: params.username,
					content: data.content,
				}
			);

			toast({
				title: "Success",
				description: response.data.message,
			});

			form.reset({ ...form.getValues(), content: "" });

			setIsSendingMessage(false);
		} catch (error) {
			console.error("Error in sending message", error);
			const axiosError = error as AxiosError<ApiResponse>;

			toast({
				title:
					axiosError.response?.data.message ??
					"There was a problem with sending your message. Please try again.",
				variant: "destructive",
			});

			setIsSendingMessage(false);
		}
	};

	useEffect(() => {
		if (error) {
			toast({
				title: "Error",
				description: error.message,
			});
		}
	}, [error]);

	const fetchSuggestedMessages = async () => {
		try {
			// Add a random element to the prompt
			// const randomPrompt = `${prompt}\n\nRandom seed: ${Math.random()}`;
			console.log("Fetching new suggestions...");
			const result = await complete("");
			console.log("API response:", result);
			// You might want to update state here if the completion state isn't updating automatically
		} catch (error) {
			console.error("Error fetching messages:", error);
			toast({
				title: "Error",
				description:
					"Failed to fetch suggested messages. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 mt-16 rounded w-full max-w-6xl">
			<h1 className="text-4xl font-bold mb-8">Public Profile Link</h1>

			<Separator />

			<div className="mt-6 mb-4">
				<h2 className="text-xl font-semibold mb-4">
					Send Anonymous Message to - @{params.username}
				</h2>{" "}
				<div className="flex items-center text-base">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSendMessage)}
							className="w-full space-y-6"
						>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg">
											Message
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Write an anonymous feedback!"
												className="resize-none text-base"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="hover:bg-gray-600">
								Submit
							</Button>
						</form>
					</Form>
				</div>
			</div>

			<Separator className="my-20" />

			<div>
				<div>
					<Button
						onClick={() => fetchSuggestedMessages()}
						disabled={isLoading}
					>
						Suggest Messages
					</Button>
				</div>
				<div className="my-6">
					{/* {parseFeedbacks(completion).map((message, index) => {
						return (
							<button
								key={index}
								onClick={() =>
									form.reset({
										...form.getValues(),
										content: message,
									})
								}
								className="my-4 w-full p-3 text-lg font-medium border-2 border-solid border-slate-900 rounded-2xl"
							>
								<p>{message}</p>
							</button>
						);
					})} */}
					<Card>
						<CardHeader>
							<h3 className="text-2xl font-semibold">Messages</h3>
						</CardHeader>
						<CardContent className="flex flex-col space-y-4">
							{error ? (
								<p className="text-red-500">{error.message}</p>
							) : (
								parseFeedbacks(completion).map(
									(message, index) => (
										<Button
											key={index}
											variant="outline"
											className="text-base p-2 rounded-xl mt-2"
											onClick={() =>
												form.reset({
													...form.getValues(),
													content: message,
												})
											}
										>
											{message}
										</Button>
									)
								)
							)}
						</CardContent>
					</Card>

					<Separator className="my-20" />

					<div className="text-center">
						<div className="mb-4">Get Your Account!</div>
						<Link href={"/signup"}>
							<Button>Create Your Account</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessagePage;

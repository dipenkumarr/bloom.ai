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

	// const fetchIsAcceptingMessages = useCallback(async () => {
	// 	try {
	// 		const response = await axios.get<ApiResponse>(
	// 			"/api/accept-messages"
	// 		);
	// 		setIsAcceptingMessage(response.data.isAcceptingMessage || false);
	// 	} catch (error) {
	// 		const axiosError = error as AxiosError<ApiResponse>;
	// 		toast({
	// 			title: "Error",
	// 			description:
	// 				axiosError.response?.data.message ??
	// 				"Failed to fetch if user is accepting messages settings",
	// 			variant: "destructive",
	// 		});
	// 	}
	// }, [toast, isSendingMessage, isAcceptingMessage]);

	// useEffect(() => {
	// 	fetchIsAcceptingMessages();
	// }, [toast, fetchIsAcceptingMessages, isAcceptingMessage]);

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
		<>
			<div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>

			<div className="my-4 mx-2 md:my-8 md:mx-4 lg:mx-auto p-4 md:p-6 mt-8 md:mt-16 rounded w-full max-w-6xl">
				<h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">
					🔗 Public Profile Link
				</h1>

				<Separator />

				<div className="mt-4 md:mt-6 mb-4">
					<h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
						Send Anonymous Message to - @{params.username}
					</h2>
					<div className="flex flex-col items-start text-sm md:text-base">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleSendMessage)}
								className="w-full space-y-4 md:space-y-6"
							>
								<FormField
									control={form.control}
									name="content"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base md:text-lg">
												Message
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Write an anonymous feedback!"
													className="resize-y text-sm md:text-lg min-h-32 max-h-96"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full md:w-auto hover:bg-gray-600"
								>
									Submit
								</Button>
							</form>
						</Form>
					</div>
				</div>

				<Separator className="my-8 md:my-20" />

				<div>
					<Button
						onClick={() => fetchSuggestedMessages()}
						disabled={isLoading}
						className="w-full md:w-auto mb-4"
					>
						Suggest Messages
					</Button>
					<div className="my-4 md:my-6">
						<Card>
							<CardHeader>
								<h3 className="text-xl md:text-2xl font-semibold">
									Messages
								</h3>
							</CardHeader>
							<CardContent className="flex flex-col space-y-2 md:space-y-4">
								{error ? (
									<p className="text-red-500 text-sm md:text-base">
										{error.message}
									</p>
								) : (
									parseFeedbacks(completion).map(
										(message, index) => (
											<Button
												key={index}
												variant="outline"
												className="text-xs text-wrap md:text-base p-2 rounded-xl mt-2 w-full text-left"
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

						<Separator className="my-8 md:my-20" />

						<div className="text-center">
							<div className="mb-4 text-sm md:text-base">
								Get Your Account!
							</div>
							<Link target="_blank" href={"/signup"}>
								<Button className="w-full md:w-auto">
									Create Your Account
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MessagePage;

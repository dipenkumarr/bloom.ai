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

const MessagePage = () => {
	const [messageContent, setMessageContent] = useState("");
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);

	const { toast } = useToast();
	const params = useParams<{ username: string }>();

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

			console.log(response);

			toast({
				title: "Success",
				description: response.data.message,
			});
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

	return (
		<div className="flex flex-col justify-center items-center my-8 mx-4 md:mx-8 lg:mx-auto p-6 w-full">
			<h1 className="text-4xl font-bold mb-8">Public Profile Link</h1>

			<div>
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
									<FormLabel>Message</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Send an anonymous feedback!"
											className="resize-none"
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
	);
};

export default MessagePage;

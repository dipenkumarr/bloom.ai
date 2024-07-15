"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Copy, Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import MessageCard from "@/components/MessageCard";

function UserDashboard() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);

	const { toast } = useToast();

	const handleDeleteMessage = (messageId: string) => {
		setMessages(messages.filter((message) => message._id !== messageId));
	};

	const { data: session } = useSession();

	const form = useForm({
		resolver: zodResolver(acceptMessagesSchema),
	});

	const { register, watch, setValue } = form;
	const acceptMessages = watch("acceptMessages");

	const fetchAcceptMessages = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>(
				"/api/accept-messages"
			);
			setValue("acceptMessages", response.data.isAcceptingMessage);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Failed to fetch message settings",
				variant: "destructive",
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, [setValue, toast]);

	const fetchMessages = useCallback(
		async (refresh: boolean = false) => {
			setIsLoading(true);
			setIsSwitchLoading(false);
			try {
				const response = await axios.get<ApiResponse>(
					"/api/get-messages"
				);
				setMessages(response.data.messages || []);
				if (refresh) {
					toast({
						title: "Refreshed Messages",
						description: "Showing latest messages",
					});
				}
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				toast({
					title: "Error",
					description:
						axiosError.response?.data.message ??
						"Failed to fetch messages",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
				setIsSwitchLoading(false);
			}
		},
		[setIsLoading, setMessages, toast]
	);

	// Fetch initial state from the server
	useEffect(() => {
		if (!session || !session.user) return;

		fetchMessages();

		fetchAcceptMessages();
	}, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

	// Handle switch change
	const handleSwitchChange = async () => {
		try {
			const response = await axios.post<ApiResponse>(
				"/api/accept-messages",
				{
					acceptMessages: !acceptMessages,
				}
			);
			setValue("acceptMessages", !acceptMessages);
			toast({
				title: response.data.message,
				variant: "default",
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Failed to update message settings",
				variant: "destructive",
			});
		}
	};

	if (!session || !session.user) {
		return <div></div>;
	}

	const { username } = session.user as User;

	const baseUrl = `${window.location.protocol}//${window.location.host}`;
	const profileUrl = `${baseUrl}/u/${username}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(profileUrl);
		toast({
			title: "URL Copied!",
			description: "Profile URL has been copied to clipboard.",
		});
	};

	return (
		<>
			<div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
				<div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_50%_600px,#DDF2FF,transparent)]"></div>
			</div>

			<div className="my-2 mx-2 sm:my-6 sm:mx-4 md:my-16 md:mx-8 lg:mx-auto p-4 sm:p-6 rounded w-full max-w-6xl">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">
					User Dashboard
				</h1>

				<div className="mb-4 sm:mb-6">
					<h2 className="text-base sm:text-lg font-semibold mb-2">
						Copy Your Unique Link
					</h2>
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
						<input
							type="text"
							value={profileUrl}
							disabled
							className="input input-bordered w-full p-2 sm:p-3 rounded-xl bg-white border-2 border-black text-sm sm:text-base"
						/>
						<Button
							onClick={copyToClipboard}
							className="rounded-xl px-4 py-2 sm:py-3 w-full sm:w-auto"
						>
							<Copy className="h-4 w-4 sm:h-5 sm:w-5" />
						</Button>
					</div>
				</div>

				<div className="mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-4 p-2">
					<Switch
						{...register("acceptMessages")}
						checked={acceptMessages}
						onCheckedChange={handleSwitchChange}
						disabled={isSwitchLoading}
					/>
					<span className="text-base">
						Accept Messages: {acceptMessages ? "On" : "Off"}
					</span>
				</div>
				<Separator />

				<Button
					className="mt-4 w-full sm:w-auto"
					variant="outline"
					onClick={(e) => {
						e.preventDefault();
						fetchMessages(true);
					}}
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<RefreshCcw className="h-4 w-4" />
					)}
				</Button>
				<div className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 sm:gap-6">
					{messages.length > 0 ? (
						messages.map((message) => (
							<MessageCard
								key={message._id as string}
								message={message}
								onMessageDelete={handleDeleteMessage}
							/>
						))
					) : (
						<p className="text-base sm:text-lg">
							No messages to display. 😔
						</p>
					)}
				</div>

				<Separator className="my-12" />
			</div>
		</>
	);
}

export default UserDashboard;

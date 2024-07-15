"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from "dayjs";

type MessageCardProps = {
	message: Message;
	onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
	const { toast } = useToast();

	const handleDeleteConfirm = async () => {
		try {
			const messageId = message._id as string; // Type assertion
			const response = await axios.delete<ApiResponse>(
				`/api/delete-message/${message._id}`
			);
			toast({
				title: response.data.message,
			});
			onMessageDelete(messageId);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast({
				title: "Error",
				description:
					axiosError.response?.data.message ??
					"Failed to delete message",
				variant: "destructive",
			});
		}
	};

	return (
		<div>
			<Card className="card-bordered">
				<CardContent className="mt-4">{message.content}</CardContent>
				<CardFooter className="flex justify-between -mt-4 -mb-4">
					<div className="flex text-sm">
						{dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
					</div>
					<div>
						{/* <CardTitle>{message.content}</CardTitle> */}
						{/* <CardContent>{message.content}</CardContent> */}
						<AlertDialog>
							<AlertDialogTrigger asChild>
								{/* <Button variant="destructive">
									<X className="w-4 h-4" />
								</Button> */}
								<button className="md:hover:bg-black md:hover:text-red-300 duration-200 md:p-1 rounded-full text-red-800">
									<X />
								</button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Are you absolutely sure?
									</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will
										permanently delete this message.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDeleteConfirm}
									>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default MessageCard;

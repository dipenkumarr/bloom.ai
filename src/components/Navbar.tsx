"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

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

const Navbar = () => {
	const { data: session } = useSession();

	const user: User = session?.user;

	return (
		<nav className="p-4 md:p-6 drop-shadow-2xl bg-transparent text-gray-900 rounded-full mb-8">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
				<div className="text-4xl font-bold mb-4 md:mb-0 bg-gradient-to-r from-stone-500 to-stone-700 bg-clip-text text-transparent">
					bloom.ai
				</div>
				<div className="flex items-center space-x-6">
					{session ? (
						<>
							<span className="text-xl font-medium">
								Hello, {user?.username || user?.email} 👋
							</span>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										className="bg-gray-900 text-white rounded-full text-base ease-in-out duration-200 px-6 py-4 hover:bg-gray-600"
										variant="default"
									>
										Logout
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure you want to logout?
										</AlertDialogTitle>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											formTarget="/"
											onClick={() => signOut()}
										>
											Continue
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>

							{/* <Button
								onClick={() => signOut()}
								className="bg-gray-900 text-white rounded-full text-base duration-200 border-2 border-solid px-6 py-4 border-black hover:bg-white hover:text-black"
								variant="default"
							>
								Logout
							</Button> */}
						</>
					) : (
						<>
							<Link href="/">
								<Button
									className="bg-gray-900 text-white rounded-full text-base ease-in-out duration-200 px-6 py-4 hover:bg-gray-600"
									variant="default"
								>
									Home
								</Button>
							</Link>

							<Link href="/signin">
								<Button
									className="bg-gray-900 text-white rounded-full text-base ease-in-out duration-200 px-6 py-4 hover:bg-gray-600"
									variant="default"
								>
									Sign in
								</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

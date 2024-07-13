"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
	const { data: session } = useSession();

	const user: User = session?.user;

	return (
		<nav className="p-4 md:p-6 drop-shadow-2xl bg-white/70 text-gray-900 rounded-full mb-8">
			<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
				<div className="text-4xl font-bold mb-4 md:mb-0">bloom.ai</div>
				<div className="flex items-center space-x-8">
					{session ? (
						<>
							<span className="text-lg font-normal">
								Hello, {user?.username || user?.email}
							</span>
							<Button
								onClick={() => signOut()}
								className="bg-gray-900 text-white rounded-full text-base duration-200 border-2 border-solid px-6 py-4 border-black hover:bg-white hover:text-black"
								variant="default"
							>
								Logout
							</Button>
						</>
					) : (
						<Link href="/signin">
							<Button
								className="bg-gray-900 text-white rounded-full text-base duration-200 border-2 border-solid px-6 py-4 border-black hover:bg-white hover:text-black"
								variant="default"
							>
								Sign in
							</Button>
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

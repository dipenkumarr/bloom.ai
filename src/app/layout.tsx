import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const space_grotesk = Space_Grotesk({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "bloom.ai",
	description: "Real feedback from real people.",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className={space_grotesk.className}>
					{children}
					<Toaster />
				</body>
			</AuthProvider>
		</html>
	);
}

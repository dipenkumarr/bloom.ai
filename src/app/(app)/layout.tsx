import Navbar from "@/components/Navbar";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<div className="relative flex flex-col h-screen justify-between">
			<main className="flex-1">
				<Navbar />
				{children}
			</main>
		</div>
	);
}

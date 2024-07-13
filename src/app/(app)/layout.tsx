import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<div className="flex flex-col h-screen justify-between">
			<main className="flex-1">{children}</main>
		</div>
	);
}

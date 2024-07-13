import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
	return (
		<div className="flex flex-col h-screen justify-between">
			<Navbar />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}

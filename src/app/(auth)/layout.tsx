import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<div className="flex flex-col h-screen">
			<Navbar />
			<div className="flex-1 flex items-center justify-center w-full p-4">
				{children}
			</div>
		</div>
	);
}

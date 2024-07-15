"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";

export default function Home() {
	return (
		<>
			{/* <div className="absolute top-0 -z-10 h-full w-full bg-white">
				<div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
			</div> */}
			{/* <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
				<div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_1000px_at_50%_800px,#C9EBFF,transparent)]"></div>
			</div> */}

			<div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
			<Navbar />
			{/* Main content */}
			<main
				className={`flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-gray-900  `}
			>
				<section className="text-center mb-8 md:mb-12">
					<h1 className="text-4xl md:text-5xl font-bold">
						Bloom.ai - Anonymous Feedback
					</h1>
					<p className="mt-3 md:mt-4 text-lg md:text-xl">
						Make Feedback Matter. Improve Together with Bloom.ai.
					</p>
				</section>

				{/* Carousel for Messages */}
				<Carousel
					plugins={[Autoplay({ delay: 3000 })]}
					className="w-full max-w-lg md:max-w-xl"
				>
					<CarouselContent>
						{messages.map((message, index) => (
							<CarouselItem key={index} className="p-4">
								<Card className="rounded-2xl shadow-lg">
									<CardHeader>
										<CardTitle>{message.title}</CardTitle>
									</CardHeader>
									<CardContent className="flex flex-col rounded-xl md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
										<Mail className="flex-shrink-0" />
										<div>
											<p>{message.content}</p>
											<p className="text-xs text-muted-foreground mt-2">
												{message.received}
											</p>
										</div>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</main>

			{/* <footer className="text-center p-4 shadow-2xl md:p-6 bg-slate-900 text-white">
				© 2023 bloom.ai. All rights reserved.
			</footer> */}
		</>
	);
}

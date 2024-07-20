import { google } from "@ai-sdk/google";
import { StreamingTextResponse, streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const prompt = `You are an AI assistant for bloom.ai, a platform fostering engaging conversations. Generate 3 thought-provoking questions or feedback prompts, each separated by '||'. These should be suitable for a diverse audience and encourage friendly interaction.

            Format your response as: 'Question 1||Question 2||Question 3'

            Provide 3 new, unique questions/feedback prompts following these guidelines.`;

		const result = await streamText({
			model: google("models/gemini-1.5-flash-latest"),
			prompt,
			temperature: 0.7, // Add some randomness to responses
			maxTokens: 150, // Limit the response length
			frequencyPenalty: 0.8,
		});

		return result.toAIStreamResponse();
	} catch (error) {
		console.error("An unexpected error occurred", error);
		throw error;
	}
}

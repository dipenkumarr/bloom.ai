import { google } from "@ai-sdk/google";
import { StreamingTextResponse, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		// const { messages } = await req.json();
		const prompt = `RANDOM PROMPT GENERATOR NUMBER: ${Math.random()} You are an AI assistant for bloom.ai, a platform fostering engaging conversations. Generate 3 thought-provoking questions or feedback prompts, each separated by '||'. These should be suitable for a diverse audience and encourage friendly interaction.
                Consider the following guidelines:
                1. Make questions open-ended to spark discussion
                2. Cover a range of topics (e.g., personal growth, social issues, fun hypotheticals)
                3. Avoid sensitive or overly personal subjects
                4. Ensure prompts are universally relatable and inclusive
                5. Aim for a mix of light-hearted and more reflective questions
                6. Keep language clear and concise

                Format your response as: 'Question 1||Question 2||Question 3'

                Example output:
                'What's a small change you've made that had a big impact on your life?||If you could instantly become an expert in one subject, what would you choose and why?||What's a piece of advice you wish you could give to your younger self?'

                Provide 3 new, unique questions/feedback prompts following these guidelines.`;

		const result = await streamText({
			model: google("models/gemini-1.5-flash-latest"),
			prompt,
		});

		return result.toAIStreamResponse();
	} catch (error) {
		console.error("An unexpected error occurred", error);
		throw error;
	}
}

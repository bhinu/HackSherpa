import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    // Keep conversation context manageable
    const messagesTruncated = messages.slice(-6);

    // TODO: substitute with actual project information
    // Structure project information
    const projectsContext = [
      "TechTrends: AI-powered tech news discovery platform using Python, ChromeDB, Pinecone, Google Gemini, and GPT-4. Features personalized content recommendations and like/dislike feedback system.",
      "MadVision: Browser-based drawing application using HTML, CSS, JavaScript, and Python. Features touchless drawing interface with finger tracking and multi-touch gesture support.",
    ];

    // Create the prompt with context
    const contextPrompt = `You are an intelligent helper. Here is information about available projects:\n${projectsContext.join(
      "\n"
    )}\n\nPlease help with the following questions based on this context:\n${messagesTruncated
      .map((m) => m.content)
      .join("\n")}`;

    // Stream the response
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content:
            "You are an intellegent project advisor. You answer user's questions based on the context of some good sample projects." +
            "The good sample projects are:\n" +
            projectsContext.join("\n"),
        },
        {
          role: "user",
          content: messagesTruncated.map((m) => m.content).join("\n"),
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.error("Error processing request:", e);
    return new Response("Error processing request", { status: 500 });
  }
}


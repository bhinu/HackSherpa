// /app/api/stream-chat/route.ts
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { populate } from "@/lib/populate";
import { getEmbedding } from "@/lib/openai";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    // Uncomment this if you need to re-populate your data set
    // await populate();
    const supabase = await createClient();
    
    const body = await req.json();
    console.log("Request body:", body);
    
    const messages: ChatCompletionMessage[] = body.messages;
    const userTitle = body.data.projectDetails.title;
    const userDescription = body.data.projectDetails.description;
    console.log("User title:", userTitle);
    console.log("User description:", userDescription);

    // Limit conversation context
    const messagesTruncated = messages.slice(-6);

    // Build the search text and get its embedding
    const searchText = userTitle + " " + userDescription;
    const embedding = await getEmbedding(searchText);
    console.log("Embedding:", embedding);

    // Fetch matching documents via Supabase RPC
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: 4,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return new Response("Error processing request", { status: 500 });
    }

    console.log("Documents:", documents);

    // Create context from the fetched documents
    const projectsContext = documents.map((doc: any) => {
      return `${doc.primary_category} ${doc.secondary_category} ${doc.summary}`;
    });
    console.log("Projects context:", projectsContext);

    // Stream a chat response using OpenAI's streamText functionality
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content:
            "You are an intelligent project advisor. You answer user's questions based on the context of some good sample projects." +
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

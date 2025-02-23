import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { populate } from "@/lib/populate";
import { getEmbedding } from "@/lib/openai";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    // Uncomment this only if you update the data set and wanna re-populate the embeddings
    // await populate();
    const supabase = await createClient();
    
    const body = await req.json();
    console.log("Request body:", body);
    const messages: ChatCompletionMessage[] = body.messages;
    const userTitle = body.data.projectDetails.title;
    const userDescription = body.data.projectDetails.description;
    console.log("User title:", userTitle);
    console.log("User description:", userDescription);

    // Keep conversation context manageable
    const messagesTruncated = messages.slice(-6);

    // TODO: substitute with actual project information
    const searchText = userTitle + " " + userDescription;
    const embedding = await getEmbedding(searchText);
    console.log("Embedding:", embedding);

    const {data: documents}  = await supabase.rpc('match_documents',{
      query_embedding: embedding,
      match_count: 4
    })

    console.log("Documents:", documents);

    // Structure project information
    const projectsContext = documents.map((doc: any) => {
      return `${doc.primary_category} ${doc.secondary_category} ${doc.summary}`;
    })

    console.log("Projects context:", projectsContext);

    // Create the prompt with context

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


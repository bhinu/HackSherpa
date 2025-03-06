// /app/api/recommendations/route.ts

import { getEmbedding } from "@/lib/openai";
import { createClient } from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    console.log("Request body:", body);
    
    const userTitle = body.data.projectDetails.title;
    const userDescription = body.data.projectDetails.description;
    console.log("User title:", userTitle);
    console.log("User description:", userDescription);

    // Create a search string for the embedding
    const searchText = userTitle + " " + userDescription;
    const embedding = await getEmbedding(searchText);
    console.log("Embedding:", embedding);

    // Fetch matching documents via Supabase RPC
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_count: 8,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return new Response("Error processing request", { status: 500 });
    }

    console.log("Documents:", documents);
    // Return the matching documents as JSON
    return new Response(JSON.stringify(documents), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error processing request:", e);
    return new Response("Error processing request", { status: 500 });
  }
}

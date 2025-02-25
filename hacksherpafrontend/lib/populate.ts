import { createClient } from "@/utils/supabase/client";
import { getEmbedding } from "./openai";

export async function populate() {
  const supabase = await createClient();

  console.log("Checking database connection...");

  const { data: db, error } = await supabase
    .from("db")
    .select("id, primary_category, secondary_category, summary, vec");
  
  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (db.length === 0) {
    console.log("No data found.");
    return;
  }


  for (const row of db) {
    if (row.vec) {
      return;
    }

    const contentToEmbed = `${row.primary_category} ${row.secondary_category} ${row.summary}`;
    const embedding = await getEmbedding(contentToEmbed);
    const { error: updateErr } = await supabase
      .from("db")
      .update({ vec: embedding })
      .match({ id: row.id });

    if (updateErr) {
      console.error("Error updating data:", updateErr);
    }
  }
}

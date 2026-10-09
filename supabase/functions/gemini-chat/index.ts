// supabase/functions/gemini-chat/index.ts
// StormShield AI - Gemini Chat Edge Function (Interactions API)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const MODEL = "gemini-3.8-flash";

const SYSTEM_PROMPT = `You are StormShield AI, an emergency response assistant for disaster risk reduction in the Philippines. Your job is to help citizens during typhoons, floods, earthquakes, fires, and other emergencies.

Rules:
- Give clear, actionable, and calm advice.
- Prioritize safety and life-saving steps.
- If the user describes a life-threatening emergency, tell them to press the SOS button in the app AND call local emergency services (911 in the Philippines).
- Keep answers concise (under 150 words) unless the user asks for detail.
- Use English unless the user writes in Filipino or Tagalog.
- Never make up emergency hotlines or locations.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing 'message' field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Combine system prompt + user message in the new Interactions API format
    const prompt = `${SYSTEM_PROMPT}\n\nUser question: ${message}\n\nAnswer as StormShield AI:`;

    const geminiResponse = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API error:", errText);
      return new Response(
        JSON.stringify({ error: "Gemini API failed", details: errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiResponse.json();

    // Parse the new Interactions API response format
    // The response has `steps` array with `model_output` content
    let reply = "Sorry, I couldn't generate a response.";
    
    if (geminiData.steps && Array.isArray(geminiData.steps)) {
      for (const step of geminiData.steps) {
        if (step.type === "model_output" && step.content) {
          for (const block of step.content) {
            if (block.type === "text" && block.text) {
              reply = block.text;
              break;
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
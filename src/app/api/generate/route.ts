import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { Report } from "@/lib/storage/local-storage";
import { SYSTEM_PROMPT, buildMessages } from "@/lib/ai/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  const report: Report | undefined = body.report;

  if (!report || typeof report !== "object") {
    return new Response("Missing report data", { status: 400 });
  }

  try {
    const messages = buildMessages(report);

    const result = streamText({
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
      messages,
      temperature: 0.3,
      maxOutputTokens: 1000,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Generation error:", error);
    return new Response("Generation failed", { status: 500 });
  }
}

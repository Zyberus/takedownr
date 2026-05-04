import { NextResponse } from "next/server";
import {
  buildSystemPrompt,
  detectCaseIntent,
  sanitizeMessages,
  type ChatMessageInput,
} from "@/lib/chat-assistant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenAICompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
    finish_reason?: string;
  }>;
  usage?: {
    total_tokens?: number;
  };
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

type ConversationContext = {
  hasCountry: boolean;
  hasDescription: boolean;
  hasContact: boolean;
  hasUrl: boolean;
  caseType: string | null;
};

function coerceMessages(input: unknown): ChatMessageInput[] {
  if (!Array.isArray(input)) return [];

  const messages: ChatMessageInput[] = [];

  for (const item of input) {
    if (typeof item !== "object" || item === null) continue;

    const role = "role" in item ? item.role : undefined;
    const content = "content" in item ? item.content : undefined;

    if ((role === "user" || role === "assistant") && typeof content === "string") {
      messages.push({ role, content });
    }
  }

  return messages;
}

function readAssistantReply(payload: OpenAICompletionResponse): string | null {
  try {
    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) {
      console.error("No content in API response:", JSON.stringify(payload, null, 2));
      return null;
    }
    return text;
  } catch (error) {
    console.error("Error parsing API response:", error, JSON.stringify(payload, null, 2));
    return null;
  }
}

async function requestModelReply(options: {
  apiKey: string;
  model: string;
  messages: OpenAIMessage[];
  context: ConversationContext;
}): Promise<{ reply: string | null; error: string | null }> {
  const { apiKey, model, messages, context } = options;
  const endpoint = `${process.env.OPENAI_BASE_URL ?? "https://openrouter.ai/api/v1"}/chat/completions`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30s for thinking models

  try {
    // Optimize parameters for speed
    let temperature = context.hasDescription ? 0.75 : 0.85;
    let maxTokens = context.hasUrl && context.hasContact ? 200 : 350;
    let frequencyPenalty = 0.4;
    let presencePenalty = 0.3;
    let topP = 0.92;

    // Adjust parameters for Google Gemma models
    if (model.includes("gemma") || model.includes("google")) {
      temperature = 0.6;
      maxTokens = 300;
      frequencyPenalty = 0.2;
      presencePenalty = 0.1;
      topP = 0.8;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://takedownrr.com",
        "X-Title": "Takedownrr",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      return { reply: null, error: `OpenRouter ${response.status}: ${errorText}` };
    }

    const payload = (await response.json()) as OpenAICompletionResponse;
    const reply = readAssistantReply(payload);
    if (!reply) {
      return { reply: null, error: "OpenRouter returned empty reply." };
    }
    return { reply, error: null };
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.name !== "AbortError") {
        console.error(`Model request failed: ${error.message}`);
      }
    }
    return {
      reply: null,
      error: error instanceof Error ? `OpenRouter request failed: ${error.message}` : "OpenRouter request failed.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function readGeminiReply(payload: GeminiGenerateContentResponse): string | null {
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) {
    console.error("No content in Gemini response:", JSON.stringify(payload, null, 2));
    return null;
  }
  return text;
}

async function requestGeminiReply(options: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  messages: ChatMessageInput[];
  context: ConversationContext;
}): Promise<{ reply: string | null; error: string | null }> {
  const { apiKey, model, systemPrompt, messages, context } = options;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const geminiContents = messages
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }))
      .reduce<Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>>((acc, item) => {
        const previous = acc[acc.length - 1];
        if (previous && previous.role === item.role) {
          previous.parts.push(...item.parts);
          return acc;
        }
        acc.push(item as { role: "user" | "model"; parts: Array<{ text: string }> });
        return acc;
      }, []);

    if (geminiContents.length === 0 || geminiContents[0].role !== "user") {
      geminiContents.unshift({
        role: "user",
        parts: [{ text: "Continue helping me with my takedown request." }],
      });
    }

    const maxOutputTokens = context.hasUrl && context.hasContact ? 200 : 350;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: geminiContents,
        generationConfig: {
          temperature: context.hasDescription ? 0.7 : 0.8,
          topP: 0.9,
          maxOutputTokens,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      return { reply: null, error: `Gemini ${response.status}: ${errorText}` };
    }

    const payload = (await response.json()) as GeminiGenerateContentResponse;
    const reply = readGeminiReply(payload);
    if (!reply) {
      return { reply: null, error: "Gemini returned empty reply." };
    }
    return { reply, error: null };
  } catch (error) {
    if (error instanceof Error && error.name !== "AbortError") {
      console.error(`Gemini request failed: ${error.message}`);
    }
    return {
      reply: null,
      error: error instanceof Error ? `Gemini request failed: ${error.message}` : "Gemini request failed.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const rawMessages = "messages" in body ? body.messages : undefined;
    const rawContext = "context" in body ? body.context : undefined;

    const messages = sanitizeMessages(coerceMessages(rawMessages));

    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

    if (!latestUserMessage) {
      return NextResponse.json(
        { error: "Provide at least one user message." },
        { status: 400 },
      );
    }

    // Parse context
    const contextRecord = typeof rawContext === "object" && rawContext !== null
      ? (rawContext as Record<string, unknown>)
      : null;
    const context: ConversationContext = contextRecord
      ? {
          hasCountry: Boolean(contextRecord.hasCountry),
          hasDescription: Boolean(contextRecord.hasDescription),
          hasContact: Boolean(contextRecord.hasContact),
          hasUrl: Boolean(contextRecord.hasUrl),
          caseType: typeof contextRecord.caseType === "string" ? contextRecord.caseType : null,
        }
      : {
          hasCountry: false,
          hasDescription: false,
          hasContact: false,
          hasUrl: false,
          caseType: null,
        };

    const intent = detectCaseIntent(latestUserMessage.content);
    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    const geminiModel = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
    const openRouterApiKey = process.env.OPENAI_API_KEY?.trim();
    const openRouterModel = process.env.OPENAI_MODEL?.trim() || "nvidia/nemotron-3-nano-30b-a3b:free";

    if (!geminiApiKey && !openRouterApiKey) {
      console.error("No AI provider API key configured");
      return NextResponse.json(
        { error: "No AI provider API key configured." },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(intent, latestUserMessage.content, context);

    // For models that don't support system messages, prepend to first user message
    const modelMessages: OpenAIMessage[] = [];
    if (openRouterModel.includes("liquid/lfm") || openRouterModel.includes("thinking") || openRouterModel.includes("gemma") || openRouterModel.includes("google")) {
      // Prepend system prompt to the first user message
      const userMessages = messages.filter(m => m.role === "user");
      const assistantMessages = messages.filter(m => m.role === "assistant");

      if (userMessages.length > 0) {
        modelMessages.push({
          role: "user",
          content: `${systemPrompt}\n\n${userMessages[0].content}`
        });
        // Add remaining user messages
        modelMessages.push(...userMessages.slice(1));
        // Add assistant messages
        modelMessages.push(...assistantMessages);
      } else {
        modelMessages.push({ role: "user", content: systemPrompt });
      }
    } else {
      // Use system message for models that support it
      modelMessages.push({ role: "system", content: systemPrompt });
      modelMessages.push(...messages.map((message) => ({ role: message.role, content: message.content })));
    }

    let generatedReply: string | null = null;
    const providerErrors: string[] = [];

    if (geminiApiKey) {
      console.log("Trying Gemini model first:", geminiModel);
      const geminiResult = await requestGeminiReply({
        apiKey: geminiApiKey,
        model: geminiModel,
        systemPrompt,
        messages,
        context,
      });
      generatedReply = geminiResult.reply;
      if (geminiResult.error) providerErrors.push(geminiResult.error);
    }

    if (!generatedReply && openRouterApiKey) {
      console.log("Falling back to OpenRouter model:", openRouterModel);
      const openRouterResult = await requestModelReply({
        apiKey: openRouterApiKey,
        model: openRouterModel,
        messages: modelMessages,
        context,
      });
      generatedReply = openRouterResult.reply;
      if (openRouterResult.error) providerErrors.push(openRouterResult.error);
    }

    if (!generatedReply) {
      console.error("No reply generated from Gemini or OpenRouter");
      return NextResponse.json(
        {
          error: "Failed to generate response. Please try again.",
          providerErrors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reply: generatedReply,
      detectedCaseId: intent.id,
      detectedCaseLabel: intent.label,
      confidence: intent.confidence,
    });
  } catch (error) {
    console.error("Unexpected error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

type ProviderHealth = {
  provider: "gemini" | "openrouter";
  up: boolean;
  statusCode: number | null;
  latencyMs: number | null;
  error?: string;
};

async function checkGeminiHealth(): Promise<ProviderHealth> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      provider: "gemini",
      up: false,
      statusCode: null,
      latencyMs: null,
      error: "Missing GEMINI_API_KEY",
    };
  }

  const started = Date.now();
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
      { method: "GET", cache: "no-store" },
    );
    return {
      provider: "gemini",
      up: response.ok,
      statusCode: response.status,
      latencyMs: Date.now() - started,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      provider: "gemini",
      up: false,
      statusCode: null,
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkOpenRouterHealth(): Promise<ProviderHealth> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const baseUrl = process.env.OPENAI_BASE_URL?.trim() || "https://openrouter.ai/api/v1";
  if (!apiKey) {
    return {
      provider: "openrouter",
      up: false,
      statusCode: null,
      latencyMs: null,
      error: "Missing OPENAI_API_KEY",
    };
  }

  const started = Date.now();
  try {
    const response = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    return {
      provider: "openrouter",
      up: response.ok,
      statusCode: response.status,
      latencyMs: Date.now() - started,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      provider: "openrouter",
      up: false,
      statusCode: null,
      latencyMs: Date.now() - started,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const [gemini, openrouter] = await Promise.all([checkGeminiHealth(), checkOpenRouterHealth()]);
  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    providers: [gemini, openrouter],
  });
}

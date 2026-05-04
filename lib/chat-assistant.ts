export type ChatRole = "user" | "assistant";

export type ChatMessageInput = {
  role: ChatRole;
  content: string;
};

export type CaseIntentId =
  | "content"
  | "impersonator"
  | "account"
  | "evidence"
  | "harassment"
  | "privacy"
  | "unknown";

export type DetectedIntent = {
  id: CaseIntentId;
  label: string;
  confidence: number;
  matchedKeywords: string[];
};

type ConversationContext = {
  hasCountry: boolean;
  hasDescription: boolean;
  hasContact: boolean;
  hasUrl: boolean;
  caseType: string | null;
};

type IntentRule = {
  id: Exclude<CaseIntentId, "unknown">;
  label: string;
  keywords: string[];
  weight: number;
};

const INTENT_RULES: IntentRule[] = [
  {
    id: "impersonator",
    label: "impersonation",
    keywords: [
      "fake account",
      "impersonat",
      "pretending to be",
      "using my name",
      "using my photos",
      "using my pictures",
      "report account",
      "scam account",
      "catfish",
      "clone account",
      "fake profile",
      "stolen identity",
      "someone created",
      "someone made",
      "posing as me",
    ],
    weight: 1.3,
  },
  {
    id: "content",
    label: "content",
    keywords: [
      "without consent",
      "without permission",
      "posted my photo",
      "posted my picture",
      "posted my reel",
      "posted my video",
      "my private photos",
      "remove photo",
      "remove content",
      "remove post",
      "leaked",
      "non consensual",
      "unauthorized",
      "shared without",
      "stolen content",
      "reposted",
    ],
    weight: 1.4,
  },
  {
    id: "harassment",
    label: "harassment",
    keywords: [
      "harass",
      "bully",
      "threatening",
      "stalking",
      "abusive",
      "hate speech",
      "targeted",
      "attacking",
      "won't stop",
      "keeps messaging",
      "won't leave me alone",
    ],
    weight: 1.2,
  },
  {
    id: "privacy",
    label: "privacy",
    keywords: [
      "doxxing",
      "personal information",
      "address posted",
      "phone number",
      "private details",
      "exposed",
      "leaked info",
      "private data",
    ],
    weight: 1.25,
  },
  {
    id: "account",
    label: "account",
    keywords: [
      "old account",
      "can't access",
      "cannot access",
      "forgot password",
      "lost access",
      "delete old account",
      "old instagram",
      "locked out",
      "can't log in",
      "recover account",
    ],
    weight: 1.1,
  },
  {
    id: "evidence",
    label: "evidence",
    keywords: [
      "what evidence",
      "what proof",
      "which documents",
      "how to report",
      "where do i start",
      "what steps",
      "help me report",
      "what do i need",
      "how does this work",
    ],
    weight: 0.9,
  },
];

const HIGH_URGENCY_KEYWORDS = [
  "urgent",
  "immediately",
  "asap",
  "right now",
  "emergency",
  "blackmail",
  "extort",
  "threat",
  "suicide",
  "minor",
  "underage",
  "child",
  "viral",
  "spreading fast",
  "scam",
  "money",
  "financial",
];

function normalizeText(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function scoreRule(text: string, keywords: string[], weight: number): { score: number; matches: string[] } {
  const matches: string[] = [];

  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      matches.push(keyword);
    }
  }

  return {
    score: matches.length * weight,
    matches,
  };
}

export function sanitizeMessages(messages: ChatMessageInput[], maxMessages = 15): ChatMessageInput[] {
  return messages
    .filter(
      (message): message is ChatMessageInput =>
        Boolean(message) &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 2000),
    }))
    .slice(-maxMessages);
}

export function detectCaseIntent(input: string): DetectedIntent {
  const normalized = normalizeText(input);

  let bestRule: IntentRule | null = null;
  let bestScore = 0;
  let bestMatches: string[] = [];

  for (const rule of INTENT_RULES) {
    const { score, matches } = scoreRule(normalized, rule.keywords, rule.weight);
    if (score > bestScore) {
      bestRule = rule;
      bestScore = score;
      bestMatches = matches;
    }
  }

  if (!bestRule || bestScore === 0) {
    return {
      id: "unknown",
      label: "General inquiry",
      confidence: 0,
      matchedKeywords: [],
    };
  }

  const baseConfidence = 0.35;
  const matchBonus = Math.min(bestMatches.length * 0.15, 0.6);
  const confidence = Number(Math.min(0.98, baseConfidence + matchBonus).toFixed(2));

  return {
    id: bestRule.id,
    label: bestRule.label,
    confidence,
    matchedKeywords: bestMatches,
  };
}

function buildIntentGuidance(intent: DetectedIntent, context: ConversationContext): string {
  const { id } = intent;
  const { hasCountry, hasDescription, hasContact, hasUrl } = context;

  // Build dynamic guidance based on what we already have
  const missing: string[] = [];
  if (!hasCountry) missing.push("country");
  if (!hasDescription) missing.push("brief description");
  if (!hasContact) missing.push("contact method");
  if (!hasUrl) missing.push("Instagram URL");

  const missingInfo = missing.length > 0 
    ? `Still need: ${missing.join(", ")}.` 
    : "All required information collected.";

  switch (id) {
    case "impersonator":
      return `Case: Impersonation. ${missingInfo} Focus on: who they're impersonating, how they're using photos/info, any active scams.`;
    case "content":
      return `Case: Unauthorized content. ${missingInfo} Focus on: specific content URL, consent status, distribution scope.`;
    case "harassment":
      return `Case: Harassment. ${missingInfo} Focus on: nature of harassment, frequency, evidence of threats.`;
    case "privacy":
      return `Case: Privacy violation. ${missingInfo} Focus on: what info was exposed, where posted, potential harm.`;
    case "account":
      return `Case: Account deletion. ${missingInfo} Focus on: ownership proof, access status, sensitive content.`;
    case "evidence":
      return `Case: Evidence guidance. ${missingInfo} Provide clear, actionable steps.`;
    default:
      return `Case unclear. ${missingInfo} Ask one question to identify case type.`;
  }
}

function hasUrgencySignals(text: string): boolean {
  const normalized = normalizeText(text);
  return HIGH_URGENCY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function buildProgressTracker(context: ConversationContext): string {
  const items = [
    { label: "Country", done: context.hasCountry },
    { label: "Description", done: context.hasDescription },
    { label: "Contact", done: context.hasContact },
    { label: "URL", done: context.hasUrl },
  ];

  const completed = items.filter(i => i.done).length;
  const total = items.length;

  if (completed === total) {
    return "✓ All information collected. Ready to submit.";
  }

  return `Progress: ${completed}/${total} collected. ${items.filter(i => !i.done).map(i => i.label).join(", ")} needed.`;
}

export function buildSystemPrompt(
  intent: DetectedIntent, 
  latestUserMessage: string,
  context: ConversationContext
): string {
  const urgent = hasUrgencySignals(latestUserMessage);
  const progress = buildProgressTracker(context);
  const guidance = buildIntentGuidance(intent, context);
  const normalized = normalizeText(latestUserMessage);

  // Detect edge cases
  const isNegative = /^(no|nope|nah|not really|i don't|i cant|i won't)/.test(normalized);
  const isConfused = /^(what|huh|i don't understand|confused|help)/.test(normalized);
  const isGreeting = /^(hi|hello|hey|good morning|good afternoon)/.test(normalized);
  const isThankYou = /^(thanks|thank you|thx|appreciate)/.test(normalized);

  return [
    "You are a professional intake specialist for Takedownr, an Instagram content takedown service.",
    "",
    "YOUR GOAL:",
    "Collect these 4 pieces of information to submit a takedown request:",
    "1. Country of residence",
    "2. Brief description (1-2 sentences about what happened)",
    "3. Contact method (email or WhatsApp)",
    "4. Instagram URL (account or post link)",
    "",
    "CONVERSATION STYLE:",
    "- Warm, professional, and empathetic",
    "- Keep responses SHORT (2-3 sentences max)",
    "- Ask ONE question at a time",
    "- Use natural, conversational language",
    "- Acknowledge what they share before asking for more",
    "",
    "SMART BEHAVIOR:",
    "- If they provide multiple pieces of info at once, acknowledge ALL of them",
    "- Extract information from context (e.g., 'I'm in California' = USA)",
    "- Don't ask for info they've already provided",
    "- If they share a URL, acknowledge it specifically",
    "- If they say NO or refuse, ask WHY or offer alternatives",
    "- If they seem confused, clarify what you need",
    "- If they go off-topic, gently redirect",
    "- If they say thanks, acknowledge and continue",
    "",
    `CURRENT STATUS: ${progress}`,
    `CASE ANALYSIS: ${guidance}`,
    urgent ? "\n⚠️ URGENCY DETECTED: Prioritize safety. Be reassuring and efficient." : "",
    isNegative ? "\n⚠️ USER SAID NO: Ask why or offer alternatives. Don't repeat the same question." : "",
    isConfused ? "\n⚠️ USER CONFUSED: Clarify what you need and why." : "",
    isGreeting ? "\n⚠️ GREETING: Respond warmly and get to business." : "",
    isThankYou ? "\n⚠️ THANKS: Acknowledge briefly and continue." : "",
    "",
    "HANDLING EDGE CASES:",
    "- If user says 'no' to providing info: Ask 'No problem - is there a reason you'd prefer not to share that? We need it to process your request.'",
    "- If user is vague: 'I understand. Could you be a bit more specific about [what you need]?'",
    "- If user goes off-topic: 'I hear you. To help with your takedown request, I need [missing info]. Can you share that?'",
    "- If user asks 'why': Explain briefly why you need that specific piece of information",
    "- If user provides partial info: Acknowledge what they gave and ask for the rest",
    "",
    "COMPLETION:",
    "When you have ALL 4 pieces of information, respond:",
    "\"Perfect, I have everything I need. I'll forward this to our team right now. They'll review your case in our Studio and reach out within 24-48 hours via [their contact method]. Is there anything else you'd like to add?\"",
    "",
    "EXAMPLES:",
    "",
    "User: 'Someone made a fake account with my photos'",
    "You: 'I'm sorry that's happening. To help you take it down, I need a few quick details. First, which country are you in?'",
    "",
    "User: 'no'",
    "You: 'No problem - is there a reason you'd prefer not to share your country? We need it to route your case to the right enforcement team.'",
    "",
    "User: 'I'm in the US, the account is @fakeme123'",
    "You: 'Got it - US, and the fake account is @fakeme123. Can you briefly describe how they're using your photos? And what's the best way to reach you - email or WhatsApp?'",
    "",
    "User: 'why do you need my email'",
    "You: 'Good question - we need your email or WhatsApp so our team can send you updates and the final takedown confirmation. Which would you prefer?'",
    "",
    "User: 'They copied all my photos and are pretending to be me. My email is john@email.com'",
    "You: 'Perfect, I have everything I need. I'll forward this to our team right now. They'll review your case in our Studio and reach out within 24-48 hours via email. Is there anything else you'd like to add?'",
  ].filter(Boolean).join("\n");
}

"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, RotateCcw, Download, X, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase-client";

type MessageRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
};

type ChatApiResponse = {
  reply?: string;
  detectedCaseLabel?: string;
  confidence?: number;
  providerErrors?: string[];
};

type ConversationContext = {
  hasCountry: boolean;
  hasDescription: boolean;
  hasContact: boolean;
  hasUrl: boolean;
  caseType: string | null;
  messageCount: number;
};

type IntakeDetails = {
  country: string | null;
  contactMethod: "email" | "whatsapp" | null;
  contactValue: string | null;
  instagramUrl: string | null;
  description: string | null;
  caseType: string | null;
  messageCount: number;
  isComplete: boolean;
};

const quickStarters = [
  "Someone created a fake account using my photos",
  "I need to remove content posted without my permission",
  "I can't access my old account and need it deleted",
];

const initialAssistantMessage: ChatMessage = {
  id: "assistant-initial",
  role: "assistant",
  content: "Hi! I'm here to help with Instagram takedown requests. What's going on?",
  timestamp: Date.now(),
};

function createId() {
  return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function exportConversation(messages: ChatMessage[]): void {
  const content = messages
    .map((msg) => {
      const time = new Date(msg.timestamp).toLocaleString();
      return `[${msg.role.toUpperCase()}] ${time}\n${msg.content}\n`;
    })
    .join("\n---\n\n");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `takedownr-chat-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const COUNTRY_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /\b(us|usa|united states|america)\b/i, value: "United States" },
  { pattern: /\buk|united kingdom|england\b/i, value: "United Kingdom" },
  { pattern: /\bcanada\b/i, value: "Canada" },
  { pattern: /\baustralia\b/i, value: "Australia" },
  { pattern: /\bindia\b/i, value: "India" },
  { pattern: /\bgermany\b/i, value: "Germany" },
  { pattern: /\bfrance\b/i, value: "France" },
  { pattern: /\bspain\b/i, value: "Spain" },
  { pattern: /\bitaly\b/i, value: "Italy" },
];

function extractIntakeDetails(messages: ChatMessage[]): IntakeDetails {
  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter(Boolean);
  const allText = userMessages.join(" ");
  const lowered = allText.toLowerCase();

  const country = COUNTRY_PATTERNS.find((item) => item.pattern.test(allText))?.value ?? null;

  const email = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i)?.[0] ?? null;
  const phone = allText.match(/(?:whatsapp|wa|phone|contact)?[\s:,-]*(\+?\d[\d\s\-()]{7,}\d)/i)?.[1]?.trim() ?? null;
  const contactMethod = email ? "email" : phone ? "whatsapp" : null;
  const contactValue = email ?? phone;

  const fullUrl = allText.match(/https?:\/\/(www\.)?instagram\.com\/[^\s)]+/i)?.[0] ?? null;
  const handle = allText.match(/(^|\s)@\w[\w.]{1,29}\b/)?.[0]?.trim() ?? null;
  const instagramUrl = fullUrl ?? (handle ? `https://instagram.com/${handle.replace(/^@/, "")}` : null);

  const descriptionCandidate = userMessages
    .filter((line) => !/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i.test(line))
    .filter((line) => !/https?:\/\/(www\.)?instagram\.com\/[^\s)]+/i.test(line))
    .filter((line) => !/^@\w[\w.]{1,29}$/i.test(line))
    .sort((a, b) => b.length - a.length)[0];
  const description = descriptionCandidate && descriptionCandidate.length > 20 ? descriptionCandidate.slice(0, 450) : null;

  const caseType =
    /fake|imperson|pretend|clone|scam|posing as/i.test(lowered)
      ? "impersonation"
      : /photo|picture|image|video|reel|post|content|without consent|without permission/i.test(lowered)
        ? "content"
        : /old account|can't access|cannot access|locked out|forgot password|recover account/i.test(lowered)
          ? "account"
          : null;

  const isComplete = Boolean(country && contactMethod && contactValue && instagramUrl && description);

  return {
    country,
    contactMethod,
    contactValue,
    instagramUrl,
    description,
    caseType,
    messageCount: userMessages.length,
    isComplete,
  };
}

function analyzeContext(messages: ChatMessage[]): ConversationContext {
  const details = extractIntakeDetails(messages);
  return {
    hasCountry: Boolean(details.country),
    hasDescription: Boolean(details.description),
    hasContact: Boolean(details.contactMethod && details.contactValue),
    hasUrl: Boolean(details.instagramUrl),
    caseType: details.caseType,
    messageCount: details.messageCount,
  };
}



export function AiChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [isTyping, setIsTyping] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const submittedRef = useRef(false);

  const hasUserMessages = useMemo(
    () => messages.some((message) => message.role === "user"),
    [messages],
  );

  const context = useMemo(() => analyzeContext(messages), [messages]);

  useEffect(() => {
    const storageKey = "tdr-chat-opened";
    try {
      const hasOpened = window.localStorage.getItem(storageKey) === "1";
      if (!hasOpened) {
        setTimeout(() => setIsOpen(true), 1000);
        window.localStorage.setItem(storageKey, "1");
      }
    } catch {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isOpen, isSending]);

  const resetConversation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([initialAssistantMessage]);
    setError("");
    setInput("");
    setIsSending(false);
    setIsTyping(false);
    submittedRef.current = false;
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const submitCompletedIntake = useCallback(async (conversation: ChatMessage[]) => {
    if (submittedRef.current) return;
    const details = extractIntakeDetails(conversation);
    if (!details.isComplete) {
      return;
    }

    try {
      await addDoc(collection(firestore, "contactRequests"), {
        name: "Chat intake",
        email: details.contactMethod === "email" ? details.contactValue : "",
        instagramUrl: details.instagramUrl,
        issueType: details.caseType ? `Chat ${details.caseType}` : "Chat request",
        description: details.description,
        status: "new",
        source: "chat-assistant",
        intakeSummary: {
          country: details.country,
          contactMethod: details.contactMethod,
          contactValue: details.contactValue,
          instagramUrl: details.instagramUrl,
          caseType: details.caseType || "unknown",
          messageCount: details.messageCount,
        },
        transcript: conversation.map((message) => ({
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
        })),
        createdAt: serverTimestamp(),
      });
      submittedRef.current = true;
    } catch {
      // Non-blocking; admin intake can be retried on next completion.
    }
  }, []);

  const sendMessage = useCallback(async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setInput("");
    
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    
    setError("");
    setIsSending(true);
    setIsTyping(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          context: analyzeContext(conversation),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const failedPayload = (await response.json().catch(() => ({}))) as ChatApiResponse;
        if (failedPayload.providerErrors?.length) {
          throw new Error(failedPayload.providerErrors[0]);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = (await response.json()) as ChatApiResponse;

      if (!payload.reply) {
        throw new Error("No response from assistant");
      }

      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: payload.reply,
        timestamp: Date.now(),
      };

      setMessages((current) => [...current, assistantMessage]);
      const nextConversation = [...conversation, assistantMessage];
      await submitCompletedIntake(nextConversation);
      setIsTyping(false);
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
    } catch (err) {
      setIsTyping(false);
      
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else {
          setError(err.message || "Failed to send message. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
      
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
    }
  }, [messages, isSending, submitCompletedIntake]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending && input.trim()) {
        sendMessage(input);
      }
    }
  }, [input, isSending, sendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  }, []);

  return (
    <>
      <div className="chat-fab group relative flex items-center">
        {/* Animated Popover Message */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }}
              className="absolute right-[115%] flex items-center"
            >
              <div className="bg-zinc-900 border border-zinc-800 text-white text-xs font-medium px-4 py-2.5 rounded-2xl shadow-xl whitespace-nowrap mr-2 relative cursor-pointer hover:bg-zinc-800 transition-colors tracking-wide" onClick={() => setIsOpen(true)}>
                Need an urgent removal? Start here
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-[8px] border-l-zinc-900 group-hover:border-l-zinc-800 transition-colors" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          className="chat-fab-btn h-14 w-14 rounded-full bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-none"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <MessageSquare size={22} strokeWidth={2} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="chat-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              className="chat-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
            >
              <div className="chat-header">
                <div className="chat-header-left">
                  {context.caseType && (
                    <div className="chat-context-badge">
                      <Sparkles size={12} />
                      <span>{context.caseType}</span>
                    </div>
                  )}
                </div>
                <div className="chat-header-actions">
                  {messages.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="chat-icon-btn"
                        onClick={resetConversation}
                        title="New chat"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        type="button"
                        className="chat-icon-btn"
                        onClick={() => exportConversation(messages)}
                        title="Export"
                      >
                        <Download size={16} />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="chat-icon-btn"
                    onClick={() => setIsOpen(false)}
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div ref={scrollContainerRef} className="chat-messages">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`chat-msg ${message.role === "user" ? "chat-msg-user" : ""}`}
                  >
                    <div className="chat-msg-content">
                      {message.role === "assistant" ? (
                        <div className="chat-prose">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children, ...props }) => (
                                <p {...props}>{children}</p>
                              ),
                              strong: ({ children, ...props }) => (
                                <strong {...props}>{children}</strong>
                              ),
                              em: ({ children, ...props }) => (
                                <em {...props}>{children}</em>
                              ),
                              ul: ({ children, ...props }) => (
                                <ul {...props}>{children}</ul>
                              ),
                              ol: ({ children, ...props }) => (
                                <ol {...props}>{children}</ol>
                              ),
                              li: ({ children, ...props }) => (
                                <li {...props}>{children}</li>
                              ),
                              code: ({ className, children, ...props }) => {
                                const isInline = !className?.includes('language-') && !props.style;
                                if (isInline) {
                                  return <code {...props}>{children}</code>;
                                }
                                return (
                                  <pre>
                                    <code {...props}>{children}</code>
                                  </pre>
                                );
                              },
                              a: ({ href, children, ...props }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  {...props}
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="chat-msg"
                  >
                    <div className="chat-msg-content">
                      <div className="chat-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {!hasUserMessages && (
                <div className="chat-starters">
                  {quickStarters.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      className="chat-starter"
                      onClick={() => sendMessage(starter)}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="chat-error"
                >
                  <p>{error}</p>
                </motion.div>
              )}

              <form
                className="chat-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
              >
                <div className="chat-input-wrap">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Message..."
                    disabled={isSending}
                    maxLength={2000}
                  />
                  <button
                    type="submit"
                    className="chat-send"
                    disabled={isSending || !input.trim()}
                    aria-label="Send"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

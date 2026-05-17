"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import type { OrbChatContext, OrbMessage } from "@/lib/types";

type OrbChatDrawerProps = {
  open: boolean;
  onClose: () => void;
  context?: OrbChatContext;
};

const INITIAL_MESSAGE: OrbMessage = {
  id: "intro",
  role: "assistant",
  content:
    "I'm here. Your rhythm has been intense lately, but still coherent. You can vent, think out loud, or ask me to help untangle something.",
  mode: "text",
  emotionTags: ["reflection"],
  createdAt: new Date().toISOString(),
};

export default function OrbChatDrawer({ open, onClose, context }: OrbChatDrawerProps) {
  const [messages, setMessages] = useState<OrbMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const orbStateLabel = useMemo(() => {
    if (loading) return "Thinking…";
    if (voiceEnabled) return "Voice replies enabled";
    return "Orb Companion active";
  }, [loading, voiceEnabled]);

  async function sendMessage() {
    const trimmed = input.trim();

    if (!trimmed || loading) return;

    const userMessage: OrbMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      mode: "text",
      emotionTags: [],
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/orb-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          context,
          messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: OrbMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply ?? "I'm still here. Try that one more time.",
        mode: voiceEnabled ? "voice" : "text",
        emotionTags: data.emotionTags ?? ["reflection"],
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);

      if (voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage.content);
        utterance.rate = 0.97;
        utterance.pitch = 1.02;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "The orb lost connection for a second. Try again.",
          mode: "text",
          emotionTags: ["reflection"],
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2.5rem] border border-white/10 bg-[#050816] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-sky-300/80">URAI Orb</div>
                <div className="mt-1 text-sm text-white/70">{orbStateLabel}</div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={voiceEnabled ? "primary" : "secondary"}
                  onClick={() => setVoiceEnabled((current) => !current)}
                >
                  {voiceEnabled ? "Voice On" : "Voice Off"}
                </Button>

                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "ml-auto bg-sky-500 text-white"
                        : "bg-white/8 text-white/90"
                    }`}
                  >
                    <div>{message.content}</div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.emotionTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Talk to URAI…"
                  className="min-h-[64px] flex-1 resize-none rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none placeholder:text-white/35"
                />

                <Button variant="primary" onClick={() => void sendMessage()} disabled={loading}>
                  {loading ? "Thinking…" : "Send"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

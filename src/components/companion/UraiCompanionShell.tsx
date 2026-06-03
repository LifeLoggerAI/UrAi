"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getEnabledCouncilRoles } from "@/lib/council/uraiCouncilRoles";
import { generateLocalCompanionResponse } from "@/lib/companion/localCompanionResponder";
import { getQuickPromptsForContext } from "@/lib/companion/quickPrompts";
import type { CompanionMessage, CompanionMode, CompanionQuickPrompt, GenesisMoodState } from "@/lib/companion/companionTypes";
import { DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import { useUraiVoice } from "@/providers/UraiVoiceProvider";
import styles from "./UraiCompanionShell.module.css";

type SuggestedAction = { type: "open_life_map" | "open_passport" | "open_ground" | "none"; label?: string };
type CompanionApiResponse = { reply?: string; caption?: string; councilRoleId?: string; safetyLevel?: "normal" | "gentle" | "boundary"; suggestedAction?: SuggestedAction };

type UraiCompanionShellProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: CompanionMode;
  moodState?: GenesisMoodState;
  userId?: string;
  contextPermissions?: Partial<PassportContextPermissions>;
  onOpenLifeMap?: () => void;
  onOpenPassport?: () => void;
  onOpenGround?: () => void;
  onOpenMirror?: () => void;
  onOpenShadow?: () => void;
};

const MAX_MESSAGE_LENGTH = 500;
const LAST_MODE_KEY = "urai.companion.lastMode";
const LAST_ROLE_KEY = "urai.council.lastRole";
const FALLBACK_COPY = "Something didn’t open cleanly. We can still keep this simple.";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `urai-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readStoredMode(initialMode: CompanionMode): CompanionMode {
  if (typeof window === "undefined") return initialMode;
  const stored = window.localStorage.getItem(LAST_MODE_KEY);
  return stored === "companion" || stored === "council" ? stored : initialMode;
}

function actionLabel(action?: SuggestedAction): string | null {
  if (!action || action.type === "none") return null;
  if (action.label) return action.label;
  if (action.type === "open_life_map") return "Open Life Map";
  if (action.type === "open_passport") return "Open Passport";
  if (action.type === "open_ground") return "Open Ground";
  return null;
}

export function UraiCompanionShell({ isOpen, onClose, initialMode = "companion", moodState = "luminous", userId, contextPermissions, onOpenLifeMap, onOpenPassport, onOpenGround, onOpenMirror, onOpenShadow }: UraiCompanionShellProps) {
  const reduceMotion = useReducedMotion();
  const voice = useUraiVoice();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<CompanionMode>(initialMode);
  const [selectedRoleId, setSelectedRoleId] = useState("guide");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedAction, setSuggestedAction] = useState<SuggestedAction>({ type: "none" });

  const councilRoles = useMemo(() => getEnabledCouncilRoles(), []);
  const activeRole = councilRoles.find((role) => role.id === selectedRoleId) ?? councilRoles[0];
  const quickPrompts = useMemo(() => getQuickPromptsForContext(mode, mode === "council" ? activeRole?.id : undefined), [activeRole?.id, mode]);
  const activeActionLabel = actionLabel(suggestedAction);

  useEffect(() => {
    if (!isOpen) return;
    const storedMode = readStoredMode(initialMode);
    setMode(storedMode);
    if (typeof window !== "undefined") {
      const storedRole = window.localStorage.getItem(LAST_ROLE_KEY);
      if (storedRole && councilRoles.some((role) => role.id === storedRole)) setSelectedRoleId(storedRole);
    }
    if (messages.length === 0) {
      setMessages([{ id: createId(), role: "urai", mode: storedMode, councilRoleId: storedMode === "council" ? selectedRoleId : undefined, text: "I’m here.", createdAt: new Date().toISOString(), moodState, source: "systemWhisper" }]);
    }
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }, [councilRoles, initialMode, isOpen, messages.length, moodState, selectedRoleId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, reduceMotion]);

  const changeMode = (nextMode: CompanionMode) => {
    setMode(nextMode);
    setSuggestedAction({ type: "none" });
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_MODE_KEY, nextMode);
  };

  const changeRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    setMode("council");
    setSuggestedAction({ type: "none" });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LAST_MODE_KEY, "council");
      window.localStorage.setItem(LAST_ROLE_KEY, roleId);
    }
  };

  const appendFallbackResponse = (trimmed: string, nextContext: { mode: CompanionMode; councilRoleId?: string; moodState: GenesisMoodState }) => {
    const local = generateLocalCompanionResponse(trimmed, nextContext);
    setMessages((current) => [...current, { ...local, text: local.text || FALLBACK_COPY }]);
  };

  const appendRemoteExchange = async (text: string, source: CompanionMessage["source"] = "manual") => {
    const trimmed = text.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed || isGenerating) return;
    const nextContext = { mode, councilRoleId: mode === "council" ? activeRole?.id : undefined, moodState };
    const userMessage: CompanionMessage = { id: createId(), role: "user", mode, councilRoleId: nextContext.councilRoleId, text: trimmed, createdAt: new Date().toISOString(), moodState, source };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsGenerating(true);
    setSuggestedAction({ type: "none" });
    try {
      const response = await fetch("/api/companion/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, mode, councilRoleId: nextContext.councilRoleId, moodState, userId, contextPermissions: { ...DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, ...(contextPermissions ?? {}) } }),
      });
      if (!response.ok) throw new Error("companion response failed");
      const data = (await response.json()) as CompanionApiResponse;
      const reply = (data.reply || FALLBACK_COPY).trim().slice(0, 520);
      setMessages((current) => [...current, { id: createId(), role: "urai", mode, councilRoleId: data.councilRoleId ?? nextContext.councilRoleId, text: reply, createdAt: new Date().toISOString(), moodState, source: "systemWhisper" }]);
      setSuggestedAction(data.suggestedAction ?? { type: "none" });
      if (voice.captionsEnabled && (data.caption || mode === "council")) void voice.playVoiceLine("council.listening", { priority: "council", forceCaption: !voice.voiceEnabled });
    } catch {
      appendFallbackResponse(trimmed, nextContext);
      setSuggestedAction({ type: "none" });
    } finally {
      setIsGenerating(false);
    }
  };

  const openAction = (action?: "openLifeMap" | "openPassport" | "openGround" | "openMirror" | "openShadow") => {
    if (action === "openLifeMap" && onOpenLifeMap) {
      onClose();
      onOpenLifeMap();
    }
    if (action === "openPassport" && onOpenPassport) {
      onClose();
      onOpenPassport();
    }
    if (action === "openGround" && onOpenGround) {
      onClose();
      onOpenGround();
    }
    if (action === "openMirror" && onOpenMirror) {
      onClose();
      onOpenMirror();
    }
    if (action === "openShadow" && onOpenShadow) {
      onClose();
      onOpenShadow();
    }
  };

  const runSuggestedAction = () => {
    if (suggestedAction.type === "open_life_map") openAction("openLifeMap");
    if (suggestedAction.type === "open_passport") openAction("openPassport");
    if (suggestedAction.type === "open_ground") openAction("openGround");
  };

  const handleQuickPrompt = (prompt: CompanionQuickPrompt) => {
    if (prompt.mode) changeMode(prompt.mode);
    if (prompt.councilRoleId) changeRole(prompt.councilRoleId);
    if (prompt.action) {
      void appendRemoteExchange(prompt.prompt, "quickPrompt");
      window.setTimeout(() => openAction(prompt.action), reduceMotion ? 0 : 260);
      return;
    }
    void appendRemoteExchange(prompt.prompt, "quickPrompt");
  };

  const handleSubmit = () => void appendRemoteExchange(input, "manual");
  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div className={styles.backdrop} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" tabIndex={-1} aria-label="Close Companion" className={styles.scrim} onClick={onClose} />
          </motion.div>
          <motion.section role="dialog" aria-modal="true" aria-labelledby="urai-companion-title" className={styles.shell} data-generating={isGenerating ? "true" : "false"} initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 34, scale: 0.98 }} animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: isGenerating ? 1.006 : 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.98 }} transition={{ duration: 0.24, ease: "easeOut" }}>
            <header className={styles.header}>
              <div className={styles.brand}>
                <h2 id="urai-companion-title" className={styles.title}>URAI</h2>
                <span className={styles.subtitle}>{mode === "council" ? `${activeRole?.name ?? "Guide"} · ${activeRole?.tone ?? "Calm"}` : "Companion · calm voice"}</span>
              </div>
              <button type="button" aria-label="Close Companion" className={styles.closeButton} onClick={onClose}>×</button>
            </header>
            <div className={styles.modeToggle} aria-label="Companion mode">
              <button type="button" className={`${styles.modeButton} ${mode === "companion" ? styles.activeMode : ""}`} onClick={() => changeMode("companion")}>Companion</button>
              <button type="button" className={`${styles.modeButton} ${mode === "council" ? styles.activeMode : ""}`} onClick={() => changeMode("council")}>Council</button>
            </div>
            {mode === "council" ? <div className={styles.roleRow} aria-label="Council roles">{councilRoles.map((role) => <button key={role.id} type="button" className={`${styles.roleButton} ${role.id === activeRole?.id ? styles.activeRole : ""}`} aria-label={`Select ${role.name}`} onClick={() => changeRole(role.id)}>{role.name}</button>)}</div> : null}
            <div ref={messagesRef} className={styles.messages} aria-live="polite">
              {messages.map((message) => <p key={message.id} className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.uraiMessage}`}>{message.text}</p>)}
              {isGenerating ? <p className={`${styles.message} ${styles.uraiMessage} ${styles.thinkingMessage}`}>Listening…</p> : null}
            </div>
            {activeActionLabel ? <div className={styles.actionRow}><button type="button" className={styles.actionChip} onClick={runSuggestedAction}>{activeActionLabel}</button></div> : null}
            <div className={styles.quickPromptRow} aria-label="Quick prompts">{quickPrompts.map((prompt) => <button key={prompt.id} type="button" className={styles.quickPrompt} onClick={() => handleQuickPrompt(prompt)}>{prompt.label}</button>)}</div>
            <form className={styles.form} onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
              <textarea ref={inputRef} aria-label="Message URAI" className={styles.input} value={input} maxLength={MAX_MESSAGE_LENGTH} rows={1} placeholder="Say what you want to see…" onChange={(event) => setInput(event.target.value)} onKeyDown={handleInputKeyDown} />
              <button type="submit" className={styles.sendButton} disabled={isGenerating || input.trim().length === 0}>Send</button>
            </form>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}

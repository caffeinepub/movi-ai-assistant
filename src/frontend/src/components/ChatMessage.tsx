import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { SessionMessage } from "../backend";
import { Role } from "../backend";
import { MoviOrb } from "./MoviOrb";

interface ChatMessageProps {
  message: SessionMessage;
  isLatestAssistant?: boolean;
  shouldAnimate?: boolean;
}

function TypewriterText({
  text,
  onDone,
}: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const speed = Math.max(8, Math.min(20, 2000 / text.length));
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span
          className="cursor-blink"
          style={{ color: "oklch(0.72 0.22 290)" }}
        >
          ▋
        </span>
      )}
    </span>
  );
}

export function ChatMessage({
  message,
  isLatestAssistant,
  shouldAnimate,
}: ChatMessageProps) {
  const isUser = message.role === Role.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <MoviOrb size="sm" animated={false} />
        </div>
      )}

      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "message-user-bubble text-white rounded-br-sm"
            : "message-assistant-bubble rounded-bl-sm"
        }`}
        style={{
          color: isUser ? "white" : "oklch(0.87 0.02 264)",
        }}
      >
        {isLatestAssistant && shouldAnimate ? (
          <TypewriterText text={message.content} />
        ) : (
          <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
        )}
      </div>

      {isUser && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 text-xs font-bold text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.55 0.24 320))",
          }}
        >
          U
        </div>
      )}
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-3"
      data-ocid="chat.loading_state"
    >
      <div className="flex-shrink-0 mt-1">
        <MoviOrb size="sm" animated={false} />
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-bl-sm message-assistant-bubble">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-thinking-dot"
              style={{
                background: "oklch(0.62 0.16 290)",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

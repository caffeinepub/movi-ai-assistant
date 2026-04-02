import { Mic, Paperclip, Send } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

interface ChatComposerProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
  onValueChange?: (value: string) => void;
}

export function ChatComposer({
  onSend,
  isLoading,
  placeholder = "Ask Movi or type '/' for commands\u2026",
  initialValue = "",
  onValueChange,
}: ChatComposerProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      onValueChange?.(e.target.value);
      const ta = e.target;
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    },
    [onValueChange],
  );

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div
      className="px-4 py-4"
      style={{ borderTop: "1px solid oklch(0.22 0.03 264)" }}
    >
      <div
        className="flex items-end gap-2 rounded-2xl px-4 py-3"
        style={{
          background: "oklch(0.18 0.025 264)",
          border: "1px solid oklch(0.26 0.03 264)",
        }}
      >
        {/* Attachment button */}
        <button
          type="button"
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-0.5 transition-colors"
          style={{ color: "oklch(0.5 0.04 264)" }}
          disabled={isLoading}
          data-ocid="chat.upload_button"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
          style={{
            color: "oklch(0.87 0.02 264)",
            minHeight: 24,
            maxHeight: 160,
            lineHeight: "1.6",
          }}
          data-ocid="chat.textarea"
        />

        {/* Mic button */}
        <button
          type="button"
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-0.5 transition-all"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.22 240), oklch(0.48 0.2 220))",
            boxShadow: "0 2px 8px oklch(0.42 0.22 240 / 0.4)",
          }}
          disabled={isLoading}
        >
          <Mic className="w-3.5 h-3.5 text-white" />
        </button>

        {/* Send button */}
        <motion.button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          whileTap={{ scale: canSend ? 0.9 : 1 }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-0.5 transition-all"
          style={{
            background: canSend
              ? "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.55 0.24 320))"
              : "oklch(0.22 0.03 264)",
            boxShadow: canSend
              ? "0 2px 8px oklch(0.48 0.26 290 / 0.4)"
              : "none",
            cursor: canSend ? "pointer" : "default",
          }}
          data-ocid="chat.submit_button"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </motion.button>
      </div>
      <p
        className="text-center text-xs mt-2"
        style={{ color: "oklch(0.42 0.03 264)" }}
      >
        Movi can make mistakes. Verify important information.
      </p>
    </div>
  );
}

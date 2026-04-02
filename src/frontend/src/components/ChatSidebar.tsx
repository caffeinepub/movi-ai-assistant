import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, SquarePen, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ChatSession } from "../backend";
import { MoviOrb } from "./MoviOrb";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onOpenSettings: () => void;
  userName: string | null;
  isAdmin: boolean;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onOpenSettings,
  userName,
  isAdmin,
}: ChatSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: 260,
        minWidth: 260,
        background: "oklch(0.155 0.025 264)",
        borderRight: "1px solid oklch(0.22 0.03 264)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-4"
        style={{ borderBottom: "1px solid oklch(0.22 0.03 264)" }}
      >
        <MoviOrb size="sm" animated={false} />
        <span className="font-bold font-display text-white text-base tracking-tight">
          Movi
        </span>
      </div>

      {/* Chats section */}
      <div className="px-3 pt-4">
        <span
          className="text-xs font-semibold uppercase tracking-widest px-2 mb-2 block"
          style={{ color: "oklch(0.5 0.04 264)" }}
        >
          Chats
        </span>

        {/* New Chat button */}
        <button
          type="button"
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-2 transition-all group"
          style={{
            background: "oklch(0.22 0.04 290 / 0.35)",
            border: "1px solid oklch(0.32 0.08 290 / 0.35)",
          }}
          data-ocid="sidebar.new_chat.button"
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.32 0.1 290 / 0.5)" }}
          >
            <SquarePen
              className="w-3.5 h-3.5"
              style={{ color: "oklch(0.75 0.22 290)" }}
            />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: "oklch(0.82 0.04 264)" }}
          >
            New Chat
          </span>
        </button>
      </div>

      {/* Session list */}
      <ScrollArea className="flex-1 px-3">
        <div className="pb-2">
          <AnimatePresence initial={false}>
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                className="relative group"
                onMouseEnter={() => setHoveredId(session.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-ocid={`sidebar.session.item.${index + 1}`}
              >
                <button
                  type="button"
                  onClick={() => onSelectSession(session.id)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg mb-0.5 text-left transition-all"
                  style={{
                    background:
                      activeSessionId === session.id
                        ? "oklch(0.22 0.04 290 / 0.5)"
                        : hoveredId === session.id
                          ? "oklch(0.2 0.03 264)"
                          : "transparent",
                    border:
                      activeSessionId === session.id
                        ? "1px solid oklch(0.3 0.06 290 / 0.4)"
                        : "1px solid transparent",
                  }}
                >
                  <span
                    className="text-sm truncate flex-1"
                    style={{
                      color:
                        activeSessionId === session.id
                          ? "oklch(0.88 0.02 264)"
                          : "oklch(0.65 0.03 264)",
                    }}
                  >
                    {session.title}
                  </span>

                  {hoveredId === session.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-opacity"
                      style={{ color: "oklch(0.55 0.03 264)" }}
                      data-ocid={`sidebar.session.delete_button.${index + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {sessions.length === 0 && (
            <div
              className="px-3 py-6 text-center text-xs"
              style={{ color: "oklch(0.45 0.03 264)" }}
              data-ocid="sidebar.sessions.empty_state"
            >
              No conversations yet.
              <br />
              Start a new chat!
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer: user profile + settings */}
      <div
        className="px-3 py-3"
        style={{ borderTop: "1px solid oklch(0.22 0.03 264)" }}
      >
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback
              className="text-xs font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.55 0.24 320))",
                color: "white",
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <span
            className="flex-1 text-sm font-medium truncate"
            style={{ color: "oklch(0.78 0.02 264)" }}
          >
            {userName ?? "User"}
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
              style={{ color: "oklch(0.55 0.03 264)" }}
              data-ocid="sidebar.settings.button"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

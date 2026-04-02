import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Role } from "../backend";
import type { SessionMessage } from "../backend";
import { useActor } from "../hooks/useActor";
import {
  useDeleteSession,
  useGetApiKey,
  useGetSessionMessages,
  useGetSessions,
  useGetStarters,
  useGetUserProfile,
  useIsAdmin,
} from "../hooks/useQueries";
import { AdminSettingsModal } from "./AdminSettingsModal";
import { ChatComposer } from "./ChatComposer";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { ChatSidebar } from "./ChatSidebar";
import { SetupProfileModal } from "./SetupProfileModal";
import { WelcomeState } from "./WelcomeState";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function ChatApp() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<SessionMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSessionCreated, setIsSessionCreated] = useState(false);
  const [composerInitialValue, setComposerInitialValue] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [latestAssistantMsgId, setLatestAssistantMsgId] = useState<
    number | null
  >(null);
  const [animateLatest, setAnimateLatest] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { actor } = useActor();
  const { data: sessions = [], refetch: refetchSessions } = useGetSessions();
  const { data: sessionMessages = [] } = useGetSessionMessages(activeSessionId);
  const { data: starters = [] } = useGetStarters();
  const { data: userProfile } = useGetUserProfile();
  const { data: isAdmin = false } = useIsAdmin();
  const { data: apiKey = "" } = useGetApiKey();
  const deleteSessionMutation = useDeleteSession();

  const userName = userProfile?.name ?? null;
  const needsProfile = userProfile === null;

  // Merge backend messages with local optimistic messages
  const displayMessages: SessionMessage[] =
    activeSessionId && !isSessionCreated ? sessionMessages : localMessages;

  // Scroll to bottom when messages change
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on content change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [displayMessages, isTyping]);

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    setLocalMessages([]);
    setIsSessionCreated(false);
    setComposerInitialValue("");
    setAnimateLatest(false);
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSessionCreated(false);
    setLocalMessages([]);
    setComposerInitialValue("");
    setAnimateLatest(false);
  }, []);

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await deleteSessionMutation.mutateAsync(sessionId);
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          setLocalMessages([]);
          setIsSessionCreated(false);
        }
        toast.success("Chat deleted");
      } catch {
        toast.error("Failed to delete chat");
      }
    },
    [deleteSessionMutation, activeSessionId],
  );

  const handleSend = useCallback(
    async (message: string) => {
      if (!actor) return;

      const userMessage: SessionMessage = {
        content: message,
        role: Role.user,
        timestamp: BigInt(Date.now()),
      };

      setIsTyping(true);
      setAnimateLatest(false);

      // If starting a new session
      if (!activeSessionId) {
        const newSessionId = generateUUID();
        setActiveSessionId(newSessionId);
        setIsSessionCreated(true);
        setLocalMessages([userMessage]);

        try {
          await actor.createSession(newSessionId, message);
          const response = await actor.sendMessage(newSessionId, message);
          const assistantMessage: SessionMessage = {
            content: response,
            role: Role.assistant,
            timestamp: BigInt(Date.now()),
          };
          setLocalMessages([userMessage, assistantMessage]);
          setLatestAssistantMsgId(1);
          setAnimateLatest(true);
          refetchSessions();
        } catch {
          toast.error("Failed to send message");
          setLocalMessages([userMessage]);
        } finally {
          setIsTyping(false);
        }
      } else {
        // Existing session — append to local messages
        const currentMessages = isSessionCreated
          ? localMessages
          : [...sessionMessages];
        const newMessages = [...currentMessages, userMessage];
        setLocalMessages(newMessages);
        setIsSessionCreated(true);

        try {
          const response = await actor.sendMessage(activeSessionId, message);
          const assistantMessage: SessionMessage = {
            content: response,
            role: Role.assistant,
            timestamp: BigInt(Date.now()),
          };
          const withAssistant = [...newMessages, assistantMessage];
          setLocalMessages(withAssistant);
          setLatestAssistantMsgId(withAssistant.length - 1);
          setAnimateLatest(true);
          refetchSessions();
        } catch {
          toast.error("Failed to send message");
        } finally {
          setIsTyping(false);
        }
      }
    },
    [
      actor,
      activeSessionId,
      isSessionCreated,
      localMessages,
      sessionMessages,
      refetchSessions,
    ],
  );

  const handleStarterClick = useCallback((starter: string) => {
    setComposerInitialValue(starter);
  }, []);

  const isWelcomeState = !activeSessionId && displayMessages.length === 0;
  const isEmptyNewChat =
    activeSessionId && displayMessages.length === 0 && !isTyping;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "oklch(0.13 0.02 264)" }}
    >
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.025 264)",
            border: "1px solid oklch(0.26 0.03 264)",
            color: "oklch(0.87 0.02 264)",
          },
        }}
      />

      {/* Setup profile modal */}
      {needsProfile && <SetupProfileModal open={needsProfile} />}

      {/* Admin settings modal */}
      {settingsOpen && (
        <AdminSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          currentApiKey={apiKey}
        />
      )}

      {/* Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setSettingsOpen(true)}
        userName={userName}
        isAdmin={isAdmin}
      />

      {/* Main panel */}
      <main className="flex-1 flex flex-col min-w-0" data-ocid="chat.panel">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid oklch(0.2 0.03 264)" }}
        >
          <div
            className="text-sm font-medium"
            style={{ color: "oklch(0.65 0.03 264)" }}
          >
            {activeSessionId
              ? (sessions.find((s) => s.id === activeSessionId)?.title ??
                "Chat")
              : "New Conversation"}
          </div>
        </div>

        {/* Messages area */}
        <AnimatePresence mode="wait">
          {isWelcomeState ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <WelcomeState
                userName={userName}
                starters={starters}
                onStarterClick={handleStarterClick}
              />
              <ChatComposer
                onSend={handleSend}
                isLoading={isTyping}
                initialValue={composerInitialValue}
                onValueChange={(v) => setComposerInitialValue(v)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Message list */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
                data-ocid="chat.message.list"
              >
                {(isEmptyNewChat ? [] : displayMessages).map((msg, index) => (
                  <ChatMessage
                    // biome-ignore lint/suspicious/noArrayIndexKey: no stable key available
                    key={`${activeSessionId}-${index}`}
                    message={msg}
                    isLatestAssistant={
                      msg.role === Role.assistant &&
                      index === latestAssistantMsgId
                    }
                    shouldAnimate={animateLatest}
                  />
                ))}

                <AnimatePresence>
                  {isTyping && <TypingIndicator key="typing" />}
                </AnimatePresence>
              </div>

              {/* Composer */}
              <ChatComposer
                onSend={handleSend}
                isLoading={isTyping}
                initialValue={composerInitialValue}
                onValueChange={(v) => setComposerInitialValue(v)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

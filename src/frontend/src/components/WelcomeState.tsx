import { motion } from "motion/react";
import { MoviOrb } from "./MoviOrb";

interface WelcomeStateProps {
  userName: string | null;
  starters: string[];
  onStarterClick: (starter: string) => void;
}

export function WelcomeState({
  userName,
  starters,
  onStarterClick,
}: WelcomeStateProps) {
  const displayName = userName ?? "there";

  const defaultStarters = [
    "Summarize this article",
    "Plan my week",
    "Brainstorm app names",
    "Draft an email",
  ];

  const displayStarters = starters.length > 0 ? starters : defaultStarters;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 text-center max-w-lg"
      >
        {/* Orb */}
        <div className="animate-float">
          <MoviOrb size="lg" animated />
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1
            className="text-3xl font-bold font-display"
            style={{ color: "oklch(0.94 0.01 264)" }}
          >
            Welcome to Movi, {displayName}.
          </h1>
          <p
            className="text-sm mt-2 leading-relaxed"
            style={{ color: "oklch(0.58 0.03 264)" }}
          >
            Your intelligent assistant is ready. Ask me anything — I'm here to
            help you think, create, and accomplish more.
          </p>
        </motion.div>

        {/* Suggested starters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-3"
            style={{ color: "oklch(0.5 0.04 264)" }}
          >
            Suggested starters
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {displayStarters.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => onStarterClick(starter)}
                className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "oklch(0.2 0.03 264)",
                  border: "1px solid oklch(0.28 0.04 264)",
                  color: "oklch(0.72 0.04 264)",
                }}
                data-ocid="chat.starter.button"
              >
                {starter}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import {
  Brain,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { MoviOrb } from "./MoviOrb";

interface LandingPageProps {
  onLogin: () => void;
  isLoggingIn: boolean;
}

const features = [
  {
    icon: Brain,
    title: "Context-Aware Intelligence",
    description:
      "Movi remembers your conversations and adapts to your unique communication style.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Responses",
    description:
      "Powered by state-of-the-art language models for near-instant answers.",
  },
  {
    icon: Globe,
    title: "Multi-Domain Expertise",
    description:
      "From coding to creative writing, research to planning — Movi handles it all.",
  },
  {
    icon: Sparkles,
    title: "Creative Brainstorming",
    description:
      "Generate ideas, draft content, and explore possibilities with your AI partner.",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description: "Talk to Movi the way you talk to a knowledgeable friend.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your conversations are stored on the Internet Computer, ensuring full privacy.",
  },
];

export function LandingPage({ onLogin, isLoggingIn }: LandingPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.11 0.02 264)" }}
    >
      {/* Navigation */}
      <nav
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: "oklch(0.22 0.03 264)" }}
      >
        <div className="flex items-center gap-3">
          <MoviOrb size="sm" animated={false} />
          <span className="text-xl font-bold font-display text-white tracking-tight">
            Movi
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "Pricing", "Use Cases", "Blog"].map((link) => (
            <a
              key={link}
              href="./"
              className="text-sm font-medium transition-colors hover:text-white"
              style={{ color: "oklch(0.78 0.03 264)" }}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onLogin}
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "oklch(0.78 0.03 264)" }}
            data-ocid="landing.login.button"
          >
            Log In
          </button>
          <Button
            onClick={onLogin}
            disabled={isLoggingIn}
            className="px-5 py-2 text-sm font-semibold text-white rounded-full"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.55 0.24 305))",
              border: "none",
            }}
            data-ocid="landing.signup.button"
          >
            {isLoggingIn ? "Connecting..." : "Sign Up"}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-8 pt-20 pb-16 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: hero copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{
                  background: "oklch(0.22 0.06 290 / 0.6)",
                  border: "1px solid oklch(0.35 0.1 290 / 0.5)",
                  color: "oklch(0.78 0.16 290)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Powered by advanced AI
              </div>

              <h1
                className="text-5xl lg:text-6xl font-bold font-display leading-tight mb-6"
                style={{ color: "oklch(0.96 0.01 264)" }}
              >
                Your AI,{" "}
                <span className="brand-gradient-text">Supercharged</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "oklch(0.65 0.03 264)" }}
              >
                Meet Movi — the intelligent assistant that thinks, creates, and
                communicates like a trusted partner. Ask anything, build
                anything, achieve anything.
              </p>

              <div className="flex items-center gap-4">
                <Button
                  onClick={onLogin}
                  disabled={isLoggingIn}
                  size="lg"
                  className="px-8 py-3 text-base font-semibold text-white rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.62 0.24 320))",
                    border: "none",
                    boxShadow: "0 8px 32px oklch(0.48 0.26 290 / 0.4)",
                  }}
                  data-ocid="landing.hero.primary_button"
                >
                  {isLoggingIn ? "Connecting..." : "Get Started Free"}
                </Button>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.55 0.03 264)" }}
                >
                  No credit card needed
                </span>
              </div>
            </motion.div>

            {/* Right: feature blurbs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {features.slice(0, 4).map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="p-4 rounded-xl"
                  style={{
                    background: "oklch(0.16 0.025 264)",
                    border: "1px solid oklch(0.24 0.03 264)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: "oklch(0.22 0.06 290 / 0.5)" }}
                  >
                    <feature.icon
                      className="w-4 h-4"
                      style={{ color: "oklch(0.72 0.22 290)" }}
                    />
                  </div>
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{ color: "oklch(0.9 0.01 264)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.55 0.03 264)" }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* App preview window */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 mx-auto max-w-5xl"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 40px 120px oklch(0 0 0 / 0.7), 0 8px 32px oklch(0 0 0 / 0.5)",
                border: "1px solid oklch(0.24 0.03 264)",
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: "oklch(0.14 0.025 264)",
                  borderBottom: "1px solid oklch(0.22 0.03 264)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "oklch(0.65 0.22 25)" }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "oklch(0.75 0.18 75)" }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: "oklch(0.65 0.22 145)" }}
                />
                <div className="flex-1 mx-4">
                  <div
                    className="mx-auto w-40 h-5 rounded"
                    style={{ background: "oklch(0.2 0.025 264)" }}
                  />
                </div>
              </div>

              {/* App preview content */}
              <div
                className="flex"
                style={{ background: "oklch(0.13 0.02 264)", minHeight: 320 }}
              >
                {/* Sidebar preview */}
                <div
                  className="w-52 border-r flex flex-col"
                  style={{
                    background: "oklch(0.155 0.025 264)",
                    borderColor: "oklch(0.22 0.03 264)",
                  }}
                >
                  <div className="p-4">
                    <div
                      className="text-xs font-semibold uppercase tracking-widest mb-3"
                      style={{ color: "oklch(0.5 0.04 264)" }}
                    >
                      Chats
                    </div>
                    <div
                      className="rounded-lg px-3 py-2.5 mb-2 flex items-center gap-2"
                      style={{
                        background: "oklch(0.22 0.04 290 / 0.4)",
                        border: "1px solid oklch(0.32 0.08 290 / 0.4)",
                      }}
                    >
                      <span
                        className="w-4 h-4 text-xs"
                        style={{ color: "oklch(0.72 0.22 290)" }}
                      >
                        ✎
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "oklch(0.9 0.01 264)" }}
                      >
                        New Chat
                      </span>
                    </div>
                    {[
                      "Write a Python script",
                      "Explain black holes",
                      "Plan my vacation",
                    ].map((item) => (
                      <div
                        key={item}
                        className="px-3 py-2 rounded-lg mb-1 text-xs truncate"
                        style={{ color: "oklch(0.62 0.03 264)" }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main panel preview */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-5">
                  <MoviOrb size="md" animated={false} />
                  <div className="text-center">
                    <p
                      className="text-xl font-bold"
                      style={{ color: "oklch(0.94 0.01 264)" }}
                    >
                      Welcome to Movi
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "oklch(0.58 0.03 264)" }}
                    >
                      Your intelligent assistant, ready to help.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "Summarize this article",
                      "Plan my week",
                      "Brainstorm app names",
                    ].map((chip) => (
                      <div
                        key={chip}
                        className="px-3 py-1.5 rounded-full text-xs"
                        style={{
                          background: "oklch(0.22 0.03 264)",
                          border: "1px solid oklch(0.3 0.03 264)",
                          color: "oklch(0.7 0.03 264)",
                        }}
                      >
                        {chip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features grid */}
        <section className="px-8 py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2
              className="text-4xl font-bold font-display mb-4"
              style={{ color: "oklch(0.94 0.01 264)" }}
            >
              Everything you need,{" "}
              <span className="brand-gradient-text">reimagined</span>
            </h2>
            <p className="text-lg" style={{ color: "oklch(0.6 0.03 264)" }}>
              Movi brings a new level of intelligence to every interaction.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{
                  background: "oklch(0.155 0.025 264)",
                  border: "1px solid oklch(0.22 0.03 264)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "oklch(0.22 0.08 290 / 0.5)" }}
                >
                  <feature.icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.72 0.22 290)" }}
                  />
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ color: "oklch(0.9 0.01 264)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.58 0.03 264)" }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t px-8 py-8"
        style={{ borderColor: "oklch(0.22 0.03 264)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MoviOrb size="sm" animated={false} />
            <span className="font-bold font-display text-white">Movi</span>
          </div>
          <p className="text-sm" style={{ color: "oklch(0.45 0.03 264)" }}>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "oklch(0.65 0.15 290)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

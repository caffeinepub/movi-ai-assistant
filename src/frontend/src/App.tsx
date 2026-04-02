import { Skeleton } from "@/components/ui/skeleton";
import { ChatApp } from "./components/ChatApp";
import { LandingPage } from "./components/LandingPage";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

export default function App() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "oklch(0.11 0.02 264)" }}
        data-ocid="app.loading_state"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.55 0.24 320))",
            }}
          />
          <Skeleton
            className="h-4 w-32"
            style={{ background: "oklch(0.2 0.03 264)" }}
          />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  return <ChatApp />;
}

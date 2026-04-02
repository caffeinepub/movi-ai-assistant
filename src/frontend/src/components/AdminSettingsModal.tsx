import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSetApiKey } from "../hooks/useQueries";

interface AdminSettingsModalProps {
  open: boolean;
  onClose: () => void;
  currentApiKey: string;
}

export function AdminSettingsModal({
  open,
  onClose,
  currentApiKey,
}: AdminSettingsModalProps) {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);
  const setApiKeyMutation = useSetApiKey();

  const handleSave = async () => {
    try {
      await setApiKeyMutation.mutateAsync(apiKey);
      toast.success("API key saved successfully");
      onClose();
    } catch {
      toast.error("Failed to save API key");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: "oklch(0.16 0.025 264)",
          border: "1px solid oklch(0.26 0.03 264)",
          color: "oklch(0.87 0.02 264)",
        }}
        data-ocid="admin.settings.dialog"
      >
        <DialogHeader>
          <DialogTitle style={{ color: "oklch(0.94 0.01 264)" }}>
            Admin Settings
          </DialogTitle>
          <DialogDescription style={{ color: "oklch(0.58 0.03 264)" }}>
            Configure the AI model API key for Movi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label style={{ color: "oklch(0.78 0.02 264)" }}>API Key</Label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
                style={{
                  background: "oklch(0.2 0.03 264)",
                  border: "1px solid oklch(0.28 0.03 264)",
                  color: "oklch(0.87 0.02 264)",
                }}
                data-ocid="admin.apikey.input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "oklch(0.55 0.03 264)" }}
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            style={{ color: "oklch(0.62 0.03 264)" }}
            data-ocid="admin.settings.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={setApiKeyMutation.isPending}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.55 0.24 320))",
              border: "none",
              color: "white",
            }}
            data-ocid="admin.settings.save_button"
          >
            {setApiKeyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Key"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

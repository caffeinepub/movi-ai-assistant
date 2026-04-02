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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSaveUserProfile } from "../hooks/useQueries";
import { MoviOrb } from "./MoviOrb";

interface SetupProfileModalProps {
  open: boolean;
}

export function SetupProfileModal({ open }: SetupProfileModalProps) {
  const [name, setName] = useState("");
  const saveProfile = useSaveUserProfile();

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success(`Welcome to Movi, ${name.trim()}!`);
    } catch {
      toast.error("Failed to save profile");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
        style={{
          background: "oklch(0.16 0.025 264)",
          border: "1px solid oklch(0.26 0.03 264)",
          color: "oklch(0.87 0.02 264)",
        }}
        data-ocid="profile.setup.dialog"
      >
        <DialogHeader className="items-center">
          <div className="mb-2">
            <MoviOrb size="md" animated />
          </div>
          <DialogTitle style={{ color: "oklch(0.94 0.01 264)" }}>
            Welcome to Movi!
          </DialogTitle>
          <DialogDescription style={{ color: "oklch(0.58 0.03 264)" }}>
            Let's get you set up. What should Movi call you?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label style={{ color: "oklch(0.78 0.02 264)" }}>Your name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              style={{
                background: "oklch(0.2 0.03 264)",
                border: "1px solid oklch(0.28 0.03 264)",
                color: "oklch(0.87 0.02 264)",
              }}
              data-ocid="profile.name.input"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!name.trim() || saveProfile.isPending}
          className="w-full"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.48 0.26 290), oklch(0.55 0.24 320))",
            border: "none",
            color: "white",
          }}
          data-ocid="profile.save.primary_button"
        >
          {saveProfile.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Let's go!"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

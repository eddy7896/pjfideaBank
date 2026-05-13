"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Copy, Check } from "lucide-react";

interface CreateTeamModalProps {
  open: boolean;
  schoolName: string;
  onClose: () => void;
  onSubmit: (name: string, memberNames: string[]) => { id: string; pin: string };
}

export function CreateTeamModal({
  open,
  schoolName,
  onClose,
  onSubmit,
}: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const [createdTeam, setCreatedTeam] = useState<{ id: string; pin: string } | null>(null);
  const [copiedField, setCopiedField] = useState<"id" | "pin" | null>(null);

  const handleAddMember = () => {
    if (newMember.trim() && !memberNames.includes(newMember.trim())) {
      setMemberNames([...memberNames, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (index: number) => {
    setMemberNames(memberNames.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!teamName.trim()) return;
    const result = onSubmit(teamName.trim(), memberNames);
    setCreatedTeam(result);
  };

  const handleClose = () => {
    setTeamName("");
    setMemberNames([]);
    setNewMember("");
    setCreatedTeam(null);
    onClose();
  };

  const copyToClipboard = (text: string, field: "id" | "pin") => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (createdTeam) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Team Created Successfully!</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-900">
                Your team <strong>{teamName}</strong> is ready to use. Share these credentials with your students.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">Team ID</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={createdTeam.id}
                    className="font-mono text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdTeam.id, "id")}
                  >
                    {copiedField === "id" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">6-Digit PIN</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={createdTeam.pin}
                    className="font-mono text-sm tracking-widest"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(createdTeam.pin, "pin")}
                  >
                    {copiedField === "pin" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="teamName" className="text-sm font-medium">
              Team Name
            </Label>
            <Input
              id="teamName"
              placeholder="e.g., Green Sparks"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Team Members (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add member name..."
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMember}
                disabled={!newMember.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {memberNames.length > 0 && (
              <div className="space-y-2">
                {memberNames.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3"
                  >
                    <span className="text-sm">{member}</span>
                    <button
                      onClick={() => handleRemoveMember(index)}
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!teamName.trim()} className="flex-1">
              Create Team
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

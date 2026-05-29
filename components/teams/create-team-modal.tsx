"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Copy, Check } from "lucide-react";
import type { TeamMember, StudentTeam } from "@/types";

interface CreateTeamModalProps {
  open: boolean;
  schoolName: string;
  onClose: () => void;
  onSubmit: (name: string, members: TeamMember[]) => Promise<{ id: string; pin: string }>;
  teamToEdit?: StudentTeam | null;
}

const GRADES = ["9", "10", "11", "12"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export function CreateTeamModal({
  open,
  schoolName,
  onClose,
  onSubmit,
  teamToEdit = null,
}: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (teamToEdit) {
      setTeamName(teamToEdit.name);
      setMembers(teamToEdit.members || []);
    } else {
      setTeamName("");
      setMembers([]);
    }
    setCreatedTeam(null);
  }, [teamToEdit, open]);
  const [newMember, setNewMember] = useState({
    name: "",
    grade: "",
    contactNumber: "",
    gender: "",
  });
  const [createdTeam, setCreatedTeam] = useState<{ id: string; pin: string } | null>(null);
  const [copiedField, setCopiedField] = useState<"id" | "pin" | null>(null);

  const handleAddMember = () => {
    if (
      newMember.name.trim() &&
      newMember.grade &&
      newMember.contactNumber.trim() &&
      newMember.gender
    ) {
      setMembers([
        ...members,
        {
          name: newMember.name.trim(),
          grade: newMember.grade,
          contactNumber: newMember.contactNumber.trim(),
          gender: newMember.gender as "Male" | "Female" | "Non-binary" | "Prefer not to say",
        },
      ]);
      setNewMember({ name: "", grade: "", contactNumber: "", gender: "" });
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    const result = await onSubmit(teamName.trim(), members);
    setCreatedTeam(result);
  };

  const handleClose = () => {
    setTeamName("");
    setMembers([]);
    setNewMember({ name: "", grade: "", contactNumber: "", gender: "" });
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
            <DialogTitle>
              {teamToEdit ? "Team Updated Successfully!" : "Team Created Successfully!"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-900">
                {teamToEdit ? (
                  <>Your team <strong>{teamName}</strong> has been updated and a new 6-digit PIN has been generated. Share these credentials with your students.</>
                ) : (
                  <>Your team <strong>{teamName}</strong> is ready to use. Share these credentials with your students.</>
                )}
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{teamToEdit ? "Edit Team" : "Create New Team"}</DialogTitle>
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
            <Label className="text-sm font-medium">Team Members</Label>
            <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="memberName" className="text-xs text-muted-foreground mb-1">
                    Student Name
                  </Label>
                  <Input
                    id="memberName"
                    placeholder="e.g., Alice Johnson"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="memberGender" className="text-xs text-muted-foreground mb-1">
                    Gender
                  </Label>
                  <Select value={newMember.gender || ""} onValueChange={(val) =>
                    setNewMember({ ...newMember, gender: val || "" })
                  }>
                    <SelectTrigger id="memberGender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="memberGrade" className="text-xs text-muted-foreground mb-1">
                    Grade
                  </Label>
                  <Select value={newMember.grade || ""} onValueChange={(val) =>
                    setNewMember({ ...newMember, grade: val || "" })
                  }>
                    <SelectTrigger id="memberGrade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="memberContact" className="text-xs text-muted-foreground mb-1">
                    Contact Number
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="memberContact"
                      placeholder="e.g., 555-0123"
                      value={newMember.contactNumber}
                      onChange={(e) =>
                        setNewMember({ ...newMember, contactNumber: e.target.value })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddMember}
                      disabled={
                        !newMember.name.trim() ||
                        !newMember.grade ||
                        !newMember.gender ||
                        !newMember.contactNumber.trim()
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {members.length} member{members.length !== 1 ? "s" : ""} added
                </p>
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Grade {member.grade} · {member.gender} · {member.contactNumber}
                      </p>
                    </div>
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
            <Button
              onClick={handleCreate}
              disabled={!teamName.trim() || members.length === 0}
              className="flex-1"
            >
              {teamToEdit ? "Save Changes" : "Create Team"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

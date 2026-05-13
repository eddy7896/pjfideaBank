"use client";

import { useState } from "react";
import { Users, Eye, EyeOff, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTeamModal } from "@/components/teams/create-team-modal";
import { useTeamStore } from "@/store/use-team-store";
import { useIdeaStore } from "@/store/use-idea-store";
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "sonner";

export default function TeamsPage() {
  const { currentUser } = useAuthStore();
  const { teams, createTeam, deleteTeam, getTeamsBySchool } = useTeamStore();
  const { ideas } = useIdeaStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visiblePins, setVisiblePins] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== "school") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Only teachers can manage teams.</p>
        </div>
      </div>
    );
  }

  const schoolTeams = getTeamsBySchool(currentUser.schoolName!);
  const getProjectCount = (teamId: string) => {
    return ideas.filter((i) => i.teamId === teamId).length;
  };

  const handleCreateTeam = (name: string, memberNames: string[]) => {
    const newTeam = createTeam(name, currentUser.schoolName!, memberNames);
    toast.success(`Team "${name}" created successfully!`);
    setIsModalOpen(false);
    return { id: newTeam.id, pin: newTeam.pin };
  };

  const handleDeleteTeam = (id: string) => {
    deleteTeam(id);
    setDeleteTarget(null);
    toast.success("Team deleted");
  };

  const togglePinVisibility = (teamId: string) => {
    const newVisiblePins = new Set(visiblePins);
    if (newVisiblePins.has(teamId)) {
      newVisiblePins.delete(teamId);
    } else {
      newVisiblePins.add(teamId);
    }
    setVisiblePins(newVisiblePins);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
              <p className="text-sm text-muted-foreground">
                {schoolTeams.length} team{schoolTeams.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Teams List */}
        {schoolTeams.length > 0 ? (
          <div className="space-y-4">
            {schoolTeams.map((team) => (
              <div
                key={team.id}
                className="rounded-xl border border-border/50 bg-card p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {team.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mb-4">
                  {/* Team ID */}
                  <div className="rounded-lg border border-border/50 bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Team ID
                    </p>
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {team.id}
                    </p>
                  </div>

                  {/* PIN */}
                  <div className="rounded-lg border border-border/50 bg-background p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        6-Digit PIN
                      </p>
                      <button
                        onClick={() => togglePinVisibility(team.id)}
                        className="text-muted-foreground hover:text-foreground transition"
                      >
                        {visiblePins.has(team.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-sm font-semibold text-foreground tracking-widest">
                      {visiblePins.has(team.id) ? team.pin : "••••••"}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="rounded-lg border border-border/50 bg-background p-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Members
                        </p>
                        <p className="font-semibold text-foreground">
                          {team.memberNames.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Projects
                        </p>
                        <p className="font-semibold text-foreground">
                          {getProjectCount(team.id)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Members List */}
                {team.memberNames.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-3">
                      Members
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {team.memberNames.map((member, idx) => (
                        <Badge key={idx} variant="outline">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">No teams yet</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Create your first team to start assigning projects to students
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      <CreateTeamModal
        open={isModalOpen}
        schoolName={currentUser.schoolName!}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTeam}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete Team</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The team will be deleted but existing projects will remain.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleDeleteTeam(deleteTarget)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

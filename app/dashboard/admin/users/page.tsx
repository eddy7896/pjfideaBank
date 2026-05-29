"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, MapPin, Trash2, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/use-auth-store";
import { toast } from "sonner";

type GeoRow = {
  id: string;
  name: string;
  code: string;
  subGeographies: { id: string; name: string }[];
};

type UserRow = {
  id: number;
  role: string;
  displayName: string;
  email: string;
  geographyId: string | null;
  geography?: { id: string; name: string; code: string } | null;
  assignedSubGeos: { subGeography: { id: string; name: string; geographyId: string } }[];
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { currentUser } = useAuthStore();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [geos, setGeos] = useState<GeoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    role: "geography-lead" as "geography-lead" | "super-admin" | "program-lead",
    displayName: "",
    email: "",
    password: "",
    geographyId: "",
    subGeographyIds: [] as string[],
  });

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role !== "super-admin") {
      router.replace("/dashboard");
      return;
    }
    void load();
  }, [currentUser, router]);

  async function load() {
    setLoading(true);
    try {
      const [u, g] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/geographies", { credentials: "include" }),
      ]);
      if (u.ok) setUsers(await u.json());
      if (g.ok) setGeos(await g.json());
    } finally {
      setLoading(false);
    }
  }

  const selectedGeo = useMemo(
    () => geos.find((g) => g.id === form.geographyId),
    [geos, form.geographyId]
  );

  function resetForm() {
    setForm({
      role: "geography-lead",
      displayName: "",
      email: "",
      password: "",
      geographyId: "",
      subGeographyIds: [],
    });
  }

  async function handleCreate() {
    setSubmitting(true);
    try {
      const body: any = {
        role: form.role,
        displayName: form.displayName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      if (form.role === "geography-lead") {
        if (!form.geographyId) {
          toast.error("Pick a state");
          return;
        }
        body.geographyId = form.geographyId;
        body.subGeographyIds = form.subGeographyIds;
      }
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to create user");
        return;
      }
      toast.success(`${form.role} account created`);
      setModalOpen(false);
      resetForm();
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "Failed to delete");
      return;
    }
    toast.success("User deleted");
    setDeleteTarget(null);
    await load();
  }

  if (!currentUser || currentUser.role !== "super-admin") return null;

  const superAdmins = users.filter((u) => u.role === "super-admin");
  const programLeads = users.filter((u) => u.role === "program-lead");
  const leads = users.filter((u) => u.role === "geography-lead");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin · Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage super-admins and geography-leads. Teacher-trainers
            and schools self-register; they are not minted here.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New account
        </Button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <div className="space-y-8">
          <UserSection
            title="Super Admins"
            icon={<ShieldCheck className="h-4 w-4" />}
            rows={superAdmins}
            onDelete={setDeleteTarget}
            currentUserId={String(currentUser.email)}
          />
          <UserSection
            title="Program Leads / TTLs"
            icon={<ShieldCheck className="h-4 w-4" />}
            rows={programLeads}
            onDelete={setDeleteTarget}
            currentUserId={String(currentUser.email)}
          />
          <UserSection
            title="Geography Leads"
            icon={<MapPin className="h-4 w-4" />}
            rows={leads}
            onDelete={setDeleteTarget}
            currentUserId={String(currentUser.email)}
          />
        </div>
      )}

      {/* Create modal */}
      <Dialog open={modalOpen} onOpenChange={(o) => { setModalOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create account</DialogTitle>
            <DialogDescription>
              Super-admins have full system oversight. Geography-leads are
              scoped to a state and (optionally) specific districts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    role: v as any,
                    geographyId: "",
                    subGeographyIds: [],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geography-lead">Geography Lead</SelectItem>
                  <SelectItem value="program-lead">Program Lead / TTL</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
              />
            </div>

            {form.role === "geography-lead" && (
              <>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <Select
                    value={form.geographyId}
                    onValueChange={(v) =>
                      setForm({ ...form, geographyId: v ?? "", subGeographyIds: [] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {geos.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          {g.name} ({g.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedGeo && selectedGeo.subGeographies.length > 0 && (
                  <div className="space-y-2">
                    <Label>
                      Districts (leave all unchecked for state-wide scope)
                    </Label>
                    <div className="max-h-48 overflow-y-auto rounded-md border border-border/50 p-3 space-y-2">
                      {selectedGeo.subGeographies.map((s) => {
                        const checked = form.subGeographyIds.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) => {
                                const next = c
                                  ? [...form.subGeographyIds, s.id]
                                  : form.subGeographyIds.filter((id) => id !== s.id);
                                setForm({ ...form, subGeographyIds: next });
                              }}
                            />
                            <span>{s.name}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {form.subGeographyIds.length === 0
                        ? "Lead will see every school in the state."
                        : `Lead will see schools in ${form.subGeographyIds.length} district${form.subGeographyIds.length === 1 ? "" : "s"}.`}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete user</DialogTitle>
                <DialogDescription>
                  This deletes the account and all its assignments. Cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">{deleteTarget?.displayName}</strong>{" "}
              ({deleteTarget?.email})
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserSection({
  title,
  icon,
  rows,
  onDelete,
  currentUserId,
}: {
  title: string;
  icon: React.ReactNode;
  rows: UserRow[];
  onDelete: (u: UserRow) => void;
  currentUserId: string;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
          {icon}
        </div>
        <h2 className="font-semibold">{title}</h2>
        <Badge variant="outline">{rows.length}</Badge>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-6 text-sm text-muted-foreground text-center">
          None yet.
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/50 bg-card p-4"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{u.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                {u.role === "geography-lead" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {u.geography?.name ?? "no state"}
                    {u.assignedSubGeos.length > 0 && (
                      <>
                        {" "}·{" "}
                        {u.assignedSubGeos.map((j) => j.subGeography.name).join(", ")}
                      </>
                    )}
                    {u.role === "geography-lead" && u.assignedSubGeos.length === 0 && (
                      <> · state-wide</>
                    )}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(u)}
                disabled={u.email === currentUserId}
                title={u.email === currentUserId ? "Cannot delete yourself" : undefined}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

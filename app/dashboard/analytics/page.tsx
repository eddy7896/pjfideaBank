"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/use-auth-store";
import { useIdeaStore } from "@/store/use-idea-store";
import { useTeamStore } from "@/store/use-team-store";
import { useSchoolStore } from "@/store/use-school-store";
import {
  computeAnalytics,
  computeIdeasByDay,
  computeIdeasByGeography,
} from "@/lib/analytics";
import { HeatmapGrid } from "@/components/analytics/heatmap-grid";
import { RosterTable } from "@/components/analytics/roster-table";
import { AuditLogTable } from "@/components/analytics/audit-log-table";
import { Users, Lightbulb, School as SchoolIcon, Users2, Info, Database, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const HEATMAP_ROW_HEADING: Record<string, string> = {
  geography: "State",
  subGeography: "District",
  school: "School",
};

interface AnalyticsExtra {
  heatmap: { rowKind: string; rows: string[]; cols: string[]; matrix: number[][] };
  roster: {
    id: number;
    displayName: string;
    email: string;
    role: string;
    scopeLabel: string;
    ideaCount: number;
    teamCount: number;
  }[];
  systemHealth?: {
    recordCounts: Record<string, number>;
    auditLog: {
      entries: {
        id: string;
        actorId: string | null;
        actorRole: string | null;
        action: string;
        entityType: string;
        entityId: string | null;
        schoolName: string | null;
        createdAt: string;
      }[];
      total: number;
      page: number;
      pageSize: number;
    };
    auditByAction: { action: string; count: number }[];
  };
}

// recharts is a meaningful chunk of JS that only this route needs - load it
// only once a chart actually mounts, not as part of every dashboard visit.
const ChartSkeleton = ({ height = 220 }: { height?: number }) => (
  <div className="w-full animate-pulse rounded-lg bg-muted" style={{ height }} />
);
const TrendAreaChart = dynamic(
  () => import("@/components/analytics/trend-area-chart").then((m) => m.TrendAreaChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);
const CategoryBarChart = dynamic(
  () => import("@/components/analytics/category-bar-chart").then((m) => m.CategoryBarChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const STAGE_VAR: Record<string, string> = {
  Empathize: "var(--stage-empathize)",
  Define: "var(--stage-define)",
  Ideate: "var(--stage-ideate)",
  Prototype: "var(--stage-prototype)",
  Test: "var(--stage-test)",
};

const GENDER_VAR: Record<string, string> = {
  Male: "var(--gender-male)",
  Female: "var(--gender-female)",
  "Non-binary": "var(--gender-nonbinary)",
  "Prefer not to say": "var(--gender-unspecified)",
};

const ROLE_COPY: Partial<
  Record<Role, { headline: string; subtitle: string; scopeNote?: string }>
> = {
  "super-admin": {
    headline: "System Overview",
    subtitle: "Every school, every state — full platform visibility.",
  },
  "program-lead": {
    headline: "Program Overview",
    subtitle: "Global roll-up across every geography.",
  },
  "geography-lead": {
    headline: "State Overview",
    subtitle: "Schools and projects across your assigned state.",
  },
  "teacher-trainer": {
    headline: "District Overview",
    subtitle: "Schools and projects in your assigned district.",
  },
  "sed-department": {
    headline: "Regional Monitoring",
    subtitle: "Advanced-stage projects in your state.",
    scopeNote:
      "You're viewing Prototype and Test-stage projects only — the ones ready for department review.",
  },
  school: {
    headline: "School Overview",
    subtitle: "Your school's projects and teams.",
  },
};

function BentoCard({
  title,
  description,
  colSpan = 1,
  className,
  children,
  index = 0,
}: {
  title?: string;
  description?: string;
  colSpan?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
  index?: number;
}) {
  const spanClass = {
    1: "lg:col-span-1",
    2: "lg:col-span-2",
    3: "lg:col-span-3",
    4: "lg:col-span-4",
  }[colSpan];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={spanClass}
    >
      <Card className={cn("h-full border-border shadow-sm", className)}>
        {(title || description) && (
          <CardHeader className="pb-2">
            {title && <CardTitle className="text-sm font-semibold">{title}</CardTitle>}
            {description && (
              <CardDescription className="text-xs">{description}</CardDescription>
            )}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
  index,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
    </motion.div>
  );
}

function RankedList({
  rows,
  emptyLabel,
}: {
  rows: { label: string; count: number }[];
  emptyLabel: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="truncate font-medium text-foreground">{row.label}</span>
            <span className="tabular-nums font-semibold text-foreground">{row.count}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function GenderBar({
  breakdown,
}: {
  breakdown: { Male: number; Female: number; "Non-binary": number; "Prefer not to say": number };
}) {
  const segments = (
    ["Female", "Male", "Non-binary", "Prefer not to say"] as const
  ).map((key) => ({ key, value: breakdown[key] }));
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No students yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {segments
          .filter((s) => s.value > 0)
          .map((s) => (
            <div
              key={s.key}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${(s.value / total) * 100}%`,
                backgroundColor: GENDER_VAR[s.key],
                marginRight: "2px",
              }}
            />
          ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: GENDER_VAR[s.key] }}
            />
            <span className="truncate text-muted-foreground">{s.key}</span>
            <span className="ml-auto tabular-nums font-semibold text-foreground">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { currentUser } = useAuthStore();
  const { ideas } = useIdeaStore();
  const { teams } = useTeamStore();
  const { schools } = useSchoolStore();

  const allowedRoles: Role[] = [
    "super-admin",
    "program-lead",
    "geography-lead",
    "teacher-trainer",
    "sed-department",
    "school",
  ];

  const analytics = useMemo(() => computeAnalytics(ideas, teams, []), [ideas, teams]);
  const trend = useMemo(() => computeIdeasByDay(ideas, 14), [ideas]);
  const geography = useMemo(
    () => computeIdeasByGeography(ideas, schools),
    [ideas, schools]
  );

  const [extra, setExtra] = useState<AnalyticsExtra | null>(null);
  const [extraLoading, setExtraLoading] = useState(true);
  const [auditAction, setAuditAction] = useState("");
  const [auditEntityType, setAuditEntityType] = useState("");
  const [auditPage, setAuditPage] = useState(1);

  const loadExtra = useCallback(async () => {
    if (!currentUser) return;
    setExtraLoading(true);
    try {
      const params = new URLSearchParams();
      if (auditAction) params.set("auditAction", auditAction);
      if (auditEntityType) params.set("auditEntityType", auditEntityType);
      params.set("auditPage", String(auditPage));
      const res = await fetch(`/api/dashboard/analytics?${params.toString()}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setExtra(data);
      }
    } finally {
      setExtraLoading(false);
    }
  }, [currentUser, auditAction, auditEntityType, auditPage]);

  useEffect(() => {
    void loadExtra();
  }, [loadExtra]);

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            You do not have permission to view this analytics dashboard.
          </p>
        </div>
      </div>
    );
  }

  const role = currentUser.role;
  const copy = ROLE_COPY[role] ?? { headline: "Overview", subtitle: "" };
  const isSingleSchool = role === "school";
  const schoolCount = currentUser.schoolIds?.length ?? (currentUser.schoolName ? 1 : 0);
  const showGeographyRollup = role === "super-admin" || role === "program-lead";
  const hasRoster = ["super-admin", "program-lead", "geography-lead", "teacher-trainer"].includes(role);
  const isSuperAdmin = role === "super-admin";

  const stageChartData = Object.entries(analytics.ideasByStatus).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{copy.headline}</h1>
          <p className="mt-1 text-muted-foreground">{copy.subtitle}</p>
          {copy.scopeNote && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-status-pending-border bg-status-pending-soft px-4 py-3 text-sm text-status-pending">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{copy.scopeNote}</p>
            </div>
          )}
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(!isSingleSchool || schoolCount > 1) && (
            <StatTile
              label={isSingleSchool ? "Your Schools" : "Schools"}
              value={isSingleSchool ? schoolCount : analytics.totalSchools}
              icon={SchoolIcon}
              index={0}
            />
          )}
          <StatTile label="Ideas" value={analytics.totalIdeas} icon={Lightbulb} index={1} />
          <StatTile label="Teams" value={analytics.totalTeams} icon={Users2} index={2} />
          <StatTile label="Students" value={analytics.totalStudents} icon={Users} index={3} />
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {/* Trend — large */}
          <BentoCard
            title="Submissions"
            description="Last 14 days"
            colSpan={2}
            index={0}
          >
            <TrendAreaChart data={trend} />
          </BentoCard>

          {/* Stage breakdown */}
          <BentoCard title="By Stage" description="Design Thinking pipeline" colSpan={1} index={1}>
            <CategoryBarChart
              data={stageChartData}
              xKey="status"
              cellColor={(entry) => STAGE_VAR[entry.status as string]}
            />
          </BentoCard>

          {/* Gender breakdown */}
          <BentoCard title="Student Gender" colSpan={1} index={2}>
            <GenderBar breakdown={analytics.studentsByGender} />
          </BentoCard>

          {/* Geography roll-up — super-admin / program-lead only */}
          {showGeographyRollup && (
            <BentoCard
              title="By State"
              description="Ideas per state"
              colSpan={2}
              index={3}
            >
              <RankedList
                rows={geography.slice(0, 8).map((g) => ({ label: g.geographyName, count: g.count }))}
                emptyLabel="No geography-linked schools yet."
              />
            </BentoCard>
          )}

          {/* Theme breakdown */}
          <BentoCard
            title="By Theme"
            description="Distribution across monthly themes"
            colSpan={showGeographyRollup ? 2 : 3}
            index={4}
          >
            <CategoryBarChart data={analytics.ideasByTheme} xKey="theme" height={240} angledLabels />
          </BentoCard>

          {/* Grade distribution */}
          <BentoCard title="By Grade" description="Student grade levels" colSpan={1} index={5}>
            <CategoryBarChart data={analytics.gradeDistribution} xKey="grade" valueLabel="Students" />
          </BentoCard>

          {/* Ranked: schools — hidden for a single-school instructor, shown for multi-school ones */}
          {(!isSingleSchool || schoolCount > 1) && (
            <BentoCard title="Top Schools" description="By ideas submitted" colSpan={2} index={6}>
              <RankedList
                rows={analytics.ideasPerSchool.slice(0, 8).map((s) => ({
                  label: s.schoolName,
                  count: s.count,
                }))}
                emptyLabel="No ideas submitted yet."
              />
            </BentoCard>
          )}

          {/* Ranked: teams */}
          <BentoCard
            title="Top Teams"
            description="By ideas submitted"
            colSpan={isSingleSchool && schoolCount <= 1 ? 4 : 2}
            index={7}
          >
            <RankedList
              rows={analytics.ideasPerTeam.slice(0, 8).map((t) => ({
                label: t.teamName,
                count: t.count,
              }))}
              emptyLabel="No teams yet."
            />
          </BentoCard>

          {/* Heatmap — territory x Design Thinking stage */}
          <BentoCard
            title="Stage Heatmap"
            description={`Ideas by ${HEATMAP_ROW_HEADING[extra?.heatmap.rowKind ?? "school"].toLowerCase()} and stage`}
            colSpan={4}
            index={8}
          >
            {extraLoading && !extra ? (
              <div className="h-40 animate-pulse rounded-lg bg-muted" />
            ) : (
              <HeatmapGrid
                rows={extra?.heatmap.rows ?? []}
                cols={extra?.heatmap.cols ?? []}
                matrix={extra?.heatmap.matrix ?? []}
                rowHeading={HEATMAP_ROW_HEADING[extra?.heatmap.rowKind ?? "school"]}
                emptyLabel="No ideas in this scope yet."
              />
            )}
          </BentoCard>

          {/* Staff roster — geography-lead sees their TTs + instructors,
              teacher-trainer sees their instructors, super-admin/program-lead see everyone. */}
          {hasRoster && (
            <BentoCard
              title="Staff in Your Scope"
              description="Teacher trainers and instructors reporting into this view, with their activity"
              colSpan={4}
              index={9}
            >
              {extraLoading && !extra ? (
                <div className="h-40 animate-pulse rounded-lg bg-muted" />
              ) : (
                <RosterTable rows={extra?.roster ?? []} />
              )}
            </BentoCard>
          )}
        </div>

        {/* Technical / system health — super-admin only */}
        {isSuperAdmin && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                System Health &amp; Maintenance
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Real record counts and the audit trail — nothing here is estimated or simulated.
            </p>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {extra?.systemHealth &&
                Object.entries(extra.systemHealth.recordCounts).map(([key, value], i) => (
                  <StatTile
                    key={key}
                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                    value={value}
                    icon={Database}
                    index={i}
                  />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              <BentoCard title="Top Audit Actions" colSpan={1} index={0}>
                {extra?.systemHealth ? (
                  <CategoryBarChart
                    data={extra.systemHealth.auditByAction.map((a) => ({ action: a.action, count: a.count }))}
                    xKey="action"
                    angledLabels
                  />
                ) : (
                  <div className="h-40 animate-pulse rounded-lg bg-muted" />
                )}
              </BentoCard>

              <BentoCard title="Audit Log" description="Every recorded system action" colSpan={3} index={1}>
                {extra?.systemHealth ? (
                  <AuditLogTable
                    entries={extra.systemHealth.auditLog.entries}
                    total={extra.systemHealth.auditLog.total}
                    page={extra.systemHealth.auditLog.page}
                    pageSize={extra.systemHealth.auditLog.pageSize}
                    actionFilter={auditAction}
                    entityTypeFilter={auditEntityType}
                    actionOptions={extra.systemHealth.auditByAction.map((a) => a.action)}
                    onActionFilterChange={(v) => {
                      setAuditAction(v);
                      setAuditPage(1);
                    }}
                    onEntityTypeFilterChange={(v) => {
                      setAuditEntityType(v);
                      setAuditPage(1);
                    }}
                    onPageChange={setAuditPage}
                  />
                ) : (
                  <div className="h-40 animate-pulse rounded-lg bg-muted" />
                )}
              </BentoCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

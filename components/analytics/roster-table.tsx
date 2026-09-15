interface RosterRow {
  id: number;
  displayName: string;
  email: string;
  role: string;
  scopeLabel: string;
  ideaCount: number;
  teamCount: number;
}

const ROLE_LABEL: Record<string, string> = {
  "geography-lead": "Geography Lead",
  "teacher-trainer": "Teacher Trainer",
  school: "Instructor",
};

export function RosterTable({ rows }: { rows: RosterRow[] }) {
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No staff assigned to this scope yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">Name</th>
            <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">Role</th>
            <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">Scope</th>
            <th scope="col" className="border-b border-border px-2 py-2 text-right font-semibold text-muted-foreground">Ideas</th>
            <th scope="col" className="border-b border-border px-2 py-2 text-right font-semibold text-muted-foreground">Teams</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="border-b border-border px-2 py-2">
                <div className="font-medium text-foreground">{row.displayName}</div>
                <div className="text-xs text-muted-foreground">{row.email}</div>
              </td>
              <td className="border-b border-border px-2 py-2 text-foreground">{ROLE_LABEL[row.role] ?? row.role}</td>
              <td className="max-w-[220px] truncate border-b border-border px-2 py-2 text-foreground">{row.scopeLabel}</td>
              <td className="border-b border-border px-2 py-2 text-right tabular-nums text-foreground">{row.ideaCount}</td>
              <td className="border-b border-border px-2 py-2 text-right tabular-nums text-foreground">{row.teamCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

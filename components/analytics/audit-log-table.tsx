"use client";

interface AuditEntry {
  id: string;
  actorId: string | null;
  actorRole: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  schoolName: string | null;
  createdAt: string;
}

interface AuditLogTableProps {
  entries: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
  actionFilter: string;
  entityTypeFilter: string;
  actionOptions: string[];
  onActionFilterChange: (value: string) => void;
  onEntityTypeFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

export function AuditLogTable({
  entries,
  total,
  page,
  pageSize,
  actionFilter,
  entityTypeFilter,
  actionOptions,
  onActionFilterChange,
  onEntityTypeFilterChange,
  onPageChange,
}: AuditLogTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <select
          value={actionFilter}
          onChange={(e) => onActionFilterChange(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs text-foreground"
        >
          <option value="">All actions</option>
          {actionOptions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by entity type…"
          value={entityTypeFilter}
          onChange={(e) => onEntityTypeFilterChange(e.target.value)}
          className="h-8 w-48 rounded-lg border border-input bg-transparent px-2 text-xs text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No audit log entries match these filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-xs">
            <thead>
              <tr>
                <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">When</th>
                <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">Actor</th>
                <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">Action</th>
                <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">Entity</th>
                <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">School</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="whitespace-nowrap border-b border-border px-2 py-2 text-foreground">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="border-b border-border px-2 py-2 text-foreground">
                    {entry.actorRole ?? "—"} {entry.actorId ? `#${entry.actorId}` : ""}
                  </td>
                  <td className="border-b border-border px-2 py-2 font-medium text-foreground">{entry.action}</td>
                  <td className="border-b border-border px-2 py-2 text-foreground">
                    {entry.entityType}
                    {entry.entityId ? ` #${entry.entityId}` : ""}
                  </td>
                  <td className="border-b border-border px-2 py-2 text-foreground">{entry.schoolName ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Page {page} of {totalPages} ({total} entries)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-input px-2 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-input px-2 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

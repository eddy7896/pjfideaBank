interface HeatmapGridProps {
  rows: string[];
  cols: string[];
  matrix: number[][];
  rowHeading: string;
  emptyLabel: string;
}

/**
 * Rows x columns intensity grid. Every cell always shows its number, never
 * color alone — the background tint is a secondary scan aid on top of it.
 */
export function HeatmapGrid({ rows, cols, matrix, rowHeading, emptyLabel }: HeatmapGridProps) {
  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const max = Math.max(1, ...matrix.flat());

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b border-border px-2 py-2 text-left font-semibold text-muted-foreground">
              {rowHeading}
            </th>
            {cols.map((col) => (
              <th
                key={col}
                scope="col"
                className="border-b border-border px-2 py-2 text-center font-semibold text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row}>
              <th scope="row" className="max-w-[160px] truncate border-b border-border px-2 py-2 text-left font-medium text-foreground">
                {row}
              </th>
              {matrix[rowIndex].map((value, colIndex) => {
                const intensity = value / max;
                return (
                  <td
                    key={cols[colIndex]}
                    className="border-b border-border px-2 py-2 text-center tabular-nums text-foreground"
                    style={{
                      backgroundColor: value > 0 ? `color-mix(in oklch, var(--primary) ${Math.round(intensity * 65)}%, transparent)` : undefined,
                    }}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

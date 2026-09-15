"use client";

export function ChartTooltip({
  active,
  payload,
  label,
  valueLabel = "Ideas",
}: {
  active?: boolean;
  payload?: { value: number; payload?: Record<string, unknown> }[];
  label?: string;
  valueLabel?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">
        {valueLabel}: <span className="font-semibold text-foreground">{payload[0].value}</span>
      </p>
    </div>
  );
}

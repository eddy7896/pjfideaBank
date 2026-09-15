"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "./chart-tooltip";

export function CategoryBarChart({
  data,
  xKey,
  yKey = "count",
  height = 220,
  angledLabels = false,
  cellColor,
  barColor = "var(--primary)",
  valueLabel,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  yKey?: string;
  height?: number;
  angledLabels?: boolean;
  cellColor?: (entry: Record<string, string | number>) => string;
  barColor?: string;
  valueLabel?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey={xKey}
          stroke="var(--muted-foreground)"
          tick={{ fontSize: angledLabels ? 10 : 11 }}
          angle={angledLabels ? -35 : 0}
          textAnchor={angledLabels ? "end" : "middle"}
          height={angledLabels ? 70 : 30}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          tick={{ fontSize: 11 }}
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip valueLabel={valueLabel} />} />
        <Bar dataKey={yKey} fill={barColor} fillOpacity={cellColor ? 1 : 0.85} radius={[6, 6, 0, 0]}>
          {cellColor && data.map((entry, i) => <Cell key={i} fill={cellColor(entry)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

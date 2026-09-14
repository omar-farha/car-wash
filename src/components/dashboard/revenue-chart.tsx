"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ChartDay {
  key: string;
  label: string;
  revenue: number;
  expenses: number;
}

export function RevenueChart({ data, currency }: { data: ChartDay[]; currency: string }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#efefed" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#78756d", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#78756d", fontSize: 12 }}
          width={40}
        />
        <Tooltip
          cursor={{ fill: "#f8f8f7" }}
          formatter={(value) => formatCurrency(Number(value), currency)}
          contentStyle={{
            direction: "rtl",
            borderRadius: 12,
            border: "1px solid #efefed",
            fontFamily: "var(--font-cairo)",
            fontSize: 13,
          }}
        />
        <Legend
          formatter={(value) => (value === "revenue" ? "الإيرادات" : "المصروفات")}
          wrapperStyle={{ fontSize: 13, fontFamily: "var(--font-cairo)" }}
        />
        <Bar dataKey="revenue" fill="#dc2626" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar dataKey="expenses" fill="#dcdbd8" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

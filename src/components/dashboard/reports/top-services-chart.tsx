"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TopServicesChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#efefed" />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "#78756d", fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={140}
          tick={{ fill: "#33312d", fontSize: 13 }}
        />
        <Tooltip
          formatter={(value) => [`${value} طلب`, "عدد الطلبات"]}
          contentStyle={{
            direction: "rtl",
            borderRadius: 12,
            border: "1px solid #efefed",
            fontFamily: "var(--font-cairo)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="count" fill="#dc2626" radius={[0, 6, 6, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}

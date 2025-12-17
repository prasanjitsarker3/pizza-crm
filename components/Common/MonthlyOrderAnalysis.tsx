"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from "react";

const MonthlyOrderAnalysis = ({ analyticsData }: { analyticsData: any }) => {
  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  const day = today.getDate();
  const year = today.getFullYear();

  const chartData = analyticsData.monthlyOrders.map((item: any) => ({
    date: new Date(item.date).getDate(),
    orders: item.count,
  }));

  // Calculate max value for Y-axis to set proper ticks
  const maxOrders = Math.max(...chartData.map((item: any) => item.orders));
  const yAxisMax = Math.ceil(maxOrders * 1.2); // Add 20% padding

  return (
    <div>
      {/* Monthly Orders Chart */}
      <div className="shadow-none py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#ff7200] mb-1">
            Monthly Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Order trends for the {monthName} {year}
          </p>
        </div>
        <div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7200" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#ff7200" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#ff7200" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[0, yAxisMax || 5]}
                ticks={
                  yAxisMax <= 5
                    ? [0, 1, 2, 3, 4, 5]
                    : yAxisMax <= 10
                    ? [0, 2, 4, 6, 8, 10]
                    : undefined
                }
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "8px 12px",
                }}
                labelStyle={{
                  color: "#111827",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
                itemStyle={{ color: "#ff7200", fontWeight: "500" }}
                formatter={(value: any) => [`${value} orders`, ""]}
                labelFormatter={(value) => `Day ${value}`}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#ff7200"
                strokeWidth={1}
                fill="url(#colorOrders)"
                animationDuration={1000}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MonthlyOrderAnalysis;

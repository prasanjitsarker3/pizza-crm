import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingCart, DollarSign } from "lucide-react";

interface MonthlyData {
  month: string;
  totalOrders: number;
  totalRevenue: number;
}

interface MonthlyRevenueAnalysisProps {
  monthlyRevenueAnalysis: MonthlyData[];
}

const MonthlyRevenueAnalysis = ({
  monthlyRevenueAnalysis,
}: MonthlyRevenueAnalysisProps) => {
  // Calculate totals
  const totalYearOrders = monthlyRevenueAnalysis.reduce(
    (sum, item) => sum + item.totalOrders,
    0
  );
  const totalYearRevenue = monthlyRevenueAnalysis.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );

  // Format data for display
  const formattedData = monthlyRevenueAnalysis.map((item) => ({
    ...item,
    monthShort: item.month.substring(0, 3),
  }));

  // Custom tooltip (border removed)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {payload[0]?.payload?.month}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-orange-500" />
            Orders: <span className="font-medium">{payload[0]?.value}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className=" text-base font-semibold text-orange-500 font-sans">৳</span>
            Revenue:{" "}
            <p className="font-medium">
              <span className=" text-sm font-semibold font-sans">৳</span> {payload[1]?.value.toLocaleString("en-BD")}
            </p>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-orange-500">
            Orders vs Revenue Comparison
          </span>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={formattedData}>
            {/* Light grid without visible border */}
            <CartesianGrid strokeDasharray="3 3" stroke="#f9fafb" />
            <XAxis
              dataKey="monthShort"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="totalOrders"
              fill="#ff7200"
              radius={[8, 8, 0, 0]}
              name="Orders"
            />
            <Bar
              yAxisId="right"
              dataKey="totalRevenue"
              fill="#ffb380"
              radius={[8, 8, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyRevenueAnalysis;

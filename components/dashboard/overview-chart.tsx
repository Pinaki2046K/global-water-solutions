"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface OverviewChartProps {
  data: {
    name: string;
    revenue: number;
  }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-[0_10px_15px_-3px_rgb(0,0,0,0.1)]">
        <p className="text-gray-500 text-sm mb-1 font-medium">{label}</p>
        <div className="flex items-end gap-2">
          <span className="text-indigo-600 text-lg font-bold">
            {`₹${payload[0].value.toLocaleString()}`}
          </span>
          <span className="text-gray-400 text-xs font-medium mb-1">
            Revenue
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
          <p className="text-sm text-gray-500">Monthly revenue collection</p>
        </div>
        <div className="relative">
          <select className="appearance-none bg-gray-50 border-none text-gray-900 text-sm font-medium rounded-lg block w-full p-2.5 pr-8 focus:ring-0 cursor-pointer">
            <option>Last 6 Months</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `₹${value >= 1000 ? `${value / 1000}k` : value}`
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 2,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#4f46e5" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

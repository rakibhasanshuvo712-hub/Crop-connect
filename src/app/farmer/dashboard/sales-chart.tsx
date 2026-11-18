'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { month: 'Jun', sales: 45000, orders: 12 },
  { month: 'Jul', sales: 62000, orders: 18 },
  { month: 'Aug', sales: 58000, orders: 15 },
  { month: 'Sep', sales: 84000, orders: 24 },
  { month: 'Oct', sales: 110000, orders: 32 },
  { month: 'Nov', sales: 142000, orders: 41 },
]

export function FarmerSalesChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
          <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" tickFormatter={(v) => `৳${v / 1000}k`} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                    <p className="font-bold">{payload[0].payload.month} 2026</p>
                    <p className="text-emerald-400">Revenue: ৳{Number(payload[0].value).toLocaleString()}</p>
                    <p className="text-slate-300">Orders: {payload[0].payload.orders}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

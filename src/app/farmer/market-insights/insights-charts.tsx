'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { MarketInsightData } from '@/lib/actions/ai'

const trendData = [
  { week: 'Week 1', rice: 68, potato: 28, onion: 66, tomato: 54 },
  { week: 'Week 2', rice: 69, potato: 30, onion: 68, tomato: 52 },
  { week: 'Week 3', rice: 70, potato: 31, onion: 70, tomato: 49 },
  { week: 'Week 4', rice: 70, potato: 33, onion: 72, tomato: 46 },
]

export function MarketInsightsCharts({ insights }: { insights: MarketInsightData[] }) {
  const barData = insights.slice(0, 4).map(item => ({
    name: item.categoryName.split(' ')[0],
    avg: item.averagePrice,
    min: item.minPrice,
    max: item.maxPrice
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Price by Category */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Average Listed Rates by Category</h3>
          <p className="text-xs text-slate-400">Current average price in BDT per kilogram</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" tickFormatter={(v) => `৳${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                        <p className="font-bold">{payload[0].payload.name}</p>
                        <p className="text-emerald-400">Avg Price: ৳{payload[0].value}/kg</p>
                        <p className="text-slate-400">Min: ৳{payload[0].payload.min} | Max: ৳{payload[0].payload.max}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="avg" fill="#15803d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4-Week Price Trends */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">4-Week Price Trajectory (৪ সপ্তাহের ট্রেন্ড)</h3>
          <p className="text-xs text-slate-400">Weekly price movements for high-volume staples</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#64748b" tickFormatter={(v) => `৳${v}`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg">
                        <p className="font-bold">{payload[0].payload.week}</p>
                        {payload.map((p, i) => (
                          <p key={i} style={{ color: p.color }}>
                            {p.name}: ৳{p.value}
                          </p>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="rice" stroke="#15803d" strokeWidth={2} dot={{ r: 3 }} name="Rice" />
              <Line type="monotone" dataKey="onion" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Onion" />
              <Line type="monotone" dataKey="tomato" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Tomato" />
              <Line type="monotone" dataKey="potato" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Potato" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

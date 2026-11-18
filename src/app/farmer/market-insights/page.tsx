import { LineChart as LineChartIcon, TrendingUp, AlertCircle, BarChart3, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getMarketInsightsData } from '@/lib/actions/ai'
import { MarketInsightsCharts } from './insights-charts'

export default async function MarketInsightsPage() {
  const { insights, disclaimer, lastUpdated } = await getMarketInsightsData()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LineChartIcon className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">
              AI Market Insights & Price Trends (কৃষি বাজারদর অ্যানালিটিক্স)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time asking rates, regional supply indices, and price trajectory based on CropConnect trade data.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium">Updated: {lastUpdated}</span>
      </div>

      {/* Prominent Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Marketplace Price Notice (বাজারদর বিজ্ঞপ্তি):</span>
          <p className="leading-relaxed">{disclaimer}</p>
        </div>
      </div>

      {/* Visual Recharts Charts */}
      <MarketInsightsCharts insights={insights} />

      {/* Category Deep Dive Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900">
          Category Price Analysis & Demand Indices
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{item.categoryName}</h4>
                <Badge
                  variant={item.priceTrend === 'rising' ? 'accent' : item.priceTrend === 'stable' ? 'default' : 'secondary'}
                  className="capitalize text-[10px]"
                >
                  Trend: {item.priceTrend}
                </Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700">৳{item.averagePrice}</span>
                <span className="text-xs text-slate-500">/ {item.unit} (Average Asking Price)</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Range: ৳{item.minPrice} – ৳{item.maxPrice}</span>
                <span className="font-semibold text-emerald-800">Demand: {item.demandIndex}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                "{item.insightText}"
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Primary Source Hubs: {item.topDistricts.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

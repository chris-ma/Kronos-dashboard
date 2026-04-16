'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { CalendarDays, Brain, RefreshCw, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  generateLongTermData,
  buildLongTermSummaries,
  type Timeframe,
  type LongTermPoint,
  type LongTermSummary,
  TF_LABELS,
} from '@/lib/mockData'
import clsx from 'clsx'

const ASSETS = [
  { symbol: 'S&P 500', base: 5243.77 },
  { symbol: 'NASDAQ', base: 16423.58 },
  { symbol: 'BTC/USD', base: 67843.2 },
  { symbol: 'NVDA', base: 874.15 },
  { symbol: 'ETH/USD', base: 3412.88 },
]

const TIMEFRAMES: Timeframe[] = ['3M', '6M', '1Y', '3Y', '5Y']

const SIGNAL_CFG = {
  BULLISH: { color: '#10b981', label: 'Bullish', Icon: TrendingUp },
  BEARISH: { color: '#ef4444', label: 'Bearish', Icon: TrendingDown },
  NEUTRAL: { color: '#f59e0b', label: 'Neutral', Icon: Minus },
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const visible = payload.filter((p) => p.value != null && p.name !== 'upper' && p.name !== 'lower')
  return (
    <div className="bg-kronos-surface border border-kronos-border rounded-xl p-3 shadow-2xl min-w-[170px]">
      <p className="text-xs text-kronos-muted mb-2 font-medium">{label}</p>
      {visible.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <span style={{ color: p.color }} className="font-medium">
            {p.name === 'forecast' ? '🤖 Kronos Forecast' : p.name === 'actual' ? '● Actual' : p.name}
          </span>
          <span className="font-num font-semibold text-kronos-text">
            {p.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  )
}

function SummaryCard({ summary, isActive, onClick }: { summary: LongTermSummary; isActive: boolean; onClick: () => void }) {
  const cfg = SIGNAL_CFG[summary.signal]
  const isUp = summary.returnPct >= 0

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex-1 rounded-xl p-3 border text-left transition-all',
        isActive
          ? 'border-kronos-accent/60 bg-kronos-accent/8 shadow-lg shadow-kronos-accent/10'
          : 'border-kronos-border bg-kronos-bg hover:border-kronos-border/80 hover:bg-kronos-card/50'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={clsx('text-xs font-bold', isActive ? 'text-kronos-accent' : 'text-kronos-muted')}>
          {summary.label}
        </span>
        <div
          className="flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={{ color: cfg.color, backgroundColor: cfg.color + '18' }}
        >
          <cfg.Icon size={10} />
          <span>{cfg.label}</span>
        </div>
      </div>

      <div className="font-num text-base font-black text-kronos-text mb-1">
        {summary.targetPrice >= 1000
          ? summary.targetPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })
          : summary.targetPrice.toFixed(2)}
      </div>

      <div className={clsx('font-num text-sm font-bold mb-2', isUp ? 'text-kronos-green' : 'text-kronos-red')}>
        {isUp ? '+' : ''}{summary.returnPct.toFixed(2)}%
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-kronos-muted">Confidence</span>
          <span
            className="font-num font-semibold"
            style={{
              color:
                summary.confidence >= 70
                  ? '#10b981'
                  : summary.confidence >= 50
                  ? '#f59e0b'
                  : '#ef4444',
            }}
          >
            {summary.confidence}%
          </span>
        </div>
        <div className="h-1 bg-kronos-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${summary.confidence}%`,
              backgroundColor:
                summary.confidence >= 70
                  ? '#10b981'
                  : summary.confidence >= 50
                  ? '#f59e0b'
                  : '#ef4444',
            }}
          />
        </div>
      </div>
    </button>
  )
}

export default function LongTermForecast() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0])
  const [selectedTF, setSelectedTF] = useState<Timeframe>('1Y')
  const [allData, setAllData] = useState<Partial<Record<Timeframe, LongTermPoint[]>>>({})
  const [summaries, setSummaries] = useState<LongTermSummary[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const regenerate = useCallback((base: number) => {
    const data = {} as Record<Timeframe, LongTermPoint[]>
    for (const tf of TIMEFRAMES) {
      data[tf] = generateLongTermData(base, tf)
    }
    setAllData(data)
    setSummaries(buildLongTermSummaries(base, data))
  }, [])

  useEffect(() => {
    regenerate(selectedAsset.base)
  }, [selectedAsset, regenerate])

  const refresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      regenerate(selectedAsset.base)
      setIsRefreshing(false)
    }, 700)
  }

  const chartData = allData[selectedTF] ?? []

  // Compute X-axis ticks — show ~8 evenly spaced labels
  const totalPts = chartData.length
  const tickStep = Math.max(1, Math.floor(totalPts / 8))
  const ticks = chartData.filter((_, i) => i % tickStep === 0).map((d) => d.time)

  // "Now" divider: last point with actual !== null
  const nowLabel = chartData.filter((d) => d.actual !== null).at(-1)?.time

  // Y-axis formatter
  const yFmt = (v: number) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M'
    if (v >= 1_000) return (v / 1_000).toFixed(1) + 'K'
    return v.toFixed(1)
  }

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-kronos-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kronos-purple/20 to-kronos-accent/20 border border-kronos-purple/30 flex items-center justify-center">
            <CalendarDays size={15} className="text-kronos-purple" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-kronos-text">Kronos Long-Term Forecasts</h2>
            <p className="text-xs text-kronos-muted">Multi-horizon transformer outlook · 3M → 5Y</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Asset dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-kronos-bg rounded-lg border border-kronos-border hover:border-kronos-accent/50 transition-colors text-sm font-semibold"
            >
              {selectedAsset.symbol}
              <ChevronDown size={13} className="text-kronos-muted" />
            </button>
            {showDropdown && (
              <div className="absolute top-full mt-1 right-0 z-20 bg-kronos-surface border border-kronos-border rounded-xl shadow-2xl py-1 min-w-[140px]">
                {ASSETS.map((a) => (
                  <button
                    key={a.symbol}
                    onClick={() => { setSelectedAsset(a); setShowDropdown(false) }}
                    className={clsx(
                      'w-full text-left px-3 py-2 text-sm transition-colors hover:bg-kronos-card',
                      a.symbol === selectedAsset.symbol ? 'text-kronos-accent font-semibold' : 'text-kronos-text'
                    )}
                  >
                    {a.symbol}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timeframe tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-kronos-bg rounded-lg border border-kronos-border/50">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTF(tf)}
                className={clsx(
                  'px-3 py-1 text-xs font-bold rounded-md transition-all',
                  selectedTF === tf
                    ? 'bg-kronos-purple text-white shadow-sm shadow-kronos-purple/30'
                    : 'text-kronos-muted hover:text-kronos-text'
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={refresh}
            className="p-1.5 rounded-lg hover:bg-kronos-card transition-colors text-kronos-muted hover:text-kronos-purple"
          >
            <RefreshCw size={14} className={clsx(isRefreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Horizon label + AI badge */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-kronos-border/40">
        <div className="flex items-center gap-3">
          <span className="text-xs text-kronos-muted">
            Showing <span className="font-semibold text-kronos-text">{TF_LABELS[selectedTF]}</span> outlook for{' '}
            <span className="font-semibold text-kronos-text">{selectedAsset.symbol}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-xs text-kronos-muted">
            · Confidence band widens with horizon
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-kronos-purple/30 bg-kronos-purple/10 text-kronos-purple text-xs font-bold">
          <Brain size={10} />
          Kronos v2 · Transformer
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-3 min-h-0" style={{ minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ltActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="ltForecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
            <XAxis
              dataKey="time"
              ticks={ticks}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={yFmt}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Confidence band */}
            <Area dataKey="upper" stroke="none" fill="url(#ltForecastGrad)" fillOpacity={1} />
            <Area dataKey="lower" stroke="none" fill="#0a0e1a" fillOpacity={1} />

            {/* Forecast line (dashed purple) */}
            <Line
              dataKey="forecast"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6' }}
            />

            {/* Actual line (solid cyan) */}
            <Area
              dataKey="actual"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#ltActualGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#0ea5e9' }}
              connectNulls={false}
            />

            {/* Now divider */}
            {nowLabel && (
              <ReferenceLine
                x={nowLabel}
                stroke="#f59e0b"
                strokeDasharray="4 2"
                strokeWidth={1.5}
                label={{ value: 'TODAY', fill: '#f59e0b', fontSize: 9, position: 'top' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 pb-3 text-xs text-kronos-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-kronos-accent inline-block rounded" /> Historical
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-4 border-t border-dashed border-kronos-purple" /> Kronos Forecast
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-kronos-purple/10 inline-block" /> Confidence Band
        </span>
      </div>

      {/* Summary cards — all 5 timeframes */}
      <div className="px-4 pb-4 border-t border-kronos-border/50 pt-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-kronos-muted uppercase tracking-wide">
            Kronos Price Targets & Signals
          </span>
          <span className="text-xs text-kronos-border">·</span>
          <span className="text-xs text-kronos-muted">Click a horizon to view its chart</span>
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {summaries.map((s) => (
            <SummaryCard
              key={s.period}
              summary={s}
              isActive={selectedTF === s.period}
              onClick={() => setSelectedTF(s.period)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

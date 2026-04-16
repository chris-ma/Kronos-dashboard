'use client'

import { useState, useEffect } from 'react'
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
import { Brain, Zap, RefreshCw, ChevronDown, Target, AlertTriangle, TrendingUp } from 'lucide-react'
import { generateForecastData, scenarios, type ForecastPoint } from '@/lib/mockData'
import clsx from 'clsx'

const ASSETS = [
  { symbol: 'S&P 500', base: 5243.77 },
  { symbol: 'NASDAQ', base: 16423.58 },
  { symbol: 'BTC/USD', base: 67843.2 },
  { symbol: 'NVDA', base: 874.15 },
  { symbol: 'ETH/USD', base: 3412.88 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-kronos-surface border border-kronos-border rounded-xl p-3 shadow-2xl min-w-[160px]">
      <p className="text-xs text-kronos-muted mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-xs py-0.5">
          <span style={{ color: p.color }} className="font-medium capitalize">
            {p.name === 'forecast' ? '🤖 Forecast' : p.name === 'actual' ? '● Actual' : p.name}
          </span>
          <span className="font-num font-semibold text-kronos-text">
            {p.value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  )
}

function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-kronos-muted">Model Confidence</span>
        <span className="font-num text-xs font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 bg-kronos-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function ScenarioCard({ label, probability, description, color }: typeof scenarios[0]) {
  return (
    <div
      className="flex-1 rounded-xl p-3 border transition-colors cursor-pointer hover:border-opacity-70"
      style={{ borderColor: color + '40', backgroundColor: color + '0d' }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold" style={{ color }}>{label}</span>
        <span className="font-num text-xs font-bold" style={{ color }}>{probability}%</span>
      </div>
      <div className="h-1 rounded-full bg-kronos-border mb-2">
        <div className="h-full rounded-full" style={{ width: `${probability}%`, backgroundColor: color }} />
      </div>
      <p className="text-xs text-kronos-muted leading-relaxed">{description}</p>
    </div>
  )
}

function KronosSignalBadge({ signal, dir }: { signal: string; dir: 'up' | 'down' | 'neutral' }) {
  const cfg = {
    up: { cls: 'bg-kronos-green/15 text-kronos-green border-kronos-green/30 signal-bullish', icon: '▲', label: 'BULLISH' },
    down: { cls: 'bg-kronos-red/15 text-kronos-red border-kronos-red/30 signal-bearish', icon: '▼', label: 'BEARISH' },
    neutral: { cls: 'bg-kronos-yellow/15 text-kronos-yellow border-kronos-yellow/30', icon: '◆', label: 'NEUTRAL' },
  }[dir]

  return (
    <div className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold', cfg.cls)}>
      <Brain size={11} />
      <span>Kronos: {cfg.label}</span>
    </div>
  )
}

export default function AIForecastPanel() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0])
  const [data, setData] = useState<ForecastPoint[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [confidence] = useState(87)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    setData(generateForecastData(selectedAsset.base))
  }, [selectedAsset])

  const refresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setData(generateForecastData(selectedAsset.base))
      setIsRefreshing(false)
    }, 800)
  }

  const nowIdx = data.findIndex((d) => d.actual !== null && data[data.indexOf(d) + 1]?.actual === null)
  const nowTime = nowIdx >= 0 ? data[nowIdx]?.time : undefined

  const lastActual = data.filter((d) => d.actual !== null).at(-1)
  const lastForecast = data.at(-1)
  const forecastReturn = lastActual && lastForecast
    ? ((lastForecast.forecast - lastActual.actual!) / lastActual.actual!) * 100
    : 0
  const forecastDir: 'up' | 'down' | 'neutral' = forecastReturn > 0.1 ? 'up' : forecastReturn < -0.1 ? 'down' : 'neutral'

  const ticks = data.filter((_, i) => i % 8 === 0).map((d) => d.time)

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-kronos-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kronos-accent/20 to-kronos-purple/20 border border-kronos-accent/30 flex items-center justify-center">
            <Brain size={15} className="text-kronos-accent" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-kronos-text">Kronos AI Forecast</h2>
            <p className="text-xs text-kronos-muted">Transformer-based 24h outlook</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <KronosSignalBadge signal="BULLISH" dir={forecastDir} />
          <button
            onClick={refresh}
            className="p-1.5 rounded-lg hover:bg-kronos-card transition-colors text-kronos-muted hover:text-kronos-accent"
          >
            <RefreshCw size={14} className={clsx(isRefreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Asset selector + metrics */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-kronos-border/50">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-kronos-bg rounded-lg border border-kronos-border hover:border-kronos-accent/50 transition-colors text-sm font-semibold"
          >
            {selectedAsset.symbol}
            <ChevronDown size={13} className="text-kronos-muted" />
          </button>
          {showDropdown && (
            <div className="absolute top-full mt-1 left-0 z-20 bg-kronos-surface border border-kronos-border rounded-xl shadow-2xl py-1 min-w-[140px]">
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

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-kronos-muted">Current</div>
            <div className="font-num text-sm font-bold text-kronos-text">
              {selectedAsset.base.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-kronos-muted">24h Forecast</div>
            <div className={clsx('font-num text-sm font-bold', forecastReturn >= 0 ? 'text-kronos-green' : 'text-kronos-red')}>
              {forecastReturn >= 0 ? '+' : ''}{forecastReturn.toFixed(2)}%
            </div>
          </div>
          <div className="hidden sm:block text-right w-36">
            <ConfidenceMeter value={confidence} />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-3 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.12} />
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
              tickFormatter={(v) => v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v.toFixed(1)}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Confidence band */}
            <Area dataKey="upper" stroke="none" fill="url(#forecastGrad)" fillOpacity={1} />
            <Area dataKey="lower" stroke="none" fill="#0a0e1a" fillOpacity={1} />

            {/* Forecast line */}
            <Line
              dataKey="forecast"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6' }}
            />

            {/* Actual line */}
            <Area
              dataKey="actual"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#0ea5e9' }}
              connectNulls={false}
            />

            {/* Now line */}
            {nowTime && (
              <ReferenceLine
                x={nowTime}
                stroke="#f59e0b"
                strokeDasharray="4 2"
                strokeWidth={1.5}
                label={{ value: 'NOW', fill: '#f59e0b', fontSize: 9, position: 'top' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 pb-2 text-xs text-kronos-muted">
        <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-kronos-accent inline-block rounded" /> Actual</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-kronos-purple inline-block rounded border-t-2 border-dashed border-kronos-purple" style={{ background: 'none' }} />
          <span className="w-4 border-t border-dashed border-kronos-purple inline-block" /> Kronos Forecast</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-kronos-purple/10 inline-block" /> Confidence Band</span>
      </div>

      {/* Scenarios */}
      <div className="px-4 pb-4 border-t border-kronos-border/50 pt-3">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={12} className="text-kronos-yellow" />
          <span className="text-xs font-semibold text-kronos-muted uppercase tracking-wide">Kronos Scenarios (24h)</span>
        </div>
        <div className="flex gap-2">
          {scenarios.map((s) => (
            <ScenarioCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Key levels */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        {[
          { icon: <Target size={12} />, label: 'Resistance', value: (selectedAsset.base * 1.018).toFixed(2), color: 'text-kronos-red' },
          { icon: <TrendingUp size={12} />, label: 'Pivot', value: selectedAsset.base.toFixed(2), color: 'text-kronos-yellow' },
          { icon: <AlertTriangle size={12} />, label: 'Support', value: (selectedAsset.base * 0.982).toFixed(2), color: 'text-kronos-green' },
        ].map((kl) => (
          <div key={kl.label} className="bg-kronos-bg rounded-lg px-3 py-2 flex items-center justify-between">
            <div className={clsx('flex items-center gap-1.5 text-xs', kl.color)}>
              {kl.icon}
              <span>{kl.label}</span>
            </div>
            <span className="font-num text-xs font-bold text-kronos-text">{Number(kl.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

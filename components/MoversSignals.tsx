'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Zap, BarChart2, Activity } from 'lucide-react'
import { topMovers, type Mover, type Signal } from '@/lib/mockData'
import clsx from 'clsx'

type Filter = 'all' | 'bullish' | 'bearish' | 'volatile'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'bullish', label: 'Bullish' },
  { key: 'bearish', label: 'Bearish' },
  { key: 'volatile', label: 'Volatile' },
]

const SIGNAL_CONFIG: Record<Signal, { label: string; cls: string; dot: string }> = {
  BULLISH:  { label: 'BULLISH',  cls: 'bg-kronos-green/15 text-kronos-green border-kronos-green/30',   dot: 'bg-kronos-green signal-bullish' },
  BEARISH:  { label: 'BEARISH',  cls: 'bg-kronos-red/15 text-kronos-red border-kronos-red/30',         dot: 'bg-kronos-red signal-bearish' },
  NEUTRAL:  { label: 'NEUTRAL',  cls: 'bg-kronos-muted/15 text-kronos-muted border-kronos-muted/30',   dot: 'bg-kronos-muted' },
  VOLATILE: { label: 'VOLATILE', cls: 'bg-kronos-yellow/15 text-kronos-yellow border-kronos-yellow/30', dot: 'bg-kronos-yellow animate-pulse' },
}

function ConfidenceBar({ value, signal }: { value: number; signal: Signal }) {
  const color = signal === 'BULLISH' ? '#10b981' : signal === 'BEARISH' ? '#ef4444' : signal === 'VOLATILE' ? '#f59e0b' : '#64748b'
  return (
    <div className="w-20">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-kronos-muted">AI conf.</span>
        <span className="font-num font-semibold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-1 bg-kronos-border rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function MoverRow({ mover }: { mover: Mover }) {
  const sig = SIGNAL_CONFIG[mover.signal]
  const isUp = mover.dir === 'up'

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-kronos-border/20 transition-all cursor-pointer group border border-transparent hover:border-kronos-border/50">
      {/* Symbol */}
      <div className="flex items-center gap-2.5 w-28 min-w-0">
        <div className={clsx(
          'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-transform group-hover:scale-105',
          isUp ? 'bg-kronos-green/15 text-kronos-green' : 'bg-kronos-red/15 text-kronos-red'
        )}>
          {mover.symbol.slice(0, 3)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-kronos-text">{mover.symbol}</div>
          <div className="text-xs text-kronos-muted truncate max-w-[80px]">{mover.sector}</div>
        </div>
      </div>

      {/* Price + change */}
      <div className="w-24 text-right">
        <div className="font-num text-sm font-bold text-kronos-text">${mover.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className={clsx('font-num text-xs font-semibold flex items-center justify-end gap-0.5', isUp ? 'text-kronos-green' : 'text-kronos-red')}>
          {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isUp ? '+' : ''}{mover.changePct.toFixed(2)}%
        </div>
      </div>

      {/* Signal badge */}
      <div className="flex-1 flex justify-center">
        <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold', sig.cls)}>
          <span className={clsx('w-1.5 h-1.5 rounded-full', sig.dot)} />
          {sig.label}
        </div>
      </div>

      {/* Confidence */}
      <div className="hidden lg:block">
        <ConfidenceBar value={mover.confidence} signal={mover.signal} />
      </div>

      {/* Volume */}
      <div className="hidden xl:block text-right w-20">
        <div className="text-xs text-kronos-muted flex items-center justify-end gap-1">
          <BarChart2 size={10} />Vol
        </div>
        <div className="font-num text-xs text-kronos-text">{mover.volume}</div>
      </div>
    </div>
  )
}

function SignalSummary() {
  const counts = topMovers.reduce((acc, m) => {
    acc[m.signal] = (acc[m.signal] || 0) + 1
    return acc
  }, {} as Record<Signal, number>)

  return (
    <div className="grid grid-cols-4 gap-2">
      {(Object.entries(counts) as [Signal, number][]).map(([signal, count]) => {
        const cfg = SIGNAL_CONFIG[signal]
        return (
          <div key={signal} className={clsx('rounded-xl p-3 border text-center', cfg.cls)}>
            <div className="font-num text-xl font-black">{count}</div>
            <div className="text-xs font-bold mt-0.5 opacity-80">{cfg.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function MoversSignals() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = topMovers.filter((m) => {
    if (filter === 'all') return true
    if (filter === 'bullish') return m.signal === 'BULLISH'
    if (filter === 'bearish') return m.signal === 'BEARISH'
    if (filter === 'volatile') return m.signal === 'VOLATILE'
    return true
  })

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-kronos-border">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-kronos-accent" />
          <div>
            <h2 className="text-sm font-bold text-kronos-text">Top Movers & AI Signals</h2>
            <p className="text-xs text-kronos-muted">Kronos-driven buy/sell signals</p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-kronos-bg rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                'px-2.5 py-1 text-xs rounded-md transition-all font-medium',
                filter === f.key ? 'bg-kronos-accent text-white' : 'text-kronos-muted hover:text-kronos-text'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signal summary */}
      <div className="px-4 py-3 border-b border-kronos-border/50">
        <SignalSummary />
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-3 py-1.5 text-xs text-kronos-muted border-b border-kronos-border/30">
        <div className="w-28">Asset</div>
        <div className="w-24 text-right">Price / Chg</div>
        <div className="flex-1 text-center">AI Signal</div>
        <div className="hidden lg:block w-24">Confidence</div>
        <div className="hidden xl:block w-20 text-right">Volume</div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filtered.map((m) => (
          <MoverRow key={m.symbol} mover={m} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-kronos-muted">
            <Zap size={24} className="mb-2 opacity-30" />
            <p className="text-sm">No signals match this filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

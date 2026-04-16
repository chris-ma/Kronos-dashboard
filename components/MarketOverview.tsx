'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react'
import { indices, crypto, forex, commodities, type MarketItem } from '@/lib/mockData'
import clsx from 'clsx'

type Tab = 'indices' | 'crypto' | 'forex' | 'commodities'

const TABS: { key: Tab; label: string }[] = [
  { key: 'indices', label: 'Indices' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'forex', label: 'FX' },
  { key: 'commodities', label: 'Commodities' },
]

const DATA: Record<Tab, MarketItem[]> = { indices, crypto, forex, commodities }

function MiniSparkline({ dir }: { dir: 'up' | 'down' }) {
  const points = Array.from({ length: 12 }, (_, i) => {
    const trend = dir === 'up' ? i * 2.5 : -i * 2.5
    return 20 + trend + (Math.random() - 0.5) * 8
  })
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const w = 60
  const h = 28
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w
      const y = h - ((p - min) / range) * h
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={path} fill="none" stroke={dir === 'up' ? '#10b981' : '#ef4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MarketRow({ item }: { item: MarketItem }) {
  const isUp = item.dir === 'up'

  const formatPrice = (p: number) => {
    if (p >= 10000) return p.toLocaleString('en-US', { minimumFractionDigits: 2 })
    if (p >= 100) return p.toLocaleString('en-US', { minimumFractionDigits: 2 })
    if (p >= 1) return p.toFixed(4)
    return p.toFixed(5)
  }

  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-kronos-border/30 transition-colors group cursor-pointer">
      <div className="flex items-center gap-3 min-w-0">
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0',
          isUp ? 'bg-kronos-green/15 text-kronos-green' : 'bg-kronos-red/15 text-kronos-red')}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-kronos-text truncate">{item.symbol}</div>
          <div className="text-xs text-kronos-muted truncate hidden sm:block">{item.name}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <MiniSparkline dir={item.dir} />
        </div>
        <div className="text-right">
          <div className="font-num text-sm font-semibold text-kronos-text">{formatPrice(item.price)}</div>
          <div className={clsx('font-num text-xs font-medium', isUp ? 'text-kronos-green' : 'text-kronos-red')}>
            {isUp ? '+' : ''}{item.changePct.toFixed(2)}%
          </div>
        </div>
        {item.volume && (
          <div className="hidden lg:block text-right w-16">
            <div className="text-xs text-kronos-muted">Vol</div>
            <div className="font-num text-xs text-kronos-text">{item.volume}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function MarketSummaryBar({ items }: { items: MarketItem[] }) {
  const up = items.filter((i) => i.dir === 'up').length
  const down = items.length - up
  const upPct = Math.round((up / items.length) * 100)

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-kronos-bg rounded-lg">
      <BarChart2 size={13} className="text-kronos-muted" />
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-kronos-green font-medium">{up} ▲</span>
        <div className="flex-1 h-1.5 bg-kronos-red/30 rounded-full overflow-hidden">
          <div className="h-full bg-kronos-green rounded-full transition-all" style={{ width: `${upPct}%` }} />
        </div>
        <span className="text-xs text-kronos-red font-medium">{down} ▼</span>
      </div>
      <span className="text-xs text-kronos-muted font-num">{upPct}% positive</span>
    </div>
  )
}

export default function MarketOverview() {
  const [tab, setTab] = useState<Tab>('indices')
  const items = DATA[tab]

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-kronos-border">
        <div>
          <h2 className="text-sm font-bold text-kronos-text">Market Overview</h2>
          <p className="text-xs text-kronos-muted mt-0.5">Live premarket data</p>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-kronos-bg rounded-lg">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                'px-2.5 py-1 text-xs rounded-md transition-all font-medium',
                tab === t.key
                  ? 'bg-kronos-accent text-white shadow-sm'
                  : 'text-kronos-muted hover:text-kronos-text'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 animate-fade-in">
        {items.map((item) => (
          <MarketRow key={item.symbol} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="px-2 pb-2">
        <MarketSummaryBar items={items} />
      </div>
    </div>
  )
}

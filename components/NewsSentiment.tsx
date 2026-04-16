'use client'

import { useState } from 'react'
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, BarChart2 } from 'lucide-react'
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { newsItems, type NewsItem, type Sentiment } from '@/lib/mockData'
import clsx from 'clsx'

const SENTIMENT_CONFIG: Record<Sentiment, { icon: React.ReactNode; cls: string; label: string; color: string }> = {
  positive: { icon: <TrendingUp size={11} />, cls: 'bg-kronos-green/15 text-kronos-green border-kronos-green/30', label: 'Positive', color: '#10b981' },
  negative: { icon: <TrendingDown size={11} />, cls: 'bg-kronos-red/15 text-kronos-red border-kronos-red/30', label: 'Negative', color: '#ef4444' },
  neutral:  { icon: <Minus size={11} />, cls: 'bg-kronos-muted/15 text-kronos-muted border-kronos-muted/30', label: 'Neutral', color: '#64748b' },
}

type Filter = 'all' | Sentiment

function SentimentGauge() {
  const pos = newsItems.filter((n) => n.sentiment === 'positive').length
  const neg = newsItems.filter((n) => n.sentiment === 'negative').length
  const neu = newsItems.filter((n) => n.sentiment === 'neutral').length
  const total = newsItems.length

  const score = Math.round(((pos - neg) / total) * 100)
  const scoreLabel = score > 20 ? 'Bullish' : score < -20 ? 'Bearish' : 'Neutral'
  const scoreColor = score > 20 ? '#10b981' : score < -20 ? '#ef4444' : '#f59e0b'

  const radialData = [
    { name: 'positive', value: (pos / total) * 100, fill: '#10b981' },
    { name: 'negative', value: (neg / total) * 100, fill: '#ef4444' },
    { name: 'neutral', value: (neu / total) * 100, fill: '#64748b' },
  ]

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-kronos-bg rounded-xl border border-kronos-border/50">
      {/* Gauge */}
      <div className="relative w-20 h-20 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="55%" outerRadius="85%"
            barSize={6}
            data={radialData}
            startAngle={90} endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            {radialData.map((entry, index) => (
              <RadialBar key={index} dataKey="value" cornerRadius={3} background={{ fill: '#1a2235' }}>
                <Cell fill={entry.fill} />
              </RadialBar>
            ))}
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-num text-base font-black" style={{ color: scoreColor }}>
            {score > 0 ? '+' : ''}{score}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: scoreColor }}>Market Sentiment: {scoreLabel}</span>
        </div>
        {[
          { label: 'Positive', count: pos, color: '#10b981' },
          { label: 'Negative', count: neg, color: '#ef4444' },
          { label: 'Neutral', count: neu, color: '#64748b' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-xs text-kronos-muted w-14">{s.label}</span>
            <div className="flex-1 h-1.5 bg-kronos-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color }}
              />
            </div>
            <span className="font-num text-xs font-semibold w-4 text-right" style={{ color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = SENTIMENT_CONFIG[item.sentiment]
  const scoreAbs = Math.abs(item.sentimentScore)

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="px-3 py-3 rounded-xl hover:bg-kronos-border/20 border border-transparent hover:border-kronos-border/40 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-2.5">
        <div className={clsx('flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold mt-0.5 shrink-0', cfg.cls)}>
          {cfg.icon}
          <span className="hidden sm:inline">{cfg.label}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-kronos-text leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {item.headline}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-semibold text-kronos-accent">{item.source}</span>
            <span className="text-xs text-kronos-muted">{item.time}</span>
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs px-1.5 py-0.5 bg-kronos-border/50 text-kronos-muted rounded-md">
                #{tag}
              </span>
            ))}
          </div>

          {/* Sentiment score bar */}
          <div className="flex items-center gap-2 mt-2">
            <BarChart2 size={10} className="text-kronos-muted" />
            <div className="flex-1 h-1 bg-kronos-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${scoreAbs * 100}%`,
                  backgroundColor: cfg.color,
                  marginLeft: item.sentimentScore < 0 ? `${(1 - scoreAbs) * 100}%` : '0',
                }}
              />
            </div>
            <span className="font-num text-xs" style={{ color: cfg.color }}>
              {item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore.toFixed(2)}
            </span>
          </div>

          {expanded && (
            <p className="text-xs text-kronos-muted mt-2 leading-relaxed border-t border-kronos-border/50 pt-2">
              {item.summary}
            </p>
          )}
        </div>

        <ExternalLink size={12} className="text-kronos-muted group-hover:text-kronos-accent transition-colors mt-0.5 shrink-0" />
      </div>
    </div>
  )
}

export default function NewsSentiment() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = newsItems.filter((n) => filter === 'all' || n.sentiment === filter)

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-kronos-border">
        <div className="flex items-center gap-2">
          <Newspaper size={15} className="text-kronos-accent" />
          <div>
            <h2 className="text-sm font-bold text-kronos-text">News & Sentiment</h2>
            <p className="text-xs text-kronos-muted">AI-scored market headlines</p>
          </div>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-kronos-bg rounded-lg">
          {(['all', 'positive', 'negative', 'neutral'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-2.5 py-1 text-xs rounded-md transition-all font-medium capitalize',
                filter === f ? 'bg-kronos-accent text-white' : 'text-kronos-muted hover:text-kronos-text'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sentiment gauge */}
      <div className="px-3 py-3 border-b border-kronos-border/50">
        <SentimentGauge />
      </div>

      {/* News feed */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filtered.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-kronos-border/50 flex items-center justify-between">
        <span className="text-xs text-kronos-muted">{filtered.length} articles</span>
        <button className="text-xs text-kronos-accent hover:underline">Load more →</button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Activity, Bell, Settings, ChevronDown, Wifi } from 'lucide-react'
import { tickerItems } from '@/lib/mockData'
import clsx from 'clsx'

function MarketClock() {
  const [time, setTime] = useState('')
  const [session, setSession] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      const hh = et.getHours()
      const mm = et.getMinutes().toString().padStart(2, '0')
      const ss = et.getSeconds().toString().padStart(2, '0')
      const ampm = hh >= 12 ? 'PM' : 'AM'
      const h12 = ((hh % 12) || 12).toString().padStart(2, '0')
      setTime(`${h12}:${mm}:${ss} ${ampm} ET`)

      if (hh >= 4 && hh < 9.5) setSession('PRE-MARKET')
      else if (hh >= 9.5 && hh < 16) setSession('MARKET OPEN')
      else if (hh >= 16 && hh < 20) setSession('AFTER HOURS')
      else setSession('MARKET CLOSED')
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const sessionColor =
    session === 'MARKET OPEN'
      ? 'text-kronos-green'
      : session === 'PRE-MARKET' || session === 'AFTER HOURS'
      ? 'text-kronos-yellow'
      : 'text-kronos-muted'

  return (
    <div className="flex items-center gap-3">
      <div className={clsx('flex items-center gap-1.5 text-xs font-semibold tracking-widest', sessionColor)}>
        <span
          className={clsx('w-2 h-2 rounded-full', {
            'bg-kronos-green animate-pulse': session === 'MARKET OPEN',
            'bg-kronos-yellow animate-pulse': session === 'PRE-MARKET' || session === 'AFTER HOURS',
            'bg-kronos-muted': session === 'MARKET CLOSED',
          })}
        />
        {session}
      </div>
      <span className="font-num text-xs text-kronos-muted">{time}</span>
    </div>
  )
}

function TickerTape() {
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <div className="ticker-wrapper overflow-hidden bg-kronos-surface border-b border-kronos-border h-8 flex items-center">
      <div className="ticker-tape flex items-center gap-0">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 text-xs">
            <span className="text-kronos-muted font-semibold tracking-wide">{item.symbol}</span>
            <span className="font-num text-kronos-text">
              {item.price >= 100 ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : item.price >= 1 ? item.price.toFixed(4)
                : item.price.toFixed(4)}
            </span>
            <span className={clsx('font-num font-medium', item.dir === 'up' ? 'text-kronos-green' : 'text-kronos-red')}>
              {item.dir === 'up' ? '▲' : '▼'} {Math.abs(item.changePct).toFixed(2)}%
            </span>
            <span className="text-kronos-border">│</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* Main nav */}
      <div className="bg-kronos-bg border-b border-kronos-border px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kronos-accent to-kronos-purple flex items-center justify-center glow-accent">
              <Activity size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight gradient-text">KRONOS</span>
              <span className="text-kronos-muted text-xs ml-1.5 font-medium hidden sm:inline">AI Dashboard</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 ml-6">
            {['Overview', 'Forecasts', 'Signals', 'Portfolio', 'News'].map((nav) => (
              <button
                key={nav}
                className={clsx(
                  'px-3 py-1.5 text-sm rounded-md transition-colors',
                  nav === 'Overview'
                    ? 'text-kronos-accent bg-kronos-accentDim/20'
                    : 'text-kronos-muted hover:text-kronos-text hover:bg-kronos-card'
                )}
              >
                {nav}
              </button>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <MarketClock />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-kronos-border text-xs text-kronos-green">
            <Wifi size={11} />
            <span className="hidden sm:inline font-medium">Live</span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-kronos-card transition-colors text-kronos-muted hover:text-kronos-text">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-kronos-accent rounded-full" />
          </button>
          <button className="p-2 rounded-lg hover:bg-kronos-card transition-colors text-kronos-muted hover:text-kronos-text">
            <Settings size={16} />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-kronos-border">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-kronos-accent to-kronos-purple flex items-center justify-center text-xs font-bold text-white">
              K
            </div>
            <ChevronDown size={14} className="text-kronos-muted hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <TickerTape />
    </header>
  )
}

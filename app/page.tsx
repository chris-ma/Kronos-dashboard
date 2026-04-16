import Header from '@/components/Header'
import MarketOverview from '@/components/MarketOverview'
import AIForecastPanel from '@/components/AIForecastPanel'
import MoversSignals from '@/components/MoversSignals'
import NewsSentiment from '@/components/NewsSentiment'
import LongTermForecast from '@/components/LongTermForecast'

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-kronos-bg">
      <Header />

      <main className="flex-1 p-3 lg:p-4 xl:p-5 space-y-4 max-w-[1920px] mx-auto w-full">
        {/* Top row: Market Overview + AI Forecast */}
        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4 h-auto xl:h-[520px]">
          <MarketOverview />
          <AIForecastPanel />
        </div>

        {/* Middle row: Movers + News */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4 h-auto xl:h-[500px]">
          <MoversSignals />
          <NewsSentiment />
        </div>

        {/* Bottom row: Long-term forecasts (full width) */}
        <div className="h-auto xl:h-[580px]">
          <LongTermForecast />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-kronos-border px-5 py-3 flex items-center justify-between text-xs text-kronos-muted">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-kronos-accent">KRONOS</span>
          <span>AI Premarket Dashboard v1.0</span>
          <span className="hidden sm:inline">Powered by Kronos Forecasting Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Data is for informational purposes only. Not financial advice.</span>
          <span className="hidden md:inline">© 2025 Kronos Analytics</span>
        </div>
      </footer>
    </div>
  )
}

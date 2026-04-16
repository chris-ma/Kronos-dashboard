export type ChangeDir = 'up' | 'down'
export type Signal = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'VOLATILE'
export type Sentiment = 'positive' | 'negative' | 'neutral'

export interface MarketItem {
  symbol: string
  name: string
  price: number
  change: number
  changePct: number
  dir: ChangeDir
  volume?: string
}

export interface ForecastPoint {
  time: string
  actual: number | null
  forecast: number
  upper: number
  lower: number
}

export interface Mover {
  symbol: string
  name: string
  price: number
  changePct: number
  dir: ChangeDir
  signal: Signal
  confidence: number
  volume: string
  sector: string
}

export interface NewsItem {
  id: string
  headline: string
  source: string
  time: string
  sentiment: Sentiment
  sentimentScore: number
  tags: string[]
  summary: string
}

export interface ScenarioItem {
  label: string
  probability: number
  description: string
  color: string
}

// ── Indices ──────────────────────────────────────────────────────────────────
export const indices: MarketItem[] = [
  { symbol: 'S&P 500', name: 'S&P 500', price: 5243.77, change: 18.44, changePct: 0.35, dir: 'up', volume: '2.1B' },
  { symbol: 'DJIA', name: 'Dow Jones', price: 38947.12, change: -112.83, changePct: -0.29, dir: 'down', volume: '312M' },
  { symbol: 'NASDAQ', name: 'Nasdaq Comp', price: 16423.58, change: 94.21, changePct: 0.58, dir: 'up', volume: '4.7B' },
  { symbol: 'Russell 2K', name: 'Russell 2000', price: 2043.91, change: -7.34, changePct: -0.36, dir: 'down', volume: '890M' },
  { symbol: 'VIX', name: 'Volatility Index', price: 14.23, change: -0.87, changePct: -5.76, dir: 'down', volume: '—' },
]

// ── Crypto ────────────────────────────────────────────────────────────────────
export const crypto: MarketItem[] = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 67843.20, change: 1243.50, changePct: 1.87, dir: 'up', volume: '$48.3B' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 3412.88, change: -87.32, changePct: -2.49, dir: 'down', volume: '$21.7B' },
  { symbol: 'SOL/USD', name: 'Solana', price: 178.44, change: 6.21, changePct: 3.61, dir: 'up', volume: '$4.2B' },
  { symbol: 'BNB/USD', name: 'BNB', price: 594.17, change: -4.83, changePct: -0.81, dir: 'down', volume: '$1.9B' },
  { symbol: 'XRP/USD', name: 'XRP', price: 0.6234, change: 0.0112, changePct: 1.83, dir: 'up', volume: '$1.1B' },
]

// ── FX ────────────────────────────────────────────────────────────────────────
export const forex: MarketItem[] = [
  { symbol: 'EUR/USD', name: 'Euro / Dollar', price: 1.0821, change: 0.0034, changePct: 0.31, dir: 'up' },
  { symbol: 'GBP/USD', name: 'Pound / Dollar', price: 1.2697, change: -0.0028, changePct: -0.22, dir: 'down' },
  { symbol: 'USD/JPY', name: 'Dollar / Yen', price: 153.42, change: 0.87, changePct: 0.57, dir: 'up' },
  { symbol: 'USD/CHF', name: 'Dollar / Franc', price: 0.9034, change: -0.0012, changePct: -0.13, dir: 'down' },
  { symbol: 'AUD/USD', name: 'Aussie / Dollar', price: 0.6521, change: 0.0018, changePct: 0.28, dir: 'up' },
]

// ── Commodities ───────────────────────────────────────────────────────────────
export const commodities: MarketItem[] = [
  { symbol: 'GOLD', name: 'Gold Spot', price: 2338.40, change: 14.20, changePct: 0.61, dir: 'up' },
  { symbol: 'OIL (WTI)', name: 'Crude Oil WTI', price: 82.47, change: -0.93, changePct: -1.12, dir: 'down' },
  { symbol: 'SILVER', name: 'Silver Spot', price: 27.83, change: 0.34, changePct: 1.24, dir: 'up' },
  { symbol: 'NAT GAS', name: 'Natural Gas', price: 1.874, change: -0.032, changePct: -1.68, dir: 'down' },
]

// ── Kronos Forecast ───────────────────────────────────────────────────────────
export function generateForecastData(basePrice: number, points = 48): ForecastPoint[] {
  const data: ForecastPoint[] = []
  const now = new Date()
  now.setMinutes(0, 0, 0)
  let price = basePrice

  for (let i = -24; i < points; i++) {
    const t = new Date(now.getTime() + i * 30 * 60 * 1000)
    const label = t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    const noise = (Math.random() - 0.48) * basePrice * 0.0035
    price = price + noise
    const spread = basePrice * (0.004 + Math.abs(i) * 0.0005)

    data.push({
      time: label,
      actual: i <= 0 ? parseFloat(price.toFixed(2)) : null,
      forecast: parseFloat(price.toFixed(2)),
      upper: parseFloat((price + spread).toFixed(2)),
      lower: parseFloat((price - spread).toFixed(2)),
    })
  }
  return data
}

// ── Top Movers ────────────────────────────────────────────────────────────────
export const topMovers: Mover[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 874.15, changePct: 4.87, dir: 'up', signal: 'BULLISH', confidence: 92, volume: '48.2M', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 177.58, changePct: -3.42, dir: 'down', signal: 'BEARISH', confidence: 78, volume: '112.4M', sector: 'Auto' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 162.44, changePct: 3.11, dir: 'up', signal: 'BULLISH', confidence: 85, volume: '41.7M', sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', price: 492.18, changePct: 2.14, dir: 'up', signal: 'BULLISH', confidence: 88, volume: '19.3M', sector: 'Tech / Social' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: 62.33, changePct: -2.87, dir: 'down', signal: 'BEARISH', confidence: 71, volume: '23.1M', sector: 'Fintech' },
  { symbol: 'COIN', name: 'Coinbase Global', price: 224.77, changePct: 5.63, dir: 'up', signal: 'VOLATILE', confidence: 64, volume: '8.9M', sector: 'Crypto' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', price: 183.92, changePct: 1.44, dir: 'up', signal: 'BULLISH', confidence: 83, volume: '31.6M', sector: 'E-Commerce' },
  { symbol: 'INTC', name: 'Intel Corp', price: 30.12, changePct: -4.21, dir: 'down', signal: 'BEARISH', confidence: 80, volume: '55.8M', sector: 'Semiconductors' },
]

// ── News Feed ─────────────────────────────────────────────────────────────────
export const newsItems: NewsItem[] = [
  {
    id: '1',
    headline: 'Fed signals potential rate cut in Q3 as inflation cools to 2.8%',
    source: 'Reuters',
    time: '6m ago',
    sentiment: 'positive',
    sentimentScore: 0.78,
    tags: ['Fed', 'Rates', 'Inflation'],
    summary: 'Federal Reserve officials indicated openness to easing policy as CPI data showed progress toward the 2% target.',
  },
  {
    id: '2',
    headline: 'NVIDIA beats Q1 earnings estimates by 18%, raises full-year guidance',
    source: 'Bloomberg',
    time: '14m ago',
    sentiment: 'positive',
    sentimentScore: 0.91,
    tags: ['NVDA', 'Earnings', 'AI'],
    summary: 'Data center revenue surged 427% YoY, driven by AI chip demand. EPS of $6.12 vs. $5.19 expected.',
  },
  {
    id: '3',
    headline: 'China manufacturing PMI contracts for third consecutive month',
    source: 'FT',
    time: '28m ago',
    sentiment: 'negative',
    sentimentScore: -0.62,
    tags: ['China', 'PMI', 'Macro'],
    summary: 'Official PMI fell to 49.1 in April, raising concerns about global demand outlook and supply chain pressures.',
  },
  {
    id: '4',
    headline: 'Bitcoin ETF inflows hit $642M in single day, largest since January',
    source: 'CoinDesk',
    time: '42m ago',
    sentiment: 'positive',
    sentimentScore: 0.84,
    tags: ['BTC', 'ETF', 'Crypto'],
    summary: 'Spot Bitcoin ETFs recorded combined net inflows of $642M, signaling renewed institutional demand.',
  },
  {
    id: '5',
    headline: 'Tesla recalls 125,000 vehicles over seat belt warning defect',
    source: 'WSJ',
    time: '1h ago',
    sentiment: 'negative',
    sentimentScore: -0.55,
    tags: ['TSLA', 'Recall', 'Auto'],
    summary: 'NHTSA issued a recall for Model S, X, 3, and Y vehicles over a software defect in seat belt warning systems.',
  },
  {
    id: '6',
    headline: 'ECB holds rates steady, hints at June cut amid slowing eurozone growth',
    source: 'ECB',
    time: '1h 20m ago',
    sentiment: 'neutral',
    sentimentScore: 0.05,
    tags: ['ECB', 'EUR', 'Rates'],
    summary: 'The ECB kept its key rate at 4.0%, with Lagarde citing "sufficient confidence" in disinflation for a potential June reduction.',
  },
  {
    id: '7',
    headline: 'Microsoft Azure revenue growth accelerates to 31% in Q3',
    source: 'Bloomberg',
    time: '2h ago',
    sentiment: 'positive',
    sentimentScore: 0.76,
    tags: ['MSFT', 'Cloud', 'AI'],
    summary: 'Azure and cloud services grew 31% YoY, beating expectations of 28%, driven by AI workload expansion.',
  },
]

// ── Kronos AI Scenarios ───────────────────────────────────────────────────────
export const scenarios: ScenarioItem[] = [
  { label: 'Bull Case', probability: 38, description: 'Fed signals June cut; tech leads rally. S&P targets 5,400+.', color: '#10b981' },
  { label: 'Base Case', probability: 44, description: 'Consolidation in 5,150–5,280 range. Mixed sector rotation.', color: '#0ea5e9' },
  { label: 'Bear Case', probability: 18, description: 'Macro headwinds trigger selloff below 5,000 support.', color: '#ef4444' },
]

// ── Ticker tape data ──────────────────────────────────────────────────────────
export const tickerItems = [
  ...indices.map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
  ...crypto.slice(0, 3).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
  ...forex.slice(0, 3).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
  ...commodities.slice(0, 2).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
]

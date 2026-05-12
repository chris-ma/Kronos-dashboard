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
  category?: string
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

// ── Commodities (all categories) ─────────────────────────────────────────────
export const commodities: MarketItem[] = [
  // Precious Metals
  { symbol: 'GOLD',      name: 'Gold Spot',       price: 2338.40,  change:  14.20,   changePct:  0.61,  dir: 'up',   category: 'Precious Metals' },
  { symbol: 'SILVER',    name: 'Silver Spot',      price:   27.83,  change:   0.34,   changePct:  1.24,  dir: 'up',   category: 'Precious Metals' },
  { symbol: 'PLATINUM',  name: 'Platinum Spot',    price:  985.20,  change:  -8.40,   changePct: -0.85,  dir: 'down', category: 'Precious Metals' },
  { symbol: 'PALLADIUM', name: 'Palladium Spot',   price: 1024.50,  change:  12.30,   changePct:  1.22,  dir: 'up',   category: 'Precious Metals' },
  // Base Metals
  { symbol: 'COPPER',    name: 'Copper ($/lb)',     price:    4.523, change:   0.042,  changePct:  0.94,  dir: 'up',   category: 'Base Metals' },
  { symbol: 'ALUMINUM',  name: 'Aluminum ($/t)',    price: 2534.00,  change: -18.50,   changePct: -0.72,  dir: 'down', category: 'Base Metals' },
  { symbol: 'ZINC',      name: 'Zinc ($/t)',        price: 2876.00,  change:  34.00,   changePct:  1.20,  dir: 'up',   category: 'Base Metals' },
  { symbol: 'NICKEL',    name: 'Nickel ($/t)',      price: 18240.00, change: -210.00,  changePct: -1.14,  dir: 'down', category: 'Base Metals' },
  { symbol: 'LEAD',      name: 'Lead ($/t)',        price: 2156.00,  change:  11.00,   changePct:  0.51,  dir: 'up',   category: 'Base Metals' },
  { symbol: 'TIN',       name: 'Tin ($/t)',         price: 31450.00, change: 280.00,   changePct:  0.90,  dir: 'up',   category: 'Base Metals' },
  // Energy
  { symbol: 'WTI',       name: 'Crude Oil WTI',    price:   82.47,  change:  -0.93,   changePct: -1.12,  dir: 'down', category: 'Energy' },
  { symbol: 'BRENT',     name: 'Brent Crude',       price:   86.23,  change:  -0.71,   changePct: -0.82,  dir: 'down', category: 'Energy' },
  { symbol: 'NAT GAS',   name: 'Natural Gas',       price:    1.874, change:  -0.032,  changePct: -1.68,  dir: 'down', category: 'Energy' },
  { symbol: 'HEAT OIL',  name: 'Heating Oil',       price:    2.634, change:   0.018,  changePct:  0.69,  dir: 'up',   category: 'Energy' },
  { symbol: 'GASOLINE',  name: 'RBOB Gasoline',     price:    2.743, change:  -0.024,  changePct: -0.87,  dir: 'down', category: 'Energy' },
  { symbol: 'COAL',      name: 'Newcastle Coal',    price:  134.50,  change:   1.85,   changePct:  1.39,  dir: 'up',   category: 'Energy' },
  // Agriculture
  { symbol: 'CORN',      name: 'Corn (¢/bu)',       price:  454.25,  change:  -3.75,   changePct: -0.82,  dir: 'down', category: 'Agriculture' },
  { symbol: 'WHEAT',     name: 'Wheat (¢/bu)',      price:  567.75,  change:   8.25,   changePct:  1.47,  dir: 'up',   category: 'Agriculture' },
  { symbol: 'SOYBEANS',  name: 'Soybeans (¢/bu)',   price: 1143.25,  change: -11.50,   changePct: -1.00,  dir: 'down', category: 'Agriculture' },
  { symbol: 'COFFEE',    name: 'Coffee C (¢/lb)',   price:  223.45,  change:   4.20,   changePct:  1.92,  dir: 'up',   category: 'Agriculture' },
  { symbol: 'SUGAR',     name: 'Sugar #11 (¢/lb)',  price:   19.24,  change:  -0.38,   changePct: -1.94,  dir: 'down', category: 'Agriculture' },
  { symbol: 'COTTON',    name: 'Cotton (¢/lb)',     price:   82.34,  change:   0.67,   changePct:  0.82,  dir: 'up',   category: 'Agriculture' },
  { symbol: 'COCOA',     name: 'Cocoa ($/t)',       price: 8234.00,  change: 124.00,   changePct:  1.53,  dir: 'up',   category: 'Agriculture' },
  // Livestock
  { symbol: 'CATTLE',    name: 'Live Cattle (¢/lb)',price:  181.42,  change:   0.87,   changePct:  0.48,  dir: 'up',   category: 'Livestock' },
  { symbol: 'HOGS',      name: 'Lean Hogs (¢/lb)', price:   92.34,  change:  -1.24,   changePct: -1.33,  dir: 'down', category: 'Livestock' },
]

// ── ASX (Australia) ───────────────────────────────────────────────────────────
export const asxIndices: MarketItem[] = [
  { symbol: 'XJO',  name: 'S&P/ASX 200',         price: 7823.40, change:  42.30, changePct:  0.54, dir: 'up',   volume: '—',     category: 'Indices' },
  { symbol: 'XAO',  name: 'All Ordinaries',        price: 8034.20, change:  38.70, changePct:  0.48, dir: 'up',   volume: '—',     category: 'Indices' },
  { symbol: 'XFL',  name: 'S&P/ASX 50',           price: 7234.80, change: -21.40, changePct: -0.29, dir: 'down', volume: '—',     category: 'Indices' },
  { symbol: 'XSO',  name: 'ASX Small Ords',        price: 3124.50, change:  14.80, changePct:  0.48, dir: 'up',   volume: '—',     category: 'Indices' },
]

export const asxStocks: MarketItem[] = [
  { symbol: 'BHP',  name: 'BHP Group',            price:  45.12, change:  0.63,  changePct:  1.42, dir: 'up',   volume: '28.4M', category: 'Mining' },
  { symbol: 'RIO',  name: 'Rio Tinto',             price: 118.23, change: -1.87,  changePct: -1.56, dir: 'down', volume: '4.1M',  category: 'Mining' },
  { symbol: 'FMG',  name: 'Fortescue',             price:  22.87, change:  0.44,  changePct:  1.96, dir: 'up',   volume: '18.7M', category: 'Mining' },
  { symbol: 'CBA',  name: 'Commonwealth Bank',     price: 122.45, change:  1.23,  changePct:  1.01, dir: 'up',   volume: '3.8M',  category: 'Financials' },
  { symbol: 'NAB',  name: 'National Aust. Bank',   price:  34.78, change: -0.42,  changePct: -1.19, dir: 'down', volume: '9.2M',  category: 'Financials' },
  { symbol: 'WBC',  name: 'Westpac Banking',       price:  26.92, change:  0.18,  changePct:  0.67, dir: 'up',   volume: '11.3M', category: 'Financials' },
  { symbol: 'ANZ',  name: 'ANZ Group',             price:  28.54, change: -0.31,  changePct: -1.08, dir: 'down', volume: '8.6M',  category: 'Financials' },
  { symbol: 'MQG',  name: 'Macquarie Group',       price: 189.34, change:  2.87,  changePct:  1.54, dir: 'up',   volume: '1.4M',  category: 'Financials' },
  { symbol: 'CSL',  name: 'CSL Limited',           price: 287.30, change:  3.45,  changePct:  1.22, dir: 'up',   volume: '1.1M',  category: 'Healthcare' },
  { symbol: 'WES',  name: 'Wesfarmers',            price:  67.45, change: -0.54,  changePct: -0.79, dir: 'down', volume: '2.9M',  category: 'Consumer' },
  { symbol: 'WOW',  name: 'Woolworths Group',      price:  33.45, change:  0.23,  changePct:  0.69, dir: 'up',   volume: '4.7M',  category: 'Consumer' },
  { symbol: 'TLS',  name: 'Telstra Group',         price:   4.21, change: -0.04,  changePct: -0.94, dir: 'down', volume: '22.8M', category: 'Telecom' },
  { symbol: 'GMG',  name: 'Goodman Group',         price:  32.15, change:  0.48,  changePct:  1.51, dir: 'up',   volume: '3.2M',  category: 'Property' },
  { symbol: 'TCL',  name: 'Transurban Group',      price:  13.24, change: -0.12,  changePct: -0.90, dir: 'down', volume: '5.8M',  category: 'Infrastructure' },
  { symbol: 'REA',  name: 'REA Group',             price: 195.60, change:  4.20,  changePct:  2.19, dir: 'up',   volume: '0.6M',  category: 'Technology' },
]

export const asx: MarketItem[] = [...asxIndices, ...asxStocks]

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

// ── Long-Term Forecast ────────────────────────────────────────────────────────
export type Timeframe = '3M' | '6M' | '1Y' | '3Y' | '5Y'

export interface LongTermPoint {
  time: string
  actual: number | null
  forecast: number
  upper: number
  lower: number
}

export interface LongTermSummary {
  period: Timeframe
  label: string
  targetPrice: number
  returnPct: number
  confidence: number
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
}

interface TFConfig {
  totalMonths: number
  intervalDays: number
  annualDrift: number
  endSpreadFraction: number
}

const TF_CONFIG: Record<Timeframe, TFConfig> = {
  '3M': { totalMonths: 3,  intervalDays: 7,   annualDrift: 0.09, endSpreadFraction: 0.06 },
  '6M': { totalMonths: 6,  intervalDays: 14,  annualDrift: 0.09, endSpreadFraction: 0.10 },
  '1Y': { totalMonths: 12, intervalDays: 30,  annualDrift: 0.09, endSpreadFraction: 0.17 },
  '3Y': { totalMonths: 36, intervalDays: 91,  annualDrift: 0.09, endSpreadFraction: 0.30 },
  '5Y': { totalMonths: 60, intervalDays: 182, annualDrift: 0.09, endSpreadFraction: 0.45 },
}

const TF_CONF_MAP: Record<Timeframe, number> = {
  '3M': 84, '6M': 76, '1Y': 67, '3Y': 52, '5Y': 41,
}

export const TF_LABELS: Record<Timeframe, string> = {
  '3M': '3 Months', '6M': '6 Months', '1Y': '1 Year', '3Y': '3 Years', '5Y': '5 Years',
}

function fmtTimeLabel(date: Date, intervalDays: number): string {
  if (intervalDays <= 14) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  if (intervalDays <= 31) {
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }
  const q = Math.floor(date.getMonth() / 3) + 1
  return `Q${q} '${String(date.getFullYear()).slice(2)}`
}

export function generateLongTermData(basePrice: number, timeframe: Timeframe): LongTermPoint[] {
  const { totalMonths, intervalDays, annualDrift, endSpreadFraction } = TF_CONFIG[timeframe]
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const totalDays = totalMonths * 30
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000
  const driftPerInterval = annualDrift * (intervalDays / 365)
  const volPerInterval = 0.016 * Math.sqrt(intervalDays / 5)

  // Build history (walk backwards from basePrice, then reverse)
  const histDates: Date[] = []
  let d = new Date(now)
  while (d.getTime() >= now.getTime() - totalDays * 86400000) {
    histDates.unshift(new Date(d))
    d = new Date(d.getTime() - intervalMs)
  }

  const histPrices: number[] = [basePrice]
  for (let i = 1; i < histDates.length; i++) {
    const noise = (Math.random() - 0.5) * 2 * volPerInterval
    // reverse-drift to simulate history
    histPrices.unshift(Math.max(histPrices[0] / (1 + driftPerInterval + noise), 0.001))
  }

  // Build forecast (walk forward from basePrice)
  const futureDates: Date[] = []
  d = new Date(now.getTime() + intervalMs)
  while (d.getTime() <= now.getTime() + totalDays * 86400000) {
    futureDates.push(new Date(d))
    d = new Date(d.getTime() + intervalMs)
  }

  const futurePrices: number[] = [basePrice]
  for (let i = 1; i <= futureDates.length; i++) {
    const noise = (Math.random() - 0.47) * 2 * volPerInterval
    futurePrices.push(Math.max(futurePrices[futurePrices.length - 1] * (1 + driftPerInterval + noise), 0.001))
  }
  futurePrices.shift() // remove the seed (current price)

  const totalFuture = futureDates.length

  return [
    ...histDates.map((date, i) => {
      const p = histPrices[i]
      return {
        time: fmtTimeLabel(date, intervalDays),
        actual: parseFloat(p.toFixed(2)),
        forecast: parseFloat(p.toFixed(2)),
        upper: parseFloat(p.toFixed(2)),
        lower: parseFloat(p.toFixed(2)),
      }
    }),
    ...futureDates.map((date, i) => {
      const p = futurePrices[i]
      const spreadFrac = endSpreadFraction * ((i + 1) / totalFuture)
      const spread = basePrice * spreadFrac
      return {
        time: fmtTimeLabel(date, intervalDays),
        actual: null,
        forecast: parseFloat(p.toFixed(2)),
        upper: parseFloat((p + spread).toFixed(2)),
        lower: parseFloat(Math.max(p - spread, 0.001).toFixed(2)),
      }
    }),
  ]
}

export function buildLongTermSummaries(
  basePrice: number,
  allData: Record<Timeframe, LongTermPoint[]>
): LongTermSummary[] {
  return (['3M', '6M', '1Y', '3Y', '5Y'] as Timeframe[]).map((period) => {
    const last = allData[period].at(-1)!
    const returnPct = ((last.forecast - basePrice) / basePrice) * 100
    return {
      period,
      label: TF_LABELS[period],
      targetPrice: last.forecast,
      returnPct: parseFloat(returnPct.toFixed(2)),
      confidence: TF_CONF_MAP[period],
      signal: returnPct > 3 ? 'BULLISH' : returnPct < -3 ? 'BEARISH' : 'NEUTRAL',
    }
  })
}

// ── Ticker tape data ──────────────────────────────────────────────────────────
export const tickerItems = [
  ...indices.map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
  ...asxIndices.slice(0, 2).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
  ...crypto.slice(0, 3).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
  ...forex.slice(0, 3).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
  ...commodities.filter(c => ['GOLD', 'WTI', 'COPPER', 'BRENT'].includes(c.symbol)).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct, dir: i.dir })),
]

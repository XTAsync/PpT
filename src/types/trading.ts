export type MarketType = 'stocks' | 'crypto' | 'etfs' | 'forex_commodities';

export interface Asset {
  symbol: string;
  name: string;
  market: MarketType;
  price: number;
  prevClose: number;
  change: number;
  changePct: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap: string;
  peRatio?: number;
  dividendYield?: number;
  description: string;
  sector: string;
  icon?: string;
  sparkline: number[];
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Holding {
  symbol: string;
  name: string;
  market: MarketType;
  shares: number;
  avgBuyPrice: number;
  totalCost: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  market: MarketType;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  realizedPnL?: number;
  timestamp: number;
}

export interface LimitOrder {
  id: string;
  symbol: string;
  name: string;
  market: MarketType;
  type: 'BUY' | 'SELL';
  shares: number;
  targetPrice: number;
  totalValue: number;
  createdAt: number;
  status: 'PENDING' | 'FILLED' | 'CANCELLED';
}

export interface LeaderboardTrader {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  country: string;
  portfolioValue: number;
  totalReturnPct: number;
  dayReturnPct: number;
  winRate: number;
  tradesCount: number;
  badge: string;
  isUser?: boolean;
}

export interface UserProfile {
  username: string;
  avatar: string;
  country: string;
  style: string;
  seasonId: string;
}

export interface ContestInfo {
  seasonTitle: string;
  seasonNumber: number;
  startingCapital: number;
  prizePool: string;
  endDate: string;
  participantsCount: number;
}

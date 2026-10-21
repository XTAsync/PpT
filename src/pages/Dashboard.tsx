import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset } from '../types/trading';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Shield,
  Zap,
  Sparkles,
  ChevronRight,
  BarChart2,
} from 'lucide-react';

interface DashboardProps {
  onOpenTrade: (asset: Asset, mode?: 'BUY' | 'SELL') => void;
  onNavigateTab: (tab: 'dashboard' | 'market' | 'portfolio' | 'leaderboard' | 'copilot' | 'rules') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenTrade, onNavigateTab }) => {
  const {
    assets,
    priceFlashes,
    cash,
    holdings,
    totalInvested,
    portfolioValue,
    totalReturnDollars,
    totalReturnPct,
    dayReturnDollars,
    dayReturnPct,
    userRank,
    contestInfo,
    transactions,
    userProfile,
  } = useTrading();

  // Contest Countdown Timer simulation
  const [timeLeft, setTimeLeft] = useState({ days: 11, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Top gainers and losers
  const sortedByChange = [...assets].sort((a, b) => b.changePct - a.changePct);
  const topGainers = sortedByChange.slice(0, 4);
  const topLosers = [...sortedByChange].reverse().slice(0, 4);

  const holdingsList = Object.values(holdings);

  return (
    <div className="space-y-6">
      {/* Hero Contest Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-teal-500/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Season 4 Live Tournament
              </span>
              <span className="text-xs text-slate-400 font-medium">
                4,892 Traders Competing
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Global Paper Trading Championship
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Every participant enters with an official <span className="text-emerald-400 font-semibold">$100,000</span> virtual starting balance. Trade US stocks, crypto, ETFs, and commodities with zero risk and fight for the #1 spot on the live leaderboard.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                onClick={() => onNavigateTab('market')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                Explore Markets & Trade
              </button>
              <button
                onClick={() => onNavigateTab('leaderboard')}
                className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                View Leaderboard (You: #{userRank})
              </button>
            </div>
          </div>

          {/* Countdown & Rank Card */}
          <div className="w-full lg:w-auto shrink-0 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Tournament Ends In:
              </span>
              <span className="text-amber-400 font-bold">{contestInfo.prizePool}</span>
            </div>

            {/* Countdown Clocks */}
            <div className="grid grid-cols-4 gap-2 text-center mb-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 min-w-14">
                <div className="text-lg font-black font-mono text-white">{timeLeft.days}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Days</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 min-w-14">
                <div className="text-lg font-black font-mono text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Hours</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 min-w-14">
                <div className="text-lg font-black font-mono text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Mins</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 min-w-14">
                <div className="text-lg font-black font-mono text-emerald-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Secs</div>
              </div>
            </div>

            {/* User Standing Strip */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{userProfile.avatar}</span>
                <div>
                  <div className="text-xs font-bold text-white">{userProfile.username}</div>
                  <div className="text-[10px] text-slate-400">Starting: $100,000</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-emerald-400">Rank #{userRank}</div>
                <div className="text-[10px] text-slate-400">
                  {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}% ROI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Contest Net Worth</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span
              className={`font-semibold font-mono flex items-center ${
                totalReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalReturnPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}%
            </span>
            <span className="text-slate-400">all-time (${totalReturnDollars >= 0 ? '+' : ''}${totalReturnDollars.toLocaleString()})</span>
          </div>
        </div>

        {/* Available Cash / Buying Power */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Buying Power (Cash)</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            ${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {((cash / portfolioValue) * 100).toFixed(1)}% of total portfolio in cash
          </div>
        </div>

        {/* Invested Equity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Invested In Markets</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across {holdingsList.length} active position{holdingsList.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Day P&L */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Today's Market P&L</span>
            <div
              className={`p-2 rounded-xl ${
                dayReturnDollars >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {dayReturnDollars >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div
            className={`text-2xl font-black font-mono tracking-tight ${
              dayReturnDollars >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {dayReturnDollars >= 0 ? '+' : ''}${dayReturnDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <span className={`font-semibold font-mono ${dayReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {dayReturnPct >= 0 ? '+' : ''}{dayReturnPct.toFixed(2)}%
            </span>
            <span>24h intraday movement</span>
          </div>
        </div>
      </div>

      {/* Top Movers Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Top Market Gainers</h2>
            </div>
            <button
              onClick={() => onNavigateTab('market')}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              All Markets <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {topGainers.map((asset) => {
              const flash = priceFlashes[asset.symbol];
              return (
                <div
                  key={asset.symbol}
                  className={`flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all ${
                    flash === 'up' ? 'ring-1 ring-emerald-500' : flash === 'down' ? 'ring-1 ring-rose-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {asset.symbol}
                        <span className="text-[10px] text-slate-400 font-normal uppercase px-1.5 py-0.2 rounded-md bg-slate-800">
                          {asset.market}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[130px] sm:max-w-xs">{asset.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-white">${asset.price.toFixed(asset.price < 2 ? 4 : 2)}</div>
                      <div className="text-[11px] font-bold font-mono text-emerald-400 flex items-center justify-end">
                        <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                        +{asset.changePct.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenTrade(asset, 'BUY')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
                    >
                      Trade
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Losers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Top Dips & Oversold</h2>
            </div>
            <button
              onClick={() => onNavigateTab('market')}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              All Markets <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {topLosers.map((asset) => {
              const flash = priceFlashes[asset.symbol];
              return (
                <div
                  key={asset.symbol}
                  className={`flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all ${
                    flash === 'up' ? 'ring-1 ring-emerald-500' : flash === 'down' ? 'ring-1 ring-rose-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-rose-400">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        {asset.symbol}
                        <span className="text-[10px] text-slate-400 font-normal uppercase px-1.5 py-0.2 rounded-md bg-slate-800">
                          {asset.market}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[130px] sm:max-w-xs">{asset.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-white">${asset.price.toFixed(asset.price < 2 ? 4 : 2)}</div>
                      <div className="text-[11px] font-bold font-mono text-rose-400 flex items-center justify-end">
                        <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                        {asset.changePct.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenTrade(asset, 'BUY')}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
                    >
                      Buy Dip
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portfolio Holdings Quick Snapshot & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Positions */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Your Active Contest Holdings ({holdingsList.length})
            </h2>
            <button
              onClick={() => onNavigateTab('portfolio')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              Full Portfolio <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {holdingsList.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
                <BarChart2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No active positions yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                You have $100,000 ready to deploy! Buy tech giants, Bitcoin, Solana, or index funds to start climbing the leaderboard.
              </p>
              <button
                onClick={() => onNavigateTab('market')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Browse Markets
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-medium">Asset</th>
                    <th className="pb-3 font-medium text-right">Shares</th>
                    <th className="pb-3 font-medium text-right">Avg Cost</th>
                    <th className="pb-3 font-medium text-right">Current Price</th>
                    <th className="pb-3 font-medium text-right">Market Value</th>
                    <th className="pb-3 font-medium text-right">P&L ($ / %)</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {holdingsList.slice(0, 5).map((h) => {
                    const isProfitable = h.unrealizedPnL >= 0;
                    const asset = assets.find((a) => a.symbol === h.symbol);

                    return (
                      <tr key={h.symbol} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-sans">
                          <div className="font-bold text-white">{h.symbol}</div>
                          <div className="text-[11px] text-slate-400 font-normal truncate max-w-[120px]">{h.name}</div>
                        </td>
                        <td className="py-3 text-right text-slate-200">{h.shares.toFixed(4)}</td>
                        <td className="py-3 text-right text-slate-300">${h.avgBuyPrice.toFixed(2)}</td>
                        <td className="py-3 text-right text-white font-bold">${h.currentPrice.toFixed(2)}</td>
                        <td className="py-3 text-right text-white font-bold">${h.currentValue.toLocaleString()}</td>
                        <td className={`py-3 text-right font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfitable ? '+' : ''}${h.unrealizedPnL.toFixed(2)}
                          <div className="text-[10px]">({isProfitable ? '+' : ''}{h.unrealizedPnLPct.toFixed(2)}%)</div>
                        </td>
                        <td className="py-3 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => asset && onOpenTrade(asset, 'BUY')}
                              className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold transition-colors"
                            >
                              +Buy
                            </button>
                            <button
                              onClick={() => asset && onOpenTrade(asset, 'SELL')}
                              className="px-2 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 text-[11px] font-bold transition-colors"
                            >
                              Sell
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Transactions Feed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Recent Fills
            </h2>
            <button
              onClick={() => onNavigateTab('portfolio')}
              className="text-xs text-slate-400 hover:text-white"
            >
              All Trades
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No trades executed yet. Place your first market or limit order!
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.slice(0, 6).map((tx) => {
                const isBuy = tx.type === 'BUY';
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                          isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {tx.type}
                      </span>
                      <div>
                        <div className="font-bold text-white">{tx.symbol}</div>
                        <div className="text-[10px] text-slate-400">
                          {tx.shares.toFixed(3)} @ ${tx.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-slate-200 font-semibold">${tx.total.toLocaleString()}</div>
                      {tx.realizedPnL !== undefined && (
                        <div
                          className={`text-[10px] font-bold ${
                            tx.realizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {tx.realizedPnL >= 0 ? '+' : ''}${tx.realizedPnL.toFixed(2)} P&L
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

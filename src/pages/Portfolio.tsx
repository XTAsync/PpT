import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset } from '../types/trading';
import {
  PieChart as PieIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Layers,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface PortfolioPageProps {
  onOpenTrade: (asset: Asset, mode?: 'BUY' | 'SELL') => void;
  onNavigateTab: (tab: 'dashboard' | 'market' | 'portfolio' | 'leaderboard' | 'copilot' | 'rules') => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenTrade, onNavigateTab }) => {
  const {
    cash,
    holdings,
    assets,
    transactions,
    limitOrders,
    cancelLimitOrder,
    totalInvested,
    portfolioValue,
    totalReturnDollars,
    totalReturnPct,
    resetContest,
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history'>('positions');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const holdingsList = Object.values(holdings);

  // Calculate allocation by category
  const allocation = useMemo(() => {
    let stocks = 0;
    let crypto = 0;
    let etfs = 0;
    let forex = 0;

    holdingsList.forEach((h) => {
      if (h.market === 'stocks') stocks += h.currentValue;
      else if (h.market === 'crypto') crypto += h.currentValue;
      else if (h.market === 'etfs') etfs += h.currentValue;
      else if (h.market === 'forex_commodities') forex += h.currentValue;
    });

    const total = portfolioValue || 1;
    return {
      cash: { amount: cash, pct: Number(((cash / total) * 100).toFixed(1)), color: '#38BDF8' }, // sky
      stocks: { amount: stocks, pct: Number(((stocks / total) * 100).toFixed(1)), color: '#10B981' }, // emerald
      crypto: { amount: crypto, pct: Number(((crypto / total) * 100).toFixed(1)), color: '#F59E0B' }, // amber
      etfs: { amount: etfs, pct: Number(((etfs / total) * 100).toFixed(1)), color: '#8B5CF6' }, // violet
      forex: { amount: forex, pct: Number(((forex / total) * 100).toFixed(1)), color: '#EC4899' }, // pink
    };
  }, [holdingsList, cash, portfolioValue]);

  // Total realized P&L from transaction history
  const totalRealizedPnL = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + (tx.realizedPnL || 0), 0);
  }, [transactions]);

  // Total unrealized P&L from active holdings
  const totalUnrealizedPnL = useMemo(() => {
    return holdingsList.reduce((sum, h) => sum + h.unrealizedPnL, 0);
  }, [holdingsList]);

  return (
    <div className="space-y-6">
      {/* Portfolio Header Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Total Net Worth</span>
          <div className="text-2xl font-black font-mono text-white">
            ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs flex items-center gap-1.5 font-mono font-semibold">
            <span className={totalReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}%
            </span>
            <span className="text-slate-400 font-sans">
              (${totalReturnDollars >= 0 ? '+' : ''}${totalReturnDollars.toLocaleString()} vs $100K start)
            </span>
          </div>
        </div>

        {/* Buying Power */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Available Cash</span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            ${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Unallocated capital ready to trade
          </div>
        </div>

        {/* Unrealized P&L */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Unrealized Holdings P&L</span>
          <div
            className={`text-2xl font-black font-mono ${
              totalUnrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Floating gain/loss on open trades
          </div>
        </div>

        {/* Realized P&L */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 block mb-1">Realized Net P&L</span>
          <div
            className={`text-2xl font-black font-mono ${
              totalRealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalRealizedPnL >= 0 ? '+' : ''}${totalRealizedPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Locked profits from closed positions
          </div>
        </div>
      </div>

      {/* Asset Allocation Breakdown Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            Asset Allocation by Market
          </span>
          <span className="text-slate-400 font-mono">100% Total Capital</span>
        </div>

        {/* Multi-segment horizontal progress bar */}
        <div className="w-full h-3 rounded-full bg-slate-950 flex overflow-hidden p-0.5 border border-slate-800 mb-3">
          <div style={{ width: `${allocation.cash.pct}%`, backgroundColor: allocation.cash.color }} className="h-full first:rounded-l-full last:rounded-r-full" title={`Cash: ${allocation.cash.pct}%`} />
          <div style={{ width: `${allocation.stocks.pct}%`, backgroundColor: allocation.stocks.color }} className="h-full" title={`Stocks: ${allocation.stocks.pct}%`} />
          <div style={{ width: `${allocation.crypto.pct}%`, backgroundColor: allocation.crypto.color }} className="h-full" title={`Crypto: ${allocation.crypto.pct}%`} />
          <div style={{ width: `${allocation.etfs.pct}%`, backgroundColor: allocation.etfs.color }} className="h-full" title={`ETFs: ${allocation.etfs.pct}%`} />
          <div style={{ width: `${allocation.forex.pct}%`, backgroundColor: allocation.forex.color }} className="h-full first:rounded-l-full last:rounded-r-full" title={`Forex & Commodities: ${allocation.forex.pct}%`} />
        </div>

        {/* Allocation Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: allocation.cash.color }}></span>
            <span className="text-slate-300">Cash:</span>
            <span className="text-white font-bold">{allocation.cash.pct}%</span>
            <span className="text-slate-400 text-[11px]">(${allocation.cash.amount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: allocation.stocks.color }}></span>
            <span className="text-slate-300">Stocks:</span>
            <span className="text-white font-bold">{allocation.stocks.pct}%</span>
            <span className="text-slate-400 text-[11px]">(${allocation.stocks.amount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: allocation.crypto.color }}></span>
            <span className="text-slate-300">Crypto:</span>
            <span className="text-white font-bold">{allocation.crypto.pct}%</span>
            <span className="text-slate-400 text-[11px]">(${allocation.crypto.amount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: allocation.etfs.color }}></span>
            <span className="text-slate-300">ETFs:</span>
            <span className="text-white font-bold">{allocation.etfs.pct}%</span>
            <span className="text-slate-400 text-[11px]">(${allocation.etfs.amount.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: allocation.forex.color }}></span>
            <span className="text-slate-300">Commodities/FX:</span>
            <span className="text-white font-bold">{allocation.forex.pct}%</span>
            <span className="text-slate-400 text-[11px]">(${allocation.forex.amount.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Tabs: Positions vs Pending Orders vs Trade History */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'positions'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Open Positions ({holdingsList.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Limit Orders ({limitOrders.filter((o) => o.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Trade Ledger ({transactions.length})
            </button>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-900 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to $100K Start
          </button>
        </div>

        {/* Tab 1: Open Positions */}
        {activeTab === 'positions' && (
          <div>
            {holdingsList.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm font-semibold text-slate-300">You currently hold no open positions</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Browse markets to buy stocks, cryptocurrencies, ETFs or commodities with your $100,000 cash.
                </p>
                <button
                  onClick={() => onNavigateTab('market')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  Go to Markets Terminal
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-medium">Asset</th>
                      <th className="pb-3 font-medium text-right">Shares Held</th>
                      <th className="pb-3 font-medium text-right">Avg Cost</th>
                      <th className="pb-3 font-medium text-right">Current Price</th>
                      <th className="pb-3 font-medium text-right">Total Value</th>
                      <th className="pb-3 font-medium text-right">Unrealized P&L</th>
                      <th className="pb-3 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {holdingsList.map((h) => {
                      const isUp = h.unrealizedPnL >= 0;
                      const asset = assets.find((a) => a.symbol === h.symbol);

                      return (
                        <tr key={h.symbol} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 font-sans">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{h.symbol}</span>
                              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-400 font-mono">
                                {h.market}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">{h.name}</div>
                          </td>

                          <td className="py-3.5 text-right text-slate-200">{h.shares.toFixed(4)}</td>
                          <td className="py-3.5 text-right text-slate-300">${h.avgBuyPrice.toFixed(2)}</td>
                          <td className="py-3.5 text-right font-bold text-white">${h.currentPrice.toFixed(2)}</td>
                          <td className="py-3.5 text-right font-bold text-white">${h.currentValue.toLocaleString()}</td>

                          <td className={`py-3.5 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isUp ? '+' : ''}${h.unrealizedPnL.toFixed(2)}
                            <div className="text-[10px]">({isUp ? '+' : ''}{h.unrealizedPnLPct.toFixed(2)}%)</div>
                          </td>

                          <td className="py-3.5 text-right font-sans">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => asset && onOpenTrade(asset, 'BUY')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-colors"
                              >
                                Buy More
                              </button>
                              <button
                                onClick={() => asset && onOpenTrade(asset, 'SELL')}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 text-xs font-bold transition-colors"
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
        )}

        {/* Tab 2: Limit Orders */}
        {activeTab === 'orders' && (
          <div>
            {limitOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No active or historical limit orders.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Symbol</th>
                      <th className="pb-3 font-medium text-right">Shares</th>
                      <th className="pb-3 font-medium text-right">Target Price</th>
                      <th className="pb-3 font-medium text-right">Total Value</th>
                      <th className="pb-3 font-medium text-center">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {limitOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              order.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            LIMIT {order.type}
                          </span>
                        </td>
                        <td className="py-3 font-sans font-bold text-white">{order.symbol}</td>
                        <td className="py-3 text-right text-slate-200">{order.shares.toFixed(4)}</td>
                        <td className="py-3 text-right text-white font-bold">${order.targetPrice.toFixed(2)}</td>
                        <td className="py-3 text-right text-slate-300">${order.totalValue.toLocaleString()}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'PENDING'
                                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20 animate-pulse'
                                : order.status === 'FILLED'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-sans">
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => cancelLimitOrder(order.id)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-400 text-[11px] font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Trade Ledger History */}
        {activeTab === 'history' && (
          <div>
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No trades recorded in your ledger yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-medium">Timestamp</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Asset</th>
                      <th className="pb-3 font-medium text-right">Shares</th>
                      <th className="pb-3 font-medium text-right">Filled Price</th>
                      <th className="pb-3 font-medium text-right">Total Cost / Proceeds</th>
                      <th className="pb-3 font-medium text-right">Realized P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {transactions.map((tx) => {
                      const dateStr = new Date(tx.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const isBuy = tx.type === 'BUY';

                      return (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 text-slate-400 font-sans text-[11px]">{dateStr}</td>
                          <td className="py-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-3 font-sans font-bold text-white">{tx.symbol}</td>
                          <td className="py-3 text-right text-slate-200">{tx.shares.toFixed(4)}</td>
                          <td className="py-3 text-right text-white">${tx.price.toFixed(2)}</td>
                          <td className="py-3 text-right font-semibold text-slate-100">${tx.total.toLocaleString()}</td>
                          <td className="py-3 text-right font-bold">
                            {tx.realizedPnL !== undefined ? (
                              <span className={tx.realizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {tx.realizedPnL >= 0 ? '+' : ''}${tx.realizedPnL.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Restart Contest?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Reset your trading account back to the <strong>$100,000.00</strong> starting capital and wipe your positions and trade history.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetContest();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

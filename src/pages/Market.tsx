import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset, MarketType } from '../types/trading';
import { InteractiveChart } from '../components/InteractiveChart';
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  ArrowUpDown,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface MarketPageProps {
  onOpenTrade: (asset: Asset, mode?: 'BUY' | 'SELL') => void;
  selectedSymbol?: string;
  onSelectSymbol?: (symbol: string) => void;
  onNavigateToCopilot?: (symbol: string) => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({
  onOpenTrade,
  selectedSymbol,
  onSelectSymbol,
  onNavigateToCopilot,
}) => {
  const { assets, priceFlashes, watchlist, toggleWatchlist, holdings } = useTrading();

  const [activeTab, setActiveTab] = useState<'all' | MarketType | 'watchlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'change' | 'price' | 'symbol' | 'marketCap'>('change');
  const [sortAsc, setSortAsc] = useState(false);

  // Active detailed symbol in the chart pane
  const [activeSymbol, setActiveSymbol] = useState<string>(selectedSymbol || 'NVDA');

  const detailedAsset = useMemo(() => {
    return assets.find((a) => a.symbol === activeSymbol) || assets[0];
  }, [assets, activeSymbol]);

  // Filter assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Tab filter
      if (activeTab === 'watchlist') {
        if (!watchlist.includes(asset.symbol)) return false;
      } else if (activeTab !== 'all') {
        if (asset.market !== activeTab) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchSymbol = asset.symbol.toLowerCase().includes(query);
        const matchName = asset.name.toLowerCase().includes(query);
        const matchSector = asset.sector.toLowerCase().includes(query);
        if (!matchSymbol && !matchName && !matchSector) return false;
      }

      return true;
    });
  }, [assets, activeTab, watchlist, searchQuery]);

  // Sort assets
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let diff = 0;
      if (sortBy === 'change') {
        diff = b.changePct - a.changePct;
      } else if (sortBy === 'price') {
        diff = b.price - a.price;
      } else if (sortBy === 'symbol') {
        diff = a.symbol.localeCompare(b.symbol);
      } else if (sortBy === 'marketCap') {
        diff = b.price * 1000 - a.price * 1000;
      }
      return sortAsc ? -diff : diff;
    });
  }, [filteredAssets, sortBy, sortAsc]);

  // Simulated Order Book levels for detailed asset
  const orderBook = useMemo(() => {
    if (!detailedAsset) return { bids: [], asks: [] };
    const p = detailedAsset.price;
    const spread = p * 0.0005;

    const asks = [
      { price: Number((p + spread * 4).toFixed(2)), size: Math.floor(20 + Math.random() * 80) },
      { price: Number((p + spread * 3).toFixed(2)), size: Math.floor(40 + Math.random() * 120) },
      { price: Number((p + spread * 2).toFixed(2)), size: Math.floor(80 + Math.random() * 200) },
      { price: Number((p + spread * 1).toFixed(2)), size: Math.floor(150 + Math.random() * 300) },
    ];

    const bids = [
      { price: Number((p - spread * 1).toFixed(2)), size: Math.floor(180 + Math.random() * 320) },
      { price: Number((p - spread * 2).toFixed(2)), size: Math.floor(95 + Math.random() * 210) },
      { price: Number((p - spread * 3).toFixed(2)), size: Math.floor(50 + Math.random() * 140) },
      { price: Number((p - spread * 4).toFixed(2)), size: Math.floor(30 + Math.random() * 90) },
    ];

    return { asks, bids };
  }, [detailedAsset]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Markets ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'stocks'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            US Stocks
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'crypto'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Crypto 24/7
          </button>
          <button
            onClick={() => setActiveTab('etfs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'etfs'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            ETFs & Index
          </button>
          <button
            onClick={() => setActiveTab('forex_commodities')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'forex_commodities'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Commodities & FX
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'watchlist'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Watchlist ({watchlist.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symbol (e.g. NVDA, BTC) or company..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Terminal View: Chart & Asset Details on Top, Market Table Below */}
      {detailedAsset && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleWatchlist(detailedAsset.symbol)}
                  className={`p-2 rounded-xl border transition-colors ${
                    watchlist.includes(detailedAsset.symbol)
                      ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                  }`}
                  title="Toggle Watchlist"
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">{detailedAsset.symbol}</h2>
                    <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                      {detailedAsset.sector}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{detailedAsset.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-black font-mono text-white">
                    ${detailedAsset.price.toFixed(detailedAsset.price < 2 ? 4 : 2)}
                  </div>
                  <div
                    className={`text-xs font-bold font-mono flex items-center justify-end ${
                      detailedAsset.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {detailedAsset.changePct >= 0 ? '+' : ''}${detailedAsset.change.toFixed(2)} ({detailedAsset.changePct >= 0 ? '+' : ''}{detailedAsset.changePct.toFixed(2)}%)
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenTrade(detailedAsset, 'BUY')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => onOpenTrade(detailedAsset, 'SELL')}
                    disabled={!holdings[detailedAsset.symbol]}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sell
                  </button>
                  {onNavigateToCopilot && (
                    <button
                      onClick={() => onNavigateToCopilot(detailedAsset.symbol)}
                      className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors"
                      title="Analyze with Gemini AI"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Candlestick / Line Chart */}
            <InteractiveChart
              symbol={detailedAsset.symbol}
              currentPrice={detailedAsset.price}
              changePct={detailedAsset.changePct}
            />
          </div>

          {/* Right Sidebar: Simulated Order Book & Key Fundamentals */}
          <div className="space-y-4">
            {/* Order Book Depth Simulator */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  Live Order Book (Depth)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Simulated Level II</span>
              </div>

              {/* Asks (Sells) */}
              <div className="space-y-1 mb-2 font-mono text-[11px]">
                {orderBook.asks.map((ask, i) => (
                  <div key={'ask-' + i} className="flex justify-between items-center text-rose-400 py-0.5 px-2 rounded-md bg-rose-950/20">
                    <span>${ask.price.toFixed(2)}</span>
                    <span className="text-slate-400">{ask.size}</span>
                  </div>
                ))}
              </div>

              {/* Current Mid Spread Banner */}
              <div className="py-1 px-3 my-2 text-center bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs font-bold text-white flex justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-sans">Spread 0.05%</span>
                <span>${detailedAsset.price.toFixed(2)}</span>
              </div>

              {/* Bids (Buys) */}
              <div className="space-y-1 font-mono text-[11px]">
                {orderBook.bids.map((bid, i) => (
                  <div key={'bid-' + i} className="flex justify-between items-center text-emerald-400 py-0.5 px-2 rounded-md bg-emerald-950/20">
                    <span>${bid.price.toFixed(2)}</span>
                    <span className="text-slate-400">{bid.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Statistics & Company Profile */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-white">Market Statistics</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">24h High</span>
                  <span className="font-mono font-bold text-white">${detailedAsset.high24h.toFixed(2)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">24h Low</span>
                  <span className="font-mono font-bold text-white">${detailedAsset.low24h.toFixed(2)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Volume</span>
                  <span className="font-mono font-bold text-white">{detailedAsset.volume}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Market Cap</span>
                  <span className="font-mono font-bold text-white">{detailedAsset.marketCap}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                {detailedAsset.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Market Asset Quotes Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Trading Universe Quotes</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {sortedAssets.length} symbols available
            </span>
          </h2>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-hidden"
            >
              <option value="change">% Change (24h)</option>
              <option value="price">Price</option>
              <option value="symbol">Symbol</option>
              <option value="marketCap">Market Cap</option>
            </select>
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              title="Toggle Asc/Desc"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 w-8"></th>
                <th className="pb-3 font-medium">Asset / Market</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium text-right">24h Change</th>
                <th className="pb-3 font-medium text-right hidden sm:table-cell">24h High/Low</th>
                <th className="pb-3 font-medium text-right hidden md:table-cell">Volume</th>
                <th className="pb-3 font-medium text-right hidden lg:table-cell">Market Cap</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sortedAssets.map((asset) => {
                const flash = priceFlashes[asset.symbol];
                const isWatched = watchlist.includes(asset.symbol);
                const isSelected = asset.symbol === activeSymbol;
                const isUp = asset.changePct >= 0;

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => {
                      setActiveSymbol(asset.symbol);
                      onSelectSymbol?.(asset.symbol);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-800/80 border-l-2 border-emerald-500'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 pl-2" onClick={(e) => { e.stopPropagation(); toggleWatchlist(asset.symbol); }}>
                      <Star
                        className={`w-3.5 h-3.5 cursor-pointer ${
                          isWatched ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      />
                    </td>

                    <td className="py-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{asset.symbol}</span>
                        <span className="text-[10px] uppercase px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-400">
                          {asset.market}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal truncate max-w-[140px] sm:max-w-xs">
                        {asset.name}
                      </div>
                    </td>

                    <td className="py-3 text-right">
                      <div
                        className={`font-bold text-sm inline-block px-1.5 py-0.5 rounded transition-colors ${
                          flash === 'up'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : flash === 'down'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'text-white'
                        }`}
                      >
                        ${asset.price.toFixed(asset.price < 2 ? 4 : 2)}
                      </div>
                    </td>

                    <td className={`py-3 text-right font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div className="flex items-center justify-end gap-0.5">
                        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isUp ? '+' : ''}{asset.changePct.toFixed(2)}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {isUp ? '+' : ''}${asset.change.toFixed(2)}
                      </div>
                    </td>

                    <td className="py-3 text-right text-slate-400 hidden sm:table-cell text-[11px]">
                      <div>H: ${asset.high24h.toFixed(2)}</div>
                      <div>L: ${asset.low24h.toFixed(2)}</div>
                    </td>

                    <td className="py-3 text-right text-slate-300 hidden md:table-cell font-sans text-xs">
                      {asset.volume}
                    </td>

                    <td className="py-3 text-right text-slate-300 hidden lg:table-cell font-sans text-xs">
                      {asset.marketCap}
                    </td>

                    <td className="py-3 text-right pr-2 font-sans" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenTrade(asset, 'BUY')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => onOpenTrade(asset, 'SELL')}
                          disabled={!holdings[asset.symbol]}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
};

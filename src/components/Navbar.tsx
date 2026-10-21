import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import {
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  BarChart3,
  PieChart,
  Trophy,
  Bot,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'market' | 'portfolio' | 'leaderboard' | 'copilot' | 'rules';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAssetTrade?: (symbol: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAssetTrade }) => {
  const {
    assets,
    priceFlashes,
    portfolioValue,
    cash,
    totalReturnPct,
    userRank,
    soundEnabled,
    setSoundEnabled,
    resetContest,
    userProfile,
  } = useTrading();

  const [showResetModal, setShowResetModal] = useState(false);

  // Curate tape items
  const tapeSymbols = ['SPY', 'QQQ', 'BTC', 'ETH', 'NVDA', 'AAPL', 'TSLA', 'XAU/USD'];
  const tapeAssets = tapeSymbols
    .map((sym) => assets.find((a) => a.symbol === sym))
    .filter(Boolean);

  return (
    <>
      {/* Top Streaming Live Ticker Tape */}
      <div className="w-full bg-slate-950 border-b border-slate-800/80 overflow-hidden py-1.5 px-4 text-xs select-none">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-slate-800 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Live Markets
          </div>

          <div className="flex items-center gap-6 shrink-0">
            {tapeAssets.map((asset) => {
              if (!asset) return null;
              const flash = priceFlashes[asset.symbol];
              const isUp = asset.changePct >= 0;

              return (
                <div
                  key={asset.symbol}
                  onClick={() => onOpenAssetTrade?.(asset.symbol)}
                  className={`flex items-center gap-2 cursor-pointer transition-colors px-2 py-0.5 rounded-lg hover:bg-slate-900 ${
                    flash === 'up'
                      ? 'bg-emerald-950/60 ring-1 ring-emerald-500'
                      : flash === 'down'
                      ? 'bg-rose-950/60 ring-1 ring-rose-500'
                      : ''
                  }`}
                >
                  <span className="font-bold text-slate-200">{asset.symbol}</span>
                  <span className="font-mono text-slate-100">${asset.price.toFixed(asset.price < 2 ? 4 : 2)}</span>
                  <span
                    className={`flex items-center text-[11px] font-medium ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                    {isUp ? '+' : ''}
                    {asset.changePct.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main App Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Season Badge */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => onSelectTab('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5 text-slate-950 font-black" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black tracking-tight text-white">InvestGrow</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      $100K CONTEST
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-none">Paper Trading Championship</p>
                </div>
              </div>
            </div>

            {/* Navigation Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </button>

              <button
                onClick={() => onSelectTab('market')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'market'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Markets & Trade
              </button>

              <button
                onClick={() => onSelectTab('portfolio')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'portfolio'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                Portfolio
              </button>

              <button
                onClick={() => onSelectTab('leaderboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'leaderboard'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                Leaderboard
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  currentTab === 'leaderboard' ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  #{userRank}
                </span>
              </button>

              <button
                onClick={() => onSelectTab('copilot')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'copilot'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-purple-950/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                AI Analyst
              </button>

              <button
                onClick={() => onSelectTab('rules')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  currentTab === 'rules'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Contest Rules & FAQ"
              >
                <Info className="w-3.5 h-3.5" />
                Rules
              </button>
            </nav>

            {/* Right Quick Stats & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Portfolio Quick Value Pill */}
              <div
                onClick={() => onSelectTab('portfolio')}
                className="cursor-pointer bg-slate-950/90 border border-slate-800 rounded-2xl px-3 py-1.5 hidden sm:flex items-center gap-3 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Contest Net Worth</div>
                  <div className="text-xs font-bold font-mono text-white">
                    ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div
                  className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                    totalReturnPct >= 0
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {totalReturnPct >= 0 ? '+' : ''}
                  {totalReturnPct.toFixed(2)}%
                </div>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute Trade Audio' : 'Unmute Trade Audio'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset Contest Button */}
              <button
                onClick={() => setShowResetModal(true)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800 transition-colors"
                title="Reset $100K Contest Portfolio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* User Avatar Chip */}
              <div
                onClick={() => onSelectTab('leaderboard')}
                className="cursor-pointer flex items-center gap-2 pl-2 border-l border-slate-800"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shadow-inner">
                  {userProfile.avatar}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    {userProfile.username}
                    <span className="text-[10px]">{userProfile.country}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Rank #{userRank}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-slate-950/90 py-2 px-2 text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => onSelectTab('market')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'market' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Markets</span>
          </button>
          <button
            onClick={() => onSelectTab('portfolio')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'portfolio' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
          <button
            onClick={() => onSelectTab('leaderboard')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'leaderboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Rank #{userRank}</span>
          </button>
          <button
            onClick={() => onSelectTab('copilot')}
            className={`flex flex-col items-center gap-1 ${
              currentTab === 'copilot' ? 'text-purple-400' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Desk</span>
          </button>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Reset Paper Contest?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This will reset your portfolio balance back to the official <strong>$100,000.00</strong> starting capital, clear all holdings, active limit orders, and transaction history.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetContest();
                  setShowResetModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-colors"
              >
                Yes, Reset to $100K
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

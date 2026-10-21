import React from 'react';
import { Trophy, ShieldCheck, Scale, Award, HelpCircle, CheckCircle, Flame } from 'lucide-react';

interface RulesPageProps {
  onStartTrading: () => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({ onStartTrading }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Contest Rules Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Official Tournament Guidelines
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Season 4 Paper Trading Championship
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          The InvestGrow Paper Trading Championship is a global simulated trading competition where traders from around the world compete with identical starting capital of $100,000 to achieve the highest portfolio return.
        </p>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3>$100,000 Equal Starting Capital</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All participants enter with an identical virtual starting balance of $100,000.00 cash. No outside capital can be deposited, ensuring a level playing field for all traders.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Scale className="w-4 h-4 text-emerald-400" />
            <h3>Multi-Market Universe</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trade across major US Tech Equities (NVDA, AAPL, MSFT, TSLA), Top Cryptocurrencies (BTC, ETH, SOL), Benchmark ETFs (SPY, QQQ), and Commodities/FX (Gold, WTI Crude).
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3>Order Types & Real-Time Fills</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Execute immediate Market Orders or plan setups with pending Limit Orders. The simulated order book automatically checks triggers on live market ticks with zero slippage commissions.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3>Leaderboard Rankings & Tiebreakers</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rankings are determined by total percentage return (% ROI). In the event of identical percentage returns, the trader with higher win rate and active risk discipline ranks higher.
          </p>
        </div>
      </div>

      {/* Prize & Achievement Tiers */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Tournament Badges & Achievement Tiers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
            <div className="text-2xl mb-1">🥇</div>
            <div className="text-xs font-black text-amber-400">Diamond Tier</div>
            <div className="text-[11px] text-slate-400 mt-1">Top 1% Return</div>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">
              Grandmaster
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80">
            <div className="text-2xl mb-1">🥈</div>
            <div className="text-xs font-black text-slate-200">Platinum Tier</div>
            <div className="text-[11px] text-slate-400 mt-1">Top 5% Return</div>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
              Elite Trader
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-800/40">
            <div className="text-2xl mb-1">🥉</div>
            <div className="text-xs font-black text-amber-600">Gold Tier</div>
            <div className="text-[11px] text-slate-400 mt-1">Top 15% Return</div>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-800/30 text-amber-500">
              Pro Challenger
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-2xl mb-1">🛡️</div>
            <div className="text-xs font-black text-slate-400">Silver Tier</div>
            <div className="text-[11px] text-slate-400 mt-1">Positive P&L</div>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
              Contender
            </span>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={onStartTrading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all cursor-pointer"
          >
            Enter Markets with $100K Starting Balance
          </button>
        </div>
      </div>
    </div>
  );
};

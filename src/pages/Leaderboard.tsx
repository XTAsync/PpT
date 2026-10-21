import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { LeaderboardTrader } from '../types/trading';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  Target,
  Users,
  Edit3,
  Check,
  X,
  Flame,
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const {
    leaderboard,
    userRank,
    portfolioValue,
    totalReturnPct,
    userProfile,
    updateUserProfile,
    contestInfo,
  } = useTrading();

  const [timeframe, setTimeframe] = useState<'season' | 'daily' | 'weekly'>('season');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUsername, setTempUsername] = useState(userProfile.username);
  const [tempAvatar, setTempAvatar] = useState(userProfile.avatar);
  const [tempCountry, setTempCountry] = useState(userProfile.country);
  const [tempStyle, setTempStyle] = useState(userProfile.style);

  // Compute leaderboard sorted by selected timeframe
  const displayLeaderboard = useMemo(() => {
    const list = [...leaderboard];
    if (timeframe === 'daily') {
      list.sort((a, b) => b.dayReturnPct - a.dayReturnPct);
    } else if (timeframe === 'weekly') {
      list.sort((a, b) => b.totalReturnPct * 0.7 - a.totalReturnPct * 0.7);
    } else {
      list.sort((a, b) => b.totalReturnPct - a.totalReturnPct);
    }
    return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [leaderboard, timeframe]);

  const top3 = displayLeaderboard.slice(0, 3);
  const restTraders = displayLeaderboard.slice(3);

  // User's entry in current view
  const userEntry = displayLeaderboard.find((t) => t.isUser);
  const leaderEntry = displayLeaderboard[0];
  const distanceToFirstPct = leaderEntry && userEntry ? leaderEntry.totalReturnPct - userEntry.totalReturnPct : 0;
  const distanceToFirstDollars = leaderEntry && userEntry ? leaderEntry.portfolioValue - userEntry.portfolioValue : 0;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      username: tempUsername.trim() || 'ApexTrader',
      avatar: tempAvatar,
      country: tempCountry.trim() || '🇺🇸',
      style: tempStyle,
    });
    setIsEditingProfile(false);
  };

  const avatarOptions = ['🚀', '🦊', '⚡', '💎', '🦁', '🦉', '🎯', '⛩️', '🐉', '🏄', '👑', '🎲'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                <Crown className="w-3.5 h-3.5 fill-current" />
                Live Standings
              </span>
              <span className="text-xs text-slate-400">
                {contestInfo.participantsCount.toLocaleString()} Verified Competitors
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Championship Leaderboard
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time portfolio returns across all simulated competitors starting with identical $100,000 cash. Rankings update live alongside asset market movements.
            </p>
          </div>

          {/* User's Fast Rank Badge & Edit Profile */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 min-w-64">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Your Contest Standing</span>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Customize
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-inner">
                {userProfile.avatar}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  {userProfile.username}
                  <span>{userProfile.country}</span>
                </div>
                <div className="text-xs text-emerald-400 font-bold font-mono">
                  Rank #{userEntry?.rank || userRank} &bull; {totalReturnPct >= 0 ? '+' : ''}{totalReturnPct.toFixed(2)}% ROI
                </div>
              </div>
            </div>

            {distanceToFirstPct > 0 && (
              <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center gap-1">
                <Target className="w-3 h-3 text-amber-400" />
                <span>
                  Gap to #1: <strong className="text-amber-400">+{distanceToFirstPct.toFixed(2)}%</strong> (${distanceToFirstDollars.toLocaleString('en-US', { maximumFractionDigits: 0 })})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Customization Drawer */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-in slide-in-from-top-4 duration-200 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-400" />
              Customize Trader Profile & Persona
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Trader Handle</label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                maxLength={24}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Country Flag Emoji</label>
              <input
                type="text"
                value={tempCountry}
                onChange={(e) => setTempCountry(e.target.value)}
                maxLength={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Trading Strategy</label>
              <select
                value={tempStyle}
                onChange={(e) => setTempStyle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="Momentum Scalper">Momentum Scalper</option>
                <option value="Crypto Maxi">Crypto Maxi</option>
                <option value="Value Investor">Value Investor</option>
                <option value="Swing Trader">Swing Trader</option>
                <option value="Algorithmic Quant">Algorithmic Quant</option>
                <option value="Multi-Asset Tactical">Multi-Asset Tactical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Choose Avatar</label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setTempAvatar(emoji)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    tempAvatar === emoji
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 scale-110'
                      : 'bg-slate-950 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Timeframe Filter Tabs */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTimeframe('season')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeframe === 'season'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Full Season (All-Time)
          </button>
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeframe === 'daily'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            24h Daily Sprint
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeframe === 'weekly'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Cup
          </button>
        </div>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2 pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Rankings synchronized live</span>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* #2 Silver */}
        {top3[1] && (
          <div className="relative bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 text-center order-2 md:order-1 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-slate-400/10 border border-slate-400/30 text-slate-300 flex items-center justify-center mx-auto mb-3 text-xl font-black">
              🥈 2nd
            </div>
            <div className="text-3xl mb-1">{top3[1].avatar}</div>
            <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
              {top3[1].username}
              <span className="text-xs">{top3[1].country}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">{top3[1].badge}</span>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-1">
              <div className="text-xl font-black font-mono text-emerald-400">
                +{top3[1].totalReturnPct.toFixed(2)}%
              </div>
              <div className="text-xs font-mono text-slate-300">
                ${top3[1].portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-500">{top3[1].tradesCount} trades &bull; {top3[1].winRate}% win rate</div>
            </div>
          </div>
        )}

        {/* #1 Gold Grand Champion */}
        {top3[0] && (
          <div className="relative bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 text-center order-1 md:order-2 shadow-2xl scale-100 md:scale-105 z-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-current" />
              Tournament Leader
            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto mt-2 mb-3 text-2xl font-black shadow-inner">
              🥇 1st
            </div>
            <div className="text-4xl mb-1">{top3[0].avatar}</div>
            <h3 className="text-lg font-black text-white flex items-center justify-center gap-1">
              {top3[0].username}
              <span className="text-sm">{top3[0].country}</span>
            </h3>
            <span className="text-xs text-amber-400 font-semibold">{top3[0].badge}</span>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-1">
              <div className="text-2xl font-black font-mono text-emerald-400">
                +{top3[0].totalReturnPct.toFixed(2)}%
              </div>
              <div className="text-sm font-mono text-white font-bold">
                ${top3[0].portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-400">{top3[0].tradesCount} trades &bull; {top3[0].winRate}% win rate</div>
            </div>
          </div>
        )}

        {/* #3 Bronze */}
        {top3[2] && (
          <div className="relative bg-slate-900/80 border border-amber-700/50 rounded-3xl p-6 text-center order-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-700/10 border border-amber-700/30 text-amber-600 flex items-center justify-center mx-auto mb-3 text-xl font-black">
              🥉 3rd
            </div>
            <div className="text-3xl mb-1">{top3[2].avatar}</div>
            <h3 className="text-base font-black text-white flex items-center justify-center gap-1">
              {top3[2].username}
              <span className="text-xs">{top3[2].country}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">{top3[2].badge}</span>

            <div className="mt-4 pt-4 border-t border-slate-800 space-y-1">
              <div className="text-xl font-black font-mono text-emerald-400">
                +{top3[2].totalReturnPct.toFixed(2)}%
              </div>
              <div className="text-xs font-mono text-slate-300">
                ${top3[2].portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-500">{top3[2].tradesCount} trades &bull; {top3[2].winRate}% win rate</div>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Rankings & Performance Ledger
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Showing Top {displayLeaderboard.length} of {contestInfo.participantsCount}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 w-12 text-center font-medium">Rank</th>
                <th className="pb-3 font-medium">Trader</th>
                <th className="pb-3 font-medium text-right">Total Net Worth</th>
                <th className="pb-3 font-medium text-right">Total Return (%)</th>
                <th className="pb-3 font-medium text-right hidden sm:table-cell">24h Day ROI</th>
                <th className="pb-3 font-medium text-right hidden md:table-cell">Win Rate</th>
                <th className="pb-3 font-medium text-right hidden lg:table-cell">Trades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {displayLeaderboard.map((trader) => {
                const isUser = trader.isUser;
                const isPositive = trader.totalReturnPct >= 0;

                return (
                  <tr
                    key={trader.id}
                    className={`transition-colors ${
                      isUser
                        ? 'bg-emerald-950/40 border-l-4 border-emerald-500 font-bold'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black ${
                          trader.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : trader.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : trader.rank === 3
                            ? 'bg-amber-700 text-white'
                            : isUser
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400'
                        }`}
                      >
                        #{trader.rank}
                      </span>
                    </td>

                    <td className="py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{trader.avatar}</span>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <span>{trader.username}</span>
                            <span className="text-[11px]">{trader.country}</span>
                            {isUser && (
                              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">{trader.badge}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-right font-bold text-white">
                      ${trader.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className={`py-3 text-right font-bold text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '+' : ''}{trader.totalReturnPct.toFixed(2)}%
                    </td>

                    <td className={`py-3 text-right hidden sm:table-cell font-semibold ${trader.dayReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trader.dayReturnPct >= 0 ? '+' : ''}{trader.dayReturnPct.toFixed(2)}%
                    </td>

                    <td className="py-3 text-right hidden md:table-cell text-slate-300">
                      {trader.winRate}%
                    </td>

                    <td className="py-3 text-right hidden lg:table-cell text-slate-400">
                      {trader.tradesCount}
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

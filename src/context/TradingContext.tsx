import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Asset, Holding, Transaction, LimitOrder, LeaderboardTrader, UserProfile, ContestInfo } from '../types/trading';
import { INITIAL_ASSETS, INITIAL_LEADERBOARD_TRADERS } from '../data/initialMarkets';
import { sounds } from '../lib/sound';

const STORAGE_KEY_PREFIX = 'investgrow_contest_v1_';
const STARTING_CAPITAL = 100000;

interface TradingContextType {
  // Market assets with live price ticks
  assets: Asset[];
  getAsset: (symbol: string) => Asset | undefined;
  priceFlashes: Record<string, 'up' | 'down' | null>;

  // User & Portfolio
  cash: number;
  holdings: Record<string, Holding>;
  transactions: Transaction[];
  limitOrders: LimitOrder[];
  watchlist: string[];
  userProfile: UserProfile;

  // Computed Portfolio Metrics
  totalInvested: number;
  portfolioValue: number;
  totalReturnDollars: number;
  totalReturnPct: number;
  dayReturnDollars: number;
  dayReturnPct: number;

  // Contest & Leaderboard
  contestInfo: ContestInfo;
  leaderboard: LeaderboardTrader[];
  userRank: number;

  // Actions
  buyAsset: (symbol: string, shares: number, orderType?: 'MARKET' | 'LIMIT', limitPrice?: number) => { success: boolean; message: string };
  sellAsset: (symbol: string, shares: number) => { success: boolean; message: string };
  cancelLimitOrder: (orderId: string) => void;
  toggleWatchlist: (symbol: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  resetContest: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [cash, setCash] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'cash');
    return saved !== null ? Number(saved) : STARTING_CAPITAL;
  });

  const [holdings, setHoldings] = useState<Record<string, Holding>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'holdings');
    return saved ? JSON.parse(saved) : {};
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [limitOrders, setLimitOrders] = useState<LimitOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'limit_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'watchlist');
    return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', 'BTC', 'SPY', 'SOL'];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'profile');
    return saved ? JSON.parse(saved) : {
      username: 'ApexTrader',
      avatar: '🚀',
      country: '🇺🇸',
      style: 'Multi-Asset Tactical',
      seasonId: 'season-4',
    };
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'sound');
    return saved !== null ? saved === 'true' : true;
  });

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sounds.enabled = enabled;
    localStorage.setItem(STORAGE_KEY_PREFIX + 'sound', String(enabled));
  };

  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [priceFlashes, setPriceFlashes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [competitors, setCompetitors] = useState<LeaderboardTrader[]>(INITIAL_LEADERBOARD_TRADERS);

  // Contest definition
  const contestInfo: ContestInfo = {
    seasonTitle: 'Global Paper Trading Championship',
    seasonNumber: 4,
    startingCapital: STARTING_CAPITAL,
    prizePool: '$50,000 Trophy & Badges',
    endDate: 'Nov 15, 2026',
    participantsCount: 4892,
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'cash', cash.toString());
  }, [cash]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'limit_orders', JSON.stringify(limitOrders));
  }, [limitOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Asset finder helper
  const getAsset = useCallback((symbol: string) => {
    return assets.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase());
  }, [assets]);

  // Live Price Tick Simulator: runs every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        const nextFlashes: Record<string, 'up' | 'down' | null> = {};
        
        const updated = prevAssets.map((asset) => {
          // 40% chance of price tick per asset per interval
          if (Math.random() > 0.42) {
            return asset;
          }

          // Volatility factor based on market
          let pctDelta = 0;
          if (asset.market === 'crypto') {
            pctDelta = (Math.random() - 0.48) * 0.007; // crypto higher volatility
          } else if (asset.market === 'forex_commodities') {
            pctDelta = (Math.random() - 0.49) * 0.002;
          } else {
            pctDelta = (Math.random() - 0.49) * 0.0035; // stocks / ETFs
          }

          const rawNewPrice = asset.price * (1 + pctDelta);
          const precision = asset.price < 2 ? 4 : 2;
          const newPrice = Number(rawNewPrice.toFixed(precision));

          if (newPrice !== asset.price) {
            nextFlashes[asset.symbol] = newPrice > asset.price ? 'up' : 'down';
          }

          const newChange = Number((newPrice - asset.prevClose).toFixed(precision));
          const newChangePct = Number(((newChange / asset.prevClose) * 100).toFixed(2));
          const newHigh = Math.max(asset.high24h, newPrice);
          const newLow = Math.min(asset.low24h, newPrice);

          const newSparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            price: newPrice,
            change: newChange,
            changePct: newChangePct,
            high24h: newHigh,
            low24h: newLow,
            sparkline: newSparkline,
          };
        });

        // Set flash indicators then clear after 800ms
        setPriceFlashes((prev) => ({ ...prev, ...nextFlashes }));
        setTimeout(() => {
          setPriceFlashes((prev) => {
            const cleared = { ...prev };
            Object.keys(nextFlashes).forEach((sym) => {
              cleared[sym] = null;
            });
            return cleared;
          });
        }, 850);

        return updated;
      });

      // Also gently fluctuate competitors' returns so leaderboard feels truly alive
      if (Math.random() > 0.6) {
        setCompetitors((prev) =>
          prev.map((c) => {
            const shift = (Math.random() - 0.49) * 0.08;
            const newRet = Number((c.totalReturnPct + shift).toFixed(2));
            const newPortfolio = Number((STARTING_CAPITAL * (1 + newRet / 100)).toFixed(2));
            return {
              ...c,
              totalReturnPct: newRet,
              portfolioValue: newPortfolio,
            };
          })
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update Holdings with live prices whenever assets change
  useEffect(() => {
    setHoldings((prev) => {
      let changed = false;
      const updated = { ...prev };

      Object.keys(updated).forEach((sym) => {
        const item = updated[sym];
        const asset = assets.find((a) => a.symbol === sym);
        if (asset && asset.price !== item.currentPrice) {
          changed = true;
          const currentValue = Number((item.shares * asset.price).toFixed(2));
          const unrealizedPnL = Number((currentValue - item.totalCost).toFixed(2));
          const unrealizedPnLPct = item.totalCost > 0 
            ? Number(((unrealizedPnL / item.totalCost) * 100).toFixed(2))
            : 0;

          updated[sym] = {
            ...item,
            currentPrice: asset.price,
            currentValue,
            unrealizedPnL,
            unrealizedPnLPct,
          };
        }
      });

      return changed ? updated : prev;
    });
  }, [assets]);

  // Auto-check and trigger limit orders
  useEffect(() => {
    limitOrders.forEach((order) => {
      if (order.status !== 'PENDING') return;
      const asset = getAsset(order.symbol);
      if (!asset) return;

      const shouldExecuteBuy = order.type === 'BUY' && asset.price <= order.targetPrice;
      const shouldExecuteSell = order.type === 'SELL' && asset.price >= order.targetPrice;

      if (shouldExecuteBuy) {
        const cost = Number((order.shares * asset.price).toFixed(2));
        if (cash >= cost) {
          setCash((c) => c - cost);
          setHoldings((prev) => {
            const existing = prev[order.symbol];
            if (existing) {
              const newShares = existing.shares + order.shares;
              const newCost = existing.totalCost + cost;
              return {
                ...prev,
                [order.symbol]: {
                  ...existing,
                  shares: newShares,
                  totalCost: newCost,
                  avgBuyPrice: Number((newCost / newShares).toFixed(2)),
                  currentPrice: asset.price,
                  currentValue: Number((newShares * asset.price).toFixed(2)),
                  unrealizedPnL: Number((newShares * asset.price - newCost).toFixed(2)),
                  unrealizedPnLPct: Number((((newShares * asset.price - newCost) / newCost) * 100).toFixed(2)),
                },
              };
            } else {
              return {
                ...prev,
                [order.symbol]: {
                  symbol: order.symbol,
                  name: order.name,
                  market: order.market,
                  shares: order.shares,
                  avgBuyPrice: asset.price,
                  totalCost: cost,
                  currentPrice: asset.price,
                  currentValue: cost,
                  unrealizedPnL: 0,
                  unrealizedPnLPct: 0,
                },
              };
            }
          });

          // Mark order filled
          setLimitOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, status: 'FILLED' } : o))
          );

          // Add transaction
          setTransactions((prev) => [
            {
              id: 'tx-' + Date.now(),
              symbol: order.symbol,
              name: order.name,
              market: order.market,
              type: 'BUY',
              shares: order.shares,
              price: asset.price,
              total: cost,
              timestamp: Date.now(),
            },
            ...prev,
          ]);

          sounds.playBuySound();
        }
      } else if (shouldExecuteSell) {
        const holding = holdings[order.symbol];
        if (holding && holding.shares >= order.shares) {
          const proceeds = Number((order.shares * asset.price).toFixed(2));
          const costOfSold = Number((order.shares * holding.avgBuyPrice).toFixed(2));
          const realizedPnL = Number((proceeds - costOfSold).toFixed(2));

          setCash((c) => c + proceeds);
          setHoldings((prev) => {
            const existing = prev[order.symbol];
            const remainingShares = existing.shares - order.shares;
            if (remainingShares <= 0.0001) {
              const copy = { ...prev };
              delete copy[order.symbol];
              return copy;
            } else {
              const newCost = remainingShares * existing.avgBuyPrice;
              return {
                ...prev,
                [order.symbol]: {
                  ...existing,
                  shares: remainingShares,
                  totalCost: Number(newCost.toFixed(2)),
                  currentValue: Number((remainingShares * asset.price).toFixed(2)),
                  unrealizedPnL: Number((remainingShares * asset.price - newCost).toFixed(2)),
                  unrealizedPnLPct: Number((((remainingShares * asset.price - newCost) / newCost) * 100).toFixed(2)),
                },
              };
            }
          });

          setLimitOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, status: 'FILLED' } : o))
          );

          setTransactions((prev) => [
            {
              id: 'tx-' + Date.now(),
              symbol: order.symbol,
              name: order.name,
              market: order.market,
              type: 'SELL',
              shares: order.shares,
              price: asset.price,
              total: proceeds,
              realizedPnL,
              timestamp: Date.now(),
            },
            ...prev,
          ]);

          sounds.playSellSound();
        }
      }
    });
  }, [assets, limitOrders, cash, holdings, getAsset]);

  // Compute overall portfolio metrics
  const totalInvested = useMemo(() => {
    return Object.values(holdings).reduce((sum, h) => sum + h.currentValue, 0);
  }, [holdings]);

  const portfolioValue = useMemo(() => {
    return Number((cash + totalInvested).toFixed(2));
  }, [cash, totalInvested]);

  const totalReturnDollars = useMemo(() => {
    return Number((portfolioValue - STARTING_CAPITAL).toFixed(2));
  }, [portfolioValue]);

  const totalReturnPct = useMemo(() => {
    return Number(((totalReturnDollars / STARTING_CAPITAL) * 100).toFixed(2));
  }, [totalReturnDollars]);

  // Compute daily return based on holdings' 24h change
  const dayReturnDollars = useMemo(() => {
    let dayDelta = 0;
    Object.values(holdings).forEach((h) => {
      const asset = getAsset(h.symbol);
      if (asset) {
        dayDelta += h.shares * asset.change;
      }
    });
    return Number(dayDelta.toFixed(2));
  }, [holdings, getAsset]);

  const dayReturnPct = useMemo(() => {
    return portfolioValue > 0 ? Number(((dayReturnDollars / portfolioValue) * 100).toFixed(2)) : 0;
  }, [dayReturnDollars, portfolioValue]);

  // Dynamic Leaderboard merging user and simulated competitors
  const { leaderboard, userRank } = useMemo(() => {
    const userEntry: LeaderboardTrader = {
      id: 'user-player',
      rank: 0,
      username: userProfile.username || 'ApexTrader',
      avatar: userProfile.avatar || '🚀',
      country: userProfile.country || '🇺🇸',
      portfolioValue,
      totalReturnPct,
      dayReturnPct,
      winRate: transactions.filter((t) => (t.realizedPnL ?? 0) > 0).length > 0
        ? Math.round((transactions.filter((t) => (t.realizedPnL ?? 0) > 0).length / Math.max(1, transactions.filter((t) => t.type === 'SELL').length)) * 100)
        : 65,
      tradesCount: transactions.length,
      badge: totalReturnPct >= 25 ? 'Diamond Contender' : totalReturnPct >= 10 ? 'Gold Challenger' : 'Pro Trader',
      isUser: true,
    };

    const all = [...competitors, userEntry];
    all.sort((a, b) => b.totalReturnPct - a.totalReturnPct);

    let foundRank = 1;
    const ranked = all.map((entry, idx) => {
      const rank = idx + 1;
      if (entry.isUser) {
        foundRank = rank;
      }
      return { ...entry, rank };
    });

    return { leaderboard: ranked, userRank: foundRank };
  }, [competitors, userProfile, portfolioValue, totalReturnPct, dayReturnPct, transactions]);

  // Trade action: Buy Asset
  const buyAsset = useCallback(
    (symbol: string, shares: number, orderType: 'MARKET' | 'LIMIT' = 'MARKET', limitPrice?: number) => {
      const asset = getAsset(symbol);
      if (!asset) {
        return { success: false, message: 'Asset not found in trading universe' };
      }

      if (shares <= 0) {
        return { success: false, message: 'Quantity must be greater than zero' };
      }

      const executionPrice = orderType === 'LIMIT' && limitPrice ? limitPrice : asset.price;
      const totalCost = Number((shares * executionPrice).toFixed(2));

      if (totalCost > cash) {
        return {
          success: false,
          message: `Insufficient buying power. Order requires $${totalCost.toLocaleString()} but available cash is $${cash.toLocaleString()}`,
        };
      }

      if (orderType === 'LIMIT' && limitPrice) {
        const newOrder: LimitOrder = {
          id: 'lo-' + Date.now(),
          symbol: asset.symbol,
          name: asset.name,
          market: asset.market,
          type: 'BUY',
          shares,
          targetPrice: limitPrice,
          totalValue: totalCost,
          createdAt: Date.now(),
          status: 'PENDING',
        };
        setLimitOrders((prev) => [newOrder, ...prev]);
        sounds.playTickSound();
        return {
          success: true,
          message: `Limit Buy placed: ${shares} ${asset.symbol} @ $${limitPrice.toFixed(2)}`,
        };
      }

      // Execute Market Buy
      setCash((c) => Number((c - totalCost).toFixed(2)));

      setHoldings((prev) => {
        const existing = prev[asset.symbol];
        if (existing) {
          const newShares = existing.shares + shares;
          const newTotalCost = existing.totalCost + totalCost;
          const newAvgBuyPrice = Number((newTotalCost / newShares).toFixed(2));
          const currentValue = Number((newShares * asset.price).toFixed(2));
          const pnl = Number((currentValue - newTotalCost).toFixed(2));
          const pnlPct = Number(((pnl / newTotalCost) * 100).toFixed(2));

          return {
            ...prev,
            [asset.symbol]: {
              ...existing,
              shares: newShares,
              avgBuyPrice: newAvgBuyPrice,
              totalCost: newTotalCost,
              currentPrice: asset.price,
              currentValue,
              unrealizedPnL: pnl,
              unrealizedPnLPct: pnlPct,
            },
          };
        } else {
          return {
            ...prev,
            [asset.symbol]: {
              symbol: asset.symbol,
              name: asset.name,
              market: asset.market,
              shares,
              avgBuyPrice: asset.price,
              totalCost,
              currentPrice: asset.price,
              currentValue: totalCost,
              unrealizedPnL: 0,
              unrealizedPnLPct: 0,
            },
          };
        }
      });

      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        symbol: asset.symbol,
        name: asset.name,
        market: asset.market,
        type: 'BUY',
        shares,
        price: asset.price,
        total: totalCost,
        timestamp: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);

      sounds.playBuySound();
      return {
        success: true,
        message: `Filled Market Buy: ${shares} ${asset.symbol} @ $${asset.price.toFixed(2)} ($${totalCost.toLocaleString()})`,
      };
    },
    [cash, getAsset]
  );

  // Trade action: Sell Asset
  const sellAsset = useCallback(
    (symbol: string, shares: number) => {
      const asset = getAsset(symbol);
      const holding = holdings[symbol];

      if (!asset || !holding) {
        return { success: false, message: 'You do not hold this position' };
      }

      if (shares <= 0 || shares > holding.shares + 0.00001) {
        return {
          success: false,
          message: `Invalid sell quantity. Max available: ${holding.shares.toFixed(4)} shares`,
        };
      }

      const executionPrice = asset.price;
      const totalProceeds = Number((shares * executionPrice).toFixed(2));
      const costOfSoldShares = Number((shares * holding.avgBuyPrice).toFixed(2));
      const realizedPnL = Number((totalProceeds - costOfSoldShares).toFixed(2));

      setCash((c) => Number((c + totalProceeds).toFixed(2)));

      setHoldings((prev) => {
        const existing = prev[symbol];
        const remainingShares = existing.shares - shares;
        if (remainingShares <= 0.0001) {
          const next = { ...prev };
          delete next[symbol];
          return next;
        } else {
          const newCost = Number((remainingShares * existing.avgBuyPrice).toFixed(2));
          const currentValue = Number((remainingShares * asset.price).toFixed(2));
          const pnl = Number((currentValue - newCost).toFixed(2));
          const pnlPct = Number(((pnl / newCost) * 100).toFixed(2));

          return {
            ...prev,
            [symbol]: {
              ...existing,
              shares: remainingShares,
              totalCost: newCost,
              currentValue,
              unrealizedPnL: pnl,
              unrealizedPnLPct: pnlPct,
            },
          };
        }
      });

      const newTx: Transaction = {
        id: 'tx-' + Date.now(),
        symbol: asset.symbol,
        name: asset.name,
        market: asset.market,
        type: 'SELL',
        shares,
        price: executionPrice,
        total: totalProceeds,
        realizedPnL,
        timestamp: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);

      sounds.playSellSound();
      if (realizedPnL > 500) {
        sounds.playCelebrationSound();
        sounds.fireConfetti();
      }

      return {
        success: true,
        message: `Filled Market Sell: ${shares} ${asset.symbol} @ $${executionPrice.toFixed(2)} (${realizedPnL >= 0 ? '+' : ''}$${realizedPnL.toFixed(2)} P&L)`,
      };
    },
    [holdings, getAsset]
  );

  const cancelLimitOrder = useCallback((orderId: string) => {
    setLimitOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
    );
  }, []);

  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => {
      const upper = symbol.toUpperCase();
      if (prev.includes(upper)) {
        return prev.filter((s) => s !== upper);
      } else {
        return [...prev, upper];
      }
    });
  }, []);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  }, []);

  const resetContest = useCallback(() => {
    setCash(STARTING_CAPITAL);
    setHoldings({});
    setTransactions([]);
    setLimitOrders([]);
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'cash');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'holdings');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'transactions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'limit_orders');
    sounds.playCelebrationSound();
  }, []);

  return (
    <TradingContext.Provider
      value={{
        assets,
        getAsset,
        priceFlashes,
        cash,
        holdings,
        transactions,
        limitOrders,
        watchlist,
        userProfile,
        totalInvested,
        portfolioValue,
        totalReturnDollars,
        totalReturnPct,
        dayReturnDollars,
        dayReturnPct,
        contestInfo,
        leaderboard,
        userRank,
        buyAsset,
        sellAsset,
        cancelLimitOrder,
        toggleWatchlist,
        updateUserProfile,
        resetContest,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

import React, { useState, useEffect, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Asset } from '../types/trading';
import { X, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface TradingModalProps {
  asset: Asset | null;
  initialMode?: 'BUY' | 'SELL';
  isOpen: boolean;
  onClose: () => void;
}

export const TradingModal: React.FC<TradingModalProps> = ({
  asset,
  initialMode = 'BUY',
  isOpen,
  onClose,
}) => {
  const { cash, holdings, buyAsset, sellAsset } = useTrading();

  const [mode, setMode] = useState<'BUY' | 'SELL'>(initialMode);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [inputUnit, setInputUnit] = useState<'shares' | 'dollars'>('shares');
  const [amountValue, setAmountValue] = useState<string>('1');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setStatusMessage(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (asset) {
      setLimitPrice(asset.price.toString());
    }
  }, [asset]);

  const userHolding = asset ? holdings[asset.symbol] : undefined;
  const currentPrice = asset ? asset.price : 0;

  // Calculate shares & total cost
  const { sharesCount, totalCost } = useMemo(() => {
    if (!asset || !amountValue || isNaN(Number(amountValue))) {
      return { sharesCount: 0, totalCost: 0 };
    }
    const val = parseFloat(amountValue);
    if (val <= 0) return { sharesCount: 0, totalCost: 0 };

    const price = orderType === 'LIMIT' && Number(limitPrice) > 0 ? Number(limitPrice) : currentPrice;

    if (inputUnit === 'shares') {
      const cost = val * price;
      return { sharesCount: val, totalCost: Number(cost.toFixed(2)) };
    } else {
      // dollars
      const sh = val / price;
      return { sharesCount: Number(sh.toFixed(4)), totalCost: Number(val.toFixed(2)) };
    }
  }, [asset, amountValue, inputUnit, orderType, limitPrice, currentPrice]);

  if (!isOpen || !asset) return null;

  const maxBuyingShares = currentPrice > 0 ? cash / currentPrice : 0;
  const maxSellShares = userHolding ? userHolding.shares : 0;

  const handlePercentageSelect = (pct: number) => {
    if (mode === 'BUY') {
      if (inputUnit === 'dollars') {
        const amt = (cash * pct) / 100;
        setAmountValue(amt.toFixed(2));
      } else {
        const sh = (maxBuyingShares * pct) / 100;
        setAmountValue(sh.toFixed(4));
      }
    } else {
      // SELL
      if (inputUnit === 'shares') {
        const sh = (maxSellShares * pct) / 100;
        setAmountValue(sh.toFixed(4));
      } else {
        const val = ((maxSellShares * currentPrice) * pct) / 100;
        setAmountValue(val.toFixed(2));
      }
    }
    setStatusMessage(null);
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (sharesCount <= 0) {
      setStatusMessage({ text: 'Please enter a valid quantity greater than 0', isError: true });
      return;
    }

    if (mode === 'BUY') {
      const res = buyAsset(
        asset.symbol,
        sharesCount,
        orderType,
        orderType === 'LIMIT' ? Number(limitPrice) : undefined
      );
      if (res.success) {
        setStatusMessage({ text: res.message, isError: false });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ text: res.message, isError: true });
      }
    } else {
      // SELL
      const res = sellAsset(asset.symbol, sharesCount);
      if (res.success) {
        setStatusMessage({ text: res.message, isError: false });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMessage({ text: res.message, isError: true });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Asset Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold text-lg text-emerald-400">
            {asset.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{asset.symbol}</h2>
              <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                {asset.market}
              </span>
            </div>
            <p className="text-xs text-slate-400">{asset.name}</p>
          </div>
          <div className="ml-auto text-right pr-6">
            <div className="text-lg font-bold font-mono text-white">${asset.price.toFixed(2)}</div>
            <div
              className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                asset.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {asset.changePct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {asset.changePct >= 0 ? '+' : ''}
              {asset.changePct.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl mb-4 border border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setMode('BUY');
              setStatusMessage(null);
            }}
            className={`py-2 text-sm font-bold rounded-xl transition-all ${
              mode === 'BUY'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Buy {asset.symbol}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('SELL');
              setStatusMessage(null);
            }}
            disabled={!userHolding || userHolding.shares <= 0}
            className={`py-2 text-sm font-bold rounded-xl transition-all ${
              mode === 'SELL'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            Sell {userHolding ? `(${userHolding.shares.toFixed(2)})` : '(0)'}
          </button>
        </div>

        {/* Order Type & Unit Controls */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setOrderType('MARKET')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                orderType === 'MARKET' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Market Order
            </button>
            <button
              type="button"
              onClick={() => setOrderType('LIMIT')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                orderType === 'LIMIT' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Limit Order
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setInputUnit('shares')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                inputUnit === 'shares' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              Shares
            </button>
            <button
              type="button"
              onClick={() => setInputUnit('dollars')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                inputUnit === 'dollars' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        <form onSubmit={handleExecute} className="space-y-4">
          {/* Limit Price Input if orderType is LIMIT */}
          {orderType === 'LIMIT' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Limit Target Price ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.0001"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-hidden focus:border-emerald-500"
                  placeholder="Target price"
                />
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
              <span>{inputUnit === 'shares' ? 'Number of Shares' : 'Amount in USD'}</span>
              <span>
                {mode === 'BUY'
                  ? `Buying Power: $${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `Held: ${userHolding ? userHolding.shares.toFixed(4) : 0} shares`}
              </span>
            </div>

            <div className="relative">
              {inputUnit === 'dollars' && (
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">
                  $
                </span>
              )}
              <input
                type="number"
                step="any"
                min="0.0001"
                value={amountValue}
                onChange={(e) => {
                  setAmountValue(e.target.value);
                  setStatusMessage(null);
                }}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-white font-mono text-lg font-bold focus:outline-hidden focus:border-emerald-500 ${
                  inputUnit === 'dollars' ? 'pl-8 pr-4' : 'px-4'
                }`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Quick Percentage Chips */}
          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageSelect(pct)}
                className="py-1.5 text-xs font-semibold rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                {pct === 100 ? 'MAX' : `${pct}%`}
              </button>
            ))}
          </div>

          {/* Cost Summary Card */}
          <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Estimated Execution Price</span>
              <span className="font-mono text-slate-200">
                ${(orderType === 'LIMIT' && Number(limitPrice) > 0 ? Number(limitPrice) : currentPrice).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Quantity</span>
              <span className="font-mono text-slate-200">{sharesCount.toFixed(4)} shares</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Paper Trading Commission</span>
              <span className="text-emerald-400 font-medium">$0.00 (Free Contest)</span>
            </div>
            <div className="h-px bg-slate-800 my-1"></div>
            <div className="flex justify-between text-sm font-semibold text-white">
              <span>{mode === 'BUY' ? 'Total Cost' : 'Total Proceeds'}</span>
              <span className={`font-mono ${mode === 'BUY' ? 'text-white' : 'text-emerald-400'}`}>
                ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                statusMessage.isError
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              mode === 'BUY'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99]'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/25 hover:brightness-110 active:scale-[0.99]'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            {mode === 'BUY' ? `Confirm Buy ($${totalCost.toLocaleString()})` : `Confirm Sell ($${totalCost.toLocaleString()})`}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Paper trading contest simulation: Real-time fill simulator</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { generateCandlesForAsset } from '../data/initialMarkets';
import { Candle } from '../types/trading';

interface InteractiveChartProps {
  symbol: string;
  currentPrice: number;
  changePct: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  symbol,
  currentPrice,
  changePct,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'candle' | 'line'>('line');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Generate candles based on timeframe & currentPrice
  const candles = useMemo(() => {
    return generateCandlesForAsset(currentPrice, timeframe);
  }, [symbol, timeframe, currentPrice]);

  // Compute boundaries
  const { minPrice, maxPrice, maxVolume, smaValues } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const padding = (max - min) * 0.08 || 1;
    min = Math.max(0, min - padding);
    max = max + padding;

    // 10-period SMA
    const sma: (number | null)[] = [];
    const period = 7;
    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        sma.push(null);
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += candles[i - j].close;
        }
        sma.push(Number((sum / period).toFixed(2)));
      }
    }

    return { minPrice: min, maxPrice: max, maxVolume: maxVol, smaValues: sma };
  }, [candles]);

  const chartHeight = 260;
  const chartWidth = 620;
  const paddingBottom = 45;
  const plotHeight = chartHeight - paddingBottom;

  const getY = (val: number) => {
    return plotHeight - ((val - minPrice) / (maxPrice - minPrice)) * plotHeight;
  };

  const getX = (idx: number) => {
    return (idx / (candles.length - 1)) * chartWidth;
  };

  // Build SVG Path for line chart
  const linePath = useMemo(() => {
    if (!candles.length) return '';
    return candles
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)},${getY(c.close).toFixed(1)}`)
      .join(' ');
  }, [candles, minPrice, maxPrice]);

  // Area path
  const areaPath = useMemo(() => {
    if (!candles.length) return '';
    const lastX = getX(candles.length - 1);
    return `${linePath} L ${lastX.toFixed(1)},${plotHeight} L 0,${plotHeight} Z`;
  }, [linePath, candles, plotHeight]);

  // SMA path
  const smaPath = useMemo(() => {
    let path = '';
    let started = false;
    smaValues.forEach((val, i) => {
      if (val !== null) {
        const x = getX(i).toFixed(1);
        const y = getY(val).toFixed(1);
        if (!started) {
          path += `M ${x},${y}`;
          started = true;
        } else {
          path += ` L ${x},${y}`;
        }
      }
    });
    return path;
  }, [smaValues, minPrice, maxPrice]);

  const isBullish = changePct >= 0;
  const primaryColor = isBullish ? '#10B981' : '#F43F5E';
  const gradientId = `grad-${symbol}-${isBullish ? 'bull' : 'bear'}`;

  const activeCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-800/80 pb-3">
        {/* Active Candle Hover Info */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
          <span className="text-slate-400 font-medium">{activeCandle?.time}</span>
          <span className="text-slate-300">
            O: <strong className="font-mono text-slate-100">${activeCandle?.open.toFixed(2)}</strong>
          </span>
          <span className="text-slate-300">
            H: <strong className="font-mono text-emerald-400">${activeCandle?.high.toFixed(2)}</strong>
          </span>
          <span className="text-slate-300">
            L: <strong className="font-mono text-rose-400">${activeCandle?.low.toFixed(2)}</strong>
          </span>
          <span className="text-slate-300">
            C: <strong className="font-mono text-slate-100">${activeCandle?.close.toFixed(2)}</strong>
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Vol: <strong className="font-mono text-slate-300">{activeCandle?.volume.toLocaleString()}</strong>
          </span>
        </div>

        {/* Chart View Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              chartType === 'line' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('candle')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              chartType === 'candle' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Candles
          </button>
          <span className="w-px h-3 bg-slate-800 mx-1"></span>
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2 py-1 rounded-lg transition-colors font-medium ${
              showSMA ? 'text-amber-400 bg-amber-950/40' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle 7-period Simple Moving Average"
          >
            SMA(7)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-hidden select-none" onMouseLeave={() => setHoveredCandle(null)}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.32" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={plotHeight * 0.25} x2={chartWidth} y2={plotHeight * 0.25} stroke="#1E293B" strokeDasharray="3 3" />
          <line x1="0" y1={plotHeight * 0.5} x2={chartWidth} y2={plotHeight * 0.5} stroke="#1E293B" strokeDasharray="3 3" />
          <line x1="0" y1={plotHeight * 0.75} x2={chartWidth} y2={plotHeight * 0.75} stroke="#1E293B" strokeDasharray="3 3" />

          {/* Volume bars in lower section */}
          {candles.map((c, i) => {
            const x = getX(i);
            const barH = (c.volume / (maxVolume || 1)) * 36;
            const y = chartHeight - barH;
            const barWidth = Math.max(2, (chartWidth / candles.length) * 0.5);
            const isCandleBull = c.close >= c.open;
            return (
              <rect
                key={'vol-' + i}
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={barH}
                fill={isCandleBull ? '#10B981' : '#F43F5E'}
                opacity={0.25}
                rx={1}
              />
            );
          })}

          {chartType === 'line' ? (
            <>
              {/* Shaded Area */}
              <path d={areaPath} fill={`url(#${gradientId})`} />
              {/* Line */}
              <path d={linePath} fill="none" stroke={primaryColor} strokeWidth="2.2" strokeLinecap="round" />
            </>
          ) : (
            /* Candlestick bars */
            candles.map((c, i) => {
              const x = getX(i);
              const candleBull = c.close >= c.open;
              const wickY1 = getY(c.high);
              const wickY2 = getY(c.low);
              const bodyY = getY(Math.max(c.open, c.close));
              const bodyHeight = Math.max(2, Math.abs(getY(c.open) - getY(c.close)));
              const candleWidth = Math.max(3, (chartWidth / candles.length) * 0.65);

              return (
                <g key={'candle-' + i}>
                  {/* High/Low Wick */}
                  <line
                    x1={x}
                    y1={wickY1}
                    x2={x}
                    y2={wickY2}
                    stroke={candleBull ? '#10B981' : '#F43F5E'}
                    strokeWidth="1.2"
                  />
                  {/* Open/Close Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyY}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candleBull ? '#10B981' : '#F43F5E'}
                    rx={1}
                  />
                </g>
              );
            })
          )}

          {/* SMA line */}
          {showSMA && smaPath && (
            <path d={smaPath} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />
          )}

          {/* Hover detector zones */}
          {candles.map((c, i) => {
            const x = getX(i);
            const step = chartWidth / candles.length;
            return (
              <rect
                key={'zone-' + i}
                x={x - step / 2}
                y={0}
                width={step}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredCandle(c)}
              />
            );
          })}

          {/* Crosshair indicator */}
          {hoveredCandle && (
            <>
              <line
                x1={getX(candles.indexOf(hoveredCandle))}
                y1={0}
                x2={getX(candles.indexOf(hoveredCandle))}
                y2={plotHeight}
                stroke="#64748B"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(candles.indexOf(hoveredCandle))}
                cy={getY(hoveredCandle.close)}
                r="4"
                fill={primaryColor}
                stroke="#0F172A"
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* Min / Max Price scale labels on right */}
        <div className="absolute top-1 right-2 pointer-events-none text-[10px] font-mono text-slate-500">
          ${maxPrice.toFixed(2)}
        </div>
        <div className="absolute bottom-12 right-2 pointer-events-none text-[10px] font-mono text-slate-500">
          ${minPrice.toFixed(2)}
        </div>
      </div>

      {/* Timeframe selector footer */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-2">
        <div className="flex items-center gap-1">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                timeframe === tf
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Ticks</span>
        </div>
      </div>
    </div>
  );
};

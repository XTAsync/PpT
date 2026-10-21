import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { MarketPage } from './pages/Market';
import { PortfolioPage } from './pages/Portfolio';
import { LeaderboardPage } from './pages/Leaderboard';
import { AICopilot } from './pages/AICopilot';
import { RulesPage } from './pages/Rules';
import { TradingModal } from './components/TradingModal';
import { Asset } from './types/trading';

function MainApp() {
  const { assets } = useTrading();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [tradeModalAsset, setTradeModalAsset] = useState<Asset | null>(null);
  const [tradeModalMode, setTradeModalMode] = useState<'BUY' | 'SELL'>('BUY');
  const [selectedSymbolForMarket, setSelectedSymbolForMarket] = useState<string>('NVDA');

  const handleOpenTrade = (asset: Asset, mode: 'BUY' | 'SELL' = 'BUY') => {
    setTradeModalAsset(asset);
    setTradeModalMode(mode);
  };

  const handleOpenAssetFromNavbar = (symbol: string) => {
    const asset = assets.find((a) => a.symbol === symbol);
    if (asset) {
      setSelectedSymbolForMarket(symbol);
      setCurrentTab('market');
    }
  };

  const handleNavigateToCopilot = (symbol: string) => {
    setSelectedSymbolForMarket(symbol);
    setCurrentTab('copilot');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar & Ticker Tape */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAssetTrade={handleOpenAssetFromNavbar}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            onOpenTrade={handleOpenTrade}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'market' && (
          <MarketPage
            onOpenTrade={handleOpenTrade}
            selectedSymbol={selectedSymbolForMarket}
            onSelectSymbol={setSelectedSymbolForMarket}
            onNavigateToCopilot={handleNavigateToCopilot}
          />
        )}

        {currentTab === 'portfolio' && (
          <PortfolioPage
            onOpenTrade={handleOpenTrade}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardPage />
        )}

        {currentTab === 'copilot' && (
          <AICopilot
            initialSymbol={selectedSymbolForMarket}
            onOpenTrade={handleOpenTrade}
          />
        )}

        {currentTab === 'rules' && (
          <RulesPage onStartTrading={() => setCurrentTab('market')} />
        )}
      </main>

      {/* Trade Modal */}
      <TradingModal
        asset={tradeModalAsset}
        initialMode={tradeModalMode}
        isOpen={!!tradeModalAsset}
        onClose={() => setTradeModalAsset(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">InvestGrow</span>
            <span>&bull;</span>
            <span>Paper Trading Championship &copy; 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Official $100,000 Starting Cash</span>
            <span>Zero-Risk Simulation</span>
            <button
              onClick={() => setCurrentTab('rules')}
              className="text-emerald-400 hover:underline"
            >
              Tournament Rules
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TradingProvider>
      <MainApp />
    </TradingProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Bell, 
  Settings, 
  User,
  ShieldCheck,
  Brain,
  RefreshCw,
  Check,
  AlertTriangle
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AnalyzerView from './components/AnalyzerView';
import TutorView from './components/TutorView';
import PricingView from './components/PricingView';
import DirecionadorView from './components/DirecionadorView';
import EnquadramentoView from './components/EnquadramentoView';
import SyncB3View from './components/SyncB3View';

import { INITIAL_PORTFOLIO, INITIAL_REF_PORTFOLIOS, AVAILABLE_FIIS } from './data';
import { PortfolioItem, GalleryPortfolio, FiiMetric } from './types';
import { syncFiiListWithB3 } from './services/b3Service';

const INITIAL_SAVED_PORTFOLIOS: GalleryPortfolio[] = [
  {
    id: '1',
    name: '28-05 (28-05, 20:26)',
    description: 'Carteira principal equilibrada com ativos de alto rendimento LTM, excelente vacância física de 1.9% e foco setorial diversificado.',
    date: '28/05/2026',
    time: '20:26',
    funds: INITIAL_PORTFOLIO,
    totalValue: 31002.56,
    tag: 'Premium',
    isCustom: false
  },
  {
    id: '2',
    name: '28-05 (28-05, 19:14)',
    description: 'Carteira simulada focada em retornos de curto prazo com FIIs de recebíveis e galpões logísticos de alto yield.',
    date: '28/05/2026',
    time: '19:14',
    funds: [
      { symbol: 'HGLG11', quantity: 30, averagePrice: 159.20, targetWeight: 25 },
      { symbol: 'BTLG11', quantity: 40, averagePrice: 101.50, targetWeight: 25 },
      { symbol: 'MXRF11', quantity: 500, averagePrice: 9.70, targetWeight: 25 },
      { symbol: 'XPML11', quantity: 30, averagePrice: 111.40, targetWeight: 25 },
    ],
    totalValue: 18200.00,
    tag: 'Dividendos',
    isCustom: false
  },
  {
    id: '3',
    name: 'Posição Conservadora',
    description: 'Foco exclusivo em eixos de alta liquidez diária, P/VP descontado e imóveis triple-A consorciados de Kinea.',
    date: '25/05/2026',
    time: '10:15',
    funds: [
      { symbol: 'KNRI11', quantity: 50, averagePrice: 155.00, targetWeight: 30 },
      { symbol: 'HGLG11', quantity: 40, averagePrice: 160.00, targetWeight: 30 },
      { symbol: 'KNIP11', quantity: 40, averagePrice: 94.10, targetWeight: 20 },
      { symbol: 'XPML11', quantity: 20, averagePrice: 113.00, targetWeight: 20 },
    ],
    totalValue: 15400.00,
    tag: 'Conservador',
    isCustom: false
  }
];

export default function App() {
  const [activeView, setActiveView] = useState<string>('sync_b3');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [activePortfolioName, setActivePortfolioName] = useState<string>('28-05 (28-05, 20:26)');
  const [tutorSymbol, setTutorSymbol] = useState<string>('');
  
  const [fiis, setFiis] = useState<FiiMetric[]>(() => {
    try {
      const stored = localStorage.getItem('fiis_ia_live_metrics');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return AVAILABLE_FIIS;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('fiis_ia_last_sync') || 'Não sincronizado';
  });
  const [syncStatusText, setSyncStatusText] = useState<string>('');

  const handleSyncB3Prices = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatusText('Conectando à API da B3...');
    
    try {
      const result = await syncFiiListWithB3(fiis);
      setFiis(result.updatedFiis);
      localStorage.setItem('fiis_ia_live_metrics', JSON.stringify(result.updatedFiis));
      
      const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(nowStr);
      localStorage.setItem('fiis_ia_last_sync', nowStr);
      
      setSyncStatusText(`Cotações sincronizadas da B3 com sucesso (${result.updatedCount} ativos)!`);
      setTimeout(() => setSyncStatusText(''), 4000);
    } catch (error) {
      console.error('[App] Failed to sync prices:', error);
      setSyncStatusText('Erro de conexão. Simulando preços do pregão diário...');
      setTimeout(() => setSyncStatusText(''), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateFiis = (updatedFiis: FiiMetric[]) => {
    setFiis(updatedFiis);
    localStorage.setItem('fiis_ia_live_metrics', JSON.stringify(updatedFiis));
  };

  const [savedPortfolios, setSavedPortfolios] = useState<GalleryPortfolio[]>(() => {
    try {
      const stored = localStorage.getItem('fiis_ia_gallery');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAVED_PORTFOLIOS;
  });

  const handleSavePortfolio = (name: string, desc: string, tag: 'Premium' | 'Dividendos' | 'Conservador' | 'Personalizada') => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR');
    const timeStr = today.toTimeString().substring(0, 5);

    const val = portfolio.reduce((sum, item) => {
      const fii = fiis.find(f => f.symbol === item.symbol);
      return sum + (fii ? fii.currentPrice * item.quantity : 0);
    }, 0);

    const newPort: GalleryPortfolio = {
      id: Date.now().toString(),
      name,
      description: desc || 'Carteira salva pelo usuário.',
      date: dateStr,
      time: timeStr,
      funds: [...portfolio],
      totalValue: val,
      tag,
      isCustom: true
    };

    const updated = [newPort, ...savedPortfolios];
    setSavedPortfolios(updated);
    localStorage.setItem('fiis_ia_gallery', JSON.stringify(updated));
  };

  const handleLoadPortfolio = (funds: PortfolioItem[], name: string) => {
    setPortfolio(funds);
    setActivePortfolioName(name);
    setActiveView('analisador');
  };

  const handleDeletePortfolio = (id: string) => {
    const updated = savedPortfolios.filter(p => p.id !== id);
    setSavedPortfolios(updated);
    localStorage.setItem('fiis_ia_gallery', JSON.stringify(updated));
  };

  // Handle selected portfolio from the dashboard list
  const handleSelectPortfolio = (selectedPort: any) => {
    setActivePortfolioName(selectedPort.name);
    
    // Simulate updating active portfolio list values based on preset portfolio sizes
    let newItems: PortfolioItem[] = [];
    if (selectedPort.funds === 26) {
      newItems = INITIAL_PORTFOLIO;
    } else if (selectedPort.funds === 18) {
      newItems = [
        { symbol: 'HGLG11', quantity: 30, averagePrice: 159.20, targetWeight: 25 },
        { symbol: 'BTLG11', quantity: 40, averagePrice: 101.50, targetWeight: 25 },
        { symbol: 'MXRF11', quantity: 500, averagePrice: 9.70, targetWeight: 25 },
        { symbol: 'XPML11', quantity: 30, averagePrice: 111.40, targetWeight: 25 },
      ];
    } else {
      newItems = [
        { symbol: 'KNRI11', quantity: 25, averagePrice: 155.00, targetWeight: 40 },
        { symbol: 'HGLG11', quantity: 20, averagePrice: 160.00, targetWeight: 30 },
        { symbol: 'MXRF11', quantity: 400, averagePrice: 9.80, targetWeight: 30 },
      ];
    }
    setPortfolio(newItems);
  };

  // Switch navigation helper
  const handleNavigate = (view: string, extraParam?: string) => {
    if (view === 'tutor' && extraParam) {
      setTutorSymbol(extraParam);
    }
    setActiveView(view);
  };

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-100 overflow-hidden font-sans selection:bg-sky-500/30 selection:text-sky-450" id="fiis-ia-root">
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar activeView={activeView} onViewChange={handleNavigate} />

      {/* 2. Main Layout Compartment */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#020617]" id="main-content-panel">
        
        {/* Top Header navbar with Alanderson Goulart de Barros details */}
        <header className="h-[76px] bg-[#020617] border-b border-[#1e293b]/80 flex items-center justify-between px-8 z-10 select-none" id="main-header">
          
          {/* Breadcrumb matching layout */}
          <div className="flex items-center gap-2" id="header-breadcrumb">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">Ambiente Seguro</span>
            <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-sky-400 font-mono tracking-tight font-bold">FIIs.IA SUÍTE EDITORIAL v2.5</span>
          </div>

          {/* User profile card & credentials matching image */}
          <div className="flex items-center gap-6" id="user-profile-controls">
            
            {/* Sync feedback indicator */}
            {syncStatusText && (
              <div className="hidden md:flex items-center gap-2 bg-[#0c1a2e]/95 text-sky-400 text-[10px] font-mono px-3 py-1.5 rounded-lg border border-sky-500/20 shadow-md">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping"></span>
                <span>{syncStatusText}</span>
              </div>
            )}

            {/* B3 Realtime Price Sync Button */}
            <div className="flex items-center gap-2.5 bg-[#080d16] border border-[#1e293b] hover:border-sky-500/30 transition-all py-1.5 px-3 rounded-xl text-xs font-mono group" id="b3-sync-widget">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-550 font-mono uppercase tracking-wider font-bold">Cotações B3</span>
                <span className="text-[10px] text-sky-450 font-bold mt-0.5">
                  {isSyncing ? 'Atualizando...' : `Última: ${lastSyncTime === 'Não sincronizado' ? 'Suíte v2.5' : lastSyncTime}`}
                </span>
              </div>
              <button
                onClick={handleSyncB3Prices}
                disabled={isSyncing}
                className={`p-1.5 rounded-lg border ml-1 ${
                  isSyncing 
                    ? 'bg-sky-500/10 border-sky-500/20 text-sky-400 cursor-wait' 
                    : 'bg-[#1e293b] border-[#334155] hover:border-sky-500/50 text-slate-300 hover:text-white cursor-pointer active:scale-95'
                } transition-all duration-300 flex items-center justify-center`}
                title="Sincronizar preços diários da B3 via Yahoo Finance em tempo real"
              >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : 'group-hover:rotate-45 transition-transform duration-500'} />
              </button>
            </div>

            {/* Quick utility alerts */}
            <div className="hidden sm:flex items-center gap-3 border-r border-[#1e293b]/60 pr-5" id="header-utilities">
              <button title="Notificações" className="text-slate-400 hover:text-white transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
              </button>
              <button title="Configurações" className="text-slate-400 hover:text-white transition-colors">
                <Settings size={18} />
              </button>
            </div>

            {/* Profile block */}
            <div className="flex items-center gap-3 group cursor-pointer" id="header-user-badge">
              <div className="flex flex-col text-right leading-none">
                <span className="text-xs font-extrabold text-[#f8fafc] group-hover:text-sky-400 transition-colors font-sans">
                  Alanderson Goulart de Barros
                </span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono font-medium">
                  Usuário Plano Master
                </span>
              </div>

              {/* Styled circle avatar */}
              <div className="w-10 h-10 rounded-full bg-[#1e293b]/80 border border-[#334155] flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-[#f8fafc] font-sans tracking-tight">AG</span>
              </div>

              <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
            </div>

          </div>
        </header>

        {/* 3. Primary Content Section */}
        <main className="flex-1 overflow-y-auto p-8 relative space-y-8 bg-[#020617]/40" id="primary-main-viewport">
          
          {activeView === 'dashboard' && (
            <DashboardView 
              onNavigate={handleNavigate} 
              onSelectPortfolio={handleSelectPortfolio} 
              activePortfolioName={activePortfolioName} 
              fiis={fiis}
            />
          )}

          {activeView === 'analisador' && (
            <AnalyzerView 
              portfolio={portfolio} 
              onUpdatePortfolio={setPortfolio} 
              onNavigate={handleNavigate} 
              fiis={fiis}
              onUpdateFiis={handleUpdateFiis}
              activePortfolioName={activePortfolioName}
            />
          )}

          {activeView === 'tutor' && (
            <TutorView 
              initialSymbol={tutorSymbol} 
              onClearSymbol={() => setTutorSymbol('')} 
            />
          )}

          {activeView === 'precificacao' && <PricingView fiis={fiis} />}

          {activeView === 'direcionador' && (
            <DirecionadorView 
              portfolio={portfolio} 
              onNavigate={handleNavigate} 
              fiis={fiis}
            />
          )}

          {activeView === 'enquadramento' && (
            <EnquadramentoView
              portfolio={portfolio}
              onNavigate={handleNavigate}
              fiis={fiis}
            />
          )}

          {activeView === 'sync_b3' && (
            <SyncB3View 
              portfolio={portfolio} 
              fiis={fiis}
              onUpdatePortfolio={setPortfolio} 
              onUpdateFiis={handleUpdateFiis}
              onNavigate={handleNavigate}
            />
          )}

          {/* Compliance warning footer adhering perfectly to image */}
          <footer className="pt-8 border-t border-[#121f35]/50 text-center pb-4" id="view-footer">
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed max-w-3xl mx-auto">
              Esta plataforma tem caráter informativo e educacional. Não constitui recomendação individual de investimento. 
              As cotações e estimativas de Preço Justo IA são geradas com fins exclusivamente educacionais baseados em algoritmos públicos multiplicadores de mercado.
            </p>
          </footer>

        </main>
      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  RefreshCw, 
  Plus, 
  ArrowRight, 
  BarChart3, 
  GraduationCap, 
  DollarSign, 
  Compass, 
  Scale,
  Brain,
  ChevronRight
} from 'lucide-react';
import { INITIAL_REF_PORTFOLIOS, RECENT_ANALYSES, AVAILABLE_FIIS } from '../data';
import { AnalysisHistoryItem, FiiMetric } from '../types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectPortfolio: (portfolio: any) => void;
  activePortfolioName: string;
  fiis?: FiiMetric[];
}

export default function DashboardView({ 
  onNavigate, 
  onSelectPortfolio, 
  activePortfolioName,
  fiis = AVAILABLE_FIIS
}: DashboardViewProps) {
  // Triple the items to make continuous, seamless marquee looping possible
  const tickerItems = [...fiis, ...fiis, ...fiis];

  return (
    <div className="space-y-6" id="dashboard-view-container">
      {/* Welcome Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/70 p-6 rounded-xl border border-[#334155]/60 shadow-lg" id="dashboard-header-panel">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#020617] rounded-lg border border-[#334155] text-sky-400 shrink-0">
            <Brain size={30} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3.5xl font-serif font-black italic tracking-tight text-[#f8fafc]">
              Central de Análises
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Bem-vindo ao FIIs.IA - Sua curadoria exclusiva e plataforma inteligente de Fundos Imobiliários.
            </p>
          </div>
        </div>
        
        {/* Quick status mini-badge */}
        <div className="flex items-center gap-2 bg-[#020617] px-4 py-2 rounded-lg border border-[#1e293b] text-xs font-mono" id="quick-status-badge">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-slate-400 font-sans">Portfólios Carregados: <strong className="text-sky-400 font-mono">4</strong></span>
        </div>
      </div>

      {/* Real-time FIIs Asset Moving Ticker Tape */}
      <div className="relative w-full overflow-hidden bg-[#070e1b] border border-[#1e293b]/70 rounded-xl py-2.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.6)] flex items-center" id="dashboard-ticker-tape">
        {/* Left fog gradient overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Right fog gradient overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020617] via-[#020617]/80 to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling track */}
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 pl-4">
          {tickerItems.map((item, idx) => (
            <React.Fragment key={`${item.symbol}-${idx}`}>
              <div 
                onClick={() => onNavigate('analisador')}
                className="flex items-center gap-2 shrink-0 select-none cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-colors group"
                title={`Analisar FII ${item.symbol}`}
              >
                <span className="font-extrabold text-slate-100 group-hover:text-sky-400 font-sans text-xs tracking-tight transition-colors">
                  {item.symbol}
                </span>
                <span className="text-slate-400 text-[11px] font-mono">
                  R$ {item.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold font-mono px-1.5 py-0.5 rounded ${
                  (item.dailyChange ?? 0) >= 0 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-rose-400 bg-rose-500/10'
                }`}>
                  <span className="text-[8px]">{(item.dailyChange ?? 0) >= 0 ? '▲' : '▼'}</span>
                  <span>{((item.dailyChange ?? 0) >= 0 ? '+' : '')}{(item.dailyChange ?? 0).toFixed(2)}%</span>
                </span>
              </div>
              <span className="text-slate-800 font-bold select-none h-3 w-[1px] bg-slate-850 self-center">|</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Grid: 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-grid">
        
        {/* Column 1: Minhas Carteiras - 3 columns on desktop */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col space-y-4" id="section-minhas-carteiras">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest">Minhas Carteiras</span>
            </div>
            <div className="flex gap-2">
              <button 
                title="Sincronizar Carteiras"
                className="p-1.5 hover:bg-[#1e293b] text-slate-400 hover:text-sky-400 rounded-md transition-colors border border-transparent hover:border-[#334155]"
              >
                <RefreshCw size={12} />
              </button>
              <button 
                onClick={() => onNavigate('analisador')}
                title="Nova Carteira"
                className="p-1.5 bg-[#1e293b] hover:bg-sky-500 hover:text-slate-950 text-sky-400 rounded-md transition-all duration-300 border border-sky-500/20 hover:border-transparent cursor-pointer"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Portfolios list */}
          <div className="space-y-3 flex-1" id="portfolio-list-cards">
            {INITIAL_REF_PORTFOLIOS.map((port, idx) => {
              const isActive = activePortfolioName === port.name;
              return (
                <div 
                  key={idx}
                  id={`portfolio-card-${idx}`}
                  onClick={() => onSelectPortfolio(port)}
                  className={`p-4 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-between border group ${
                    isActive 
                      ? 'bg-[#1e293b] border-sky-500/50 shadow-md' 
                      : 'bg-[#020617]/70 border-[#1e293b] hover:bg-[#1e293b]/50 hover:border-[#334155]'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-slate-500">{port.date}</p>
                    <h3 className="text-sm font-bold text-slate-200 tracking-tight group-hover:text-sky-450 transition-colors">
                      {port.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {port.funds} fundos
                    </p>
                    <p className="text-sm font-bold text-sky-400 mt-1 font-mono">
                      R$ {port.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] text-slate-500 font-sans mt-1">
                      {port.age}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Acesso Rápido + Dica do Tio FIIs - 5 columns on desktop */}
        <div className="lg:col-span-8 xl:col-span-6 flex flex-col space-y-6" id="section-acesso-rapido">
          
          <div className="bg-[#1e293b]/30 border border-[#1e293b] rounded-xl p-5 space-y-4" id="quick-access-box">
            <h2 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest px-1">
              Acesso Rápido
            </h2>

            {/* Quick Access Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="quick-access-grid">
              
              {/* Option 1: Analisar Carteira */}
              <button 
                onClick={() => onNavigate('analisador')}
                className="p-5 text-left rounded-xl bg-[#020617]/70 hover:bg-[#1e293b]/60 border border-[#1e293b] hover:border-sky-500/40 hover:shadow-lg group transition-all duration-300 cursor-pointer"
                id="qa-analisador"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg group-hover:bg-[#38bdf8] group-hover:text-slate-950 transition-all duration-300">
                    <BarChart3 size={18} className="stroke-[2px]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 group-hover:text-sky-400 transition-colors leading-tight">
                      Analisar Carteira
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-tight mt-1">
                      Análise completa da sua carteira de FIIs
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 2: Tutor de FIIs */}
              <button 
                onClick={() => onNavigate('tutor')}
                className="p-5 text-left rounded-xl bg-[#020617]/70 hover:bg-[#1e293b]/60 border border-[#1e293b] hover:border-violet-500/40 hover:shadow-lg group transition-all duration-300 cursor-pointer"
                id="qa-tutor"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/10 text-[#a78bfa] border border-violet-500/20 rounded-lg group-hover:bg-[#a78bfa] group-hover:text-slate-950 transition-all duration-300">
                    <GraduationCap size={18} className="stroke-[2px]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 group-hover:text-violet-400 transition-colors leading-tight">
                      Tutor de FIIs
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-tight mt-1">
                      Tire suas dúvidas cognitivas sobre fundos
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 3: Precificação */}
              <button 
                onClick={() => onNavigate('precificacao')}
                className="p-5 text-left rounded-xl bg-[#020617]/70 hover:bg-[#1e293b]/60 border border-[#1e293b] hover:border-emerald-500/40 hover:shadow-lg group transition-all duration-300 cursor-pointer"
                id="qa-precificacao"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg group-hover:bg-emerald-450 group-hover:text-slate-950 transition-all duration-300">
                    <DollarSign size={18} className="stroke-[2px]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 group-hover:text-emerald-400 transition-colors leading-tight">
                      Precificação
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-tight mt-1">
                      Valuation e preço justo por algoritmos
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 4: Direcionador */}
              <button 
                onClick={() => onNavigate('direcionador')}
                className="p-5 text-left rounded-xl bg-[#020617]/70 hover:bg-[#1e293b]/60 border border-[#1e293b] hover:border-amber-500/40 hover:shadow-lg group transition-all duration-300 cursor-pointer"
                id="qa-direcionador"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                    <Compass size={18} className="stroke-[2px]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-200 group-hover:text-amber-400 transition-colors leading-tight">
                      Direcionador
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-tight mt-1">
                      Direcione seus aportes mensais com IA
                    </p>
                  </div>
                </div>
              </button>

            </div>
          </div>

          {/* Dica do Tio FIIs Tip Banner */}
          <div className="p-6 bg-[#1e293b]/80 border-l-4 border-sky-400 rounded-r-xl rounded-l-md flex gap-4 items-start shadow-md" id="advice-banner">
            <div className="p-2.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-md shrink-0">
              <GraduationCap size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm uppercase font-bold text-sky-400 font-sans tracking-wide">Diretriz Editorial</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Comece inserindo seus dados de ativos no <strong className="text-slate-100 font-semibold">Analisador</strong>. Depois, navegue pelo <strong className="text-slate-100 font-semibold">Direcionador</strong> para reequilibrar novas parcelas sem custos de tributação adicionais e avalie oportunidades pelo <strong className="text-slate-100 font-semibold">Tutor Cognitivo</strong>.
              </p>
            </div>
          </div>

        </div>

        {/* Column 3: Análises Recentes - 3 columns on desktop */}
        <div className="lg:col-span-12 xl:col-span-3 flex flex-col space-y-4" id="section-analises-recentes">
          <div className="px-1">
            <span className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest">Análises Recentes</span>
          </div>

          <div className="space-y-3 flex-1" id="recent-analyses-cards">
            {RECENT_ANALYSES.map((analysis) => {
              // Set type color pills
              let pillBg = 'bg-sky-500/10 text-sky-400 border border-sky-500/25';
              if (analysis.type === 'Enquadramento') {
                pillBg = 'bg-pink-500/10 text-pink-400 border border-pink-500/25';
              } else if (analysis.type === 'Direcionador') {
                pillBg = 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
              } else if (analysis.type === 'Precificação') {
                pillBg = 'bg-violet-500/10 text-violet-400 border border-violet-500/25';
              }

              return (
                <div 
                  key={analysis.id}
                  id={`analysis-item-${analysis.id}`}
                  onClick={() => {
                    const dest = analysis.type.toLowerCase();
                    onNavigate(dest);
                  }}
                  className="p-4 bg-[#020617]/70 border border-[#1e293b] hover:border-[#334155] rounded-xl hover:bg-[#1e293b]/40 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-sans uppercase tracking-wider ${pillBg}`}>
                        {analysis.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{analysis.time}</span>
                    </div>
                    
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-sky-400 transition-colors leading-tight">
                      {analysis.title}
                    </h3>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">
                        {analysis.fundCount} ativos
                      </span>
                      {analysis.value > 0 && (
                        <span className="text-xs font-mono font-bold text-slate-300">
                          R$ {analysis.value.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-slate-550 font-mono text-right mt-1">
                      {analysis.relativeTime}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

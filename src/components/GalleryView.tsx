/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderHeart, 
  Trash2, 
  ArrowUpRight, 
  Plus, 
  Copy, 
  ChevronRight,
  Sparkles,
  Search,
  Check,
  Percent,
  TrendingUp,
  Sliders,
  Calendar,
  Layers,
  CircleDollarSign,
  AlertCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { AVAILABLE_FIIS, segmentColors } from '../data';
import { PortfolioItem, GalleryPortfolio, FiiMetric } from '../types';

interface GalleryViewProps {
  portfolio: PortfolioItem[];
  savedPortfolios: GalleryPortfolio[];
  onSavePortfolio: (name: string, desc: string, tag: 'Premium' | 'Dividendos' | 'Conservador' | 'Personalizada') => void;
  onLoadPortfolio: (funds: PortfolioItem[], name: string) => void;
  onDeletePortfolio: (id: string) => void;
  activePortfolioName: string;
  fiis?: FiiMetric[];
}

export default function GalleryView({
  portfolio,
  savedPortfolios,
  onSavePortfolio,
  onLoadPortfolio,
  onDeletePortfolio,
  activePortfolioName,
  fiis
}: GalleryViewProps) {
  const activeFiis = fiis || AVAILABLE_FIIS;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  
  // Custom Portfolio builder form states
  const [newPortName, setNewPortName] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortTag, setNewPortTag] = useState<'Premium' | 'Dividendos' | 'Conservador' | 'Personalizada'>('Personalizada');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter portfolios
  const filteredPortfolios = savedPortfolios.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTagFilter === 'all' || p.tag === selectedTagFilter;
    return matchesSearch && matchesTag;
  });

  // Calculate detailed stats for any portfolio
  const getPortfolioStats = (funds: PortfolioItem[]) => {
    let totalInv = 0;
    let totalYieldSum = 0;
    const segments: Record<string, number> = {};

    funds.forEach(item => {
      const fii = activeFiis.find(f => f.symbol === item.symbol);
      if (fii) {
        const itemVal = item.quantity * fii.currentPrice;
        totalInv += itemVal;
        totalYieldSum += itemVal * (fii.dy / 100);
        segments[fii.segment] = (segments[fii.segment] || 0) + itemVal;
      }
    });

    const averageYield = totalInv > 0 ? (totalYieldSum / totalInv) * 100 : 0;

    return {
      totalValue: totalInv,
      dividendYield: averageYield,
      segments
    };
  };

  const activeStats = getPortfolioStats(portfolio);

  const chartData = Object.entries(activeStats.segments)
    .map(([name, value]) => ({
      name,
      value,
      color: segmentColors[name]?.accent || '#64748b'
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#020617] border border-[#1e293b] p-2.5 rounded-lg shadow-xl font-mono text-xs text-left">
          <p className="font-sans font-bold text-white mb-1">{data.name}</p>
          <p className="text-sky-400 font-bold">R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-slate-400 text-[10px] mt-0.5">
            {activeStats.totalValue > 0 ? ((data.value / activeStats.totalValue) * 100).toFixed(1) : 0}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortName.trim()) return;

    onSavePortfolio(newPortName, newPortDesc || 'Criação própria do usuário.', newPortTag);
    setNewPortName('');
    setNewPortDesc('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Premium':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Dividendos':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Conservador':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-[#a78bfa]/10 text-[#a78bfa] border-[#a78bfa]/20';
    }
  };

  return (
    <div className="space-y-6" id="gallery-view-container">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/70 p-6 rounded-xl border border-[#334155]/60 shadow-lg" id="gallery-header">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b] text-sky-450 shrink-0">
            <FolderHeart size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black italic tracking-tight text-white flex items-center gap-2">
              Galeria de Carteiras
              <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold px-2.5 py-0.5 rounded-full font-sans uppercase tracking-wider">
                Plano Master
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Organize, preserve e compare diferentes versões ou estratégias alternativas de sua carteira de Fundos Imobiliários.
            </p>
          </div>
        </div>

        {/* Quick Active Portfolio Summary Card */}
        <div className="flex items-center gap-3 bg-[#020617] p-3.5 rounded-xl border border-[#1e293b] text-xs font-mono" id="active-portfolio-preview">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 uppercase font-sans tracking-wide block">Carteira Ativa Atual</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold max-w-40 truncate">{activePortfolioName}</span>
              <span className="text-sky-400 font-bold">R$ {activeStats.totalValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 12 columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="gallery-workspace">
          {/* Left Side Column: Actions & Distribution (col-span-4) */}
        <div className="xl:col-span-4 space-y-6 flex flex-col" id="gallery-left-column">
          
          {/* Save Current Portfolio Card */}
          <div className="bg-[#1e293b]/70 border border-[#334155]/60 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-lg" id="save-current-panel">
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} className="text-sky-400" /> Salvar Modelo Atual
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                Guarde a composição de ativos que está visualizando no momento (<strong className="text-white">{portfolio.length} ativos</strong>, avaliados em <strong className="text-sky-400">R$ {activeStats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>) na sua Galeria Pessoal.
              </p>

              {saveSuccess ? (
                <div className="p-4 bg-emerald-500/15 border border-emerald-550/30 text-emerald-400 text-xs rounded-lg flex items-center gap-2 font-medium">
                  <Check size={16} /> Carteira salva com sucesso na galeria!
                </div>
              ) : portfolio.length === 0 ? (
                <div className="p-4 bg-rose-500/10 border border-rose-550/20 text-rose-400 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                  <p>
                    Sua carteira atual está vazia. Adicione alguns fundos na aba <strong>Analisador</strong> para poder salvar fotos ou simulações.
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSaveCurrent} className="space-y-4 pt-1">
                {/* Form Input: Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] font-sans font-semibold uppercase tracking-wider block">Nome da Carteira</label>
                  <input 
                    type="text" 
                    value={newPortName}
                    onChange={(e) => setNewPortName(e.target.value)}
                    disabled={portfolio.length === 0}
                    className="w-full bg-[#020617] border border-[#1e293b] focus:border-sky-500 rounded-lg py-2.5 px-3.5 text-xs text-white outline-none font-sans"
                    placeholder="Ex: Carteira Aportes Junho"
                    maxLength={35}
                    required
                  />
                </div>

                {/* Form Input: Description */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] font-sans font-semibold uppercase tracking-wider block">Breve Descrição</label>
                  <textarea 
                    value={newPortDesc}
                    onChange={(e) => setNewPortDesc(e.target.value)}
                    disabled={portfolio.length === 0}
                    className="w-full bg-[#020617] border border-[#1e293b] focus:border-sky-500 rounded-lg py-2.5 px-3.5 text-xs text-white outline-none font-sans resize-none h-20"
                    placeholder="Ex: Redução em shoppings e aumento na alocação de logística."
                    maxLength={100}
                  />
                </div>

                {/* Form Input: Category Tag Selection */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] font-sans font-semibold uppercase tracking-wider block">Estilo / Perfil</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Premium', 'Dividendos', 'Conservador', 'Personalizada'] as const).map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setNewPortTag(tag)}
                        disabled={portfolio.length === 0}
                        className={`text-xs p-2.5 border rounded-lg font-sans transition-all cursor-pointer text-center ${
                          newPortTag === tag
                            ? tag === 'Premium' ? 'bg-sky-500/15 border-sky-500 text-sky-400 font-bold'
                              : tag === 'Dividendos' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                              : tag === 'Conservador' ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                              : 'bg-violet-500/10 border-violet-500 text-[#a78bfa] font-bold'
                            : 'bg-[#020617] border-[#1e293b] text-slate-400 hover:text-white hover:border-sky-500/30'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={portfolio.length === 0}
                  className="w-full mt-3 py-3 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-850 disabled:text-slate-650 text-slate-950 border-none font-bold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer text-center font-sans shadow-md flex justify-center items-center gap-2"
                >
                  <Plus size={14} /> Adicionar à Galeria
                </button>
              </form>
            </div>

            {/* Guidelines info */}
            <div className="p-4 mt-4 bg-[#020617] border border-[#1e293b] rounded-lg space-y-1 text-[11px] text-slate-400 leading-relaxed font-sans">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Calendar size={12} className="text-sky-400" /> Comparação Inteligente
              </span>
              <p>
                Salvar fotos permite que você navegue por versões históricas da sua carteira ou simule modificações complexas sem perder o seu portfólio oficial atual.
              </p>
            </div>
          </div>

          {/* Distribuição Setorial Card */}
          <div className="bg-[#1e293b]/70 border border-[#334155]/60 rounded-xl p-6 shadow-lg space-y-4" id="sector-distribution-panel">
            <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
              <Layers size={14} className="text-sky-400" /> Distribuição Setorial
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Proporção alocada por segmento para a carteira ativa (<span className="text-white font-semibold">{activePortfolioName}</span>).
            </p>

            {portfolio.length > 0 ? (
              <div className="space-y-4">
                {/* Recharts PieChart */}
                <div className="h-44 w-full flex items-center justify-center relative z-20" id="donut-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend list */}
                <div className="grid grid-cols-1 gap-2 border-t border-[#1e293b]/50 pt-3">
                  {chartData.map((item, index) => {
                    const pct = activeStats.totalValue > 0 ? (item.value / activeStats.totalValue) * 100 : 0;
                    return (
                      <div key={index} className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-slate-300 font-medium">{item.name}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-white font-bold">{pct.toFixed(1)}%</span>
                          <span className="text-slate-500 text-[10px] ml-1.5">
                            R$ {item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 bg-[#020617] rounded-lg border border-[#1e293b]">
                <AlertCircle size={24} className="text-slate-600 mx-auto mb-2" />
                <p className="text-xs">Nenhum ativo alocado na carteira ativa.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Gallery Cards Grid (col-span-8) */}
        <div className="xl:col-span-8 space-y-6" id="gallery-list-panel">
          
          {/* Filters and Search controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between" id="gallery-controls-bar">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                type="text"
                placeholder="Pesquisar carteira..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#020617] border border-[#1e293b] focus:border-sky-500 rounded-lg text-xs py-2 pl-9 pr-3 outline-none text-white font-sans"
              />
            </div>

            {/* Quick Profile Tag Filters */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto overflow-x-auto justify-end">
              <button
                onClick={() => setSelectedTagFilter('all')}
                className={`text-[11px] font-sans px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedTagFilter === 'all'
                    ? 'bg-[#1e293b] text-white border-[#334155] font-bold'
                    : 'bg-[#020617] border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Todas ({savedPortfolios.length})
              </button>
              {['Premium', 'Dividendos', 'Conservador', 'Personalizada'].map(tag => {
                const count = savedPortfolios.filter(p => p.tag === tag).length;
                return (count > 0 || tag === 'Personalizada') && (
                  <button
                    key={tag}
                    onClick={() => setSelectedTagFilter(tag)}
                    className={`text-[11px] font-sans px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedTagFilter === tag
                        ? 'bg-[#1e293b] text-white border-[#334155] font-bold'
                        : 'bg-[#020617] border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="gallery-cards">
            <AnimatePresence mode="popLayout">
              {filteredPortfolios.map((port) => {
                const isActive = activePortfolioName === port.name;
                const stats = getPortfolioStats(port.funds);
                const fundsCount = port.funds.length;

                return (
                  <motion.div 
                    key={port.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`p-5 rounded-xl border transition-colors duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden bg-[#1e293b]/70 ${
                      isActive 
                        ? 'border-sky-500 bg-gradient-to-br from-sky-500/10 to-[#0c1020]' 
                        : 'border-[#1e293b] hover:border-sky-500/40 hover:bg-[#1e293b]/50 hover:shadow-lg'
                    }`}
                  >
                    {/* Glowing thin decorative border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isActive ? 'bg-sky-500' : 'bg-transparent'
                    }`}></div>

                    {/* Card Header */}
                    <div className="space-y-1.5 relative">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono text-slate-550 block leading-none">{port.date} às {port.time}</span>
                        
                        <span className={`text-[9px] font-bold font-sans px-2.5 py-0.5 rounded-full border leading-none uppercase tracking-wide inline-block ${getTagStyle(port.tag)}`}>
                          {port.tag}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-100 font-sans tracking-tight group-hover:text-sky-400 transition-colors pt-1">
                        {port.name}
                      </h3>

                      <p className="text-xs text-slate-400 max-h-12 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed">
                        {port.description}
                      </p>
                    </div>

                    {/* Stats breakdown */}
                    <div className="grid grid-cols-3 gap-2 bg-[#020617] border border-[#1e293b] p-3 rounded-lg text-center" id={`stats-breakdown-${port.id}`}>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-500 font-sans uppercase block">Valor Total</span>
                        <span className="text-xs font-bold text-white font-mono leading-none">
                          R$ {stats.totalValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      <div className="space-y-0.5 border-x border-[#1e293b]">
                        <span className="text-[9px] text-slate-500 font-sans uppercase block">Yield (LTM)</span>
                        <span className="text-xs font-bold text-sky-400 font-mono leading-none flex items-center justify-center gap-0.5">
                          {stats.dividendYield.toFixed(2)}%
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-500 font-sans uppercase block">Nº FIIs</span>
                        <span className="text-xs font-bold text-[#e1e1e1] font-sans leading-none">
                          {fundsCount} ativos
                        </span>
                      </div>
                    </div>

                    {/* Sector Allocation colored line indicators */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-sans">
                        <span>Proporcionais Setoriais</span>
                        <span className="font-mono text-slate-400">Tijolo + Papel</span>
                      </div>

                      <div className="flex w-full bg-[#020617] h-1.5 rounded-full overflow-hidden">
                        {Object.entries(stats.segments).map(([seg, val], j) => {
                          const pct = stats.totalValue > 0 ? (val / stats.totalValue) * 100 : 0;
                          const config = segmentColors[seg] || { accent: '#64748b' };
                          return (
                            <div 
                              key={j} 
                              style={{ 
                                width: `${pct}%`, 
                                backgroundColor: config.accent 
                              }} 
                              title={`${seg}: ${pct.toFixed(0)}%`}
                              className="h-full first:rounded-l-full last:rounded-r-full hover:opacity-85 transition-opacity"
                            />
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[9px] pt-1">
                        {Object.entries(stats.segments).map(([seg, val], j) => {
                          const pct = stats.totalValue > 0 ? (val / stats.totalValue) * 100 : 0;
                          const config = segmentColors[seg] || { text: 'text-slate-400' };
                          return (
                            <div key={j} className="flex items-center gap-1 text-slate-400 leading-none">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: segmentColors[seg]?.accent || '#64748b' }} />
                              <span>{seg} ({pct.toFixed(0)}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions buttons footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/45">
                      <div>
                        {isActive ? (
                          <span className="text-[10px] text-sky-450 font-extrabold flex items-center gap-1 font-sans">
                            <Check size={12} className="stroke-[3px]" /> CARREGADA
                          </span>
                        ) : (
                          <button
                            onClick={() => onLoadPortfolio(port.funds, port.name)}
                            className="text-[11px] font-sans text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            Carregar Carteira &rarr;
                          </button>
                        )}
                      </div>

                      {/* Allow deleting custom portfolios */}
                      {port.isCustom && (
                        <button
                          onClick={() => onDeletePortfolio(port.id)}
                          className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-450 rounded-md transition-all cursor-pointer"
                          title="Deletar Carteira"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredPortfolios.length === 0 && (
              <div className="col-span-1 md:col-span-2 p-12 text-center text-slate-500 bg-[#020617]/50 rounded-xl border border-[#1e293b]">
                <FolderHeart size={36} className="text-slate-700 mx-auto mb-3 animate-pulse" />
                <p className="text-sm font-semibold text-slate-400 font-sans">Nenhuma carteira encontrada</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Não existem modelos correspondentes aos filtros selecionados. Crie uma carteira ao lado ou remova os filtros de pesquisa.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

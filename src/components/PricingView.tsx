/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  DollarSign,
  HelpCircle,
  Info,
  Sliders,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Scale,
  Percent,
  Calculator,
  Search,
  ChevronDown,
  Tag,
} from 'lucide-react';
import { AVAILABLE_FIIS, segmentColors } from '../data';
import { FiiMetric } from '../types';

interface PricingViewProps {
  fiis?: FiiMetric[];
}

const SLIDER_CLASS = "w-full h-1.5 bg-[#1e293b] rounded-full appearance-none outline-none cursor-pointer accent-sky-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:border-0";

export default function PricingView({ fiis }: PricingViewProps = {}) {
  const activeFiis = fiis || AVAILABLE_FIIS;

  // FII search/selection
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(activeFiis[0].symbol);
  const [rankingSearch, setRankingSearch] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Parameters
  const [ntnbRate, setNtnbRate] = useState(6.5);       // NTN-B yield %
  const [riskPremium, setRiskPremium] = useState(3.5); // Prêmio de risco %
  const [growthRate, setGrowthRate] = useState(3.5);   // g (crescimento perpetuo)
  const [projectedPayout, setProjectedPayout] = useState(0);
  const [grahamMultiplier, setGrahamMultiplier] = useState(15);

  const activeFii = activeFiis.find(f => f.symbol === selectedSymbol) || activeFiis[0];
  const isPapel = activeFii.segment === 'Recebíveis';

  // Auto-set defaults when FII changes
  useEffect(() => {
    setProjectedPayout(activeFii.lastDividend * 12);
    // Papel FIIs typically have lower risk premium (they carry credit risk, not real estate risk)
    setRiskPremium(isPapel ? 2.0 : 3.5);
  }, [selectedSymbol]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredFiis = useMemo(() =>
    activeFiis.filter(f =>
      f.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [activeFiis, searchQuery]);

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchQuery('');
    setShowDropdown(false);
  };

  // ─── Calculations ─────────────────────────────────────────────────────────
  const discountK = ntnbRate + riskPremium; // total discount rate %
  const vpa = activeFii.currentPrice / activeFii.p_vp;

  // Preço teto: Papel = VPA, Tijolo = Gordon
  const gordonTeto = isPapel
    ? vpa
    : (() => {
        const rateDiff = (discountK - growthRate) / 100;
        return rateDiff <= 0 ? 0 : projectedPayout / rateDiff;
      })();

  // Graham fair price
  const grahamPrice = (() => {
    const lpa = activeFii.lastDividend * 12;
    const result = Math.sqrt(grahamMultiplier * vpa * lpa);
    return isNaN(result) ? 0 : result;
  })();

  // Blended AI price
  const blendedPrice = isPapel ? gordonTeto : (gordonTeto + grahamPrice) / 2;

  // Discount/premium relative to preço teto
  const discountFromTeto = gordonTeto > 0
    ? ((gordonTeto - activeFii.currentPrice) / gordonTeto) * 100
    : 0;
  const isCheap = discountFromTeto >= 0;

  // Meter bar: clamp to [-50, +50]
  const meterPct = Math.max(-50, Math.min(50, discountFromTeto));
  const markerLeft = 50 + meterPct; // 0-100% of the bar width
  const fillLeft = meterPct >= 0 ? 50 : markerLeft;
  const fillWidth = Math.abs(meterPct);

  const colors = segmentColors[activeFii.segment] || { bg: 'bg-slate-800/50', text: 'text-slate-300', border: 'border-slate-800', accent: '#64748b' };

  return (
    <div className="space-y-6" id="pricing-view-container">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/70 p-6 rounded-xl border border-[#334155]/60 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b] text-sky-400">
            <Calculator size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black italic tracking-tight text-white flex items-center gap-2">
              Precificação · Preço Teto Dinâmico
              <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold px-2.5 py-0.5 rounded-full font-sans uppercase tracking-wider">
                Suíte FIIs.IA
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Calcule o preço teto de FIIs pelo Modelo de Gordon calibrado pela NTN-B. Para FIIs de Papel, o preço teto é o VPA (Valor Patrimonial da Cota).
            </p>
          </div>
        </div>

        {/* Search / Autocomplete */}
        <div ref={searchRef} className="relative min-w-[260px]">
          <div className="flex items-center gap-2 bg-[#020617] border border-[#1e293b] focus-within:border-sky-400/60 p-2.5 rounded-xl transition-all">
            <Search size={13} className="text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder={`${activeFii.symbol} — ${activeFii.name}`}
              value={searchQuery}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              className="bg-transparent border-none text-sm text-white outline-none font-mono w-full placeholder:text-slate-500 placeholder:font-sans placeholder:text-xs"
            />
            <ChevronDown size={13} className="text-slate-500 flex-shrink-0" />
          </div>
          {showDropdown && filteredFiis.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden z-50 shadow-2xl max-h-60 overflow-y-auto">
              {filteredFiis.map(f => {
                const fc = segmentColors[f.segment] || { text: 'text-slate-400', accent: '#64748b' };
                return (
                  <button
                    key={f.symbol}
                    onMouseDown={() => handleSelect(f.symbol)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[#1e293b] transition-colors ${selectedSymbol === f.symbol ? 'bg-sky-500/10' : ''}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[11px] font-bold font-mono ${fc.text}`}>{f.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-sans truncate max-w-[140px]">{f.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">R$ {f.currentPrice.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left: Parameters */}
        <div className="xl:col-span-7 bg-[#020617]/70 border border-[#1e293b] rounded-xl p-6 space-y-6 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex items-center gap-2">
              <Sliders size={15} className="text-sky-400" /> Parâmetros do Modelo
            </h3>
            <button
              onClick={() => {
                setNtnbRate(6.5);
                setRiskPremium(isPapel ? 2.0 : 3.5);
                setGrowthRate(3.5);
                setProjectedPayout(activeFii.lastDividend * 12);
                setGrahamMultiplier(15);
              }}
              className="text-[11px] font-mono text-slate-500 hover:text-sky-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw size={11} /> Resetar
            </button>
          </div>

          <div className="space-y-6">

            {/* NTN-B Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans flex items-center gap-1">
                  Taxa NTN-B (Tesouro IPCA+)
                  <HelpCircle size={11} className="text-slate-600" />
                </span>
                <span className="font-mono font-bold text-amber-400">{ntnbRate.toFixed(1)}% aa</span>
              </div>
              <input type="range" min={4.0} max={10.0} step={0.1} value={ntnbRate} onChange={(e) => setNtnbRate(parseFloat(e.target.value))} className={SLIDER_CLASS} />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>4.0% (Juro Baixo)</span>
                <span>6.5% (Atual ~NTN-B 2035)</span>
                <span>10.0% (Juro Alto)</span>
              </div>
            </div>

            {/* Risk Premium */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans flex items-center gap-1">
                  Prêmio de Risco do Segmento
                  <HelpCircle size={11} className="text-slate-600" />
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${isPapel ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'}`}>
                    {isPapel ? 'Papel' : 'Tijolo'}
                  </span>
                  <span className="font-mono font-bold text-sky-400">{riskPremium.toFixed(1)}% aa</span>
                </div>
              </div>
              <input type="range" min={0.5} max={6.0} step={0.5} value={riskPremium} onChange={(e) => setRiskPremium(parseFloat(e.target.value))} className={SLIDER_CLASS} />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0.5% (Papel)</span>
                <span>3.5% (Tijolo Típico)</span>
                <span>6.0% (Alto Risco)</span>
              </div>
            </div>

            {/* Projected Payout */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans flex items-center gap-1">
                  Dividendo Anual Projetado (DY Base)
                  <HelpCircle size={11} className="text-slate-600" />
                </span>
                <span className="font-mono font-bold text-white">R$ {projectedPayout.toFixed(2)} /ano</span>
              </div>
              <input type="range" min={0.5} max={25} step={0.10} value={projectedPayout} onChange={(e) => setProjectedPayout(parseFloat(e.target.value))} className={SLIDER_CLASS} />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>R$ 0,50</span>
                <span>Último: R$ {(activeFii.lastDividend * 12).toFixed(2)}</span>
                <span>R$ 25,00</span>
              </div>
            </div>

            {/* Growth Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans flex items-center gap-1">
                  Crescimento Perpétuo Esperado (g)
                  <HelpCircle size={11} className="text-slate-600" />
                </span>
                <span className="font-mono font-bold text-indigo-400">{growthRate.toFixed(1)}% aa</span>
              </div>
              <input type="range" min={0.0} max={6.0} step={0.1} value={growthRate} onChange={(e) => setGrowthRate(parseFloat(e.target.value))} className={SLIDER_CLASS} />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0.0% (Zero real)</span>
                <span>3.5% (IPCA médio)</span>
                <span>6.0% (Otimista)</span>
              </div>
            </div>

            {/* Graham Multiplier (hidden for Papel) */}
            {!isPapel && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-sans">Multiplicador de Graham Adaptado</span>
                  <span className="font-mono font-bold text-white">{grahamMultiplier}x</span>
                </div>
                <input type="range" min={10} max={25} step={1} value={grahamMultiplier} onChange={(e) => setGrahamMultiplier(parseInt(e.target.value))} className={SLIDER_CLASS} />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>10x (Conservador)</span>
                  <span>15x (Mercado)</span>
                  <span>25x (Otimista)</span>
                </div>
              </div>
            )}
          </div>

          {/* Formula info */}
          <div className="p-4 bg-[#020617] border border-[#1e293b] rounded-lg text-xs space-y-1">
            <span className="font-bold text-slate-300 block">Fórmulas Utilizadas:</span>
            {isPapel ? (
              <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-1 font-mono">
                <li>Preço Teto (Papel): <code className="text-violet-400">P_teto = VPA = Preço / P·VP</code></li>
                <li>VPA atual: <code className="text-violet-400">R$ {vpa.toFixed(2)}</code></li>
              </ul>
            ) : (
              <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-1 font-mono">
                <li>Preço Teto (Gordon): <code className="text-sky-400">P = Div / (NTN-B + Prêmio - g)</code></li>
                <li>K total: <code className="text-sky-400">{ntnbRate.toFixed(1)}% + {riskPremium.toFixed(1)}% = {discountK.toFixed(1)}%</code></li>
                <li>Graham: <code className="text-violet-400">V = √({grahamMultiplier} × VPA × LPA)</code></li>
              </ul>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="xl:col-span-5 space-y-5">

          <div className="bg-[#020617]/75 border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">

            {/* Accent bar */}
            <div className="h-1 w-full" style={{ backgroundColor: colors.accent }} />

            <div className="p-6 space-y-5">

              {/* FII identity */}
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-[11px] font-bold font-mono px-3 py-1 rounded-md ${colors.text} border ${colors.border}`} style={{ background: colors.bg }}>
                    {activeFii.symbol}
                  </span>
                  <p className="text-slate-400 text-xs mt-2 font-sans">{activeFii.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-sans uppercase">P/VP</p>
                  <p className="text-sm font-mono font-bold text-white">{activeFii.p_vp.toFixed(2)}x</p>
                  <p className="text-[9px] text-slate-500 font-sans uppercase mt-1">DY LTM</p>
                  <p className="text-sm font-mono font-bold text-emerald-400">{activeFii.dy.toFixed(2)}%</p>
                </div>
              </div>

              {/* ── VISUAL METER BAR ── */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-sans text-slate-500 uppercase tracking-wide">
                  <span>← Prêmio (caro)</span>
                  <span className="font-bold text-slate-400">Posição vs Preço Teto</span>
                  <span>Desconto (barato) →</span>
                </div>
                {/* Bar */}
                <div className="relative h-4 bg-[#1e293b] rounded-full overflow-hidden">
                  {/* Center line */}
                  <div className="absolute top-0 bottom-0 w-px bg-slate-500 z-10" style={{ left: '50%' }} />
                  {/* Colored fill from center to marker */}
                  <div
                    className={`absolute top-0 bottom-0 transition-all duration-500 ${isCheap ? 'bg-emerald-500/50' : 'bg-red-500/50'}`}
                    style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
                  />
                  {/* Marker */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 z-20 transition-all duration-500 ${isCheap ? 'bg-emerald-400 border-emerald-200' : 'bg-red-400 border-red-200'}`}
                    style={{ left: `calc(${markerLeft}% - 6px)` }}
                  />
                </div>
                {/* Scale labels */}
                <div className="flex justify-between text-[9px] font-mono text-slate-600">
                  <span>-50%</span>
                  <span>-25%</span>
                  <span className="text-slate-500">0%</span>
                  <span>+25%</span>
                  <span>+50%</span>
                </div>
              </div>

              {/* Main Price Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[#020617] border border-[#1e293b] rounded-xl text-center space-y-1">
                  <span className="text-[9px] text-slate-500 font-sans uppercase block">Preço Atual</span>
                  <p className="text-xl font-serif font-black text-white">R$ {activeFii.currentPrice.toFixed(2)}</p>
                </div>
                <div className={`p-4 border rounded-xl text-center space-y-1 ${isCheap ? 'bg-emerald-950/20 border-emerald-500/25' : 'bg-red-950/20 border-red-500/25'}`}>
                  <span className="text-[9px] text-slate-500 font-sans uppercase block">Preço Teto</span>
                  <p className={`text-xl font-serif font-black ${isCheap ? 'text-emerald-400' : 'text-red-400'}`}>
                    R$ {gordonTeto.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Discount/Premium badge */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${isCheap ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-red-500/5 border-red-500/20'}`}>
                {isCheap
                  ? <TrendingDown size={18} className="text-emerald-400 flex-shrink-0" />
                  : <TrendingUp size={18} className="text-red-400 flex-shrink-0" />
                }
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide ${isCheap ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isCheap
                      ? `${Math.abs(discountFromTeto).toFixed(2)}% abaixo do preço teto`
                      : `${Math.abs(discountFromTeto).toFixed(2)}% acima do preço teto`
                    }
                  </p>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                    {isCheap
                      ? `${activeFii.symbol} está dentro da margem de segurança — aporte elegível.`
                      : `${activeFii.symbol} está acima do preço teto — evite aportes adicionais.`
                    }
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 pt-2 border-t border-[#1e293b]">
                <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wide font-sans">Decomposição</h4>

                <div className="flex items-center justify-between py-1.5 border-b border-[#1e293b]/60 text-xs font-sans text-slate-400">
                  <span>{isPapel ? 'Preço Teto (VPA)' : 'Preço Teto — Gordon (NTN-B)'}</span>
                  <span className="font-mono text-white font-semibold">R$ {gordonTeto.toFixed(2)}</span>
                </div>

                {!isPapel && (
                  <div className="flex items-center justify-between py-1.5 border-b border-[#1e293b]/60 text-xs font-sans text-slate-400">
                    <span>Preço Justo — Graham Adaptado</span>
                    <span className="font-mono text-white font-semibold">R$ {grahamPrice.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 text-xs font-sans">
                  <span className="text-slate-300 font-bold">Valuation Blend FIIs.IA</span>
                  <span className="font-mono font-bold text-sky-400">R$ {blendedPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-t border-[#1e293b]/60 text-xs font-sans text-slate-500">
                  <span>VPA (Valor Patrimonial)</span>
                  <span className="font-mono text-slate-300">R$ {vpa.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-1 text-xs font-sans text-slate-500">
                  <span>Taxa Total de Desconto (K)</span>
                  <span className="font-mono text-slate-300">{discountK.toFixed(1)}% aa ({ntnbRate.toFixed(1)} + {riskPremium.toFixed(1)})</span>
                </div>
              </div>

            </div>
          </div>

          {/* All FIIs ranking with search */}
          {(() => {
            const rankedFiis = activeFiis
              .map(f => {
                const isP = f.segment === 'Recebíveis';
                const vpaF = f.currentPrice / f.p_vp;
                const kF = ntnbRate + (isP ? 2.0 : 3.5);
                const gF = 3.5;
                const tetoF = isP
                  ? vpaF
                  : (() => {
                      const rd = (kF - gF) / 100;
                      return rd <= 0 ? 0 : (f.lastDividend * 12) / rd;
                    })();
                const discF = tetoF > 0 ? ((tetoF - f.currentPrice) / tetoF) * 100 : 0;
                return { ...f, tetoF, discF };
              })
              .sort((a, b) => b.discF - a.discF);

            const filteredRanking = rankingSearch.trim()
              ? rankedFiis.filter(f =>
                  f.symbol.toLowerCase().includes(rankingSearch.toLowerCase()) ||
                  f.name.toLowerCase().includes(rankingSearch.toLowerCase())
                )
              : rankedFiis;

            return (
              <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
                {/* Header + search */}
                <div className="px-4 py-3 border-b border-[#1e293b] space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-sans flex items-center gap-1.5">
                      <Tag size={12} className="text-sky-400" /> Todos os FIIs Disponíveis ({filteredRanking.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] focus-within:border-sky-400/60 px-3 py-1.5 rounded-lg transition-all">
                    <Search size={12} className="text-slate-500 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar ticker..."
                      value={rankingSearch}
                      onChange={e => setRankingSearch(e.target.value)}
                      className="bg-transparent border-none text-xs text-white outline-none font-mono w-full placeholder:text-slate-500"
                    />
                    {rankingSearch && (
                      <button onClick={() => setRankingSearch('')} className="text-slate-500 hover:text-slate-300 text-[10px] cursor-pointer">✕</button>
                    )}
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] px-4 py-2 border-b border-[#1e293b] text-[9px] uppercase tracking-wide text-slate-500 font-sans">
                  <span>FII</span>
                  <span className="text-right w-20">Preço Atual</span>
                  <span className="text-right w-20">Preço Teto</span>
                  <span className="text-right w-28">Status</span>
                </div>

                <div className="divide-y divide-[#1e293b] max-h-[480px] overflow-y-auto">
                  {filteredRanking.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-6 font-sans">Nenhum FII encontrado para "{rankingSearch}"</p>
                  ) : filteredRanking.map(f => {
                    const fc = segmentColors[f.segment] || { text: 'text-slate-400' };
                    const isSelected = f.symbol === selectedSymbol;
                    return (
                      <button
                        key={f.symbol}
                        onClick={() => handleSelect(f.symbol)}
                        className={`w-full grid grid-cols-[1fr_auto_auto_auto] items-center px-4 py-2.5 text-left hover:bg-[#1e293b]/40 transition-colors ${isSelected ? 'bg-sky-500/5 border-l-2 border-sky-400' : ''}`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className={`text-[11px] font-bold font-mono ${fc.text}`}>{f.symbol}</span>
                          <span className="text-[9px] text-slate-500 font-sans truncate">{f.segment}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-300 text-right w-20">
                          R$ {f.currentPrice.toFixed(2)}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold text-right w-20 ${f.discF >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          R$ {f.tetoF.toFixed(2)}
                        </span>
                        <span className={`text-[9px] font-mono font-bold text-right w-28 ${f.discF >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {f.discF >= 0
                            ? `${f.discF.toFixed(2)}% abaixo`
                            : `${Math.abs(f.discF).toFixed(2)}% acima`
                          }
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}

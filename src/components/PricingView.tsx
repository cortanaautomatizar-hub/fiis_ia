/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  HelpCircle, 
  Info, 
  Sliders, 
  RotateCcw,
  TrendingUp, 
  Scale,
  Percent,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { AVAILABLE_FIIS, segmentColors } from '../data';
import { FiiMetric } from '../types';

interface PricingViewProps {
  fiis?: FiiMetric[];
}

export default function PricingView({ fiis }: PricingViewProps = {}) {
  const activeFiis = fiis || AVAILABLE_FIIS;
  const [selectedSymbol, setSelectedSymbol] = useState(activeFiis[0].symbol);
  const [discountRate, setDiscountRate] = useState(10.5); // Taxa de desconto exigida % (Risk premium + Selic)
  const [growthRate, setGrowthRate] = useState(3.5); // Taxa de crescimento perpetuo % (IPCA)
  const [projectedPayout, setProjectedPayout] = useState(0); // Rendimento anual projetado R$
  const [grahamMultiplier, setGrahamMultiplier] = useState(15); // Gravidade do valuation

  const activeFii = activeFiis.find(f => f.symbol === selectedSymbol) || activeFiis[0];

  // Set initial projects when selected asset updates
  useEffect(() => {
    // Project annual payout based on last paid dividend * 12
    setProjectedPayout(activeFii.lastDividend * 12);
  }, [selectedSymbol]);

  // Calculations
  const gordonFairPrice = () => {
    const rateDiff = (discountRate - growthRate) / 100;
    if (rateDiff <= 0) return 0;
    return projectedPayout / rateDiff;
  };

  const grahamFairPrice = () => {
    // Valuation adapted for FIIs using price net book value
    const vpa = activeFii.currentPrice / activeFii.p_vp;
    const lpa = activeFii.lastDividend * 12; // Annual earnings approximation
    const result = Math.sqrt(grahamMultiplier * vpa * lpa);
    return isNaN(result) ? 0 : result;
  };

  const gordonPrice = gordonFairPrice();
  const grahamPrice = grahamFairPrice();
  const finalAiPrice = (gordonPrice + grahamPrice) / 2; // AI Blended valuation price

  const colors = segmentColors[activeFii.segment] || { bg: 'bg-slate-850', text: 'text-slate-300', border: 'border-slate-800', accent: '#64748b' };
  const discountedPct = ((finalAiPrice - activeFii.currentPrice) / activeFii.currentPrice) * 100;
  const isCheap = activeFii.currentPrice <= finalAiPrice;

  return (
    <div className="space-y-6" id="pricing-view-container">
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/70 p-6 rounded-xl border border-[#334155]/60 shadow-lg" id="pricing-header">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b] text-sky-450">
            <Calculator size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black italic tracking-tight text-white flex items-center gap-2">
              Modelos de Precificação (Preço Justo)
              <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold px-2.5 py-0.5 rounded-full font-sans uppercase tracking-wider">
                Suíte FIIs.IA
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Calcule o preço justo de seus Fundos Imobiliários em tempo real utilizando os consagrados modelos Gordon (Fluxo de Caixa Descontado) e Graham adaptado.
            </p>
          </div>
        </div>

        {/* Asset Selector */}
        <div className="flex items-center gap-2 bg-[#020617] border border-[#1e293b] p-2 rounded-xl" id="asset-scoller">
          <span className="text-xs text-slate-500 font-sans pl-2">Analisar:</span>
          <select 
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="bg-transparent border-none text-sky-400 text-sm font-bold font-mono outline-none cursor-pointer pr-4"
          >
            {activeFiis.map(fii => (
              <option key={fii.symbol} value={fii.symbol} className="bg-[#020617] text-white">
                {fii.symbol} - {fii.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="pricing-workspace">
        
        {/* Left Side: Parameters sliders (col-span-7) */}
        <div className="xl:col-span-7 bg-[#020617]/70 border border-[#1e293b] rounded-xl p-6 space-y-6 shadow-lg" id="pricing-inputs-box">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex items-center gap-2">
              <Sliders size={15} className="text-sky-400" /> Parâmetros Contábeis
            </h3>
            <button 
              onClick={() => {
                setDiscountRate(10.5);
                setGrowthRate(3.5);
                setProjectedPayout(activeFii.lastDividend * 12);
                setGrahamMultiplier(15);
              }}
              className="text-[11px] font-mono text-slate-500 hover:text-sky-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Resetar"
            >
              <RotateCcw size={11} /> Resetar Padrão
            </button>
          </div>

          <div className="space-y-6" id="sliders-wrap">
            
            {/* Gordon projected payout */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans flex items-center gap-1">
                  Rendimento Anual Provisório (LPA Provisório)
                  <HelpCircle size={11} className="text-slate-600" title="Estimativa acumulada de proventos distribuídos pelo fundo nos próximos 12 meses." />
                </span>
                <span className="font-mono font-bold text-white">R$ {projectedPayout.toFixed(2)} / ano</span>
              </div>
              <input 
                type="range" 
                min={1} 
                max={25} 
                step={0.10}
                value={projectedPayout}
                onChange={(e) => setProjectedPayout(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1e293b] rounded-full appearance-none outline-none cursor-pointer accent-sky-400 transition-all focus:ring-1 focus:ring-sky-500/50 [&::-webkit-slider-runnable-track]:bg-[#1e293b] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-moz-range-track]:bg-[#1e293b] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>R$ 1,00</span>
                <span>R$ 12.00 (Média)</span>
                <span>R$ 25,00</span>
              </div>
            </div>

            {/* Gordon Discount Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans">Taxa de Desconto Exigida (K)</span>
                <span className="font-mono font-bold text-slate-100 flex items-center gap-1">
                  <Percent size={12} className="text-emerald-400" /> {discountRate.toFixed(1)}% aa
                </span>
              </div>
              <input 
                type="range" 
                min={6.0} 
                max={18.0} 
                step={0.1}
                value={discountRate}
                onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1e293b] rounded-full appearance-none outline-none cursor-pointer accent-sky-400 transition-all focus:ring-1 focus:ring-sky-500/50 [&::-webkit-slider-runnable-track]:bg-[#1e293b] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-moz-range-track]:bg-[#1e293b] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>6.0% (Risk-free)</span>
                <span>10.5% (Típico Selic+)</span>
                <span>18.0% (Alto Risco)</span>
              </div>
            </div>

            {/* Gordon Growth Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans flex items-center gap-1">
                  Crescimento Perpétuo Esperado (g)
                  <HelpCircle size={11} className="text-slate-600" title="Taxa esperada de reajuste real dos aluguéis e imóveis frente à inflação de longo prazo." />
                </span>
                <span className="font-mono font-bold text-slate-100 flex items-center gap-1">
                  <Percent size={12} className="text-indigo-400" /> {growthRate.toFixed(1)}% aa
                </span>
              </div>
              <input 
                type="range" 
                min={0.0} 
                max={6.0} 
                step={0.1}
                value={growthRate}
                onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1e293b] rounded-full appearance-none outline-none cursor-pointer accent-sky-400 transition-all focus:ring-1 focus:ring-sky-500/50 [&::-webkit-slider-runnable-track]:bg-[#1e293b] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-moz-range-track]:bg-[#1e293b] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0.0% (Zero real)</span>
                <span>3.5% (Estratégia IPCA)</span>
                <span>6.0% (Otimista)</span>
              </div>
            </div>

            {/* Graham Multiplier Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-sans">Multiplicador de Graham Adaptado</span>
                <span className="font-mono font-bold text-white">{grahamMultiplier}x</span>
              </div>
              <input 
                type="range" 
                min={10} 
                max={25} 
                step={1}
                value={grahamMultiplier}
                onChange={(e) => setGrahamMultiplier(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#1e293b] rounded-full appearance-none outline-none cursor-pointer accent-sky-400 transition-all focus:ring-1 focus:ring-sky-500/50 [&::-webkit-slider-runnable-track]:bg-[#1e293b] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-1.5 [&::-moz-range-track]:bg-[#1e293b] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-400 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(56,189,248,0.8)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>10x (Super conservador)</span>
                <span>15x (Média do Mercado)</span>
                <span>25x (Otimista Crescimento)</span>
              </div>
            </div>

          </div>

          {/* Model theoretical formula description matching Portuguese logic */}
          <div className="p-4 bg-[#020617] border border-[#1e293b] rounded-lg space-y-1 text-xs" id="formulas-guide text">
            <span className="font-bold text-slate-350 block">Equações Financeiras Utilizadas:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-1.5 font-mono">
              <li>Modelo Gordon: <code className="text-sky-400">V = Dividendo Projetado / (K - g)</code></li>
              <li>Graham FIIs: <code className="text-violet-400">V = Sqrt({grahamMultiplier} * VPA * LPA)</code></li>
            </ul>
          </div>
        </div>

        {/* Right Side: Pricing result and dynamic color highlights (col-span-5) */}
        <div className="xl:col-span-5 space-y-6" id="pricing-results-box">
          
          <div className="bg-[#020617]/75 border border-[#1e293b] rounded-xl overflow-hidden shadow-lg" id="valuation-glowing-results">
            
            {/* Glowing Accent Bar for current FII */}
            <div className="h-1 w-full" style={{ backgroundColor: colors.accent }}></div>

            <div className="p-6 space-y-5">
              
              <div className="text-center space-y-1">
                <span className={`text-[11px] font-bold font-mono px-3 py-1 rounded-md ${colors.text} ${colors.bg} border ${colors.border}`}>
                  {activeFii.symbol}
                </span>
                <h2 className="text-sm font-semibold text-slate-400 mt-2 font-sans tracking-tight">Valuation Blend FIIs.IA</h2>
              </div>

              {/* Mega Blended fair price result */}
              <div className="p-5 bg-[#020617] border border-[#1e293b] rounded-xl text-center space-y-1" id="mega-price-bubble">
                <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider font-sans block">Preço Justo Sugerido</span>
                <p className="text-3xl font-serif font-black italic text-sky-400 tracking-tight">
                  R$ {finalAiPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-slate-500 font-sans block">Média ponderada dos dois modelos de valuation</span>
              </div>

              {/* Market price contrast card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#080d16] border border-[#1b2c45]/30 rounded-xl space-y-1 text-center">
                  <span className="text-[9px] text-slate-550 block font-sans uppercase">Preço em Tela</span>
                  <p className="text-sm font-bold text-white font-mono">
                    R$ {activeFii.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-3 bg-[#080d16] border border-[#1b2c45]/30 rounded-xl space-y-1 text-center">
                  <span className="text-[9px] text-slate-550 block font-sans uppercase">Desvio Estimado</span>
                  <p className={`text-sm font-bold font-mono ${isCheap ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isCheap ? `-${discountedPct.toFixed(1)}% Desconto` : `+${Math.abs(discountedPct).toFixed(1)}% Ágio`}
                  </p>
                </div>
              </div>

              {/* Status color-coded alignment alert */}
              <div className={`p-4 rounded-xl border flex gap-3 text-xs ${
                isCheap 
                  ? 'bg-emerald-500/5 border-emerald-500/25 text-emerald-400' 
                  : 'bg-rose-500/5 border-rose-500/25 text-rose-450'
              }`}>
                <div className="mt-0.5">
                  <Info size={16} />
                </div>
                <div>
                  <span className="font-bold block uppercase tracking-wider">
                    {isCheap ? 'Ativo Subavaliado (Compra Inteligente)' : 'Ativo Sobreavaliado (Atenção)'}
                  </span>
                  <p className="text-slate-300 leading-relaxed mt-0.5 font-sans">
                    {isCheap 
                      ? `As projeções indicam que ${activeFii.symbol} está sendo negociado com uma margem de segurança atrativa. O rendimento em proventos compensa de forma sólida a taxa de desconto configurada.`
                      : `A cotação de mercado para ${activeFii.symbol} superou a estimativa matemática de valor intrínseco. Recomenda-se ponderar os aportes mensais para evitar a perpetuidade de prêmios adicionais.`
                    }
                  </p>
                </div>
              </div>

              {/* Two Models decomposition detail */}
              <div className="space-y-2 pt-2 border-t border-[#1b2c45]/30 text-xs">
                
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide font-sans mb-1 block">Decomposição das Equações</h4>

                <div className="flex items-center justify-between py-1 border-b border-[#15233c]/40 font-sans text-slate-400">
                  <span>Modelo Gordon (Fluxo Caixa)</span>
                  <span className="font-mono text-white font-semibold">R$ {gordonPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex items-center justify-between py-1 font-sans text-slate-400">
                  <span>Modelo Graham (VP & Proventos)</span>
                  <span className="font-mono text-white font-semibold">R$ {grahamPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

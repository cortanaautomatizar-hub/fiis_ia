/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  ArrowRight, 
  Plus, 
  Scale, 
  Info, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Coins,
  Sparkles,
  Bot
} from 'lucide-react';
import { AVAILABLE_FIIS, segmentColors } from '../data';
import { PortfolioItem, FiiMetric } from '../types';

interface DirecionadorViewProps {
  portfolio: PortfolioItem[];
  onNavigate: (view: string) => void;
  fiis?: FiiMetric[];
}

export default function DirecionadorView({ portfolio, onNavigate, fiis }: DirecionadorViewProps) {
  const activeFiis = fiis || AVAILABLE_FIIS;
  const [apportValue, setApportValue] = useState(5000); // Default investment amount R$ 5.000,00
  const [hasCalculated, setHasCalculated] = useState(false);

  // Allocation metrics
  const getAssetTotalValue = (item: PortfolioItem) => {
    const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
    return fiiInfo ? fiiInfo.currentPrice * item.quantity : 0;
  };

  const totalValue = portfolio.reduce((sum, item) => sum + getAssetTotalValue(item), 0);

  // Rebalancing calculator logic for Real Estate Funds
  // Highlights under-allocated funds that are furthest from their targets
  const calculateRecommendations = () => {
    if (portfolio.length === 0) return [];

    // 1. Calculate current weights
    const itemsWithMetrics = portfolio.map(item => {
      const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
      const currentValue = getAssetTotalValue(item);
      const currentWeight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      const targetWeight = item.targetWeight;
      const weightDiff = targetWeight - currentWeight; // Positive means we need to buy more

      return {
        ...item,
        info: fiiInfo!,
        currentValue,
        currentWeight,
        weightDiff,
        isUnder: weightDiff > 0.5
      };
    });

    // 2. Distribute the apport amount to funds with positive weight diff
    const underAllocated = itemsWithMetrics.filter(i => i.isUnder);
    const totalWeightDiff = underAllocated.reduce((sum, i) => sum + i.weightDiff, 0);

    if (totalWeightDiff === 0 || underAllocated.length === 0) {
      // Revert to general target weight distribution if everything is balanced
      return itemsWithMetrics.map(item => {
        const valueToInvest = (item.targetWeight / 100) * apportValue;
        const sharesToBuy = Math.floor(valueToInvest / item.info.currentPrice);
        const actualCost = sharesToBuy * item.info.currentPrice;

        return {
          symbol: item.symbol,
          name: item.info.name,
          segment: item.info.segment,
          currentPrice: item.info.currentPrice,
          sharesToBuy,
          actualCost,
          reason: 'Aporte proporcional ao alvo (Equânime)'
        };
      });
    }

    // 3. Pro-rata distribution based on under-allocation gap
    return underAllocated.map(item => {
      const shareOfApport = item.weightDiff / totalWeightDiff;
      const valueToInvest = shareOfApport * apportValue;
      const sharesToBuy = Math.floor(valueToInvest / item.info.currentPrice);
      const actualCost = sharesToBuy * item.info.currentPrice;

      return {
        symbol: item.symbol,
        name: item.info.name,
        segment: item.info.segment,
        currentPrice: item.info.currentPrice,
        sharesToBuy,
        actualCost,
        reason: `Rebalanceamento (+${item.weightDiff.toFixed(1)}% abaixo do alvo setorial)`
      };
    }).filter(rec => rec.sharesToBuy > 0);
  };

  const recommendations = calculateRecommendations();
  const totalAllocated = recommendations.reduce((sum, r) => sum + r.actualCost, 0);
  const remainingCash = apportValue - totalAllocated;

  const getSegmentColorConfig = (segmentName: string) => {
    return segmentColors[segmentName] || { bg: 'bg-slate-800/50', text: 'text-slate-350', border: 'border-slate-800', accent: '#64748b' };
  };

  return (
    <div className="space-y-6" id="direcionador-viewport">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/70 p-6 rounded-xl border border-[#334155]/60 shadow-lg" id="direcionador-top">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b] text-sky-450">
            <Compass size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black italic tracking-tight text-white flex items-center gap-2">
              Direcionador Inteligente de Aportes
              <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold px-2.5 py-0.5 rounded-full font-sans uppercase tracking-wider">
                Suíte FIIs.IA
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Insira o valor que deseja investir no mês e nossa inteligência matemática calcula exatamente as ordens de compra necessárias para alinhar sua carteira com as metas de cores.
            </p>
          </div>
        </div>

        {/* Quick Back to portfolios trigger */}
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#020617] font-sans hover:bg-[#1e293b] text-slate-300 pointer-events-auto cursor-pointer transition-all"
        >
          Voltar para Central
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="direcionador-grid flex">
        
        {/* Left Input controller (col-span-5) */}
        <div className="xl:col-span-5 bg-[#020617]/70 border border-[#1e293b] rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-lg" id="direcionador-setup">
          
          <div className="space-y-5">
            <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
              <Coins size={14} className="text-sky-400" /> Montante de Investimento
            </h3>

            {/* Simulated Money input panel */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-sans block">Quanto você deseja investir hoje?</label>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold font-mono text-sm">R$</span>
                <input 
                  type="number" 
                  value={apportValue}
                  onChange={(e) => {
                    setApportValue(Math.max(0, parseInt(e.target.value) || 0));
                    setHasCalculated(false);
                  }}
                  className="w-full bg-[#020617] border border-[#1e293b] focus:border-sky-400 rounded-lg py-3 pl-12 pr-4 font-mono font-bold text-white text-md outline-none transition-all"
                  placeholder="EX: 5000"
                />
              </div>

              {/* Quick Preset values indicators */}
              <div className="flex gap-2">
                {[1000, 3000, 5000, 10000].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      setApportValue(val);
                      setHasCalculated(false);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-mono border transition-all cursor-pointer ${
                      apportValue === val 
                        ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold'
                        : 'bg-[#080e1a]/80 border-[#15233c] text-slate-400 hover:text-slate-100 hover:border-slate-600'
                    }`}
                  >
                    R$ {val.toLocaleString('pt-BR')}
                  </button>
                ))}
              </div>
            </div>

            {/* Informational banner warning about why rebalancing is crucial inside portfolio strategy */}
            <div className="p-4 bg-[#020617] border border-[#1e293b] rounded-lg space-y-1 text-xs text-slate-400 leading-relaxed font-sans">
              <p className="font-bold text-slate-300 flex items-center gap-1">
                <Info size={12} className="text-sky-400" /> Como o rebalanceamento funciona?
              </p>
              <p className="pt-1">
                O direcionador calcula a distância patrimonial de cada FII em relação à sua porcentagem ideal. Em vez de vender ativos (gerando impostos), o algoritmo recomenda aplicar capital novo <strong className="text-sky-400">exclusivamente</strong> naqueles fundos que estiverem sub-alocados, reduzindo o custo de transação de forma inteligente.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setHasCalculated(true)}
            className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 border-none font-bold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer text-center font-sans shadow-md flex justify-center items-center gap-2"
            id="calculate-apport-trigger"
          >
            <Sparkles size={14} /> Calcular Distribuição Recomendada
          </button>

        </div>

        {/* Right Panel matching recommendations (col-span-7) */}
        <div className="xl:col-span-7" id="direcionador-results">
          
          {hasCalculated && portfolio.length > 0 ? (
            <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl overflow-hidden space-y-6 shadow-lg p-6" id="apport-success-box">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest">
                  Boletim de Ordens Sugeridas: {apportValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
                
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-450 uppercase">
                  Otimizado por IA
                </span>
              </div>

              {/* Calculated recommendations cards list */}
              <div className="space-y-3" id="sugested-buy-items">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, i) => {
                    const colors = getSegmentColorConfig(rec.segment);
                    return (
                      <div 
                        key={i}
                        className="p-4 bg-[#020617] border border-[#1e293b] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sky-500/40 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[11px] font-bold font-mono px-2.5 py-1 rounded ${colors.text} ${colors.bg} border ${colors.border} tracking-tight`}>
                            {rec.symbol}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-slate-200 tracking-tight leading-none">{rec.name}</p>
                            <span className="text-[10px] text-slate-500 font-sans mt-1 block">{rec.reason}</span>
                          </div>
                        </div>

                        {/* Buying detailed orders */}
                        <div className="flex items-center gap-6 justify-between md:justify-end">
                          <div className="text-right">
                            <span className="text-[9px] text-slate-500 block uppercase font-sans">Comprar</span>
                            <span className="text-sm font-bold text-sky-400 font-mono leading-none">
                              {rec.sharesToBuy} cotas
                            </span>
                          </div>

                          <div className="text-right pl-4 border-l border-slate-800">
                            <span className="text-[9px] text-slate-500 block uppercase font-sans">Custo Estimado</span>
                            <span className="text-xs font-bold text-white font-mono leading-none">
                              R$ {rec.actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-500 font-sans border border-[#1e293b] rounded-xl bg-[#020617]/50">
                    Sua carteira está perfeitamente alinhada! O aporte não requereu ajustes substanciais para equilibrar as faixas macro.
                  </div>
                )}
              </div>

              {/* Recapitulation total summary stats */}
              <div className="p-4 bg-[#020617] border border-[#1e293b] rounded-lg space-y-2 font-sans" id="apport-recap">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Total Aplicado em FIIs:</span>
                  <span className="font-mono font-bold text-white">
                    R$ {totalAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Caixa Sobrentendido (Troco):</span>
                  <span className="font-mono font-bold text-slate-300">
                    R$ {remainingCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#1e293b] flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-100 uppercase tracking-tight text-[10px] flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-sky-400" /> Status de Execução sugerida:
                  </span>
                  <span className="font-semibold text-sky-400 text-[10px] uppercase tracking-normal">
                    Pendente na sua corretora
                  </span>
                </div>
              </div>

              {/* Dynamic steps to execute order */}
              <div className="space-y-2 pt-2 text-xs text-slate-400" id="broker-actions">
                <span className="font-bold text-slate-300 block uppercase text-[10px] tracking-wide font-sans mb-1">Como Executar na sua Corretora:</span>
                <ol className="list-decimal pl-4 space-y-1 font-sans text-slate-400">
                  <li>Abra o Home Broker de sua preferência (XP, Rico, NuInvest, etc).</li>
                  <li>Envie ordens de compra correspondentes aos códigos e quantidades descritas no boletim acima.</li>
                  <li>Insira o preço limite de compra baseado no Preço Limite de tela para garantir a execução imediata.</li>
                </ol>
              </div>

            </div>
          ) : (
            <div className="bg-[#020617]/50 border border-[#1e293b] rounded-xl p-8 text-center text-slate-500 font-sans h-96 flex flex-col justify-center items-center" id="direcionador-empty">
              <Bot size={40} className="text-sky-500/20 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-slate-300 font-sans">Aguardando Parâmetro de Aporte</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed font-sans">
                Digite um valor de aporte no painel ao lado e clique em "Calcular Distribuição Recomendada" para visualizar quais ativos comprar para manter suas cores e proporções de carteira alinhados.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Compass,
  ArrowRight,
  Scale,
  Info,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Sparkles,
  Bot,
  XCircle,
  TrendingUp,
  BarChart2,
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
  const [apportValue, setApportValue] = useState(5000);
  const [hasCalculated, setHasCalculated] = useState(false);

  // helpers
  const getAssetTotalValue = (item: PortfolioItem) => {
    const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
    return fiiInfo ? fiiInfo.currentPrice * item.quantity : 0;
  };

  const totalValue = portfolio.reduce((sum, item) => sum + getAssetTotalValue(item), 0);

  const getSegmentColorConfig = (segmentName: string) =>
    segmentColors[segmentName] || { bg: 'bg-slate-800/50', text: 'text-slate-300', border: 'border-slate-800', accent: '#64748b' };

  // 1. Diagnóstico de Balanceamento
  const segmentDiagnosis = useMemo(() => {
    if (portfolio.length === 0) return [];
    const segMap: Record<string, { currentValue: number; targetWeight: number }> = {};
    portfolio.forEach(item => {
      const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
      if (!fiiInfo) return;
      const seg = fiiInfo.segment;
      const val = fiiInfo.currentPrice * item.quantity;
      if (!segMap[seg]) segMap[seg] = { currentValue: 0, targetWeight: 0 };
      segMap[seg].currentValue += val;
      segMap[seg].targetWeight += item.targetWeight;
    });
    return Object.entries(segMap).map(([segment, data]) => {
      const currentWeight = totalValue > 0 ? (data.currentValue / totalValue) * 100 : 0;
      const diff = currentWeight - data.targetWeight;
      const status: 'ok' | 'under' | 'over' = Math.abs(diff) <= 5 ? 'ok' : diff < 0 ? 'under' : 'over';
      return { segment, currentWeight, targetWeight: data.targetWeight, diff, status };
    }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  }, [portfolio, activeFiis, totalValue]);

  const fundsDiagnosis = useMemo(() => {
    return portfolio.map(item => {
      const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
      if (!fiiInfo) return null;
      const currentWeight = totalValue > 0 ? (getAssetTotalValue(item) / totalValue) * 100 : 0;
      const diff = currentWeight - item.targetWeight;
      const status: 'ok' | 'under' | 'over' = Math.abs(diff) <= 2 ? 'ok' : diff < 0 ? 'under' : 'over';
      return { symbol: item.symbol, name: fiiInfo.name, segment: fiiInfo.segment, currentWeight, targetWeight: item.targetWeight, diff, status };
    }).filter(Boolean) as { symbol: string; name: string; segment: string; currentWeight: number; targetWeight: number; diff: number; status: 'ok' | 'under' | 'over' }[];
  }, [portfolio, activeFiis, totalValue]);

  // 2. Fundos Não Elegíveis
  const ineligibleFunds = useMemo(() => {
    return portfolio.map(item => {
      const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
      if (!fiiInfo || fiiInfo.currentPrice <= fiiInfo.fairPrice) return null;
      const premium = ((fiiInfo.currentPrice - fiiInfo.fairPrice) / fiiInfo.fairPrice) * 100;
      return { symbol: item.symbol, name: fiiInfo.name, currentPrice: fiiInfo.currentPrice, fairPrice: fiiInfo.fairPrice, premium, segment: fiiInfo.segment };
    }).filter(Boolean) as { symbol: string; name: string; currentPrice: number; fairPrice: number; premium: number; segment: string }[];
  }, [portfolio, activeFiis]);

  const ineligibleSymbols = useMemo(() => new Set(ineligibleFunds.map(f => f.symbol)), [ineligibleFunds]);

  // 3. Recomendações (excluindo inelegíveis)
  const calculateRecommendations = () => {
    if (portfolio.length === 0) return [];
    const eligiblePortfolio = portfolio.filter(item => !ineligibleSymbols.has(item.symbol));
    const itemsWithMetrics = eligiblePortfolio.map(item => {
      const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
      if (!fiiInfo) return null;
      const currentValue = getAssetTotalValue(item);
      const currentWeight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      const weightDiff = item.targetWeight - currentWeight;
      return { ...item, info: fiiInfo, currentValue, currentWeight, weightDiff, isUnder: weightDiff > 0.5 };
    }).filter(Boolean) as any[];

    const underAllocated = itemsWithMetrics.filter((i: any) => i.isUnder);
    const totalWeightDiff = underAllocated.reduce((sum: number, i: any) => sum + i.weightDiff, 0);

    if (totalWeightDiff === 0 || underAllocated.length === 0) {
      return itemsWithMetrics.map((item: any) => {
        const valueToInvest = (item.targetWeight / 100) * apportValue;
        const sharesToBuy = Math.floor(valueToInvest / item.info.currentPrice);
        const actualCost = sharesToBuy * item.info.currentPrice;
        return { symbol: item.symbol, name: item.info.name, segment: item.info.segment, currentPrice: item.info.currentPrice, sharesToBuy, actualCost, reason: 'Aporte proporcional ao alvo (Equânime)' };
      });
    }

    return underAllocated.map((item: any) => {
      const shareOfApport = item.weightDiff / totalWeightDiff;
      const valueToInvest = shareOfApport * apportValue;
      const sharesToBuy = Math.floor(valueToInvest / item.info.currentPrice);
      const actualCost = sharesToBuy * item.info.currentPrice;
      return { symbol: item.symbol, name: item.info.name, segment: item.info.segment, currentPrice: item.info.currentPrice, sharesToBuy, actualCost, reason: `Rebalanceamento (+${item.weightDiff.toFixed(1)}% abaixo do alvo)` };
    }).filter((rec: any) => rec.sharesToBuy > 0);
  };

  const recommendations = calculateRecommendations();
  const totalAllocated = recommendations.reduce((sum, r) => sum + r.actualCost, 0);
  const remainingCash = apportValue - totalAllocated;

  // 4. Projeção pós-aporte
  const projectionData = useMemo(() => {
    if (!hasCalculated || portfolio.length === 0) return { before: [], after: [], table: [], totalAfter: 0 };
    const buyMap: Record<string, number> = {};
    recommendations.forEach(r => { buyMap[r.symbol] = r.sharesToBuy; });

    const beforeSegMap: Record<string, number> = {};
    const afterSegMap: Record<string, number> = {};

    const table = portfolio.map(item => {
      const fiiInfo = activeFiis.find(f => f.symbol === item.symbol);
      if (!fiiInfo) return null;
      const beforeValue = fiiInfo.currentPrice * item.quantity;
      const newQty = item.quantity + (buyMap[item.symbol] || 0);
      const afterValue = fiiInfo.currentPrice * newQty;
      const seg = fiiInfo.segment;
      beforeSegMap[seg] = (beforeSegMap[seg] || 0) + beforeValue;
      afterSegMap[seg] = (afterSegMap[seg] || 0) + afterValue;
      return { symbol: item.symbol, name: fiiInfo.name, segment: fiiInfo.segment, currentPrice: fiiInfo.currentPrice, beforeQty: item.quantity, afterQty: newQty, beforeValue, afterValue, bought: buyMap[item.symbol] || 0 };
    }).filter(Boolean) as any[];

    const totalBefore = totalValue;
    const totalAfter = Object.values(afterSegMap).reduce((a: number, b: unknown) => a + (b as number), 0) as number;

    const before = Object.entries(beforeSegMap).map(([seg, val]) => ({
      name: seg, value: val as number,
      pct: totalBefore > 0 ? ((val as number) / totalBefore) * 100 : 0,
      color: segmentColors[seg]?.accent || '#64748b',
    }));

    const after = Object.entries(afterSegMap).map(([seg, val]) => ({
      name: seg, value: val as number,
      pct: totalAfter > 0 ? ((val as number) / totalAfter) * 100 : 0,
      color: segmentColors[seg]?.accent || '#64748b',
    }));

    return { before, after, table, totalAfter };
  }, [hasCalculated, portfolio, activeFiis, recommendations, totalValue]);

  return (
    <div className="space-y-6" id="direcionador-viewport">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/70 p-6 rounded-xl border border-[#334155]/60 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b] text-sky-400">
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
              Insira o valor que deseja investir e o sistema calcula as ordens ideais para alinhar sua carteira, excluindo automaticamente fundos acima do preço teto.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#020617] font-sans hover:bg-[#1e293b] text-slate-300 cursor-pointer transition-all"
        >
          Voltar para Central
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left: Input panel */}
        <div className="xl:col-span-5 bg-[#020617]/70 border border-[#1e293b] rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-lg">
          <div className="space-y-5">
            <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
              <Coins size={14} className="text-sky-400" /> Montante de Investimento
            </h3>

            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-sans block">Quanto você deseja investir hoje?</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold font-mono text-sm">R$</span>
                <input
                  type="number"
                  value={apportValue}
                  onChange={(e) => { setApportValue(Math.max(0, parseInt(e.target.value) || 0)); setHasCalculated(false); }}
                  className="w-full bg-[#020617] border border-[#1e293b] focus:border-sky-400 rounded-lg py-3 pl-12 pr-4 font-mono font-bold text-white text-md outline-none transition-all"
                  placeholder="EX: 5000"
                />
              </div>
              <div className="flex gap-2">
                {[1000, 3000, 5000, 10000].map(val => (
                  <button
                    key={val}
                    onClick={() => { setApportValue(val); setHasCalculated(false); }}
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

            <div className="p-4 bg-[#020617] border border-[#1e293b] rounded-lg space-y-1 text-xs text-slate-400 leading-relaxed font-sans">
              <p className="font-bold text-slate-300 flex items-center gap-1">
                <Info size={12} className="text-sky-400" /> Como o rebalanceamento funciona?
              </p>
              <p className="pt-1">
                O algoritmo distribui o aporte nos fundos <strong className="text-sky-400">sub-alocados</strong> em relação ao alvo, ignorando automaticamente os que estão acima do preço justo (preço teto). Sem vendas, sem tributação.
              </p>
            </div>

            {portfolio.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-3 bg-[#020617] border border-[#1e293b] rounded-lg text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-sans tracking-wide">Carteira</p>
                  <p className="text-lg font-bold font-mono text-white">{portfolio.length}</p>
                  <p className="text-[9px] text-slate-500 font-sans">fundos</p>
                </div>
                <div className={`p-3 border rounded-lg text-center ${ineligibleFunds.length > 0 ? 'bg-red-950/20 border-red-500/20' : 'bg-[#020617] border-[#1e293b]'}`}>
                  <p className="text-[9px] text-slate-500 uppercase font-sans tracking-wide">Inelegíveis</p>
                  <p className={`text-lg font-bold font-mono ${ineligibleFunds.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{ineligibleFunds.length}</p>
                  <p className="text-[9px] text-slate-500 font-sans">acima P.Teto</p>
                </div>
                <div className="p-3 bg-[#020617] border border-[#1e293b] rounded-lg text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-sans tracking-wide">Segmentos</p>
                  <p className="text-lg font-bold font-mono text-white">{segmentDiagnosis.length}</p>
                  <p className="text-[9px] text-slate-500 font-sans">mapeados</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setHasCalculated(true)}
            className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 border-none font-bold text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer text-center font-sans shadow-md flex justify-center items-center gap-2"
          >
            <Sparkles size={14} /> Calcular Distribuição Recomendada
          </button>
        </div>

        {/* Right: Results */}
        <div className="xl:col-span-7 space-y-4">
          {hasCalculated && portfolio.length > 0 ? (
            <>
              {/* Bloco 1: Diagnóstico de Balanceamento */}
              <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1e293b]">
                  <BarChart2 size={14} className="text-sky-400" />
                  <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex-1">Diagnóstico de Balanceamento</h3>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 uppercase">Etapa 1</span>
                </div>

                <div className="space-y-3">
                  {segmentDiagnosis.map(seg => {
                    const colors = getSegmentColorConfig(seg.segment);
                    const barCurrent = Math.min(Math.max(seg.currentWeight, 0), 100);
                    const barTarget = Math.min(Math.max(seg.targetWeight, 0), 100);
                    return (
                      <div key={seg.segment} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-sans">
                          <span className={`font-bold ${colors.text}`}>{seg.segment}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Alvo: <span className="text-slate-300 font-mono">{seg.targetWeight.toFixed(1)}%</span></span>
                            <span className="text-slate-500">Atual: <span className="font-mono font-bold text-white">{seg.currentWeight.toFixed(1)}%</span></span>
                            <span className={`font-bold font-mono px-1.5 py-0.5 rounded text-[9px] ${
                              seg.status === 'ok'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : seg.status === 'under'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {seg.status === 'ok' ? '✓ OK' : seg.diff < 0 ? `▼ ${Math.abs(seg.diff).toFixed(1)}%` : `▲ ${seg.diff.toFixed(1)}%`}
                            </span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-[#1e293b] rounded-full overflow-visible">
                          <div className="absolute top-0 bottom-0 w-px bg-slate-500 z-10" style={{ left: `${barTarget}%` }} />
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${barCurrent}%`, backgroundColor: colors.accent }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {fundsDiagnosis.filter(f => f.status === 'under').length > 0 && (
                  <div className="pt-2 border-t border-[#1e293b]">
                    <p className="text-[9px] font-bold uppercase text-amber-400 tracking-wide mb-2 flex items-center gap-1">
                      <AlertTriangle size={11} /> Fundos abaixo do peso mínimo
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {fundsDiagnosis.filter(f => f.status === 'under').map(f => (
                        <span key={f.symbol} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          {f.symbol} ({f.diff.toFixed(1)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bloco 2: Fundos Não Elegíveis */}
              {ineligibleFunds.length > 0 && (
                <div className="bg-[#020617]/70 border border-red-500/20 rounded-xl p-5 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 pb-3 border-b border-red-500/10">
                    <XCircle size={14} className="text-red-400" />
                    <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex-1">Fundos Não Elegíveis para Compra</h3>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 uppercase">Etapa 2</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Estes fundos estão negociando <strong className="text-red-400">acima do preço teto (justo)</strong> e foram excluídos das recomendações de aporte.
                  </p>
                  <div className="space-y-2">
                    {ineligibleFunds.map(fund => {
                      const colors = getSegmentColorConfig(fund.segment);
                      return (
                        <div key={fund.symbol} className="flex items-center justify-between p-3 bg-red-950/10 border border-red-500/15 rounded-lg">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${colors.text} border ${colors.border}`} style={{ background: colors.bg }}>
                              {fund.symbol}
                            </span>
                            <span className="text-xs text-slate-400 font-sans">{fund.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-right flex-wrap justify-end">
                            <div>
                              <p className="text-[9px] text-slate-500 font-sans">Preço Teto</p>
                              <p className="text-xs font-mono font-bold text-slate-300">R$ {fund.fairPrice.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-500 font-sans">Preço Atual</p>
                              <p className="text-xs font-mono font-bold text-red-400">R$ {fund.currentPrice.toFixed(2)}</p>
                            </div>
                            <span className="text-[10px] font-bold font-mono px-2 py-1 rounded bg-red-500/15 border border-red-500/20 text-red-400">
                              +{fund.premium.toFixed(1)}% prêmio
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bloco 3: Ordens de Compra */}
              <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1e293b]">
                  <Scale size={14} className="text-sky-400" />
                  <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex-1">
                    Ordens de Compra · {apportValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </h3>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 uppercase">Etapa 3</span>
                </div>

                <div className="space-y-2.5">
                  {recommendations.length > 0 ? (
                    recommendations.map((rec, i) => {
                      const colors = getSegmentColorConfig(rec.segment);
                      return (
                        <div key={i} className="p-3.5 bg-[#020617] border border-[#1e293b] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-sky-500/30 transition-all">
                          <div className="flex items-center gap-3">
                            <span className={`text-[11px] font-bold font-mono px-2.5 py-1 rounded ${colors.text} border ${colors.border}`} style={{ background: colors.bg }}>
                              {rec.symbol}
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-slate-200 leading-none">{rec.name}</p>
                              <span className="text-[10px] text-slate-500 font-sans mt-0.5 block">{rec.reason}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-5 justify-end">
                            <div className="text-right">
                              <span className="text-[9px] text-slate-500 block uppercase font-sans">Comprar</span>
                              <span className="text-sm font-bold text-sky-400 font-mono">{rec.sharesToBuy} cotas</span>
                            </div>
                            <div className="text-right pl-4 border-l border-[#1e293b]">
                              <span className="text-[9px] text-slate-500 block uppercase font-sans">Custo</span>
                              <span className="text-xs font-bold text-white font-mono">R$ {rec.actualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-slate-500 font-sans border border-[#1e293b] rounded-xl bg-[#020617]/50 text-xs">
                      <CheckCircle2 size={20} className="mx-auto mb-2 text-emerald-400" />
                      Carteira perfeitamente balanceada! Nenhum ajuste necessário.
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-[#020617] border border-[#1e293b] rounded-lg space-y-2 font-sans">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Total aplicado:</span>
                    <span className="font-mono font-bold text-white">R$ {totalAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Troco (caixa):</span>
                    <span className="font-mono font-bold text-slate-300">R$ {remainingCash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="pt-2 border-t border-[#1e293b] flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-100 uppercase flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-sky-400" /> Status:
                    </span>
                    <span className="font-semibold text-sky-400 uppercase tracking-wide">Pendente na sua corretora</span>
                  </div>
                </div>
              </div>

              {/* Bloco 4: Projeção Pós-Aporte */}
              <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl p-5 space-y-5 shadow-lg">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1e293b]">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <h3 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-widest flex-1">Projeção da Carteira Após o Aporte</h3>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">Projeção</span>
                </div>

                {/* Donut charts */}
                <div className="grid grid-cols-2 gap-4">
                  {(['before', 'after'] as const).map(mode => {
                    const data = projectionData[mode] as { name: string; value: number; pct: number; color: string }[];
                    const label = mode === 'before' ? 'Antes do Aporte' : 'Após o Aporte';
                    const totalVal = data.reduce((s, d) => s + d.value, 0);
                    return (
                      <div key={mode} className={`p-4 rounded-xl border ${mode === 'after' ? 'border-emerald-500/20 bg-emerald-950/10' : 'border-[#1e293b] bg-[#020617]/60'}`}>
                        <p className={`text-[10px] font-bold text-center font-sans uppercase tracking-wide mb-1 ${mode === 'after' ? 'text-emerald-400' : 'text-slate-400'}`}>{label}</p>
                        <ResponsiveContainer width="100%" height={140}>
                          <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value">
                              {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} stroke="transparent" />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                              contentStyle={{ background: '#020617', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <p className="text-center text-xs font-mono font-bold text-white">
                          R$ {totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </p>
                        <div className="mt-2 space-y-1">
                          {data.map(d => (
                            <div key={d.name} className="flex items-center justify-between text-[9px] font-sans">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                <span className="text-slate-400 truncate max-w-[80px]">{d.name}</span>
                              </div>
                              <span className="font-mono font-bold text-slate-200">{d.pct.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Projection table */}
                <div className="overflow-x-auto rounded-lg border border-[#1e293b]">
                  <table className="w-full text-[10px] font-sans">
                    <thead>
                      <tr className="bg-[#0f172a] text-slate-500 uppercase tracking-widest">
                        <th className="text-left p-2.5 pl-3">Fundo</th>
                        <th className="text-right p-2.5">Qtd. Atual</th>
                        <th className="text-right p-2.5">Comprar</th>
                        <th className="text-right p-2.5">Qtd. Final</th>
                        <th className="text-right p-2.5">Valor Atual</th>
                        <th className="text-right p-2.5 pr-3">Valor Projetado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectionData.table.map((row: any, i: number) => {
                        const colors = getSegmentColorConfig(row.segment);
                        const delta = row.afterValue - row.beforeValue;
                        return (
                          <tr key={i} className="border-t border-[#1e293b] hover:bg-[#1e293b]/20 transition-colors">
                            <td className="p-2.5 pl-3">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold font-mono text-[10px] px-1.5 py-0.5 rounded ${colors.text} border ${colors.border}`} style={{ background: colors.bg }}>
                                  {row.symbol}
                                </span>
                                <span className="text-slate-400 hidden md:block truncate max-w-[100px]">{row.name}</span>
                              </div>
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">{row.beforeQty}</td>
                            <td className="p-2.5 text-right font-mono font-bold">
                              {row.bought > 0 ? (
                                <span className="text-emerald-400">+{row.bought}</span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-white">{row.afterQty}</td>
                            <td className="p-2.5 text-right font-mono text-slate-400">R$ {row.beforeValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-2.5 pr-3 text-right">
                              <div className="flex flex-col items-end">
                                <span className="font-mono font-bold text-white">R$ {row.afterValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                {delta > 0 && <span className="text-[9px] text-emerald-400 font-mono">+R$ {delta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#334155] bg-[#0f172a]">
                        <td className="p-2.5 pl-3 font-bold text-slate-300 uppercase tracking-wide text-[9px]">Total</td>
                        <td colSpan={3} />
                        <td className="p-2.5 text-right font-mono font-bold text-slate-300">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="p-2.5 pr-3 text-right font-mono font-bold text-emerald-400">R$ {(projectionData.totalAfter || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#020617]/50 border border-[#1e293b] rounded-xl p-8 text-center text-slate-500 font-sans h-96 flex flex-col justify-center items-center">
              <Bot size={40} className="text-sky-500/20 mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-slate-300 font-sans">Aguardando Parâmetro de Aporte</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed font-sans">
                Digite um valor de aporte no painel ao lado e clique em "Calcular Distribuição Recomendada" para ver o diagnóstico completo, fundos inelegíveis e a projeção pós-aporte.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

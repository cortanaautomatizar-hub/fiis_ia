/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  Compass,
  Scale,
  Info,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { AVAILABLE_FIIS, segmentColors } from '../data';
import { PortfolioItem, FiiMetric } from '../types';

interface EnquadramentoViewProps {
  portfolio: PortfolioItem[];
  onNavigate: (view: string) => void;
  fiis?: FiiMetric[];
}

export default function EnquadramentoView({ portfolio, onNavigate, fiis }: EnquadramentoViewProps) {
  const activeFiis = fiis || AVAILABLE_FIIS;
  const totalValue = portfolio.reduce((sum, item) => {
    const info = activeFiis.find(f => f.symbol === item.symbol);
    return sum + (info ? info.currentPrice * item.quantity : 0);
  }, 0);

  const portfolioMetrics = useMemo(() => {
    return portfolio.map(item => {
      const info = activeFiis.find(f => f.symbol === item.symbol);
      const currentPrice = info?.currentPrice ?? 0;
      const fairPrice = info?.fairPrice ?? currentPrice;
      const currentValue = currentPrice * item.quantity;
      const currentWeight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
      const targetValue = (item.targetWeight / 100) * totalValue;
      const valueGap = currentValue - targetValue;
      const weightGap = currentWeight - item.targetWeight;
      const shouldSell = valueGap > currentPrice * 0.5;
      const shouldBuy = valueGap < -currentPrice * 0.5;
      const sharesToSell = shouldSell ? Math.floor(valueGap / currentPrice) : 0;
      const sharesToBuy = shouldBuy ? Math.floor(-valueGap / currentPrice) : 0;
      const priceTeto = info?.segment === 'Recebíveis' ? currentPrice / (info?.p_vp || 1) : fairPrice;
      const premium = priceTeto > 0 ? ((currentPrice - priceTeto) / priceTeto) * 100 : 0;
      return {
        ...item,
        name: info?.name ?? item.symbol,
        segment: info?.segment ?? 'Híbrido',
        currentPrice,
        fairPrice,
        priceTeto,
        currentValue,
        currentWeight,
        weightGap,
        targetValue,
        valueGap,
        sharesToSell,
        sharesToBuy,
        premium,
        isOvervalued: currentPrice > priceTeto,
        action: shouldSell ? 'sell' : shouldBuy ? 'buy' : 'hold',
      };
    });
  }, [portfolio, activeFiis, totalValue]);

  const sellOrders = portfolioMetrics
    .filter(item => item.action === 'sell')
    .sort((a, b) => b.weightGap - a.weightGap);

  const buyOrders = portfolioMetrics
    .filter(item => item.action === 'buy')
    .sort((a, b) => a.weightGap - b.weightGap);

  const cashFromSales = sellOrders.reduce((sum, item) => sum + item.sharesToSell * item.currentPrice, 0);
  const cashNeededForBuys = buyOrders.reduce((sum, item) => sum + item.sharesToBuy * item.currentPrice, 0);
  const netCash = cashFromSales - cashNeededForBuys;

  const finalPortfolio = useMemo(() => {
    return portfolioMetrics.map(item => {
      const finalQty = item.quantity + item.sharesToBuy - item.sharesToSell;
      const finalValue = item.currentPrice * finalQty;
      return {
        ...item,
        finalQty,
        finalValue,
        finalWeight: totalValue > 0 ? (finalValue / totalValue) * 100 : 0,
      };
    });
  }, [portfolioMetrics, totalValue]);

  const segmentSummary = useMemo(() => {
    const summary: Record<string, { before: number; after: number }> = {};
    portfolioMetrics.forEach(item => {
      const segment = item.segment;
      if (!summary[segment]) summary[segment] = { before: 0, after: 0 };
      summary[segment].before += item.currentValue;
      summary[segment].after += item.currentPrice * (item.quantity + item.sharesToBuy - item.sharesToSell);
    });
    return Object.entries(summary).map(([segment, data]) => ({
      segment,
      beforePct: totalValue > 0 ? (data.before / totalValue) * 100 : 0,
      afterPct: totalValue > 0 ? (data.after / totalValue) * 100 : 0,
      color: segmentColors[segment]?.accent || '#64748b',
    }));
  }, [portfolioMetrics, totalValue]);

  return (
    <div className="space-y-6" id="enquadramento-view-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b]/70 p-6 rounded-xl border border-[#334155]/60 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#020617] rounded-lg border border-[#1e293b] text-sky-400">
            <Scale size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-black italic tracking-tight text-white flex items-center gap-2">
              Enquadramento de Carteira
              <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold px-2.5 py-0.5 rounded-full font-sans uppercase tracking-wider">
                Rebalanceamento Completo
              </span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Recomendações de venda e compra para fechar a posição conforme metas de peso, com projeção de carteira ajustada e saldo de caixa.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#1e293b] bg-[#020617] font-sans hover:bg-[#1e293b] text-slate-300 transition-all"
        >
          Voltar para Central
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5 bg-[#020617]/70 border border-[#1e293b] rounded-xl p-6 shadow-lg space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold text-slate-400">
              <span>Resumo de Enquadramento</span>
              <span className="text-slate-500">Total R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-[#1e293b] bg-[#020617] text-slate-300">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Ordens de Venda</p>
                <p className="text-3xl font-serif font-black text-rose-400 mt-2">{sellOrders.length}</p>
                <p className="text-[10px] text-slate-500 mt-1">Fundos acima do peso alvo</p>
              </div>
              <div className="p-4 rounded-xl border border-[#1e293b] bg-[#020617] text-slate-300">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Ordens de Compra</p>
                <p className="text-3xl font-serif font-black text-emerald-400 mt-2">{buyOrders.length}</p>
                <p className="text-[10px] text-slate-500 mt-1">Fundos abaixo do peso alvo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-[#1e293b] bg-[#020617]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Caixa Vendido</p>
                <p className="text-lg font-bold text-slate-100 mt-2">R$ {cashFromSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className={`p-4 rounded-xl border ${netCash >= 0 ? 'border-emerald-500/20' : 'border-rose-500/20'} bg-[#020617]`}>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Saldo Pós-Operações</p>
                <p className={`text-lg font-bold mt-2 ${netCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {Math.abs(netCash).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">{netCash >= 0 ? 'Troco em caixa' : 'Necessário aporte'}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#1e293b] bg-[#020617] text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Info size={14} className="text-sky-400" />
              <span>Como funciona o enquadramento</span>
            </div>
            <p>
              O Enquadramento utiliza as metas de peso de cada ativo para gerar ordens que fecham o desequilíbrio atual. Se o valor da venda for maior que o valor de compra, sobra caixa; caso contrário, a carteira precisa de aporte adicional.
            </p>
            <p>
              Fundos que já estão próximos do peso alvo não recebem ordem. O relatório também destaca valores de prêmio/ desconto relativo ao preço teto do próprio fundo.
            </p>
          </div>
        </div>

        <div className="xl:col-span-7 space-y-6">

          <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-bold">Diagnóstico de Peso Atual</p>
                <p className="text-sm text-slate-300 mt-1">Segmentos e fundos com maior desvio em relação ao objetivo.</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Análise imediata</span>
            </div>

            <div className="space-y-3 mt-4">
              {portfolioMetrics.map((item, idx) => {
                const colors = segmentColors[item.segment] || { bg: 'rgba(148,163,184,0.08)', text: 'text-slate-300', border: 'border-slate-700', accent: '#64748b' };
                return (
                  <div key={idx} className="p-4 bg-[#020617] border border-[#1e293b] rounded-xl">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${colors.text} ${colors.bg} border ${colors.border}`}>{item.symbol}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wide">{item.segment}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-200">{item.name}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-400 space-y-1">
                        <p>Preço atual: R$ {item.currentPrice.toFixed(2)}</p>
                        <p>Preço teto: R$ {item.priceTeto.toFixed(2)}</p>
                        <p className={`${item.isOvervalued ? 'text-red-400' : 'text-emerald-400'}`}>{item.isOvervalued ? 'Acima do teto' : 'Dentro do teto'}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
                      <div className="rounded-xl bg-[#0f172a] p-3">
                        <div className="font-semibold text-slate-200">Peso Atual</div>
                        <div className="mt-1 font-mono text-white">{item.currentWeight.toFixed(1)}%</div>
                      </div>
                      <div className="rounded-xl bg-[#0f172a] p-3">
                        <div className="font-semibold text-slate-200">Peso Alvo</div>
                        <div className="mt-1 font-mono text-white">{item.targetWeight.toFixed(1)}%</div>
                      </div>
                      <div className="rounded-xl bg-[#0f172a] p-3">
                        <div className="font-semibold text-slate-200">GAP</div>
                        <div className={`mt-1 font-mono ${item.weightGap > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{item.weightGap.toFixed(1)}%</div>
                      </div>
                      <div className="rounded-xl bg-[#0f172a] p-3">
                        <div className="font-semibold text-slate-200">Status</div>
                        <div className={`mt-1 font-mono ${item.action === 'buy' ? 'text-emerald-400' : item.action === 'sell' ? 'text-rose-400' : 'text-slate-300'}`}>{item.action.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-bold">Ordens Sugeridas</p>
                <p className="text-sm text-slate-300 mt-1">Venda ativos em excesso e compre fundos subalocados.</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Ajuste final</span>
            </div>

            <div className="grid gap-4">
              {sellOrders.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wide font-semibold text-rose-400">Vender</h4>
                  {sellOrders.map((item, idx) => (
                    <div key={idx} className="rounded-2xl border border-rose-500/20 bg-[#08101f] p-4 text-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.symbol}</p>
                          <p className="text-[10px] text-slate-500">{item.name}</p>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-rose-400">Sell</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
                        <div className="rounded-xl bg-[#0f172a] p-3">
                          <p className="font-semibold text-slate-200">Qtd. Venda</p>
                          <p className="mt-1 font-mono text-white">{item.sharesToSell} cotas</p>
                        </div>
                        <div className="rounded-xl bg-[#0f172a] p-3">
                          <p className="font-semibold text-slate-200">Receita</p>
                          <p className="mt-1 font-mono text-white">R$ {(item.sharesToSell * item.currentPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-[10px] text-slate-500">Motivo: peso {item.weightGap.toFixed(1)}% acima do alvo {item.priceTeto ? `e ${item.isOvervalued ? 'prêmio' : 'desconto'} de ${item.premium.toFixed(1)}%` : ''}</div>
                    </div>
                  ))}
                </div>
              )}

              {buyOrders.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wide font-semibold text-emerald-400">Comprar</h4>
                  {buyOrders.map((item, idx) => (
                    <div key={idx} className="rounded-2xl border border-emerald-500/20 bg-[#08101f] p-4 text-slate-300">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.symbol}</p>
                          <p className="text-[10px] text-slate-500">{item.name}</p>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Buy</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-slate-400">
                        <div className="rounded-xl bg-[#0f172a] p-3">
                          <p className="font-semibold text-slate-200">Qtd. Compra</p>
                          <p className="mt-1 font-mono text-white">{item.sharesToBuy} cotas</p>
                        </div>
                        <div className="rounded-xl bg-[#0f172a] p-3">
                          <p className="font-semibold text-slate-200">Custo</p>
                          <p className="mt-1 font-mono text-white">R$ {(item.sharesToBuy * item.currentPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-[10px] text-slate-500">Motivo: peso {item.weightGap.toFixed(1)}% abaixo do alvo.</div>
                    </div>
                  ))}
                </div>
              )}

              {sellOrders.length === 0 && buyOrders.length === 0 && (
                <div className="rounded-2xl border border-slate-700 bg-[#08101f] p-4 text-slate-400 text-sm">
                  Carteira alinhada ao alvo. Nenhuma ordem de venda ou compra foi sugerida no momento.
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#020617]/70 border border-[#1e293b] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-bold">Projeção de Fechamento</p>
                <p className="text-sm text-slate-300 mt-1">Como ficará a carteira após executar as ordens.</p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Resultado final</span>
            </div>

            <div className="grid gap-3">
              {segmentSummary.map((segment, idx) => (
                <div key={idx} className="rounded-2xl border border-[#1e293b] bg-[#08101f] p-4 text-slate-300">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wide">
                    <span>{segment.segment}</span>
                    <span className="font-mono">Final {segment.afterPct.toFixed(1)}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[#0f172a] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, segment.afterPct)}%`, backgroundColor: segment.color }} />
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                    <span>Antes {segment.beforePct.toFixed(1)}%</span>
                    <span>{(segment.afterPct - segment.beforePct).toFixed(1)}pp</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#1e293b] bg-[#020617]">
              <table className="w-full text-[10px] font-sans text-slate-300">
                <thead>
                  <tr className="bg-[#0f172a] text-slate-500 uppercase tracking-wide text-[9px]">
                    <th className="p-3 text-left">Ativo</th>
                    <th className="p-3 text-right">Atual%</th>
                    <th className="p-3 text-right">Alvo%</th>
                    <th className="p-3 text-right">Final%</th>
                    <th className="p-3 text-right">Ajuste</th>
                  </tr>
                </thead>
                <tbody>
                  {finalPortfolio.map((item, idx) => (
                    <tr key={idx} className="border-t border-[#1e293b] hover:bg-[#111b2f] transition-colors">
                      <td className="p-3 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[10px] px-2 py-1 rounded ${segmentColors[item.segment]?.text || 'text-slate-400'} border ${segmentColors[item.segment]?.border || 'border-slate-700'}`}>
                            {item.symbol}
                          </span>
                          <span className="text-slate-400 truncate max-w-[120px] block">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono">{item.currentWeight.toFixed(1)}%</td>
                      <td className="p-3 text-right font-mono">{item.targetWeight.toFixed(1)}%</td>
                      <td className="p-3 text-right font-mono">{item.finalWeight.toFixed(1)}%</td>
                      <td className="p-3 text-right font-mono text-slate-300">{(item.finalWeight - item.currentWeight).toFixed(1)}pp</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

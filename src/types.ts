/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FiiSegment = 'Logística' | 'Recebíveis' | 'Shoppings' | 'Lajes Corporativas' | 'Híbrido' | 'Fiagro';

export interface FiiMetric {
  symbol: string;
  name: string;
  segment: FiiSegment;
  currentPrice: number;
  fairPrice: number; // Preço Justo (Valuation)
  p_vp: number; // P/VP
  dy: number; // Dividend Yield LTM %
  vacancy: number; // Vacância %
  liquidity: string; // Liquidez Diária
  lastDividend: number; // Último rendimento pago R$
  description: string;
  dailyChange?: number; // Variação Diária %
}

export interface PortfolioItem {
  symbol: string;
  quantity: number;
  averagePrice: number;
  targetWeight: number; // % desejada
}

export interface AnalysisHistoryItem {
  id: string;
  date: string;
  time: string;
  title: string;
  type: 'Análise' | 'Enquadramento' | 'Direcionador' | 'Precificação';
  value: number;
  fundCount: number;
  relativeTime: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface GalleryPortfolio {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  funds: PortfolioItem[];
  totalValue: number;
  tag: 'Premium' | 'Dividendos' | 'Conservador' | 'Personalizada';
  isCustom?: boolean;
}


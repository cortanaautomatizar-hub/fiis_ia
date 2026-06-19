/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FiiMetric, PortfolioItem, AnalysisHistoryItem } from './types';

export const segmentColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'Logística': {
    bg: 'rgba(56, 189, 248, 0.08)',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
    accent: '#38bdf8'
  },
  'Recebíveis': {
    bg: 'rgba(167, 139, 250, 0.08)',
    text: 'text-[#a78bfa]',
    border: 'border-violet-500/20',
    accent: '#a78bfa'
  },
  'Shoppings': {
    bg: 'rgba(244, 114, 182, 0.08)',
    text: 'text-pink-400',
    border: 'border-pink-500/20',
    accent: '#f472b6'
  },
  'Lajes Corporativas': {
    bg: 'rgba(74, 222, 128, 0.08)',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    accent: '#4ade80'
  },
  'Híbrido': {
    bg: 'rgba(251, 191, 36, 0.08)',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    accent: '#fbbf24'
  },
  'Fiagro': {
    bg: 'rgba(163, 230, 53, 0.08)',
    text: 'text-[#a3e635]',
    border: 'border-[#a3e635]/20',
    accent: '#a3e635'
  }
};

export const AVAILABLE_FIIS: FiiMetric[] = [
  {
    symbol: 'HGLG11',
    name: 'CSHG Logística',
    segment: 'Logística',
    currentPrice: 161.42,
    fairPrice: 168.50,
    p_vp: 1.02,
    dy: 9.32,
    vacancy: 2.1,
    liquidity: '8.4M',
    lastDividend: 1.10,
    description: 'Um dos maiores e mais consolidados fundos de logística do Brasil, com galpões de altíssimo padrão, localizados principalmente nas regiões metropolitanas de SP.',
    dailyChange: 0.35
  },
  {
    symbol: 'BTLG11',
    name: 'BTG Pactual Logística',
    segment: 'Logística',
    currentPrice: 102.15,
    fairPrice: 105.00,
    p_vp: 1.01,
    dy: 9.15,
    vacancy: 1.8,
    liquidity: '6.2M',
    lastDividend: 0.76,
    description: 'Fundo da gestão BTG focado no segmento logístico industrial, com alta taxa de renovação física e locatários de primeira linha.',
    dailyChange: -0.12
  },
  {
    symbol: 'XPLG11',
    name: 'XP Logística',
    segment: 'Logística',
    currentPrice: 94.60,
    fairPrice: 101.20,
    p_vp: 0.96,
    dy: 9.85,
    vacancy: 4.5,
    liquidity: '4.8M',
    lastDividend: 0.78,
    description: 'Fundo gerido pela XP Vista Asset Management focado no desenvolvimento e aquisição de galpões logísticos e industriais de classe AAA.',
    dailyChange: 0.48
  },
  {
    symbol: 'MXRF11',
    name: 'Maxi Renda',
    segment: 'Recebíveis',
    currentPrice: 9.82,
    fairPrice: 9.90,
    p_vp: 1.01,
    dy: 12.85,
    vacancy: 0,
    liquidity: '11.5M',
    lastDividend: 0.10,
    description: 'O fundo imobiliário com maior número de cotistas na bolsa brasileira, focado em papéis de crédito imobiliário (CRIs), com excelente histórico de dividendos.',
    dailyChange: 0.10
  },
  {
    symbol: 'KNIP11',
    name: 'Kinea Índices de Preços',
    segment: 'Recebíveis',
    currentPrice: 94.20,
    fairPrice: 97.40,
    p_vp: 0.99,
    dy: 11.42,
    vacancy: 0,
    liquidity: '7.9M',
    lastDividend: 0.90,
    description: 'Fundo imobiliário de papel sob gestão da renomada e conservadora asset Kinea do grupo Itaú, investindo em CRIs indexados à inflação (IPCA+).',
    dailyChange: -0.22
  },
  {
    symbol: 'CPTS11',
    name: 'Capitânia Securities II',
    segment: 'Recebíveis',
    currentPrice: 7.95,
    fairPrice: 8.20,
    p_vp: 0.97,
    dy: 11.95,
    vacancy: 0,
    liquidity: '5.2M',
    lastDividend: 0.08,
    description: 'Fundo de papel gerido pela Capitânia focado em ativos de CRIs high grade de alta liquidez e giro ativo do portfólio de crédito.',
    dailyChange: -0.62
  },
  {
    symbol: 'XPML11',
    name: 'XP Malls',
    segment: 'Shoppings',
    currentPrice: 114.80,
    fairPrice: 118.00,
    p_vp: 1.04,
    dy: 9.60,
    vacancy: 3.8,
    liquidity: '9.1M',
    lastDividend: 0.92,
    description: 'Fundo holding de shopping centers com participações ativas em grandes empreendimentos nacionais, beneficiado pelo aumento do fluxo e vendas físicas.',
    dailyChange: 0.75
  },
  {
    symbol: 'VISC11',
    name: 'Vinci Shopping Centers',
    segment: 'Shoppings',
    currentPrice: 112.50,
    fairPrice: 118.50,
    p_vp: 0.98,
    dy: 9.42,
    vacancy: 5.2,
    liquidity: '4.5M',
    lastDividend: 0.85,
    description: 'Gestão sólida da Vinci Partners com diversificação geográfica em shoppings em todas as regiões brasileiras.',
    dailyChange: 0.22
  },
  {
    symbol: 'PVBI11',
    name: 'VBI Prime Offices',
    segment: 'Lajes Corporativas',
    currentPrice: 91.30,
    fairPrice: 102.00,
    p_vp: 0.89,
    dy: 8.90,
    vacancy: 3.9,
    liquidity: '3.1M',
    lastDividend: 0.65,
    description: 'Fundo de lajes corporativas detentor de imóveis de padrão prime triplo A localizados em eixos corporativos premium de São Paulo, como Faria Lima e Paulista.',
    dailyChange: -0.45
  },
  {
    symbol: 'KNRI11',
    name: 'Kinea Renda Imobiliária',
    segment: 'Híbrido',
    currentPrice: 156.40,
    fairPrice: 165.00,
    p_vp: 1.00,
    dy: 8.52,
    vacancy: 2.9,
    liquidity: '5.4M',
    lastDividend: 1.00,
    description: 'Um dos fundos mais tradicionais, com carteira híbrida dividida entre galpões logísticos e edifícios corporativos de alta qualidade.',
    dailyChange: 0.15
  },
  {
    symbol: 'TRXF11',
    name: 'TRX Active Real Estate',
    segment: 'Híbrido',
    currentPrice: 106.80,
    fairPrice: 112.00,
    p_vp: 1.01,
    dy: 9.92,
    vacancy: 0,
    liquidity: '3.9M',
    lastDividend: 0.93,
    description: 'Fundo especializado no modelo Built-To-Suit e Sale-Leaseback, com locatários triple-A de varejo alimentar como Assaí, Pão de Açúcar e Mateus.',
    dailyChange: -0.05
  },
  {
    symbol: 'SNAG11',
    name: 'Suno Recebíveis Imobiliários e do Agronegócio',
    segment: 'Fiagro',
    currentPrice: 10.05,
    fairPrice: 10.15,
    p_vp: 0.99,
    dy: 13.20,
    vacancy: 0,
    liquidity: '3.5M',
    lastDividend: 0.10,
    description: 'Fiagro de crédito robusto gerido pela Suno Asset, focado em empréstimos de alto padrão de garantia para o agronegócio nacional.',
    dailyChange: 0.10
  },
  {
    symbol: 'KNCA11',
    name: 'Kinea Crédito Agro Fiagro',
    segment: 'Fiagro',
    currentPrice: 94.60,
    fairPrice: 96.00,
    p_vp: 0.99,
    dy: 12.50,
    vacancy: 0,
    liquidity: '4.2M',
    lastDividend: 0.95,
    description: 'Fiagro de papel gerido pela Kinea Asset (Itaú), focado em títulos CRA de grandes corporações do agronegócio.',
    dailyChange: 0.05
  },
  {
    symbol: 'RURA11',
    name: 'Itaú Rural Fiagro',
    segment: 'Fiagro',
    currentPrice: 10.15,
    fairPrice: 10.25,
    p_vp: 0.99,
    dy: 12.80,
    vacancy: 0,
    liquidity: '3.0M',
    lastDividend: 0.11,
    description: 'Fundo de investimento nas cadeias produtivas agroindustriais (Fiagro) com carteira diversificada de recebíveis do agronegócio nacional.',
    dailyChange: -0.05
  }
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  { symbol: 'HGLG11', quantity: 45, averagePrice: 159.20, targetWeight: 20 },
  { symbol: 'BTLG11', quantity: 70, averagePrice: 100.80, targetWeight: 15 },
  { symbol: 'MXRF11', quantity: 950, averagePrice: 9.75, targetWeight: 15 },
  { symbol: 'KNIP11', quantity: 65, averagePrice: 93.10, targetWeight: 15 },
  { symbol: 'XPML11', quantity: 50, averagePrice: 112.50, targetWeight: 15 },
  { symbol: 'VISC11', quantity: 20, averagePrice: 110.10, targetWeight: 10 },
  { symbol: 'PVBI11', quantity: 30, averagePrice: 90.20, targetWeight: 10 }
];

export const INITIAL_REF_PORTFOLIOS: { name: string; date: string; funds: number; value: number; age: string }[] = [
  { name: '28-05 (28-05, 20:26)', date: '28/05/2026', funds: 26, value: 31002.56, age: 'Atualizado há cerca de 1 hora' },
  { name: '28-05 (28-05, 20:09)', date: '28/05/2026', funds: 26, value: 31002.56, age: 'Atualizado há 3 dias' },
  { name: '28-05 (28-05, 19:14)', date: '28/05/2026', funds: 18, value: 24500.00, age: 'Atualizado há 3 dias' },
  { name: '28-05', date: '28/05/2026', funds: 15, value: 18900.20, age: 'Atualizado há 5 dias' }
];

export const RECENT_ANALYSES: AnalysisHistoryItem[] = [
  { id: '1', date: '28-05', time: '20:26', title: '28-05 (28-05, 20:26)', type: 'Análise', value: 31002.56, fundCount: 26, relativeTime: 'há cerca de 1 hora' },
  { id: '2', date: '28-05', time: '18:50', title: '28-05', type: 'Enquadramento', value: 31002.56, fundCount: 26, relativeTime: 'há 3 dias' },
  { id: '3', date: '28-05', time: '17:30', title: '28-05', type: 'Direcionador', value: 31002.56, fundCount: 26, relativeTime: 'há 3 dias' },
  { id: '4', date: '28-05', time: '15:15', title: '28-05', type: 'Análise', value: 12400.00, fundCount: 12, relativeTime: 'há 3 dias' },
  { id: '5', date: '22-05', time: '11:00', title: 'POSIÇÃO 20 MAIS', type: 'Enquadramento', value: 45000.00, fundCount: 20, relativeTime: 'há 1 semana' }
];

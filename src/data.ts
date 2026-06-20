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
  },

  // ─── Shoppings ───────────────────────────────────────────────────────────
  { symbol: 'ABCP11', name: 'Ancar IC Shopping Centers', segment: 'Shoppings', currentPrice: 73.01, fairPrice: 72.00, p_vp: 1.02, dy: 6.4, vacancy: 5.0, liquidity: 'R$ 2M/dia', lastDividend: 0.39, description: 'FII de shopping centers administrado pelo grupo Ancar.', dailyChange: 0.0 },
  { symbol: 'BPML11', name: 'BPProperties Malls', segment: 'Shoppings', currentPrice: 87.01, fairPrice: 104.76, p_vp: 0.83, dy: 9.5, vacancy: 6.0, liquidity: 'R$ 7M/dia', lastDividend: 0.69, description: 'FII com portfólio diversificado de shopping centers.', dailyChange: 0.0 },
  { symbol: 'BBIG11', name: 'BB Votorantim Shoppings', segment: 'Shoppings', currentPrice: 6.21, fairPrice: 8.71, p_vp: 0.71, dy: 11.5, vacancy: 9.0, liquidity: 'R$ 3M/dia', lastDividend: 0.060, description: 'FII de shoppings com desconto sobre patrimônio.', dailyChange: 0.0 },
  { symbol: 'MALL11', name: 'Malls Brasil Plural', segment: 'Shoppings', currentPrice: 101.50, fairPrice: 116.00, p_vp: 0.87, dy: 8.8, vacancy: 6.5, liquidity: 'R$ 8M/dia', lastDividend: 0.744, description: 'FII de shopping centers com portfólio diversificado.', dailyChange: 0.0 },
  { symbol: 'HSML11', name: 'HSI Malls', segment: 'Shoppings', currentPrice: 87.50, fairPrice: 101.00, p_vp: 0.87, dy: 9.2, vacancy: 7.0, liquidity: 'R$ 6M/dia', lastDividend: 0.671, description: 'FII focado em shopping centers premium.', dailyChange: 0.0 },
  { symbol: 'HQLS11', name: 'Helbor Shoppings', segment: 'Shoppings', currentPrice: 8.20, fairPrice: 9.60, p_vp: 0.85, dy: 9.0, vacancy: 7.5, liquidity: 'R$ 2M/dia', lastDividend: 0.062, description: 'FII de shoppings da Helbor.', dailyChange: 0.0 },

  // ─── Logística ───────────────────────────────────────────────────────────
  { symbol: 'ALZR11', name: 'Alianza Trust Renda Imobiliária', segment: 'Logística', currentPrice: 108.50, fairPrice: 120.00, p_vp: 0.90, dy: 8.8, vacancy: 4.0, liquidity: 'R$ 6M/dia', lastDividend: 0.795, description: 'Galpões logísticos e industriais de alto padrão.', dailyChange: 0.0 },
  { symbol: 'VILG11', name: 'Vinci Logística', segment: 'Logística', currentPrice: 106.00, fairPrice: 118.00, p_vp: 0.90, dy: 8.0, vacancy: 5.0, liquidity: 'R$ 5M/dia', lastDividend: 0.707, description: 'FII de galpões logísticos triple A.', dailyChange: 0.0 },
  { symbol: 'GGRC11', name: 'GGR Covepi Renda', segment: 'Logística', currentPrice: 128.00, fairPrice: 145.00, p_vp: 0.88, dy: 8.7, vacancy: 3.0, liquidity: 'R$ 4M/dia', lastDividend: 0.928, description: 'Galpões logísticos de alto padrão e localização estratégica.', dailyChange: 0.0 },
  { symbol: 'LVBI11', name: 'LCI Log', segment: 'Logística', currentPrice: 108.00, fairPrice: 122.00, p_vp: 0.88, dy: 8.6, vacancy: 4.0, liquidity: 'R$ 5M/dia', lastDividend: 0.774, description: 'Logística urbana e galpões industriais.', dailyChange: 0.0 },
  { symbol: 'BLMG11', name: 'Bluemacaw Logística', segment: 'Logística', currentPrice: 31.29, fairPrice: 42.97, p_vp: 0.73, dy: 10.0, vacancy: 10.0, liquidity: 'R$ 2M/dia', lastDividend: 0.261, description: 'FII de logística com desconto sobre VPA.', dailyChange: 0.0 },
  { symbol: 'AZPL11', name: 'Atria Energia e Logística', segment: 'Logística', currentPrice: 7.49, fairPrice: 8.62, p_vp: 0.87, dy: 9.5, vacancy: 8.0, liquidity: 'R$ 1M/dia', lastDividend: 0.059, description: 'FII de logística e infraestrutura.', dailyChange: 0.0 },
  { symbol: 'BRCO11', name: 'Bresco Logística', segment: 'Logística', currentPrice: 112.69, fairPrice: 102.64, p_vp: 1.10, dy: 7.5, vacancy: 2.0, liquidity: 'R$ 6M/dia', lastDividend: 0.705, description: 'Portfólio logístico premium com contratos longos.', dailyChange: 0.0 },
  { symbol: 'BTAL11', name: 'BTG Pactual Logística', segment: 'Logística', currentPrice: 87.49, fairPrice: 71.97, p_vp: 1.22, dy: 7.8, vacancy: 3.0, liquidity: 'R$ 4M/dia', lastDividend: 0.569, description: 'FII logístico BTG com portfólio diversificado.', dailyChange: 0.0 },
  { symbol: 'SDIL11', name: 'SDI Logística Rio', segment: 'Logística', currentPrice: 95.50, fairPrice: 107.00, p_vp: 0.89, dy: 9.3, vacancy: 6.0, liquidity: 'R$ 3M/dia', lastDividend: 0.741, description: 'FII de logística no eixo Rio-São Paulo.', dailyChange: 0.0 },
  { symbol: 'RBRL11', name: 'RBR Log', segment: 'Logística', currentPrice: 9.70, fairPrice: 11.20, p_vp: 0.87, dy: 9.5, vacancy: 5.0, liquidity: 'R$ 2M/dia', lastDividend: 0.077, description: 'Galpões logísticos RBR gestão ativa.', dailyChange: 0.0 },
  { symbol: 'GTLG11', name: 'Gauss Logística', segment: 'Logística', currentPrice: 93.00, fairPrice: 108.00, p_vp: 0.86, dy: 9.0, vacancy: 7.0, liquidity: 'R$ 2M/dia', lastDividend: 0.698, description: 'FII de galpões logísticos Gauss.', dailyChange: 0.0 },

  // ─── Recebíveis ──────────────────────────────────────────────────────────
  { symbol: 'AFHI11', name: 'AF Invest CRI', segment: 'Recebíveis', currentPrice: 95.43, fairPrice: 95.53, p_vp: 0.999, dy: 11.5, vacancy: 0, liquidity: 'R$ 5M/dia', lastDividend: 0.915, description: 'FII de CRIs de alta qualidade.', dailyChange: 0.0 },
  { symbol: 'AIEC11', name: 'Ancar IC Recebíveis', segment: 'Recebíveis', currentPrice: 60.80, fairPrice: 76.00, p_vp: 0.80, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.557, description: 'FII de recebíveis imobiliários.', dailyChange: 0.0 },
  { symbol: 'ARRI11', name: 'Ariza Renda Imobiliária', segment: 'Recebíveis', currentPrice: 4.74, fairPrice: 8.43, p_vp: 0.56, dy: 10.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.041, description: 'FII de recebíveis imobiliários com desconto.', dailyChange: 0.0 },
  { symbol: 'BCRI11', name: 'Banestes Recebíveis', segment: 'Recebíveis', currentPrice: 60.60, fairPrice: 84.52, p_vp: 0.72, dy: 11.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.555, description: 'CRIs diversificados com foco regional.', dailyChange: 0.0 },
  { symbol: 'BIME11', name: 'Brio CRI Imobiliário', segment: 'Recebíveis', currentPrice: 5.10, fairPrice: 8.37, p_vp: 0.61, dy: 10.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.042, description: 'FII de recebíveis imobiliários.', dailyChange: 0.0 },
  { symbol: 'DEVA11', name: 'Devant Recebíveis', segment: 'Recebíveis', currentPrice: 97.00, fairPrice: 115.00, p_vp: 0.84, dy: 12.5, vacancy: 0, liquidity: 'R$ 5M/dia', lastDividend: 1.010, description: 'CRIs com exposição diversificada.', dailyChange: 0.0 },
  { symbol: 'HABT11', name: 'Habitat II', segment: 'Recebíveis', currentPrice: 9.50, fairPrice: 10.80, p_vp: 0.88, dy: 12.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.099, description: 'FII de papel com CRIs residenciais.', dailyChange: 0.0 },
  { symbol: 'IRDM11', name: 'Iridium Recebíveis', segment: 'Recebíveis', currentPrice: 95.00, fairPrice: 108.00, p_vp: 0.88, dy: 11.5, vacancy: 0, liquidity: 'R$ 8M/dia', lastDividend: 0.909, description: 'Portfólio de CRIs diversificado alta qualidade.', dailyChange: 0.0 },
  { symbol: 'KNCR11', name: 'Kinea CRI', segment: 'Recebíveis', currentPrice: 105.00, fairPrice: 110.00, p_vp: 0.95, dy: 11.0, vacancy: 0, liquidity: 'R$ 15M/dia', lastDividend: 0.963, description: 'CRIs high grade da gestora Kinea.', dailyChange: 0.0 },
  { symbol: 'KNHY11', name: 'Kinea High Yield CRI', segment: 'Recebíveis', currentPrice: 88.00, fairPrice: 101.00, p_vp: 0.87, dy: 12.0, vacancy: 0, liquidity: 'R$ 4M/dia', lastDividend: 0.880, description: 'CRIs high yield da Kinea.', dailyChange: 0.0 },
  { symbol: 'MCCI11', name: 'Mérito Desenvolvimento Imobiliário', segment: 'Recebíveis', currentPrice: 9.45, fairPrice: 10.90, p_vp: 0.87, dy: 12.5, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.098, description: 'FII de CRIs diversificados.', dailyChange: 0.0 },
  { symbol: 'OUJP11', name: 'Ourinvest JPP', segment: 'Recebíveis', currentPrice: 9.60, fairPrice: 11.20, p_vp: 0.86, dy: 13.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.104, description: 'CRIs com foco em qualidade de crédito.', dailyChange: 0.0 },
  { symbol: 'PLCR11', name: 'Plural Recebíveis', segment: 'Recebíveis', currentPrice: 102.00, fairPrice: 112.00, p_vp: 0.91, dy: 11.5, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.978, description: 'Portfólio de CRIs high grade.', dailyChange: 0.0 },
  { symbol: 'RBRF11', name: 'RBR Alpha FOF', segment: 'Recebíveis', currentPrice: 80.00, fairPrice: 92.00, p_vp: 0.87, dy: 11.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.733, description: 'FOF de CRIs diversificado.', dailyChange: 0.0 },
  { symbol: 'RBRR11', name: 'RBR Rendimento High Grade', segment: 'Recebíveis', currentPrice: 96.00, fairPrice: 109.00, p_vp: 0.88, dy: 11.0, vacancy: 0, liquidity: 'R$ 5M/dia', lastDividend: 0.880, description: 'CRIs de alta qualidade de crédito RBR.', dailyChange: 0.0 },
  { symbol: 'RZAK11', name: 'Riza Akin CRI', segment: 'Recebíveis', currentPrice: 96.00, fairPrice: 111.00, p_vp: 0.87, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.960, description: 'FII de papel com gestão ativa.', dailyChange: 0.0 },
  { symbol: 'URPR11', name: 'Urca Prime Renda', segment: 'Recebíveis', currentPrice: 96.00, fairPrice: 112.00, p_vp: 0.86, dy: 13.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 1.040, description: 'CRIs de alto rendimento.', dailyChange: 0.0 },
  { symbol: 'VGIP11', name: 'Valora CRI', segment: 'Recebíveis', currentPrice: 95.00, fairPrice: 109.00, p_vp: 0.87, dy: 12.0, vacancy: 0, liquidity: 'R$ 4M/dia', lastDividend: 0.950, description: 'Portfólio de CRIs diversificados.', dailyChange: 0.0 },
  { symbol: 'VRTA11', name: 'Fator Verita', segment: 'Recebíveis', currentPrice: 105.00, fairPrice: 118.00, p_vp: 0.89, dy: 11.5, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 1.006, description: 'CRIs high grade com gestão ativa.', dailyChange: 0.0 },

  // ─── Lajes Corporativas ──────────────────────────────────────────────────
  { symbol: 'BBRC11', name: 'BB Renda Corporativa', segment: 'Lajes Corporativas', currentPrice: 104.00, fairPrice: 127.44, p_vp: 0.82, dy: 9.5, vacancy: 12.0, liquidity: 'R$ 5M/dia', lastDividend: 0.823, description: 'Lajes corporativas diversificadas.', dailyChange: 0.0 },
  { symbol: 'BRCR11', name: 'BTG Pactual Corporate Office', segment: 'Lajes Corporativas', currentPrice: 42.57, fairPrice: 76.02, p_vp: 0.56, dy: 9.0, vacancy: 22.0, liquidity: 'R$ 5M/dia', lastDividend: 0.319, description: 'Lajes corporativas São Paulo BTG.', dailyChange: 0.0 },
  { symbol: 'BROF11', name: 'Brazilian Offices', segment: 'Lajes Corporativas', currentPrice: 54.20, fairPrice: 109.94, p_vp: 0.49, dy: 8.5, vacancy: 15.0, liquidity: 'R$ 3M/dia', lastDividend: 0.384, description: 'Escritórios corporativos premium.', dailyChange: 0.0 },
  { symbol: 'JSRE11', name: 'JS Real Estate', segment: 'Lajes Corporativas', currentPrice: 80.00, fairPrice: 94.00, p_vp: 0.85, dy: 8.5, vacancy: 14.0, liquidity: 'R$ 3M/dia', lastDividend: 0.567, description: 'Imóveis corporativos de alto padrão.', dailyChange: 0.0 },
  { symbol: 'PATL11', name: 'Pátria Edifícios Corporativos', segment: 'Lajes Corporativas', currentPrice: 9.60, fairPrice: 11.40, p_vp: 0.84, dy: 8.5, vacancy: 18.0, liquidity: 'R$ 2M/dia', lastDividend: 0.068, description: 'Edifícios corporativos classe A.', dailyChange: 0.0 },
  { symbol: 'SARE11', name: 'Santander Renda Imobiliária', segment: 'Lajes Corporativas', currentPrice: 35.00, fairPrice: 44.00, p_vp: 0.80, dy: 9.0, vacancy: 20.0, liquidity: 'R$ 1M/dia', lastDividend: 0.263, description: 'Lajes corporativas banco Santander.', dailyChange: 0.0 },
  { symbol: 'VINO11', name: 'Vinci Offices', segment: 'Lajes Corporativas', currentPrice: 8.20, fairPrice: 10.00, p_vp: 0.82, dy: 9.5, vacancy: 15.0, liquidity: 'R$ 3M/dia', lastDividend: 0.065, description: 'Escritórios corporativos Vinci.', dailyChange: 0.0 },

  // ─── Híbrido ─────────────────────────────────────────────────────────────
  { symbol: 'APTO11', name: 'Aptare Residencial', segment: 'Híbrido', currentPrice: 8.35, fairPrice: 9.90, p_vp: 0.84, dy: 10.0, vacancy: 8.0, liquidity: 'R$ 2M/dia', lastDividend: 0.070, description: 'FII de imóveis residenciais.', dailyChange: 0.0 },
  { symbol: 'BBFO11', name: 'BB Fundo de Fundos', segment: 'Híbrido', currentPrice: 69.05, fairPrice: 74.25, p_vp: 0.93, dy: 9.5, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.547, description: 'Fundo de fundos imobiliários BB.', dailyChange: 0.0 },
  { symbol: 'BCIA11', name: 'BANESTES FII', segment: 'Híbrido', currentPrice: 89.04, fairPrice: 101.76, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.779, description: 'Fundo de fundos imobiliários diversificado.', dailyChange: 0.0 },
  { symbol: 'BCFF11', name: 'BTG Pactual Fundo de Fundos', segment: 'Híbrido', currentPrice: 60.00, fairPrice: 72.00, p_vp: 0.83, dy: 10.0, vacancy: 0, liquidity: 'R$ 5M/dia', lastDividend: 0.500, description: 'FOF imobiliário BTG diversificado.', dailyChange: 0.0 },
  { symbol: 'HFOF11', name: 'Hedge Top FOFII', segment: 'Híbrido', currentPrice: 8.00, fairPrice: 9.20, p_vp: 0.87, dy: 10.0, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.067, description: 'Fundo de fundos imobiliários Hedge.', dailyChange: 0.0 },
  { symbol: 'MGFF11', name: 'Mogno Fundo de Fundos', segment: 'Híbrido', currentPrice: 80.00, fairPrice: 92.00, p_vp: 0.87, dy: 10.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.667, description: 'FOF imobiliário Mogno Capital.', dailyChange: 0.0 },
  { symbol: 'SNFF11', name: 'Suno Fundo de Fundos', segment: 'Híbrido', currentPrice: 88.00, fairPrice: 101.00, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.770, description: 'FOF imobiliário Suno Research.', dailyChange: 0.0 },
  { symbol: 'TFOF11', name: 'TG Fundo de Fundos', segment: 'Híbrido', currentPrice: 88.00, fairPrice: 103.00, p_vp: 0.85, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.770, description: 'FOF imobiliário diversificado TG.', dailyChange: 0.0 },

  // ─── Fiagro ───────────────────────────────────────────────────────────────
  { symbol: 'AAZQ11', name: 'Agroceres Fiagro', segment: 'Fiagro', currentPrice: 7.52, fairPrice: 8.64, p_vp: 0.87, dy: 10.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.063, description: 'Fiagro com exposição ao agronegócio nacional.', dailyChange: 0.0 },
  { symbol: 'SOJA11', name: 'Soja Fiagro', segment: 'Fiagro', currentPrice: 10.00, fairPrice: 10.40, p_vp: 0.96, dy: 10.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.083, description: 'Fiagro focado na cadeia produtiva da soja.', dailyChange: 0.0 },
  { symbol: 'TGAR11', name: 'TG Ativo Real Fiagro', segment: 'Fiagro', currentPrice: 99.00, fairPrice: 108.00, p_vp: 0.92, dy: 10.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.825, description: 'Fiagro diversificado TG Ativo Real.', dailyChange: 0.0 },
  { symbol: 'RZTR11', name: 'Riza Terra Fiagro', segment: 'Fiagro', currentPrice: 96.00, fairPrice: 111.00, p_vp: 0.86, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.880, description: 'Fiagro com CRAs diversificados.', dailyChange: 0.0 }
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

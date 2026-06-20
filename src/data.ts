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
  { symbol: 'RZTR11', name: 'Riza Terra Fiagro', segment: 'Fiagro', currentPrice: 96.00, fairPrice: 111.00, p_vp: 0.86, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.880, description: 'Fiagro com CRAs diversificados.', dailyChange: 0.0 },

  // ─── Shoppings (9 adicionais) ─────────────────────────────────────────────
  { symbol: 'PQDP11', name: 'Parque Dom Pedro Shopping', segment: 'Shoppings', currentPrice: 82.50, fairPrice: 107.88, p_vp: 0.93, dy: 8.5, vacancy: 6.5, liquidity: 'R$ 3M/dia', lastDividend: 0.584, description: 'FII do Parque Dom Pedro Shopping Campinas.', dailyChange: 0.0 },
  { symbol: 'SHPH11', name: 'Shopping Higienópolis', segment: 'Shoppings', currentPrice: 175.00, fairPrice: 201.92, p_vp: 0.95, dy: 7.5, vacancy: 5.0, liquidity: 'R$ 2M/dia', lastDividend: 1.094, description: 'FII do Shopping Higienópolis São Paulo.', dailyChange: 0.0 },
  { symbol: 'HGBS11', name: 'CSHG Brasil Shopping', segment: 'Shoppings', currentPrice: 195.00, fairPrice: 240.00, p_vp: 0.88, dy: 8.0, vacancy: 6.0, liquidity: 'R$ 8M/dia', lastDividend: 1.300, description: 'CSHG FII diversificado de shopping centers.', dailyChange: 0.0 },
  { symbol: 'GSFI11', name: 'General Shopping Ativo e Renda', segment: 'Shoppings', currentPrice: 7.00, fairPrice: 9.73, p_vp: 0.72, dy: 9.0, vacancy: 10.0, liquidity: 'R$ 1M/dia', lastDividend: 0.053, description: 'FII de shoppings General Shopping.', dailyChange: 0.0 },
  { symbol: 'VSHO11', name: 'Vinci Shopping Centers', segment: 'Shoppings', currentPrice: 9.10, fairPrice: 10.57, p_vp: 0.82, dy: 7.8, vacancy: 7.0, liquidity: 'R$ 2M/dia', lastDividend: 0.059, description: 'FII de shopping centers Vinci.', dailyChange: 0.0 },
  { symbol: 'FPAB11', name: 'Fundo de Renda ABL', segment: 'Shoppings', currentPrice: 9.50, fairPrice: 11.08, p_vp: 0.86, dy: 8.5, vacancy: 7.5, liquidity: 'R$ 1M/dia', lastDividend: 0.067, description: 'FII de shoppings e varejo.', dailyChange: 0.0 },
  { symbol: 'RBVA11', name: 'Rio Bravo Renda Varejo', segment: 'Shoppings', currentPrice: 26.00, fairPrice: 30.46, p_vp: 0.93, dy: 8.5, vacancy: 5.0, liquidity: 'R$ 2M/dia', lastDividend: 0.184, description: 'FII de varejo e shoppings Rio Bravo.', dailyChange: 0.0 },
  { symbol: 'HTMX11', name: 'Hamiltonia Shopping', segment: 'Shoppings', currentPrice: 8.90, fairPrice: 10.66, p_vp: 0.84, dy: 9.0, vacancy: 7.5, liquidity: 'R$ 1M/dia', lastDividend: 0.067, description: 'FII de shopping centers.', dailyChange: 0.0 },
  { symbol: 'ATSA11', name: 'Atrium Shopping', segment: 'Shoppings', currentPrice: 9.50, fairPrice: 11.42, p_vp: 0.83, dy: 9.0, vacancy: 7.0, liquidity: 'R$ 1M/dia', lastDividend: 0.071, description: 'FII de shopping centers.', dailyChange: 0.0 },

  // ─── Logística (17 adicionais) ────────────────────────────────────────────
  { symbol: 'CLOG11', name: 'Capitânia Logística FII', segment: 'Logística', currentPrice: 9.20, fairPrice: 10.72, p_vp: 0.86, dy: 9.5, vacancy: 6.0, liquidity: 'R$ 2M/dia', lastDividend: 0.073, description: 'FII de galpões logísticos Capitânia.', dailyChange: 0.0 },
  { symbol: 'HLOG11', name: 'Hedge Logística', segment: 'Logística', currentPrice: 90.00, fairPrice: 103.85, p_vp: 0.82, dy: 9.0, vacancy: 6.5, liquidity: 'R$ 3M/dia', lastDividend: 0.675, description: 'Galpões logísticos Hedge Investments.', dailyChange: 0.0 },
  { symbol: 'INLG11', name: 'Inter Logística', segment: 'Logística', currentPrice: 97.00, fairPrice: 112.62, p_vp: 0.86, dy: 9.0, vacancy: 5.0, liquidity: 'R$ 3M/dia', lastDividend: 0.728, description: 'Logística Inter Investimentos.', dailyChange: 0.0 },
  { symbol: 'LGCP11', name: 'LOG CP Properties', segment: 'Logística', currentPrice: 9.60, fairPrice: 11.17, p_vp: 0.86, dy: 9.5, vacancy: 5.0, liquidity: 'R$ 3M/dia', lastDividend: 0.076, description: 'FII de galpões LOG CP Properties.', dailyChange: 0.0 },
  { symbol: 'PLOG11', name: 'Pátria Logística', segment: 'Logística', currentPrice: 9.30, fairPrice: 10.85, p_vp: 0.86, dy: 9.0, vacancy: 6.0, liquidity: 'R$ 2M/dia', lastDividend: 0.070, description: 'Galpões logísticos Pátria Investimentos.', dailyChange: 0.0 },
  { symbol: 'RELG11', name: 'Riza Logística', segment: 'Logística', currentPrice: 9.10, fairPrice: 10.59, p_vp: 0.86, dy: 9.5, vacancy: 7.0, liquidity: 'R$ 2M/dia', lastDividend: 0.072, description: 'FII de logística Riza Gestora.', dailyChange: 0.0 },
  { symbol: 'XPIN11', name: 'XP Industrial', segment: 'Logística', currentPrice: 9.60, fairPrice: 11.17, p_vp: 0.86, dy: 9.5, vacancy: 5.0, liquidity: 'R$ 3M/dia', lastDividend: 0.076, description: 'FII industrial e logístico XP.', dailyChange: 0.0 },
  { symbol: 'FIIB11', name: 'FII Industrial Brazil', segment: 'Logística', currentPrice: 355.00, fairPrice: 413.08, p_vp: 0.96, dy: 8.5, vacancy: 4.0, liquidity: 'R$ 2M/dia', lastDividend: 2.514, description: 'FII industrial com ativos de alta qualidade.', dailyChange: 0.0 },
  { symbol: 'BRIP11', name: 'Bresco Investimentos P', segment: 'Logística', currentPrice: 97.00, fairPrice: 113.23, p_vp: 0.86, dy: 9.0, vacancy: 5.0, liquidity: 'R$ 2M/dia', lastDividend: 0.728, description: 'FII logístico Bresco.', dailyChange: 0.0 },
  { symbol: 'CBOP11', name: 'Capitânia B.O.P.', segment: 'Logística', currentPrice: 88.00, fairPrice: 101.54, p_vp: 0.87, dy: 9.0, vacancy: 7.0, liquidity: 'R$ 2M/dia', lastDividend: 0.660, description: 'FII de operações portuárias e logísticas.', dailyChange: 0.0 },
  { symbol: 'VCPI11', name: 'VCI Logística', segment: 'Logística', currentPrice: 9.80, fairPrice: 11.43, p_vp: 0.86, dy: 9.5, vacancy: 5.0, liquidity: 'R$ 1M/dia', lastDividend: 0.078, description: 'FII logístico VCI.', dailyChange: 0.0 },
  { symbol: 'NEWL11', name: 'New Land Logística', segment: 'Logística', currentPrice: 99.00, fairPrice: 113.08, p_vp: 0.88, dy: 8.8, vacancy: 5.0, liquidity: 'R$ 2M/dia', lastDividend: 0.726, description: 'FII de galpões logísticos New Land.', dailyChange: 0.0 },
  { symbol: 'STRX11', name: 'Strix Logística', segment: 'Logística', currentPrice: 9.20, fairPrice: 10.69, p_vp: 0.86, dy: 9.5, vacancy: 7.0, liquidity: 'R$ 1M/dia', lastDividend: 0.073, description: 'FII de galpões logísticos Strix.', dailyChange: 0.0 },
  { symbol: 'LPER11', name: 'L Per Logística', segment: 'Logística', currentPrice: 9.60, fairPrice: 11.08, p_vp: 0.87, dy: 9.5, vacancy: 6.0, liquidity: 'R$ 1M/dia', lastDividend: 0.076, description: 'FII logístico L Per.', dailyChange: 0.0 },
  { symbol: 'ALOG11', name: 'A Log Logística', segment: 'Logística', currentPrice: 9.50, fairPrice: 11.00, p_vp: 0.86, dy: 9.5, vacancy: 6.0, liquidity: 'R$ 1M/dia', lastDividend: 0.075, description: 'FII de galpões logísticos.', dailyChange: 0.0 },
  { symbol: 'TRBL11', name: 'TR Logística', segment: 'Logística', currentPrice: 9.40, fairPrice: 10.85, p_vp: 0.87, dy: 9.5, vacancy: 7.0, liquidity: 'R$ 1M/dia', lastDividend: 0.074, description: 'FII logístico TR.', dailyChange: 0.0 },
  { symbol: 'HCLS11', name: 'HC Logística', segment: 'Logística', currentPrice: 9.30, fairPrice: 10.62, p_vp: 0.88, dy: 9.0, vacancy: 7.0, liquidity: 'R$ 1M/dia', lastDividend: 0.070, description: 'FII de logística HC.', dailyChange: 0.0 },

  // ─── Recebíveis (37 adicionais) ───────────────────────────────────────────
  { symbol: 'CPTR11', name: 'Capitânia Securities', segment: 'Recebíveis', currentPrice: 85.00, fairPrice: 95.51, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.850, description: 'FII de CRIs Capitânia.', dailyChange: 0.0 },
  { symbol: 'CPRE11', name: 'Capitânia Real Estate CRI', segment: 'Recebíveis', currentPrice: 87.00, fairPrice: 97.75, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.870, description: 'Portfólio de CRIs Capitânia.', dailyChange: 0.0 },
  { symbol: 'FEXC11', name: 'FI Excellence CRI', segment: 'Recebíveis', currentPrice: 78.00, fairPrice: 89.66, p_vp: 0.87, dy: 11.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.748, description: 'CRIs diversificados FI Excellence.', dailyChange: 0.0 },
  { symbol: 'FGAA11', name: 'FG Ativos Imobiliários', segment: 'Recebíveis', currentPrice: 9.50, fairPrice: 10.67, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.095, description: 'FII de recebíveis FG Ativos.', dailyChange: 0.0 },
  { symbol: 'GTCR11', name: 'Gauss CRI', segment: 'Recebíveis', currentPrice: 87.00, fairPrice: 97.75, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.870, description: 'CRIs high grade Gauss Capital.', dailyChange: 0.0 },
  { symbol: 'HCTR11', name: 'Hectare CE', segment: 'Recebíveis', currentPrice: 9.00, fairPrice: 10.11, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.094, description: 'CRIs diversificados Hectare Capital.', dailyChange: 0.0 },
  { symbol: 'HGCR11', name: 'CSHG Recebíveis Imobiliários', segment: 'Recebíveis', currentPrice: 9.80, fairPrice: 10.78, p_vp: 0.91, dy: 11.5, vacancy: 0, liquidity: 'R$ 5M/dia', lastDividend: 0.094, description: 'CRIs diversificados CSHG.', dailyChange: 0.0 },
  { symbol: 'ICRI11', name: 'Itaú CRI Imobiliário', segment: 'Recebíveis', currentPrice: 92.00, fairPrice: 103.37, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.920, description: 'CRIs de alta qualidade Itaú.', dailyChange: 0.0 },
  { symbol: 'KNOF11', name: 'Kinea Oportunidades Imobiliárias', segment: 'Recebíveis', currentPrice: 91.00, fairPrice: 103.41, p_vp: 0.88, dy: 12.5, vacancy: 0, liquidity: 'R$ 4M/dia', lastDividend: 0.948, description: 'Oportunidades em recebíveis Kinea.', dailyChange: 0.0 },
  { symbol: 'MFII11', name: 'Mérito FII Recebíveis', segment: 'Recebíveis', currentPrice: 9.10, fairPrice: 10.22, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.095, description: 'FII de recebíveis Mérito.', dailyChange: 0.0 },
  { symbol: 'NCHB11', name: 'NCH Brasil CRI', segment: 'Recebíveis', currentPrice: 90.00, fairPrice: 101.12, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.900, description: 'CRIs NCH Brasil.', dailyChange: 0.0 },
  { symbol: 'NVHO11', name: 'Novo Horizonte CRI', segment: 'Recebíveis', currentPrice: 9.40, fairPrice: 10.56, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.098, description: 'FII de recebíveis Novo Horizonte.', dailyChange: 0.0 },
  { symbol: 'PORD11', name: 'Polo Recebíveis', segment: 'Recebíveis', currentPrice: 99.00, fairPrice: 111.24, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.990, description: 'CRIs diversificados Polo Capital.', dailyChange: 0.0 },
  { symbol: 'RBVO11', name: 'RBR Value One CRI', segment: 'Recebíveis', currentPrice: 86.00, fairPrice: 96.63, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.860, description: 'CRIs high grade RBR.', dailyChange: 0.0 },
  { symbol: 'RECR11', name: 'REC Recebíveis Imobiliários', segment: 'Recebíveis', currentPrice: 93.00, fairPrice: 104.49, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.930, description: 'CRIs de alta qualidade REC.', dailyChange: 0.0 },
  { symbol: 'SCCI11', name: 'Safra CCI Imobiliário', segment: 'Recebíveis', currentPrice: 90.00, fairPrice: 101.12, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.900, description: 'CRIs diversificados Safra.', dailyChange: 0.0 },
  { symbol: 'SNCI11', name: 'Suno CRI Imobiliário', segment: 'Recebíveis', currentPrice: 9.50, fairPrice: 10.67, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.095, description: 'FII de CRIs Suno Research.', dailyChange: 0.0 },
  { symbol: 'VCJR11', name: 'Valora CJR', segment: 'Recebíveis', currentPrice: 97.00, fairPrice: 108.99, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 1.010, description: 'CRIs high yield Valora.', dailyChange: 0.0 },
  { symbol: 'XPCI11', name: 'XP Crédito Imobiliário', segment: 'Recebíveis', currentPrice: 9.00, fairPrice: 10.11, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 4M/dia', lastDividend: 0.090, description: 'CRIs high grade XP.', dailyChange: 0.0 },
  { symbol: 'RBRX11', name: 'RBR Recebíveis X', segment: 'Recebíveis', currentPrice: 93.00, fairPrice: 104.49, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.930, description: 'Portfólio de CRIs RBR.', dailyChange: 0.0 },
  { symbol: 'BPFF11', name: 'BTG Pactual Fundo de Papel', segment: 'Recebíveis', currentPrice: 8.50, fairPrice: 9.55, p_vp: 0.89, dy: 11.0, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.078, description: 'FII de papel BTG Pactual.', dailyChange: 0.0 },
  { symbol: 'IFRA11', name: 'Iridium Infra Debentures', segment: 'Recebíveis', currentPrice: 9.80, fairPrice: 11.01, p_vp: 0.89, dy: 11.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.094, description: 'FI-Infra debentures de infraestrutura.', dailyChange: 0.0 },
  { symbol: 'CPIF11', name: 'Capitânia Infra CRI', segment: 'Recebíveis', currentPrice: 93.00, fairPrice: 104.49, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.930, description: 'Debentures de infraestrutura Capitânia.', dailyChange: 0.0 },
  { symbol: 'NRRE11', name: 'Neo RE CRI', segment: 'Recebíveis', currentPrice: 9.50, fairPrice: 10.67, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.099, description: 'CRIs diversificados Neo.', dailyChange: 0.0 },
  { symbol: 'VGBL11', name: 'Vinci BL CRI', segment: 'Recebíveis', currentPrice: 9.80, fairPrice: 11.01, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.098, description: 'CRIs Vinci Gestão.', dailyChange: 0.0 },
  { symbol: 'EARN11', name: 'Earnest Recebíveis', segment: 'Recebíveis', currentPrice: 9.40, fairPrice: 10.56, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.098, description: 'FII de CRIs Earnest.', dailyChange: 0.0 },
  { symbol: 'MAXR11', name: 'Max Renda CRI', segment: 'Recebíveis', currentPrice: 9.50, fairPrice: 10.67, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.095, description: 'FII de recebíveis Max.', dailyChange: 0.0 },
  { symbol: 'FARO11', name: 'Faro Recebíveis', segment: 'Recebíveis', currentPrice: 8.90, fairPrice: 10.00, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.089, description: 'CRIs diversificados Faro Capital.', dailyChange: 0.0 },
  { symbol: 'LGIM11', name: 'LG Imóveis CRI', segment: 'Recebíveis', currentPrice: 8.90, fairPrice: 10.00, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.089, description: 'FII de recebíveis LG.', dailyChange: 0.0 },
  { symbol: 'BZLI11', name: 'Braz Invest CRI', segment: 'Recebíveis', currentPrice: 9.20, fairPrice: 10.34, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.092, description: 'FII de CRIs Braz Invest.', dailyChange: 0.0 },
  { symbol: 'SNCE11', name: 'Suno CE CRI', segment: 'Recebíveis', currentPrice: 9.40, fairPrice: 10.56, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.094, description: 'FII de CRIs Suno CE.', dailyChange: 0.0 },
  { symbol: 'FIGS11', name: 'Fig Street CRI', segment: 'Recebíveis', currentPrice: 8.80, fairPrice: 9.89, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.088, description: 'FII de recebíveis Fig Street.', dailyChange: 0.0 },
  { symbol: 'HCRI11', name: 'HC Recebíveis', segment: 'Recebíveis', currentPrice: 9.30, fairPrice: 10.45, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.093, description: 'FII de CRIs HC.', dailyChange: 0.0 },
  { symbol: 'LAQC11', name: 'Laqua Capital CRI', segment: 'Recebíveis', currentPrice: 9.70, fairPrice: 10.90, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.101, description: 'CRIs diversificados Laqua.', dailyChange: 0.0 },
  { symbol: 'PTBL11', name: 'Patria BL CRI', segment: 'Recebíveis', currentPrice: 9.60, fairPrice: 10.79, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.096, description: 'FII de CRIs Pátria.', dailyChange: 0.0 },
  { symbol: 'PLRI11', name: 'Plural Renda Imobiliária CRI', segment: 'Recebíveis', currentPrice: 9.70, fairPrice: 10.90, p_vp: 0.89, dy: 12.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.101, description: 'FII de recebíveis Plural.', dailyChange: 0.0 },
  { symbol: 'RBRY11', name: 'RBR Yield CRI', segment: 'Recebíveis', currentPrice: 9.30, fairPrice: 10.45, p_vp: 0.89, dy: 12.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.093, description: 'CRIs yield RBR.', dailyChange: 0.0 },

  // ─── Lajes Corporativas (15 adicionais) ───────────────────────────────────
  { symbol: 'ALMI11', name: 'Torre Almirante', segment: 'Lajes Corporativas', currentPrice: 13.00, fairPrice: 16.92, p_vp: 0.77, dy: 8.5, vacancy: 25.0, liquidity: 'R$ 1M/dia', lastDividend: 0.092, description: 'Laje corporativa Torre Almirante RJ.', dailyChange: 0.0 },
  { symbol: 'RBCO11', name: 'Rio Bravo Corporate', segment: 'Lajes Corporativas', currentPrice: 62.00, fairPrice: 75.38, p_vp: 0.82, dy: 8.5, vacancy: 15.0, liquidity: 'R$ 2M/dia', lastDividend: 0.439, description: 'Portfólio de lajes corporativas Rio Bravo.', dailyChange: 0.0 },
  { symbol: 'RNGO11', name: 'Rio Negro Corp', segment: 'Lajes Corporativas', currentPrice: 60.00, fairPrice: 73.85, p_vp: 0.81, dy: 9.0, vacancy: 14.0, liquidity: 'R$ 2M/dia', lastDividend: 0.450, description: 'Edifício Rio Negro Corporate.', dailyChange: 0.0 },
  { symbol: 'HGRE11', name: 'CSHG Real Estate', segment: 'Lajes Corporativas', currentPrice: 108.00, fairPrice: 133.85, p_vp: 0.81, dy: 9.0, vacancy: 12.0, liquidity: 'R$ 6M/dia', lastDividend: 0.810, description: 'Portfólio de lajes CSHG.', dailyChange: 0.0 },
  { symbol: 'HGPO11', name: 'CSHG Prime Offices', segment: 'Lajes Corporativas', currentPrice: 113.00, fairPrice: 139.23, p_vp: 0.81, dy: 9.0, vacancy: 10.0, liquidity: 'R$ 3M/dia', lastDividend: 0.848, description: 'Prime offices CSHG.', dailyChange: 0.0 },
  { symbol: 'ONEF11', name: 'One Properties Corp', segment: 'Lajes Corporativas', currentPrice: 100.00, fairPrice: 122.31, p_vp: 0.82, dy: 9.0, vacancy: 12.0, liquidity: 'R$ 2M/dia', lastDividend: 0.750, description: 'FII de escritórios One Properties.', dailyChange: 0.0 },
  { symbol: 'WTOR11', name: 'W-Torre Properties', segment: 'Lajes Corporativas', currentPrice: 78.00, fairPrice: 95.38, p_vp: 0.82, dy: 9.0, vacancy: 15.0, liquidity: 'R$ 2M/dia', lastDividend: 0.585, description: 'FII W-Torre lajes corporativas.', dailyChange: 0.0 },
  { symbol: 'EDGA11', name: 'Edgard Corporate', segment: 'Lajes Corporativas', currentPrice: 6.00, fairPrice: 7.38, p_vp: 0.81, dy: 9.0, vacancy: 30.0, liquidity: 'R$ 1M/dia', lastDividend: 0.045, description: 'Laje corporativa Edgard.', dailyChange: 0.0 },
  { symbol: 'GTWR11', name: 'Grand Tower Corporate', segment: 'Lajes Corporativas', currentPrice: 81.00, fairPrice: 99.69, p_vp: 0.81, dy: 9.0, vacancy: 12.0, liquidity: 'R$ 2M/dia', lastDividend: 0.608, description: 'FII Grand Tower escritórios.', dailyChange: 0.0 },
  { symbol: 'JRDM11', name: 'JRD Monções', segment: 'Lajes Corporativas', currentPrice: 9.30, fairPrice: 11.42, p_vp: 0.81, dy: 9.0, vacancy: 15.0, liquidity: 'R$ 1M/dia', lastDividend: 0.070, description: 'FII de lajes corporativas JRD.', dailyChange: 0.0 },
  { symbol: 'DRIT11', name: 'Domo Renda Imobiliária', segment: 'Lajes Corporativas', currentPrice: 9.50, fairPrice: 11.15, p_vp: 0.85, dy: 8.5, vacancy: 18.0, liquidity: 'R$ 1M/dia', lastDividend: 0.067, description: 'Lajes corporativas Domo.', dailyChange: 0.0 },
  { symbol: 'RSPD11', name: 'RSP Desenvolvimento', segment: 'Lajes Corporativas', currentPrice: 9.00, fairPrice: 11.08, p_vp: 0.81, dy: 9.0, vacancy: 20.0, liquidity: 'R$ 1M/dia', lastDividend: 0.068, description: 'FII de desenvolvimento corporativo.', dailyChange: 0.0 },
  { symbol: 'SAIC11', name: 'SAI Corporate', segment: 'Lajes Corporativas', currentPrice: 9.00, fairPrice: 11.08, p_vp: 0.81, dy: 9.0, vacancy: 18.0, liquidity: 'R$ 1M/dia', lastDividend: 0.068, description: 'Lajes corporativas SAI.', dailyChange: 0.0 },
  { symbol: 'BLCP11', name: 'BlueMacaw Corporate', segment: 'Lajes Corporativas', currentPrice: 8.50, fairPrice: 10.54, p_vp: 0.81, dy: 9.5, vacancy: 20.0, liquidity: 'R$ 1M/dia', lastDividend: 0.067, description: 'Lajes corporativas BlueMacaw.', dailyChange: 0.0 },
  { symbol: 'TRIG11', name: 'Trigono Corporate', segment: 'Lajes Corporativas', currentPrice: 9.60, fairPrice: 11.08, p_vp: 0.87, dy: 8.5, vacancy: 17.0, liquidity: 'R$ 1M/dia', lastDividend: 0.068, description: 'Escritórios corporativos Trigono.', dailyChange: 0.0 },

  // ─── Híbrido (14 adicionais) ──────────────────────────────────────────────
  { symbol: 'BTHF11', name: 'BTG Hybrid FOF', segment: 'Híbrido', currentPrice: 87.00, fairPrice: 101.54, p_vp: 0.86, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.761, description: 'Fundo de fundos imobiliários BTG.', dailyChange: 0.0 },
  { symbol: 'HGFF11', name: 'CSHG Fundo de Fundos', segment: 'Híbrido', currentPrice: 8.00, fairPrice: 9.54, p_vp: 0.84, dy: 11.0, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.073, description: 'FOF imobiliário CSHG diversificado.', dailyChange: 0.0 },
  { symbol: 'ITIP11', name: 'Itaú FOF Imobiliário', segment: 'Híbrido', currentPrice: 87.00, fairPrice: 103.85, p_vp: 0.84, dy: 11.0, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.798, description: 'Fundo de fundos Itaú.', dailyChange: 0.0 },
  { symbol: 'KFOF11', name: 'Kinea Fundo de Fundos', segment: 'Híbrido', currentPrice: 8.20, fairPrice: 9.54, p_vp: 0.86, dy: 10.5, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.072, description: 'FOF imobiliário Kinea.', dailyChange: 0.0 },
  { symbol: 'RBFF11', name: 'RBR FOF', segment: 'Híbrido', currentPrice: 70.00, fairPrice: 81.54, p_vp: 0.86, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.613, description: 'Fundo de fundos imobiliários RBR.', dailyChange: 0.0 },
  { symbol: 'XPFF11', name: 'XP Fundo de Fundos', segment: 'Híbrido', currentPrice: 7.80, fairPrice: 9.00, p_vp: 0.87, dy: 10.0, vacancy: 0, liquidity: 'R$ 3M/dia', lastDividend: 0.065, description: 'FOF imobiliário XP Investimentos.', dailyChange: 0.0 },
  { symbol: 'VGHF11', name: 'Vinci Hedge Fund', segment: 'Híbrido', currentPrice: 9.20, fairPrice: 10.62, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.081, description: 'Hedge fund imobiliário Vinci.', dailyChange: 0.0 },
  { symbol: 'HRDF11', name: 'Hedge RF Diversificado', segment: 'Híbrido', currentPrice: 9.20, fairPrice: 10.62, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.081, description: 'FII híbrido Hedge diversificado.', dailyChange: 0.0 },
  { symbol: 'VGIR11', name: 'Vinci IR Imobiliário', segment: 'Híbrido', currentPrice: 9.60, fairPrice: 11.08, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 2M/dia', lastDividend: 0.084, description: 'FII híbrido Vinci IR.', dailyChange: 0.0 },
  { symbol: 'SCPF11', name: 'SC Properties FOF', segment: 'Híbrido', currentPrice: 9.40, fairPrice: 10.85, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.082, description: 'FOF imobiliário SC Properties.', dailyChange: 0.0 },
  { symbol: 'URBA11', name: 'Urban FII', segment: 'Híbrido', currentPrice: 9.00, fairPrice: 10.38, p_vp: 0.87, dy: 10.5, vacancy: 5.0, liquidity: 'R$ 1M/dia', lastDividend: 0.079, description: 'FII híbrido urbano.', dailyChange: 0.0 },
  { symbol: 'TRXB11', name: 'TRX B FII', segment: 'Híbrido', currentPrice: 9.60, fairPrice: 11.08, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.084, description: 'FII híbrido TRX.', dailyChange: 0.0 },
  { symbol: 'BPOD11', name: 'BP Oportunidades Diversificadas', segment: 'Híbrido', currentPrice: 9.20, fairPrice: 10.62, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.081, description: 'FII híbrido BP.', dailyChange: 0.0 },
  { symbol: 'PABY11', name: 'Patria By FII', segment: 'Híbrido', currentPrice: 9.50, fairPrice: 10.96, p_vp: 0.87, dy: 10.5, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.083, description: 'FII híbrido Pátria.', dailyChange: 0.0 },

  // ─── Fiagro (14 adicionais) ───────────────────────────────────────────────
  { symbol: 'CACR11', name: 'Capitânia Agro CRI', segment: 'Fiagro', currentPrice: 9.20, fairPrice: 10.00, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.084, description: 'Fiagro de CRAs Capitânia.', dailyChange: 0.0 },
  { symbol: 'TRVC11', name: 'Triacon Agro', segment: 'Fiagro', currentPrice: 10.00, fairPrice: 10.87, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.092, description: 'Fiagro diversificado Triacon.', dailyChange: 0.0 },
  { symbol: 'VGIA11', name: 'Vinci Agro', segment: 'Fiagro', currentPrice: 9.70, fairPrice: 10.54, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.089, description: 'Fiagro Vinci Gestão.', dailyChange: 0.0 },
  { symbol: 'ZAAD11', name: 'Zaad Agro Fiagro', segment: 'Fiagro', currentPrice: 9.80, fairPrice: 10.65, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.090, description: 'Fiagro Zaad.', dailyChange: 0.0 },
  { symbol: 'HRAA11', name: 'Hora Agro', segment: 'Fiagro', currentPrice: 9.50, fairPrice: 10.33, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.087, description: 'Fiagro de recebíveis agroindustriais.', dailyChange: 0.0 },
  { symbol: 'MARO11', name: 'Maraú Agro', segment: 'Fiagro', currentPrice: 9.80, fairPrice: 10.65, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.090, description: 'Fiagro Maraú.', dailyChange: 0.0 },
  { symbol: 'OPTR11', name: 'Optimus Agro', segment: 'Fiagro', currentPrice: 9.60, fairPrice: 10.43, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.088, description: 'Fiagro Optimus.', dailyChange: 0.0 },
  { symbol: 'RFOF11', name: 'Rural FOF Fiagro', segment: 'Fiagro', currentPrice: 9.40, fairPrice: 10.22, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.086, description: 'FOF de Fiagros.', dailyChange: 0.0 },
  { symbol: 'ABAG11', name: 'AB Agro Fiagro', segment: 'Fiagro', currentPrice: 9.60, fairPrice: 10.43, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.088, description: 'Fiagro AB.', dailyChange: 0.0 },
  { symbol: 'FPAG11', name: 'FPA Agro Fiagro', segment: 'Fiagro', currentPrice: 9.80, fairPrice: 10.65, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.090, description: 'Fiagro FPA.', dailyChange: 0.0 },
  { symbol: 'GARE11', name: 'Garoupa Agro', segment: 'Fiagro', currentPrice: 9.80, fairPrice: 10.65, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.090, description: 'Fiagro Garoupa.', dailyChange: 0.0 },
  { symbol: 'CPAG11', name: 'CP Agro Fiagro', segment: 'Fiagro', currentPrice: 9.70, fairPrice: 10.54, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.089, description: 'Fiagro CP Agro.', dailyChange: 0.0 },
  { symbol: 'RZAG11', name: 'Riza Agro Fiagro', segment: 'Fiagro', currentPrice: 9.50, fairPrice: 10.33, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.087, description: 'Fiagro Riza Gestora.', dailyChange: 0.0 },
  { symbol: 'AGCX11', name: 'AG CX Fiagro', segment: 'Fiagro', currentPrice: 9.60, fairPrice: 10.43, p_vp: 0.92, dy: 11.0, vacancy: 0, liquidity: 'R$ 1M/dia', lastDividend: 0.088, description: 'Fiagro AG CX.', dailyChange: 0.0 }
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Brain, 
  Sparkles, 
  Database, 
  FolderOpen, 
  Workflow, 
  Globe, 
  Play, 
  Check, 
  Copy, 
  RotateCcw, 
  TrendingUp, 
  Terminal, 
  ArrowRight, 
  FileText, 
  Layers, 
  Lock,
  ChevronRight,
  Info,
  Sliders,
  Scale,
  Percent,
  ArrowUpRight,
  Plus,
  Search,
  Github,
  Upload,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FiiMetric } from '../types';

interface AgentesIAViewProps {
  fiis?: FiiMetric[];
  initialSymbol?: string;
}

type AgentType = 'model_builder' | 'earnings_reviewer' | 'market_researcher' | 'morning_note';

interface MCPConnector {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'online' | 'offline' | 'linked';
  isConfigurable: boolean;
}

export default function AgentesIAView({ fiis = [], initialSymbol }: AgentesIAViewProps) {
  // Available target assets
  const availableFIIs = fiis.length > 0 ? fiis : [
    { symbol: 'HGLG11', name: 'CSHG Logística', segment: 'Logística', currentPrice: 161.42, fairPrice: 168.50, p_vp: 1.02, dy: 9.32, vacancy: 2.1, liquidity: '8.4M', lastDividend: 1.10, description: 'Fundo líder em galpões triple-A' },
    { symbol: 'MXRF11', name: 'Maxi Renda', segment: 'Recebíveis', currentPrice: 9.82, fairPrice: 10.15, p_vp: 1.01, dy: 12.4, vacancy: 0.0, liquidity: '14.2M', lastDividend: 0.10, description: 'O maior FII de papel da bolsa' },
    { symbol: 'XPML11', name: 'XP Malls', segment: 'Shoppings', currentPrice: 115.40, fairPrice: 122.00, p_vp: 1.03, dy: 8.90, vacancy: 1.2, liquidity: '6.8M', lastDividend: 0.92, description: 'Fundo com foco em shopping centers Triple A' },
    { symbol: 'BTLG11', name: 'BTG Pactual Logística', segment: 'Logística', currentPrice: 102.50, fairPrice: 109.00, p_vp: 0.99, dy: 9.15, vacancy: 1.8, liquidity: '7.2M', lastDividend: 0.78, description: 'Excelente portfólio de galpões industriais' },
    { symbol: 'KNRI11', name: 'Kinea Renda Imobiliária', segment: 'Híbrido', currentPrice: 156.20, fairPrice: 165.00, p_vp: 0.98, dy: 8.85, vacancy: 3.5, liquidity: '4.5M', lastDividend: 1.00, description: 'Híbrido corporativo/galpões de excelente rating' }
  ];

  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialSymbol || 'HGLG11');
  const [activeAgent, setActiveAgent] = useState<AgentType>('model_builder');
  const [promptMaster, setPromptMaster] = useState<string>('');
  const [activeWorkflow, setActiveWorkflow] = useState<'fii_spread' | 'earnings' | 'rebalance' | null>(null);
  const [ntnbRate, setNtnbRate] = useState<number>(6.35);
  const [contributionAmount, setContributionAmount] = useState<number>(5000);
  
  // Simulated Claude Cowork & Marketplace states
  const [activeTab, setActiveTab] = useState<'agents_operations' | 'cowork_marketplace'>('agents_operations');
  const [coworkModeActive, setCoworkModeActive] = useState<boolean>(true); // Mode "Cowork" in Desktop app
  const [githubUrlInput, setGithubUrlInput] = useState<string>('https://github.com/anthropics/financial-services');
  const [isMarketplaceLinked, setIsMarketplaceLinked] = useState<boolean>(true); // Linked by default to show immediate value
  const [installedPlugins, setInstalledPlugins] = useState<Record<string, boolean>>({
    'analysis_core': true,
    'equity_research': true,
    'wealth_mgmt': true,
    'data_connectors': true,
  });
  const [mcpConnectors, setMcpConnectors] = useState<MCPConnector[]>([
    { id: 'factset', name: 'MCP Bloomberg / FactSet', description: 'Puxa cotações em tempo real e indicadores fundamentais diretamente da B3 via APIs.', icon: Database, status: 'online', isConfigurable: true },
    { id: 'drive', name: 'MCP CVM Docs / Drive', description: 'Garante o indexamento de relatórios gerenciais estruturados, PDFs de atas trimestrais e estatísticas oficiais da CVM.', icon: FolderOpen, status: 'linked', isConfigurable: true },
    { id: 'thinking', name: 'Sequential Thinking Core', description: 'Módulo interno da Anthropic que encadeia pensamentos hipotéticos e valida premissas lógicas antes de entregar dados.', icon: Workflow, status: 'online', isConfigurable: false },
    { id: 'web', name: 'MCP Fetch Web Search', description: 'Rastreia portais financeiros, comunicados de fatos relevantes recentes e indexa notícias macroeconômicas.', icon: Globe, status: 'online', isConfigurable: true }
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Simulated PDF, Excel, and CSV Drag & Drop and Slash command state vectors
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string }>>([
    { name: 'HGLG11_Relatorio_Trimestral.pdf', size: '2.4 MB', type: 'application/pdf' } // Pre-loaded for immediate demonstration of the indexed workspace!
  ]);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const simulateFileUpload = (fileName: string, size: string) => {
    // If already exists, delete/toggle it
    if (uploadedFiles.some(f => f.name === fileName)) {
      setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
      return;
    }
    setUploadingFileName(fileName);
    setUploadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        
        let fileType = 'application/pdf';
        const lowerName = fileName.toLowerCase();
        if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
          fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        } else if (lowerName.endsWith('.csv')) {
          fileType = 'text/csv';
        } else if (lowerName.endsWith('.json')) {
          fileType = 'application/json';
        } else if (lowerName.endsWith('.txt')) {
          fileType = 'text/plain';
        }

        setUploadedFiles(prev => [...prev, { name: fileName, size, type: fileType }]);
        setUploadingFileName(null);
        setUploadProgress(0);
        
        // Auto-populate relevant slash commands depending on document category
        const isSpreadsheet = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv') || lowerName.endsWith('.json');
        if (isSpreadsheet) {
          const command = `/rebalance otimize a distribuição aporte de R$ ${contributionAmount.toFixed(2)} importando a planilha de ativos "${fileName}" e calculando pesos dinâmicos com base em P/VP.`;
          setPromptMaster(command);
          setActiveAgent('market_researcher'); // Select Market Researcher / Wealth Manager
          
          // Auto link/install relevant plugin
          setInstalledPlugins(prev => ({
            ...prev,
            'wealth_mgmt': true,
          }));
        } else {
          const command = `/earnings analise os pontos de estresse do arquivo "${fileName}" e monte a tabela de múltiplos comparativos com os pares do setor.`;
          setPromptMaster(command);
          setActiveAgent('earnings_reviewer'); // Select Earnings agent
          
          // Auto link/install relevant plugin
          setInstalledPlugins(prev => ({
            ...prev,
            'equity_research': true,
          }));
        }
      } else {
        setUploadProgress(progress);
      }
    }, 100);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const name = file.name;
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      simulateFileUpload(name, sizeStr);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = file.name;
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      simulateFileUpload(name, sizeStr);
    }
  };

  const getSlashCommandOutput = (symbol: string, commandText: string) => {
    const f = availableFIIs.find(x => x.symbol === symbol) || availableFIIs[0];
    const lastFile = uploadedFiles.length > 0 ? uploadedFiles[uploadedFiles.length - 1] : null;
    const fileUsedName = lastFile ? lastFile.name : "HGLG11_Relatorio_Trimestral.pdf";
    const lowerName = fileUsedName.toLowerCase();
    const isSpreadsheet = lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv') || lowerName.endsWith('.json') || lowerName.endsWith('.txt');

    if (isSpreadsheet) {
      // Mock portfolio items imported from the user's spreadsheet or statement
      const portfolioItems = [
        { symbol: 'HGLG11', name: 'CSHG Logística', qty: 150, avgCost: 158.20, curPrice: 161.42, dy: 9.32, p_vp: 1.02, segment: 'Logística' },
        { symbol: 'XPML11', name: 'XP Malls', qty: 85, avgCost: 112.50, curPrice: 115.40, dy: 8.90, p_vp: 1.03, segment: 'Shoppings' },
        { symbol: 'MXRF11', name: 'Maxi Renda', qty: 500, avgCost: 9.70, curPrice: 9.82, dy: 12.40, p_vp: 1.01, segment: 'Recebíveis' },
        { symbol: 'KNRI11', name: 'Kinea Renda', qty: 65, avgCost: 159.00, curPrice: 156.20, dy: 8.85, p_vp: 0.98, segment: 'Híbrido' }
      ];

      // Computes spreadsheet data on the fly
      const totalCost = portfolioItems.reduce((acc, item) => acc + (item.qty * item.avgCost), 0);
      const totalCurrentValue = portfolioItems.reduce((acc, item) => acc + (item.qty * item.curPrice), 0);
      const totalGain = totalCurrentValue - totalCost;
      const totalGainPct = (totalGain / totalCost) * 100;

      // Recommended weights using contributionAmount state (default is 5000)
      const hglgAlloc = contributionAmount * 0.40;
      const xpmlAlloc = contributionAmount * 0.35;
      const knriAlloc = contributionAmount * 0.25;

      return (
        <div className="space-y-6 font-sans text-slate-350 text-sm leading-relaxed" id="slash-command-report">
          
          {/* Command indicator status banner for Excel/CSV */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left font-sans">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-0.5 rounded font-mono uppercase">
                  Mapeador /rebalance de Extrato Acoplado
                </span>
                <span className="text-[9.5px] bg-slate-950 border border-slate-850 text-emerald-300 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                  📊 {fileUsedName}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                O Cloud Workspace processou as colunas e células do arquivo. Foram identificados 4 tickers de FIIs e os custos de aquisição reconciliados.
              </p>
            </div>
            <span className="text-[9.5px] text-emerald-400 font-mono shrink-0">
              * Conector de Planilhas via MCP Ativo
            </span>
          </div>

          {/* Table display */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-sans leading-none">
                <span className="w-1.5 h-3.5 bg-emerald-500 rounded-sm"></span>
                1. Custódia Extraída da Planilha
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Mapeamento Efetuado em Tempo Real
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950">
              <table className="w-full text-xs font-sans text-slate-350 border-collapse">
                <thead>
                  <tr className="bg-[#020617] text-slate-450 border-b border-slate-850">
                    <th className="py-2.5 px-3 text-left font-black tracking-wider uppercase">Fundo Imobiliário</th>
                    <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">Cotas</th>
                    <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">Custo Médio</th>
                    <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">Cotação Spot</th>
                    <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">Total Custódia</th>
                    <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">P/VP Spot</th>
                    <th className="py-2.5 px-3 text-right font-black tracking-wider uppercase font-mono">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioItems.map((item) => {
                    const diff = item.curPrice - item.avgCost;
                    const diffPct = (diff / item.avgCost) * 100;
                    const currentValue = item.qty * item.curPrice;
                    return (
                      <tr key={item.symbol} className="border-b border-slate-850/60 hover:bg-[#1e293b]/10">
                        <td className="py-3 px-3 text-left font-mono font-bold text-white flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-emerald-500 rounded-sm"></span>
                          {item.symbol}
                          <span className="text-[9px] text-slate-500 font-sans font-normal">({item.name})</span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono">{item.qty}</td>
                        <td className="py-3 px-3 text-center font-mono font-medium">R$ {item.avgCost.toFixed(2)}</td>
                        <td className="py-3 px-3 text-center font-mono text-zinc-100">R$ {item.curPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-center font-mono text-emerald-400 font-semibold">
                          R$ {currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">{item.p_vp.toFixed(2)}x</td>
                        <td className="py-3 px-3 text-right font-mono">
                          {diff >= 0 ? (
                            <span className="text-emerald-400 font-bold">+{diffPct.toFixed(1)}%</span>
                          ) : (
                            <span className="text-rose-450 font-bold">{diffPct.toFixed(1)}%</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-950 font-bold border-t border-slate-880">
                    <td className="py-3 px-3 text-left font-sans text-slate-300">TOTAL CONSOLIDADO</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">-</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">-</td>
                    <td className="py-3 px-3 text-center font-mono text-white">R$ {totalCurrentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">-</td>
                    <td className="py-3 px-3 text-right font-mono">
                      {totalGain >= 0 ? (
                        <span className="text-emerald-400">+{totalGainPct.toFixed(1)}% (+R$ {totalGain.toLocaleString('pt-BR', { maximumFractionDigits: 0 })})</span>
                      ) : (
                        <span className="text-rose-440">{totalGainPct.toFixed(1)}% (R$ {totalGain.toLocaleString('pt-BR', { maximumFractionDigits: 0 })})</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Allocation block */}
          <div className="space-y-3 pt-2 text-left font-sans">
            <h4 className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <span className="w-1.5 h-3.5 bg-sky-500 rounded-sm"></span>
              2. Proposta de Distribuição de Aporte Sênior (Aporte de R$ {contributionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              O algoritmo do plugin de Wealth Management cruzou as métricas de valuation e P/VP para sugerir onde colocar os novos recursos sem expor o investidor a sobrepreços:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="p-3.5 rounded-xl border border-sky-500/15 bg-sky-500/5 space-y-1.5">
                <div className="text-xs font-bold text-sky-400 uppercase">HGLG11 (Logística) - 40%</div>
                <div className="text-lg font-black text-white font-mono">R$ {hglgAlloc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Sugerido aporte de <strong>{Math.floor(hglgAlloc / 161.42)} cotas</strong>. Reforça o portfólio de ativos logísticos defensivos altamente rentáveis e com inquilinos premium.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-500/15 bg-purple-500/5 space-y-1.5">
                <div className="text-xs font-bold text-[#a78bfa] uppercase">XPML11 (Shoppings) - 35%</div>
                <div className="text-lg font-black text-white font-mono">R$ {xpmlAlloc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Sugerido aporte de <strong>{Math.floor(xpmlAlloc / 115.40)} cotas</strong>. Tese voltada ao crescimento real de aluguéis e faturamento recorde em shoppings regionais de alta renda.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 uppercase">KNRI11 (Híbrido) - 25%</div>
                <div className="text-lg font-black text-white font-mono">R$ {knriAlloc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <p className="text-[11px] text-slate-400 leading-normal font-sans">
                  Sugerido aporte de <strong>{Math.floor(knriAlloc / 156.20)} cotas</strong>. Aproveita desconto técnico contra o valor patrimonial com IPCA + yield constante de proventos.
                </p>
              </div>
            </div>
          </div>

          {/* Final overview banner */}
          <div className="bg-[#020617]/50 p-4 rounded-xl border border-slate-850 text-left font-sans">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-emerald-400">Análise de Rebalanceamento CNPI:</strong> O reajuste do portfólio baseado na planilha importada eleva o rendimento potencial consolidado para <strong>9.73% aa.</strong> com excelente margem de segurança. Ativos com vacância no segmento ou P/VP desregulado tiveram aportes temporariamente travados pelo algoritmo regulatório.
            </p>
          </div>

        </div>
      );
    }

    const segmentPeers = availableFIIs.filter(x => x.segment === f.segment && x.symbol !== f.symbol);
    const otherPeers = availableFIIs.filter(x => x.symbol !== f.symbol).slice(0, 2);
    const peersList = segmentPeers.length > 0 ? [f, ...segmentPeers] : [f, ...otherPeers];

    return (
      <div className="space-y-6 font-sans text-slate-350 text-sm leading-relaxed" id="slash-command-report">
        
        {/* Command indicator status banner */}
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-xl border border-[#c084fc]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1 text-left font-sans">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black tracking-widest bg-purple-500/15 text-purple-400 border border-purple-500/25 px-2.5 py-0.5 rounded font-mono uppercase">
                Análise com IA Ativada (/earnings)
              </span>
              <span className="text-[9.5px] bg-slate-950 border border-slate-850 text-slate-300 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                📄 {fileUsedName}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 ledading-normal">
              O Claude Desktop processou o texto do PDF e aplicou filtros de risco setoriais do mercado de FII brasileiro.
            </p>
          </div>
          <span className="text-[9.5px] text-purple-400 font-mono shrink-0">
            * 4 plugins cognitivos ativos via GitHub
          </span>
        </div>

        {/* Dynamic Stress Points block */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-sans leading-none text-left">
            <span className="w-1.5 h-3.5 bg-rose-550 rounded-sm"></span>
            1. Pontos de Estresse Identificados no Relatório do Ativo
          </h4>
          <p className="text-xs leading-relaxed text-slate-400 text-left font-sans">
            Após decodificar o documento gerencial, o algoritmo de Sequential Thinking identificou 3 zonas críticas que merecem atenção na tese de dividendos de <strong>{f.symbol}</strong>:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 font-sans">
            
            <div className="p-3.5 rounded-xl border border-rose-500/15 bg-rose-500/5 space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase leading-none">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                Vacância Excedente
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                A vacância física do segmento de {f.segment} variou ligeiramente. O ativo reporta {f.vacancy > 0 ? `${f.vacancy}%` : 'zero vacância imediata'}, mas renegociações correntes expõem riscos de vacância transitória no final do semestre.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-500/15 bg-amber-500/5 space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase leading-none">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Indexador Tarifário
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Concentração de 75% dos contratos indexados ao IPCA. Com a desaceleração episódica dos índices de inflação, o carrego nominal e reajuste anual de portfólio sofrerá ligeira compressão.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-sky-500/15 bg-sky-500/5 space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase leading-none">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                Custo de Alavancagem
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-sans">
                Emissão recente sob taxas indexadas ao CDI adiciona pressão financeira marginal de R$ 0.04/cota ao mês. Mitigado por caixa acumulado confortável de relatórios anteriores.
              </p>
            </div>

          </div>
        </div>

        {/* Multiples Comparison Table requested by prompt */}
        <div className="space-y-3 pt-2 font-sans">
          <h4 className="text-xs font-black text-[#a78bfa] uppercase tracking-wider flex items-center gap-1.5 leading-none text-left">
            <span className="w-1.5 h-3.5 bg-purple-550 rounded-sm"></span>
            2. Tabela de Múltiplos Comparativos com os Pares do Setor
          </h4>
          <p className="text-xs leading-relaxed text-slate-400 text-left">
            Comparação sistêmica elaborada automaticamente com dados spot extraídos via conector MCP de cotações para o segmento imobiliário correspondente:
          </p>

          <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950">
            <table className="w-full text-xs font-sans text-slate-350 border-collapse">
              <thead>
                <tr className="bg-[#020617] text-slate-450 border-b border-slate-850">
                  <th className="py-2.5 px-3 text-left font-black tracking-wider uppercase">Fundo Imobiliário</th>
                  <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">P/VP Spot</th>
                  <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">DY Acumulado LTM</th>
                  <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">Preço Alvo CNPI</th>
                  <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase font-mono">Diferencial (Upside)</th>
                  <th className="py-2.5 px-3 text-right font-black tracking-wider uppercase font-mono">Rendimento Médio</th>
                </tr>
              </thead>
              <tbody>
                {peersList.map((peer) => {
                  const upside = ((peer.fairPrice - peer.currentPrice) / peer.currentPrice) * 105 - 100;
                  const isMain = peer.symbol === f.symbol;
                  return (
                    <tr 
                      key={peer.symbol} 
                      className={`border-b border-slate-850/60 hover:bg-[#1e293b]/20 ${
                        isMain ? 'bg-purple-500/5 font-bold text-white border-l-2 border-l-[#a78bfa]' : ''
                      }`}
                    >
                      <td className="py-3 px-3 flex items-center gap-1.5 text-left font-mono">
                        {isMain ? (
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 bg-slate-650 rounded-full"></span>
                        )}
                        {peer.symbol}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium">{peer.p_vp.toFixed(2)}x</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-purple-400">{peer.dy.toFixed(1)}%</td>
                      <td className="py-3 px-3 text-center font-mono text-zinc-100">R$ {peer.fairPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-center font-mono">
                        {upside > 0 ? (
                          <span className="text-emerald-400">+{upside.toFixed(1)}%</span>
                        ) : (
                          <span className="text-rose-450">{upside.toFixed(1)}%</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-100 font-bold">R$ {peer.lastDividend.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Parecer final */}
        <div className="bg-[#020617]/50 p-4 rounded-xl border border-slate-850 text-left font-sans">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-[#a78bfa]">Parecer Analítico Sênior:</strong> O uso conjunto das ferramentas cognitivas via GitHub valida o viés de carregamento de <strong>{f.symbol}</strong> frente a múltiplos históricos. Embora as fragilidades estruturais e pontos de estresse (alavancagem CDI e vencimentos contratuais) adicionem risco marginal à carteira rítmica de proventos, reajustes anuais preservam o dividend yield real robusto próximo de <strong>{f.dy}% ao ano</strong>.
          </p>
        </div>

      </div>
    );
  };

  // Default Prompts configuration matching context & senior CNPI guidelines
  const defaultPrompts: Record<AgentType, string> = {
    model_builder: `Você é o agente "Model Builder", um analista CNPI Sênior focado em modelagem de valuation. Sua tarefa é calcular o preço justo do ativo através do modelo Gordon Growth (DDM) e Fluxo de Caixa Descontado de proventos (Dividend Discount Model), projetando rentabilidade real ajustada à inflação. Empregue conectores MCP Bloomberg para carregar múltiplos históricos e Google Drive para extrair a projeção de rendimentos futuros dos relatórios gerenciais oficiais.`,
    earnings_reviewer: `Você é o agente "Earnings Reviewer". Seu objetivo principal é ler e comparar relatórios trimestrais e atas de teleconferência de resultados históricos. Atualize premissas críticas como taxas de administração médias e vacância física/financeira. Destaque variações no perfil de inquilinos e revise a tese física de contratos típicos/atípicos usando dados estruturados da CVM via MCP Docs.`,
    market_researcher: `Você é o agente "Market Researcher". Suas diretrizes consistem em realizar o escaneamento de mercado setorial (Comps). Compare o ativo com seus principais pares no setor imobiliário com bases em métricas unificadas (P/VP, Dividend Yield acumulado LTM, Alavancagem e Volume de Liquidez Diária). Gere uma planilha analítica comparativa estruturada realçando assimetrias de preço.`,
    morning_note: `Você é o agente "Morning Note Creator". Sua função é contextualizar as últimas oscilações do ativo com o cenário macroeconômico brasileiro (Boletim Focus, taxa de juros SELIC e curvas do IPCA/IGP-M). Faça buscas em portais via MCP Web Fetch para capturar comunicados de fatos relevantes das últimas 48 horas e estruture uma cobertura matinal executiva.`
  };

  // Reset or update promptMaster when Agent moves, or selected symbol moves
  useEffect(() => {
    const defaultTemplate = defaultPrompts[activeAgent];
    const asset = availableFIIs.find(f => f.symbol === selectedSymbol) || availableFIIs[0];
    const customized = defaultTemplate.replace('do ativo', `de ${asset.symbol} (${asset.name})`);
    
    // Guard: Prevent overwriting manually pasted slash commands!
    if (!promptMaster.trim().startsWith('/')) {
      setPromptMaster(customized);
    }
  }, [activeAgent, selectedSymbol]);

  // Handle preset selector click (Sync trigger)
  useEffect(() => {
    if (initialSymbol && availableFIIs.some(f => f.symbol === initialSymbol)) {
      setSelectedSymbol(initialSymbol);
    }
  }, [initialSymbol]);

  const getRequiredPluginForAgent = (agent: AgentType): { id: string; name: string } | null => {
    switch (agent) {
      case 'model_builder':
      case 'morning_note':
        return { id: 'analysis_core', name: 'Financial Analysis (Core)' };
      case 'earnings_reviewer':
        return { id: 'equity_research', name: 'Equity Research' };
      case 'market_researcher':
        return { id: 'wealth_mgmt', name: 'Wealth Management' };
      default: return null;
    }
  };

  const getRequiredPluginForWorkflow = (wk: 'fii_spread' | 'earnings' | 'rebalance' | null): { id: string; name: string } | null => {
    if (!wk) return null;
    switch (wk) {
      case 'fii_spread': return { id: 'analysis_core', name: 'Financial Analysis (Core)' };
      case 'earnings': return { id: 'equity_research', name: 'Equity Research' };
      case 'rebalance': return { id: 'wealth_mgmt', name: 'Wealth Management' };
      default: return null;
    }
  };

  const reqPlugin = getRequiredPluginForAgent(activeAgent);
  const isAgentLocked = !!(reqPlugin && !installedPlugins[reqPlugin.id]);

  const reqWkPlugin = getRequiredPluginForWorkflow(activeWorkflow);
  const isWkLocked = !!(reqWkPlugin && !installedPlugins[reqWkPlugin.id]);

  const toggleConnector = (id: string) => {
    setMcpConnectors(prev => prev.map(c => {
      if (c.id === id && c.isConfigurable) {
        return {
          ...c,
          status: c.status === 'online' || c.status === 'linked' ? 'offline' : (id === 'drive' ? 'linked' : 'online')
        };
      }
      return c;
    }));
  };

  const startOrchestration = () => {
    setIsRunning(true);
    setShowResult(false);
    setExecutionStep(1);
    setExecutionLogs([]);

    const asset = availableFIIs.find(f => f.symbol === selectedSymbol) || availableFIIs[0];
    const fileUsedName = uploadedFiles.length > 0 ? uploadedFiles[uploadedFiles.length - 1].name : "Nenhum arquivo";

    const logs = [
      `[MCP CORE] Inicializando handshake com servidor local Claude Desktop... v10.4.2 [OK]`,
      `[CONNECTORS] Resolvendo servidores do protocolo MCP ativos em localhost...`,
      `[STEP 1/4] Ativando ${mcpConnectors.find(c => c.id === 'factset')?.status !== 'offline' ? 'CONECTOR BLOOMBERG (ONLINE)' : 'MÓDULO DE EMULAÇÃO LOCAL'} para capturar dados spot do ativo ${asset.symbol}...`,
      `[DATABASE] Conexão efetuada. Cotação Spot: R$ ${asset.currentPrice.toFixed(2)} | P/VP de ${asset.p_vp}x | Dividend Yield: ${asset.dy}% aa.`,
      uploadedFiles.length > 0 
        ? `[STEP 2/4] Indexando arquivo customizado via MCP Workspace local: "${fileUsedName}"...`
        : `[STEP 2/4] Acessando ${mcpConnectors.find(c => c.id === 'drive')?.status !== 'offline' ? 'CONECTOR GOOGLE DRIVE (LINKED)' : 'SISTEMA INTERNO'} para auditar Relatórios de Informação Periódica CVM...`,
      uploadedFiles.length > 0
        ? `[PDF DECODER] Decodificando tabelas e textos do PDF. Encontradas demonstrações financeiras e estatísticas operacionais de ${asset.symbol}.`
        : `[PDF ANALYZER] Indexados 3 PDFs de relatórios gerenciais prévios. Vacância identificada: ${asset.vacancy}%. Último rendimento pago: R$ ${asset.lastDividend.toFixed(2)} por cota.`,
      `[STEP 3/4] Inicializando Anthropic Sequential Thinking (Raciocínio Encadeado)...`,
      `[THINKING] Hipótese: "Se a SELIC mantiver trajetória de estabilização, o custo de capital para o segmento de ${asset.segment} declina, induzindo compressão de cap rate de saída."`,
      `[THINKING COMMENT] Validando a hipótese comparando à taxa terminal de 8.5% real para ${asset.symbol}. Ajustando margem de segurança...`,
      `[STEP 4/4] Buscando notícias e fatos relevantes em tempo real via ${mcpConnectors.find(c => c.id === 'web')?.status !== 'offline' ? 'MCP FETCH WEB SEARCH' : 'MOCK DE PREGÃO'}...`,
      `[NEWS] Encontrados 2 comunicados recentes sobre a gestão de fluxo de caixa e reajuste inflacionário dos contratos típicos de ${asset.symbol}.`,
      `[COMPLETED] Orquestração finalizada com sucesso pelas ferramentas cognitivas da plataforma em 2.45s!`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setExecutionLogs(prev => [...prev, logs[currentLogIndex]]);
        
        // Progress matching steps
        if (currentLogIndex === 2) setExecutionStep(2);
        if (currentLogIndex === 4) setExecutionStep(3);
        if (currentLogIndex === 6) setExecutionStep(4);
        if (currentLogIndex === 9) setExecutionStep(5);

        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setShowResult(true);
        }, 600);
      }
    }, 450);
  };

  const handleCopyReport = () => {
    setCopied(true);
    const contentText = document.getElementById('report-editorial-content')?.innerText || '';
    navigator.clipboard.writeText(contentText);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAgentHeader = () => {
    switch (activeAgent) {
      case 'model_builder': return { title: 'Model Builder', label: 'Valuation & Projeções de Dividendos', color: 'border-sky-500 text-sky-400 bg-sky-500/5' };
      case 'earnings_reviewer': return { title: 'Earnings Reviewer', label: 'Resenha de Balanços & Transcripts', color: 'border-purple-500 text-purple-400 bg-purple-500/5' };
      case 'market_researcher': return { title: 'Market Researcher', label: 'Análise de Múltiplos Comparativos', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/5' };
      case 'morning_note': return { title: 'Morning Note Creator', label: 'Crawling Informativo Macro', color: 'border-amber-500 text-amber-400 bg-amber-500/5' };
    }
  };

  // Generate customized reports data depending on chosen options
  const activeAsset = availableFIIs.find(f => f.symbol === selectedSymbol) || availableFIIs[0];

  const getValuationModelOutput = (symbol: string) => {
    const f = availableFIIs.find(x => x.symbol === symbol) || availableFIIs[0];
    const riskPremium = 4.2;
    const expectedGrowth = symbol === 'MXRF11' ? 0.5 : 4.5;
    const discountRate = 10.5;
    const isDiscounted = f.currentPrice < f.fairPrice;

    return (
      <div className="space-y-6 font-sans text-slate-300 text-sm leading-relaxed" id="valuation-model">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Cotação Atual</span>
            <span className="text-lg font-black text-white font-mono">R$ {f.currentPrice.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Prêmio de Risco Real</span>
            <span className="text-lg font-black text-sky-400 font-mono">+{riskPremium.toFixed(1)}%</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Taxa Desconto DDM</span>
            <span className="text-lg font-black text-[#a78bfa] font-mono">{discountRate.toFixed(1)}% aa</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Preço Alvo IA</span>
            <span className="text-lg font-black text-emerald-400 font-mono">R$ {f.fairPrice.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
            <span className="w-1.5 h-3 bg-sky-500 rounded-sm"></span>
            Fundamentos de Projeção Multimodelo (DDM + Gordon)
          </h4>
          <p>
            Processando o encadeamento pelo simulador Claude via plugin MCP FactSet, projetamos os dividendos com base nos dividendos históricos acumulados aproximados de <strong>{f.dy}% ao ano (R$ {f.lastDividend.toFixed(2)} por cota pagos em último lote)</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-3 ml-1 text-slate-400">
            <li>Taxa terminal de capitalização de saída estimada: <strong>8.75% aa</strong>.</li>
            <li>Taxa intrínseca de inflação embutida nas renovações de inquilinos: <strong>{expectedGrowth.toFixed(1)}% ao ano</strong>.</li>
            <li>
              Margem de segurança configurada no Prompt Master: <strong className="text-emerald-400">{( (f.fairPrice - f.currentPrice) / f.currentPrice * 100 ).toFixed(1)}%</strong> ({isDiscounted ? 'Desconto Ativo' : 'Prêmio em Relação ao Valor Justo'}).
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-800/80 pt-4">
          <p className="text-slate-400 text-xs italic">
            *Análise emitida por assistente cognitivo financeiro baseado em diretrizes estruturadas de modelos CNPI operacionais do mercado de FII brasileiro.
          </p>
        </div>
      </div>
    );
  };

  const getEarningsReviewOutput = (symbol: string) => {
    const f = availableFIIs.find(x => x.symbol === symbol) || availableFIIs[0];
    
    return (
      <div className="space-y-6 font-sans text-slate-300 text-sm leading-relaxed" id="earnings-review">
        <div className="border border-slate-800/80 bg-slate-900/40 p-4 rounded-xl">
          <h4 className="text-xs font-bold text-white uppercase mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            Premissas Ajustadas via Transcripts Oficiais
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Taxa de Vacância</span>
              <span className="text-white font-mono font-bold">{f.vacancy > 0 ? `${f.vacancy}%` : 'Mínima (0%)'}</span>
              <span className="text-[9px] block text-emerald-400 mt-1 font-mono">Tendência Recuo</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Rendimento Médio LTM</span>
              <span className="text-white font-mono font-bold">R$ {f.lastDividend.toFixed(2)} / cota</span>
              <span className="text-[9px] block text-slate-400 mt-1 font-mono">Estável no Semestre</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Taxa Adm / Gestão</span>
              <span className="text-white font-mono font-bold">0.95% a 1.20%</span>
              <span className="text-[9px] block text-purple-400 mt-1 font-mono">Sob Controle</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
            <span className="w-1.5 h-3 bg-purple-500 rounded-sm"></span>
            Cometários e Análise Qualitativa de Risco
          </h4>
          <p>
            A auditoria inteligente nos informativos periódicos CVM via <strong>MCP local</strong> de relatórios indica uma saúde operacional robusta para o ativo <strong>{f.symbol} ({f.name})</strong>, focado no setor de <strong>{f.segment}</strong>.
          </p>
          <p className="text-slate-400 leading-relaxed text-xs">
            Com as taxas de ocupação física girando perto de <strong>{(100 - f.vacancy).toFixed(1)}%</strong>, as receitas geradas possuem risco de contraparte classificado como AAA/AA, reduzindo riscos de inadimplência severa decorrente de flutuações cíclicas do mercado imobiliário comercial e mantendo o dividendo de longo prazo ancorado.
          </p>
        </div>
      </div>
    );
  };

  const getMarketCompsOutput = (symbol: string) => {
    const f = availableFIIs.find(x => x.symbol === symbol) || availableFIIs[0];
    
    // Filter peers in same segment or adjacent segment
    const peerSegment = f.segment;
    const peers = availableFIIs.filter(x => x.segment === peerSegment || x.symbol !== f.symbol).slice(0, 3);
    const sortedComps = [f, ...peers.filter(p => p.symbol !== f.symbol)].slice(0, 3);

    return (
      <div className="space-y-6 font-sans text-slate-300 text-sm leading-relaxed text-left" id="market-comps">
        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
          <span className="w-1.5 h-3 bg-emerald-500 rounded-sm"></span>
          Escaneamento de Pares de Setor (Comps de {f.segment})
        </h4>

        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/30">
          <table className="w-full text-xs font-sans text-[#cbd5e1] border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-slate-400 border-b border-slate-850">
                <th className="py-2.5 px-3 text-left font-black tracking-wider uppercase">FII Ativo</th>
                <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase">Cotação</th>
                <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase">P/VP</th>
                <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase">DY LTM aa</th>
                <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase">Vacância</th>
                <th className="py-2.5 px-3 text-center font-black tracking-wider uppercase">Liquidez d.</th>
              </tr>
            </thead>
            <tbody>
              {sortedComps.map((comp, idx) => (
                <tr 
                  key={comp.symbol} 
                  className={`border-b border-slate-850/60 hover:bg-[#1e293b]/20 ${comp.symbol === f.symbol ? 'bg-emerald-500/5 font-bold text-white' : ''}`}
                >
                  <td className="py-2.5 px-3 flex items-center gap-1.5 text-left font-mono">
                    {comp.symbol === f.symbol ? (
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                    )}
                    {comp.symbol}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-100 font-bold">R$ {comp.currentPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{comp.p_vp.toFixed(2)}x</td>
                  <td className="py-2.5 px-3 text-center font-mono text-emerald-400">{comp.dy.toFixed(2)}%</td>
                  <td className="py-2.5 px-3 text-center font-mono">{comp.vacancy > 0 ? `${comp.vacancy}%` : '0%'}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-400">R$ {comp.liquidity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-850/80">
          <p className="text-slate-300 text-xs">
            <strong>Parecer Técnico:</strong> O fundo {f.symbol} está transacionando a um P/VP de <strong>{f.p_vp.toFixed(2)}x</strong>. Comparado à média do setor, seu prêmio/desconto reflete a qualidade intrínseca do portfólio físico, apresentando resiliência destacada no volume diário de liquidez de {f.liquidity} na B3.
          </p>
        </div>
      </div>
    );
  };

  const getMorningNoteOutput = (symbol: string) => {
    const f = availableFIIs.find(x => x.symbol === symbol) || availableFIIs[0];
    
    return (
      <div className="space-y-6 font-sans text-slate-300 text-sm leading-relaxed" id="morning-note-output">
        <div className="border-l-2 border-amber-500 pl-4 space-y-2">
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
            Resumo Matinal da Carteira FIIs.IA
          </span>
          <h4 className="text-base font-bold text-white tracking-tight">
            Impacto Macro e Movimentações Corporativas: {f.symbol}
          </h4>
        </div>

        <div className="space-y-3 font-sans">
          <p>
            O Comitê de Política Monetária (COPOM) reiterou a ancoragem da taxa SELIC terminal em patamares conservadores, gerando fluxos benéficos para títulos privados e FIIs de recebíveis/papéis como <strong>MXRF11</strong>, ao passo que garante contratos de locação física seguros para o setor imobiliário industrial (<strong>{f.symbol}</strong>).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200 block text-xs">Aviso CVM Incorporado</span>
              <span className="text-slate-400 text-xs mt-1 block leading-relaxed">
                Reajustes inflacionários baseados no IPCA indicam incremento estimado de 4.2% ao ano no fluxo de dividendos correntes distribuídos mensalmente aos cotistas.
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="font-bold text-slate-200 block text-xs">Diretriz Recomendada</span>
              <span className="text-slate-400 text-xs mt-1 block leading-relaxed">
                Manter posição acumuladora no ativo, aproveitando momentos de ajuste pontual abaixo do valor patrimonial indicado pelo modelo de cap-rate local.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8" id="agentes-ia-workspace">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b]/60 pb-6" id="agentes-ia-header">
        <div>
          <h1 className="text-2xl font-serif font-black italic text-white tracking-tight flex items-center gap-2">
            Análise e Agentes de IA Financeira
            <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-3 py-1 rounded-full font-sans uppercase font-bold tracking-wider animate-pulse">
              Anthropic Platform
            </span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            Orquestre modelos de IA especializados e conecte plugins através do ecossistema do Model Context Protocol (MCP) para FIIs brasileiros.
          </p>
        </div>
        
        {/* Sync Trigger / Back-Button to quick help */}
        <div className="flex gap-2 shrink-0">
          <div className="rounded-xl bg-[#1e293b]/30 border border-slate-800 px-4 py-2 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-mono font-medium text-slate-300">MCP Core v1.4 Ativo</span>
          </div>
        </div>
      </div>

      {/* Claude Cowork & Operational Tabs */}
      <div className="flex border-b border-zinc-800 pb-px mb-6 gap-2 sm:gap-4" id="cowork-tab-selectors">
        <button
          onClick={() => setActiveTab('agents_operations')}
          className={`px-4 py-3 text-xs uppercase font-black tracking-widest transition-all border-b-2 font-sans relative cursor-pointer ${
            activeTab === 'agents_operations'
              ? 'border-sky-500 text-white font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Cpu size={14} className={activeTab === 'agents_operations' ? 'text-sky-400' : 'text-slate-500'} />
            Central de Agentes & Operações
          </div>
        </button>
        <button
          onClick={() => setActiveTab('cowork_marketplace')}
          className={`px-4 py-3 text-xs uppercase font-black tracking-widest transition-all border-b-2 font-sans relative cursor-pointer ${
            activeTab === 'cowork_marketplace'
              ? 'border-sky-400 text-white font-black'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Github size={14} className={activeTab === 'cowork_marketplace' ? 'text-sky-450 animate-pulse' : 'text-slate-500'} />
            Claude Cowork Marketplace
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-400/20 font-mono font-bold tracking-normal hidden sm:inline-block">
              {Object.values(installedPlugins).filter(Boolean).length}/4 ativos
            </span>
          </div>
        </button>
      </div>

      {activeTab === 'agents_operations' ? (
        <>
          {/* Asset Picker Card */}
          <section className="bg-[#070c17] rounded-2xl border border-[#1e293b] p-6 shadow-xl" id="asset-selector-bento">
        <div className="flex items-center gap-2.5 mb-4">
          <Database size={16} className="text-sky-400" />
          <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider font-sans">
            1. Selecione o Fundo Alvo para a Orquestração
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="asset-picker-list">
          {availableFIIs.map((fii) => {
            const isSelected = selectedSymbol === fii.symbol;
            return (
              <button
                key={fii.symbol}
                onClick={() => {
                  if (!isRunning) setSelectedSymbol(fii.symbol);
                }}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer select-none group relative ${
                  isSelected 
                    ? 'bg-[#1e293b] border-sky-500 shadow-md shadow-sky-500/5' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-[#1e293b]/40 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`text-xs font-black font-mono tracking-tight ${isSelected ? 'text-sky-400' : 'text-slate-300 group-hover:text-sky-400'}`}>
                    {fii.symbol}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0f172a] border border-slate-800 text-slate-400 font-sans">
                    {fii.segment}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 line-clamp-1 font-sans">{fii.name}</span>
                <div className="mt-3 flex justify-between items-end border-t border-slate-850 pt-2">
                  <span className="text-[10px] text-slate-500 font-sans">Cot. Spot:</span>
                  <span className="text-xs font-bold text-white font-mono">R$ {fii.currentPrice.toFixed(2)}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Onde a Mágica Acontece: Casos de Uso Práticos (Ações, FIIs e Aportes) */}
      <section className="bg-gradient-to-br from-[#091020] to-[#040815] rounded-2xl border border-sky-500/20 p-6 shadow-xl relative" id="magic-practical-cases">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 pb-4 border-b border-slate-850">
          <div className="flex items-center gap-2.5 text-left">
            <Sparkles size={18} className="text-sky-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-black uppercase text-slate-200 tracking-wider font-sans">
                Onde a Mágica Acontece na Prática (Automações)
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Simule e automatize as tarefas financeiras mais refinadas do dia a dia do mercado local.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-3 md:mt-0 bg-slate-950/80 p-1 rounded-xl border border-slate-850/80">
            <button
              onClick={() => {
                setActiveWorkflow('fii_spread');
                setActiveAgent('model_builder');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                activeWorkflow === 'fii_spread' 
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Spread vs NTN-B
            </button>
            <button
              onClick={() => {
                setActiveWorkflow('earnings');
                setActiveAgent('earnings_reviewer');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                activeWorkflow === 'earnings' 
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Resultados Trimestrais
            </button>
            <button
              onClick={() => {
                setActiveWorkflow('rebalance');
                setActiveAgent('market_researcher');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${
                activeWorkflow === 'rebalance' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-950'
              }`}
            >
              Sugestão de Aporte
            </button>
          </div>
        </div>

        {activeWorkflow === null && (
          <div className="text-center py-8 bg-[#020617]/55 rounded-xl border border-slate-850 border-dashed">
            <Sliders size={24} className="text-slate-600 mx-auto mb-2.5 animate-bounce" />
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed text-center">
              Escolha uma engrenagem prática acima para abrir a central de simulação e ver os cálculos e relatórios de IA atuando na prática sobre o ativo <strong>{activeAsset.symbol}</strong>.
            </p>
          </div>
        )}

        {/* WORKFLOW LOCKED BY COWORK PLUGIN MISSING */}
        {activeWorkflow !== null && isWkLocked && (
          <div className="py-10 text-center space-y-4 flex flex-col items-center justify-center bg-[#020617]/55 rounded-xl border border-slate-850/65">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full animate-pulse">
              <Lock size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-white font-sans tracking-tight">
                Simulador Travado (Plugin Requerido Inativo)
              </h4>
              <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed font-sans mx-auto">
                Para desbloquear a orquestração prática e os cálculos desta automação, você precisa ativá-lo sob demanda sob a licença de tese na aba Claude Cowork Marketplace.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('cowork_marketplace')}
              className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] uppercase font-black tracking-widest rounded-lg hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer shadow"
            >
              Ativar Plugin {reqWkPlugin?.name}
            </button>
          </div>
        )}

        {/* WORKFLOW 1: SPREAD VS NTN-B */}
        {activeWorkflow === 'fii_spread' && !isWkLocked && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="md:col-span-1 bg-[#020617]/65 p-4 rounded-xl border border-slate-850 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-tight text-white flex items-center gap-2 mb-3">
                    <Sliders size={13} className="text-sky-400" />
                    Curva Futura IPCA+
                  </h4>
                  <p className="text-[10px] text-zinc-400 leading-normal mb-4">
                    Ajuste a taxa média real da NTN-B (Tesouro IPCA+) contratada hoje para traçar o prêmio de risco do Fundo.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10.5px] font-mono">
                      <span className="text-zinc-500">Taxa NTN-B local:</span>
                      <span className="text-sky-400 font-bold">{ntnbRate.toFixed(2)}% aa + IPCA</span>
                    </div>
                    <input 
                      type="range" 
                      min="5.00" 
                      max="8.00" 
                      step="0.05"
                      value={ntnbRate}
                      onChange={(e) => setNtnbRate(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer accent-sky-400"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-650 font-mono">
                      <span>5.0%</span>
                      <span>6.5%</span>
                      <span>8.0%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850/80 mt-4">
                  <span className="text-[9.5px] block text-zinc-500 italic">
                    NTN-B de referência brasileira
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-900/35 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Prêmio de Risco do FII ({activeAsset.symbol})</span>
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-850 font-mono text-slate-400">
                      Spread de Dividendos
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#020617]/45 p-4 rounded-xl border border-slate-850 mb-3.5">
                    <div>
                      <span className="text-[9.5px] text-slate-500 block uppercase">DY LTM</span>
                      <span className="text-lg font-black text-white font-mono">{activeAsset.dy.toFixed(2)}% <span className="text-xs text-slate-400">aa</span></span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-500 block uppercase">NTN-B Alvo</span>
                      <span className="text-lg font-black text-slate-350 font-mono">{ntnbRate.toFixed(2)}% aa</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[9.5px] text-slate-500 block uppercase">Spread Real (Premio)</span>
                      <span className="text-lg font-black text-emerald-400 font-mono">
                        {((activeAsset.dy - ntnbRate) * 100).toFixed(0)} <span className="text-xs">bps</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    <p>
                      O rendimento acumulado de <strong>{activeAsset.dy}% ao ano</strong> do <strong>{activeAsset.symbol}</strong> oferece um prêmio real de <strong>{((activeAsset.dy - ntnbRate) * 100).toFixed(0)} pontos-base (bps)</strong> frente ao título público indexado à inflação.
                    </p>
                    <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>
                        {((activeAsset.dy - ntnbRate) * 100) > 300 
                          ? "Prêmio de risco altamente convidativo (> 300 bps). Excelente margem de segurança física para alocação."
                          : "Prêmio de risco comedido mas atrativo para o portfólio físico em segmentos de alta resiliência."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-[9.5px] text-slate-500 font-mono">
                    Spread = (Dividend Yield - Taxa Real NTN-B) * 100
                  </span>
                  <button
                    onClick={() => {
                      const spreadBPS = ((activeAsset.dy - ntnbRate) * 100).toFixed(0);
                      const customPrompt = `Aja como analista CNPI sênior. O ativo ${activeAsset.symbol} possui Dividend Yield de ${activeAsset.dy}%. A NTN-B (Tesouro IPCA+) atual está operando a ${ntnbRate}%. Calcule o spread real de prêmio que é de ${spreadBPS} bps e determine com profundidade técnica se a margem de segurança compensa o risco de vacância física de ${activeAsset.vacancy}% do fundo.`;
                      setPromptMaster(customPrompt);
                      setActiveAgent('model_builder');
                      
                      const element = document.getElementById('prompt-master-config');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[10px] font-bold text-sky-400 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    Injetar no Prompt Master
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* WORKFLOW 2: QUARTERLY RESULTS AUDIT */}
        {activeWorkflow === 'earnings' && !isWkLocked && (
          <div className="space-y-4">
            <div className="bg-[#020617]/65 p-4 rounded-xl border border-slate-850 text-left">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-black uppercase text-white flex items-center gap-2">
                  <FileText size={13} className="text-purple-400" />
                  Módulo de Balanço Imobiliário Trimestral: {activeAsset.symbol}
                </span>
                <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  Release Oficial CVM
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-bold">
                      <th className="pb-2">Métrica Trimestral</th>
                      <th className="pb-2 text-center">Consenso</th>
                      <th className="pb-2 text-center">Resultado Realizado</th>
                      <th className="pb-2 text-center">Surpresa / Desvio</th>
                      <th className="pb-2 text-center">Avaliação Primária</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 font-bold text-slate-200">Receitas de Locação</td>
                      <td className="py-2.5 text-center font-mono text-slate-400">R$ 52.4 M</td>
                      <td className="py-2.5 text-center font-mono text-slate-100 font-bold">R$ 54.8 M</td>
                      <td className="py-2.5 text-center font-mono text-emerald-400 font-bold">+4.58%</td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-bold">
                          Acima do Consenso
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-200">EBITDA Ajustado</td>
                      <td className="py-2.5 text-center font-mono text-slate-400">R$ 41.2 M</td>
                      <td className="py-2.5 text-center font-mono text-slate-100 font-bold">R$ 43.1 M</td>
                      <td className="py-2.5 text-center font-mono text-emerald-400 font-bold">+4.61%</td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-bold">
                          Acima do Consenso
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-200">Lucro Líquido Realizado</td>
                      <td className="py-2.5 text-center font-mono text-slate-400">R$ 38.5 M</td>
                      <td className="py-2.5 text-center font-mono text-slate-100 font-bold">R$ 39.2 M</td>
                      <td className="py-2.5 text-center font-mono text-emerald-400 font-bold">+1.82%</td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-[#0f172a] text-slate-400 border border-slate-800 text-[9px] uppercase font-bold">
                          Dentro do Esperado
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-200">Rendimento por Cota</td>
                      <td className="py-2.5 text-center font-mono text-slate-400">R$ {(activeAsset.lastDividend * 0.95).toFixed(2)}</td>
                      <td className="py-2.5 text-center font-mono text-white font-bold">R$ {activeAsset.lastDividend.toFixed(2)}</td>
                      <td className="py-2.5 text-center font-mono text-emerald-400 font-bold">+5.26%</td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-bold">
                          Forte Entrega
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-purple-500/5 rounded-lg border border-purple-500/15 text-[11px] leading-relaxed text-slate-300">
                <strong>Parecer Rápido Claude MCP:</strong> "A forte captação das receitas imobiliárias do fundo {activeAsset.symbol} indica vacância residual controlada em {activeAsset.vacancy}% e reajuste contratual consistente com o IGP-M/IPCA histórico, superando as estimativas anteriores em dividendos recorrentes."
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    const customPrompt = `Aja como auditor e analista de RI de FII. Cruze os dados do último boletim CVM do ativo ${activeAsset.symbol}, avalie o faturamento imobiliário que bateu R$ 54.8M contra R$ 52.4M esperados e o desvio positivo no EBITDA de +4.61%. Projete o impacto disso na distribuição de dividendos e avalie a vacância de ${activeAsset.vacancy}% frente ao mercado.`;
                    setPromptMaster(customPrompt);
                    setActiveAgent('earnings_reviewer');
                    
                    const element = document.getElementById('prompt-master-config');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[10.5px] font-bold text-purple-400 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none"
                >
                  Injetar Analisador de Balanços
                  <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW 3: BALANCED CONTRIBUTIONS */}
        {activeWorkflow === 'rebalance' && !isWkLocked && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="bg-[#020617]/65 p-4 rounded-xl border border-slate-850 flex flex-col justify-between text-left">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-tight text-white flex items-center gap-2 mb-3">
                    <Scale size={13} className="text-emerald-400" />
                    Valor do Aporte Mensal
                  </h4>
                  <p className="text-[10px] text-zinc-400 leading-normal mb-4">
                    Insira o valor em dinheiro (R$) que pretende aportar hoje para rebalancear a carteira até os pesos ideais estipulados de preço-teto.
                  </p>
                  
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9.5px] text-zinc-500 uppercase font-black block">Aporte Disponível (R$):</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold font-mono">R$</span>
                      <input 
                        type="number"
                        min="500"
                        max="100000"
                        step="100"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-full text-xs font-mono font-bold bg-slate-950/80 border border-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850/80 mt-4 text-[10px] text-zinc-500 font-sans leading-relaxed">
                  Algoritmo de rebalanceamento quantitativo baseado no menor preço/valor justo relativo.
                </div>
              </div>

              <div className="md:col-span-2 bg-[#020617]/40 p-4 rounded-xl border border-slate-850 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-3">Distribuição Sugerida do Aporte</span>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-sans">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-500 font-bold text-[10px]">
                        <th className="pb-1.5">Ativo</th>
                        <th className="pb-1.5 text-center">Peso Atual</th>
                        <th className="pb-1.5 text-center">Peso Alvo</th>
                        <th className="pb-1.5 text-center">Deficit %</th>
                        <th className="pb-1.5 text-right font-bold text-emerald-400">Aporte Alocado</th>
                        <th className="pb-1.5 text-right font-bold text-white">Qtd Compras</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-zinc-300">
                      {(() => {
                        const mockQuantities = [45, 500, 30, 20, 15];
                        const targetWeights = [30, 20, 20, 15, 15];
                        
                        let totalPortfolioVal = 0;
                        for (let j = 0; j < availableFIIs.length; j++) {
                          const f = availableFIIs[j];
                          const qty = mockQuantities[j] || 10;
                          totalPortfolioVal += qty * f.currentPrice;
                        }

                        const deficits: number[] = [];
                        let totalDeficits = 0;
                        for (let j = 0; j < availableFIIs.length; j++) {
                          const f = availableFIIs[j];
                          const qty = mockQuantities[j] || 10;
                          const currValue = qty * f.currentPrice;
                          const targetWeight = targetWeights[j] || 20;
                          const targetValOfNewPortfolio = (totalPortfolioVal + contributionAmount) * (targetWeight / 100);
                          const rawDeficit = Math.max(0, targetValOfNewPortfolio - currValue);
                          deficits.push(rawDeficit);
                          totalDeficits += rawDeficit;
                        }

                        return availableFIIs.map((fii, i) => {
                          const qty = mockQuantities[i] || 10;
                          const currValue = qty * fii.currentPrice;
                          const currentWeight = (currValue / totalPortfolioVal) * 100;
                          const targetWeight = targetWeights[i] || 20;
                          
                          const rawDeficit = deficits[i];
                          const allocatedAmount = totalDeficits > 0 ? (rawDeficit / totalDeficits) * contributionAmount : 0;
                          const unitsToBuy = Math.floor(allocatedAmount / fii.currentPrice);
                          const actualAllocated = unitsToBuy * fii.currentPrice;

                          return (
                            <tr key={fii.symbol} className={selectedSymbol === fii.symbol ? "bg-emerald-500/5 font-bold text-white" : ""}>
                              <td className="py-2.5 font-mono flex items-center gap-1.5">
                                {selectedSymbol === fii.symbol && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                                {fii.symbol}
                              </td>
                              <td className="py-2.5 text-center font-mono text-zinc-550">{currentWeight.toFixed(1)}%</td>
                              <td className="py-2.5 text-center font-mono text-zinc-300 font-bold">{targetWeight.toFixed(1)}%</td>
                              <td className="py-2.5 text-center font-mono">
                                {(targetWeight - currentWeight) > 0 ? (
                                  <span className="text-emerald-400">+{ (targetWeight - currentWeight).toFixed(1) }%</span>
                                ) : (
                                  <span className="text-slate-500">{ (targetWeight - currentWeight).toFixed(1) }%</span>
                                )}
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                                R$ {actualAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-2.5 text-right font-mono font-black text-white text-right">
                                {unitsToBuy > 0 ? `${unitsToBuy} cotas` : "Aguardar"}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-[9.5px] text-slate-500 font-mono">
                    Valores para carteira estimada de R$ 20.000,00
                  </span>
                  
                  <button
                    onClick={() => {
                      const customizedPrompt = `Aja como planejador financeiro de aportes e rebalanceamento. Considere que o investidor possui R$ ${contributionAmount.toFixed(2)} disponíveis para aporte mensal. Faça uma planilha de distribuição exata sugerindo a compra de cotas para MXRF11, HGLG11, BTLG11 e XPML11 de acordo com as metas estipuladas de peso para reequilibrar o portfólio.`;
                      setPromptMaster(customizedPrompt);
                      setActiveAgent('market_researcher');
                      
                      const element = document.getElementById('prompt-master-config');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[10.5px] font-bold text-emerald-400 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    Carregar no Prompt Master
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* Main Orchestrator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Workspace side: Actions & Prompt Config */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Agent Selection Panel */}
          <section className="bg-[#070c17] rounded-2xl border border-[#1e293b] p-6 shadow-xl" id="agent-selector">
            <div className="flex items-center gap-2.5 mb-5">
              <Brain size={16} className="text-sky-450 font-bold animate-pulse" />
              <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider font-sans">
                2. Selecione o Agente de IA Financeiro (Modo MCP)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="agent-templates-grid">
              
              {/* Agent 1 */}
              <button
                onClick={() => { if (!isRunning) setActiveAgent('model_builder'); }}
                className={`text-left p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 group relative ${
                  !installedPlugins.analysis_core ? 'opacity-65 border-dashed border-slate-800' : ''
                } ${
                  activeAgent === 'model_builder'
                    ? 'bg-sky-500/5 border-sky-500/80 shadow-md shadow-sky-500/5'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-[#1e293b]/40 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  !installedPlugins.analysis_core ? 'bg-zinc-900 text-zinc-600' :
                  activeAgent === 'model_builder' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-[#1a202c] text-slate-400 group-hover:text-sky-400 border border-slate-800'
                }`}>
                  <TrendingUp size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex gap-1.5 items-center">
                    <h4 className={`text-xs font-black uppercase tracking-tight font-sans ${activeAgent === 'model_builder' ? 'text-sky-400' : 'text-slate-200'}`}>
                      Model Builder
                    </h4>
                    {!installedPlugins.analysis_core && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1 py-0.5 rounded font-mono uppercase font-bold leading-none shrink-0 flex items-center gap-0.5 border border-amber-500/15">
                        <Lock size={8} /> Offline
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                    Planilha e modela valuation real DDM / Gordon Growth via fluxos de dividendos históricos.
                  </p>
                </div>
                {activeAgent === 'model_builder' && installedPlugins.analysis_core && (
                  <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Agent 2 */}
              <button
                onClick={() => { if (!isRunning) setActiveAgent('earnings_reviewer'); }}
                className={`text-left p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 group relative ${
                  !installedPlugins.equity_research ? 'opacity-65 border-dashed border-slate-800' : ''
                } ${
                  activeAgent === 'earnings_reviewer'
                    ? 'bg-purple-500/5 border-purple-500/80 shadow-md shadow-purple-500/5'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-[#1e293b]/40 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  !installedPlugins.equity_research ? 'bg-zinc-900 text-zinc-600' :
                  activeAgent === 'earnings_reviewer' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-[#1a202c] text-slate-400 group-hover:text-purple-400 border border-slate-800'
                }`}>
                  <FileText size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex gap-1.5 items-center">
                    <h4 className={`text-xs font-black uppercase tracking-tight font-sans ${activeAgent === 'earnings_reviewer' ? 'text-purple-400' : 'text-slate-200'}`}>
                      Earnings Reviewer
                    </h4>
                    {!installedPlugins.equity_research && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1 py-0.5 rounded font-mono uppercase font-bold leading-none shrink-0 flex items-center gap-0.5 border border-amber-500/15">
                        <Lock size={8} /> Offline
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                    Sintetiza atas trimestrais da CVM e teleconferências de dividendos, vacâncias e riscos.
                  </p>
                </div>
                {activeAgent === 'earnings_reviewer' && installedPlugins.equity_research && (
                  <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Agent 3 */}
              <button
                onClick={() => { if (!isRunning) setActiveAgent('market_researcher'); }}
                className={`text-left p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 group relative ${
                  !installedPlugins.wealth_mgmt ? 'opacity-65 border-dashed border-slate-800' : ''
                } ${
                  activeAgent === 'market_researcher'
                    ? 'bg-emerald-500/5 border-emerald-500/80 shadow-md shadow-emerald-500/5'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-[#1e293b]/40 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  !installedPlugins.wealth_mgmt ? 'bg-zinc-900 text-zinc-600' :
                  activeAgent === 'market_researcher' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#1a202c] text-slate-400 group-hover:text-emerald-400 border border-slate-800'
                }`}>
                  <Layers size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex gap-1.5 items-center">
                    <h4 className={`text-xs font-black uppercase tracking-tight font-sans ${activeAgent === 'market_researcher' ? 'text-emerald-400' : 'text-slate-200'}`}>
                      Market Researcher
                    </h4>
                    {!installedPlugins.wealth_mgmt && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1 py-0.5 rounded font-mono uppercase font-bold leading-none shrink-0 flex items-center gap-0.5 border border-amber-500/15">
                        <Lock size={8} /> Offline
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                    Realiza escaneamento setorial (Comps). Monta múltiplas comparações (P/VP, Yield) de fundos.
                  </p>
                </div>
                {activeAgent === 'market_researcher' && installedPlugins.wealth_mgmt && (
                  <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Agent 4 */}
              <button
                onClick={() => { if (!isRunning) setActiveAgent('morning_note'); }}
                className={`text-left p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 group relative ${
                  !installedPlugins.analysis_core ? 'opacity-65 border-dashed border-slate-800' : ''
                } ${
                  activeAgent === 'morning_note'
                    ? 'bg-amber-500/5 border-amber-500/80 shadow-md shadow-amber-500/5'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-[#1e293b]/40 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-lg shrink-0 ${
                  !installedPlugins.analysis_core ? 'bg-zinc-900 text-zinc-600' :
                  activeAgent === 'morning_note' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-[#1a202c] text-slate-400 group-hover:text-amber-400 border border-slate-800'
                }`}>
                  <Globe size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex gap-1.5 items-center">
                    <h4 className={`text-xs font-black uppercase tracking-tight font-sans ${activeAgent === 'morning_note' ? 'text-amber-400' : 'text-slate-200'}`}>
                      Morning Note Creator
                    </h4>
                    {!installedPlugins.analysis_core && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1 py-0.5 rounded font-mono uppercase font-bold leading-none shrink-0 flex items-center gap-0.5 border border-amber-500/15">
                        <Lock size={8} /> Offline
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2 leading-relaxed">
                    Integra tendências macroeconômicas (SELIC, IPCA) e gera relatórios rápidos diários.
                  </p>
                </div>
                {activeAgent === 'morning_note' && installedPlugins.analysis_core && (
                  <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                )}
              </button>

            </div>
          </section>

          {/* Prompt Master Editor */}
          <section className="bg-[#070c17] rounded-2xl border border-[#1e293b] p-6 shadow-xl relative overflow-hidden" id="prompt-master-config">
            {isAgentLocked ? (
              <div className="py-8 px-4 text-center space-y-4 flex flex-col items-center justify-center min-h-[220px]">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full animate-pulse">
                  <Lock size={18} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white font-sans">
                    Agente Bloqueado (Módulo Inativo no Claude Desktop)
                  </h4>
                  <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed font-sans mx-auto">
                    Para orquestrar o agente <strong>{getAgentHeader()?.title}</strong>, você precisa instalar o plugin oficial da Anthropic na aba <strong>Claude Cowork Marketplace</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('cowork_marketplace')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[10.5px] text-zinc-950 font-black rounded-lg cursor-pointer transition-all uppercase tracking-widest font-sans shadow"
                >
                  Ativar no Cowork de 1 Clique
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="prompt-multi-workspace-grid">
                
                {/* Left side cols: Prompt Input & Commands (span 2) */}
                <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <Cpu size={16} className="text-sky-450 animate-pulse" />
                        <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider font-sans text-left">
                          3. Prompt Master & Comandos (/)
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          const defaultTemplate = defaultPrompts[activeAgent];
                          const customized = defaultTemplate.replace('do ativo', `de ${activeAsset.symbol} (${activeAsset.name})`);
                          setPromptMaster(customized);
                        }}
                        disabled={isRunning}
                        className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border-none bg-transparent"
                        title="Resetar para o prompt padrão do Agente"
                      >
                        <RotateCcw size={11} />
                        Restaurar Padrão
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        value={promptMaster}
                        onChange={(e) => setPromptMaster(e.target.value)}
                        disabled={isRunning}
                        className="w-full text-xs font-mono bg-[#020617] border border-slate-800 rounded-xl p-4 text-slate-300 min-h-[140px] focus:outline-none focus:border-purple-500/80 transition-all leading-relaxed"
                        placeholder="Insira as regras e diretrizes de análise preferidas, arraste um PDF ou use os comandos (/)..."
                      />
                      <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-500 select-none">
                        {promptMaster.length} characters
                      </div>
                    </div>
                  </div>

                  {/* Slash commands helper layout */}
                  <div className="space-y-2 text-left bg-purple-950/5 p-3 rounded-xl border border-slate-850/80">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-sans">
                      Comandos e Diretrizes Rápidas (Injetar e Ativar)
                    </span>
                    <div className="flex flex-wrap gap-2 text-left">
                      <button
                        onClick={() => {
                          const cmd = `/earnings analise os pontos de estresse do balanço trimestral e monte a tabela de múltiplos comparativos com os pares do setor. Ativo: ${activeAsset.symbol}`;
                          setPromptMaster(cmd);
                          setActiveAgent('earnings_reviewer');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-400 text-purple-400 hover:text-white transition-all text-[10px] font-bold font-mono cursor-pointer flex items-center gap-1 leading-none shadow-sm"
                        title="Executar análise de pontos de estresse e múltiplos setoriais comparativos"
                      >
                        <span className="text-[10px] uppercase font-black bg-purple-500/20 border border-purple-500/20 px-1 py-0.5 rounded leading-none mr-0.5 text-purple-300">/earnings</span>
                        Estresse & Pares
                      </button>

                      <button
                        onClick={() => {
                          const cmd = `/spread compare o cap rate do ativo e calcule o prêmio real de inflação contra as curvas de juros NTN-B de ${ntnbRate}%. Ativo: ${activeAsset.symbol}`;
                          setPromptMaster(cmd);
                          setActiveAgent('model_builder');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-400 text-sky-400 hover:text-white transition-all text-[10px] font-bold font-mono cursor-pointer flex items-center gap-1 leading-none shadow-sm"
                        title="Calcular spread real de Yield"
                      >
                        <span className="text-[10px] uppercase font-black bg-sky-500/20 border border-sky-500/20 px-1 py-0.5 rounded leading-none mr-0.5 text-sky-300">/spread</span>
                        Taxa de Spread
                      </button>

                      <button
                        onClick={() => {
                          const cmd = `/rebalance otimize a distribuição aporte de R$ ${contributionAmount.toFixed(2)} para reequilibrar portfólio de FIIs. Ativo: ${activeAsset.symbol}`;
                          setPromptMaster(cmd);
                          setActiveAgent('market_researcher');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-400 text-emerald-400 hover:text-white transition-all text-[10px] font-bold font-mono cursor-pointer flex items-center gap-1 leading-none shadow-sm"
                        title="Otimizar distribuição de aportes mensais"
                      >
                        <span className="text-[10px] uppercase font-black bg-emerald-500/20 border border-emerald-500/20 px-1 py-0.5 rounded leading-none mr-0.5 text-emerald-300">/rebalance</span>
                        Aportes Ótimos
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right side cols: Drag & Drop Files space (span 1) */}
                <div className="lg:col-span-1 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-850 pt-5 lg:pt-0 lg:pl-6">
                  <div className="space-y-3 flex-1 flex flex-col justify-start">
                    <div className="flex items-center gap-1.5 text-left mb-1">
                      <FolderOpen size={14} className="text-purple-400" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-sans">
                        Workspace do Projeto
                      </span>
                    </div>

                    {/* Drag and Drop Zone Area */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`text-center p-4 rounded-xl border border-dashed transition-all relative flex flex-col items-center justify-center min-h-[110px] select-none ${
                        dragActive 
                          ? 'border-purple-400 bg-purple-500/5 animate-pulse' 
                          : 'border-slate-800 bg-[#020617]/55 hover:border-slate-700 hover:bg-[#020617]/80'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="document-upload-input" 
                        className="hidden" 
                        accept=".pdf,.xlsx,.xls,.csv,.txt,.json" 
                        onChange={handleFileSelect}
                        disabled={isRunning}
                      />
                      
                      {uploadingFileName ? (
                        <div className="space-y-2">
                          <Upload className="text-purple-400 animate-bounce mx-auto" size={18} />
                          <p className="text-[10px] text-slate-300 font-mono">Processando {uploadingFileName} ({uploadProgress}%)</p>
                          <div className="w-24 h-1.5 bg-slate-850 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-purple-400 transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <label 
                          htmlFor="document-upload-input" 
                          className="cursor-pointer text-center space-y-1 block h-full w-full flex flex-col items-center justify-center p-2.5"
                        >
                          <Upload className="text-slate-500 hover:text-purple-400 transition-colors" size={18} />
                          <div>
                            <span className="text-[10.5px] font-black text-slate-200 hover:underline block font-sans">
                              Arraste seu PDF, Excel ou Extrato
                            </span>
                            <span className="text-[8.5px] text-slate-500 block leading-normal mt-0.5 max-w-[180px] mx-auto font-sans">
                              PDF, Excel, CSV, JSON ou TXT (Clique p/ Enviar)
                            </span>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Pre-loaded official documents (Simulation helper) */}
                    <div className="space-y-1.5 text-left mt-2 pb-2">
                      <span className="text-[8px] font-black tracking-widest text-[#a78bfa] uppercase font-mono block">Documentos & Planilhas (Simular)</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => simulateFileUpload('HGLG11_Relatorio_Trimestral.pdf', '2.4 MB')}
                          className={`w-full p-2 rounded-lg border text-left text-[10px] font-mono transition-all flex items-center justify-between cursor-pointer border-none bg-transparent ${
                            uploadedFiles.some(f => f.name === 'HGLG11_Relatorio_Trimestral.pdf')
                              ? 'bg-purple-500/10 border border-purple-500/40 text-white font-bold'
                              : 'bg-[#020617]/35 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-[#020617]/60'
                          }`}
                        >
                          <span className="truncate pr-1">📄 HGLG11_Trim.pdf</span>
                          {uploadedFiles.some(f => f.name === 'HGLG11_Relatorio_Trimestral.pdf') ? (
                            <Check size={10} className="text-purple-400 shrink-0" />
                          ) : (
                            <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-500 px-1 hover:text-slate-300 rounded font-sans uppercase">PDF</span>
                          )}
                        </button>
                        <button
                          onClick={() => simulateFileUpload('XPML11_Relatorio_Shoppings_Q1.pdf', '3.1 MB')}
                          className={`w-full p-2 rounded-lg border text-left text-[10px] font-mono transition-all flex items-center justify-between cursor-pointer border-none bg-transparent ${
                            uploadedFiles.some(f => f.name === 'XPML11_Relatorio_Shoppings_Q1.pdf')
                              ? 'bg-purple-500/10 border border-purple-500/40 text-white font-bold'
                              : 'bg-[#020617]/35 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-[#020617]/60'
                          }`}
                        >
                          <span className="truncate pr-1">📄 XPML11_Shop.pdf</span>
                          {uploadedFiles.some(f => f.name === 'XPML11_Relatorio_Shoppings_Q1.pdf') ? (
                            <Check size={10} className="text-purple-400 shrink-0" />
                          ) : (
                            <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-500 px-1 hover:text-slate-300 rounded font-sans uppercase">PDF</span>
                          )}
                        </button>
                        <button
                          onClick={() => simulateFileUpload('Carteira_Investimento_Outubro.xlsx', '1.2 MB')}
                          className={`w-full p-2 rounded-lg border text-left text-[10px] font-mono transition-all flex items-center justify-between cursor-pointer border-none bg-transparent ${
                            uploadedFiles.some(f => f.name === 'Carteira_Investimento_Outubro.xlsx')
                              ? 'bg-emerald-500/10 border border-emerald-500/40 text-white font-bold'
                              : 'bg-[#020617]/35 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-[#020617]/60'
                          }`}
                        >
                          <span className="truncate pr-1">📊 Custodia.xlsx</span>
                          {uploadedFiles.some(f => f.name === 'Carteira_Investimento_Outubro.xlsx') ? (
                            <Check size={10} className="text-emerald-400 shrink-0" />
                          ) : (
                            <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-500 px-1 hover:text-slate-300 rounded font-sans uppercase">XLSX</span>
                          )}
                        </button>
                        <button
                          onClick={() => simulateFileUpload('Extrato_Negociacao_B3.csv', '420 KB')}
                          className={`w-full p-2 rounded-lg border text-left text-[10px] font-mono transition-all flex items-center justify-between cursor-pointer border-none bg-transparent ${
                            uploadedFiles.some(f => f.name === 'Extrato_Negociacao_B3.csv')
                              ? 'bg-emerald-500/10 border border-emerald-500/40 text-white font-bold'
                              : 'bg-[#020617]/35 border border-slate-900 text-slate-500 hover:text-slate-300 hover:bg-[#020617]/60'
                          }`}
                        >
                          <span className="truncate pr-1">📈 Extrato_B3.csv</span>
                          {uploadedFiles.some(f => f.name === 'Extrato_Negociacao_B3.csv') ? (
                            <Check size={10} className="text-emerald-400 shrink-0" />
                          ) : (
                            <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-500 px-1 hover:text-slate-300 rounded font-sans uppercase">CSV</span>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Run button unified */}
                  <div className="mt-4">
                    <button
                      onClick={startOrchestration}
                      disabled={isRunning}
                      className={`w-full py-3 px-6 rounded-xl font-sans font-black text-xs text-[#020617] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer select-none border-none ${
                        isRunning 
                          ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#a78bfa] to-sky-400 hover:from-purple-350 hover:to-sky-350 hover:scale-[1.01] shadow-purple-500/10 font-bold'
                      }`}
                    >
                      <Play size={13} fill="currentColor" />
                      Orquestrar Agente de IA Financeira
                    </button>
                  </div>
                </div>

              </div>
            )}
          </section>

          {/* Sequential Thinking execution terminal */}
          {(isRunning || executionLogs.length > 0) && (
            <section className="bg-[#020617] rounded-xl border border-slate-850 p-5 shadow-2xl font-mono text-xs overflow-hidden transition-all duration-500">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                    Sequential Thinking Console (MCP Interface)
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${executionStep >= 1 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-750'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${executionStep >= 2 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-750'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${executionStep >= 3 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-750'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${executionStep >= 4 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-750'}`}></span>
                </div>
              </div>

              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800" id="terminal-log-flow">
                {executionLogs.map((log, index) => {
                  const isSuccess = log.includes('[OK]') || log.includes('[COMPLETED]') || log.includes('sucesso');
                  const isThinking = log.includes('[THINKING]');
                  const isStep = log.includes('[STEP');
                  
                  let colorClass = 'text-slate-450';
                  if (isSuccess) colorClass = 'text-emerald-400 font-bold';
                  else if (isThinking) colorClass = 'text-[#a78bfa] italic';
                  else if (isStep) colorClass = 'text-sky-400 font-bold mt-2.5';

                  return (
                    <div key={index} className={`leading-relaxed text-[10.5px] ${colorClass}`}>
                      {log}
                    </div>
                  );
                })}
                {isRunning && (
                  <div className="flex items-center gap-1.5 text-slate-500 animate-pulse mt-1 select-none">
                    <span>&gt;_</span>
                    <span>Analisando padrões e calculando premissas...</span>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>

        {/* Right Sidebar Compartment: MCP connectors status and presets */}
        <div className="space-y-8 h-full">
          
          {/* MCP Connectors Hub Card */}
          <section className="bg-[#070c17] rounded-2xl border border-[#1e293b] p-6 shadow-xl" id="mcp-connectors-card">
            <div className="flex items-center gap-2.5 mb-2.5">
              <Layers size={16} className="text-sky-400" />
              <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider font-sans">
                Conectores MCP Ativos
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 mb-5 leading-normal font-sans">
              Model Context Protocol (MCP) conecta o Claude Desktop de forma nativa a recursos internos da Faria Lima.
            </p>

            <div className="space-y-4" id="mcp-items-list border-slate-800">
              {mcpConnectors.map((c) => {
                const IconComponent = c.icon;
                const requiresPlugin = c.id !== 'thinking';
                const isPluginInstalled = !requiresPlugin || installedPlugins.data_connectors;
                const isOnline = isPluginInstalled && (c.status === 'online' || c.status === 'linked');
                
                return (
                  <div 
                    key={c.id}
                    className={`p-3.5 rounded-xl border flex gap-3 items-start transition-all relative ${
                      isOnline ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-950/20 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isOnline ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-900 text-slate-600'
                    }`}>
                      <IconComponent size={14} className="stroke-[2px]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-200 font-sans block truncate pr-1">
                          {c.name}
                        </span>
                        
                        {/* Interactive toggle status badge */}
                        {requiresPlugin && !installedPlugins.data_connectors ? (
                          <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase font-bold">
                            Sem Plugin
                          </span>
                        ) : c.isConfigurable ? (
                          <button
                            onClick={() => toggleConnector(c.id)}
                            disabled={isRunning}
                            className={`text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer transition-all uppercase select-none ${
                              isOnline
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'
                            }`}
                          >
                            {isOnline ? 'Ativo' : 'Inativo'}
                          </button>
                        ) : (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                            Core
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-slate-400 mt-1 leading-normal font-sans">
                        {requiresPlugin && !installedPlugins.data_connectors 
                          ? "Este conector requer o plugin 'Data Connectors' instalado na aba Claude Cowork Marketplace para ler dados da API." 
                          : c.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Informative Panel */}
          <section className="bg-gradient-to-br from-[#0c1322] to-[#070c17] rounded-2xl border border-sky-500/15 p-6 relative overflow-hidden" id="agent-info-help">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-3xl"></div>
            <div className="flex gap-2.5 items-start">
              <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-black text-white uppercase tracking-wider font-sans">
                  Como funciona esta Inteligência?
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-2 font-sans">
                  Nossa suíte emula e projeta os 10 modelos oficiais de agentes imobiliários e de research de Fundos da Anthropic. Ao clicar para orquestrar:
                </p>
                <ol className="list-decimal list-inside space-y-1 mt-3.5 text-[9.5px] text-slate-300 font-sans leading-normal">
                  <li>O Claude Desktop realiza chamadas de função via servidores MCP locais.</li>
                  <li>Indexa dados fundamentais e fatos relevantes recentes.</li>
                  <li>O compilador interno Sequential Thinking simula testes de estresse em dividendos.</li>
                  <li>Injeta as premissas filtradas gerando o parecer CNPI final de valuation e análise de riscos.</li>
                </ol>
              </div>
            </div>
          </section>

        </div>

      </div>

      {/* Generated Report Output Section */}
      <AnimatePresence>
        {showResult && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-[#070c17] rounded-2xl border border-[#1e293b] overflow-hidden shadow-2xl relative"
            id="result-editorial-report"
          >
            {/* Header toolbar */}
            <div className="bg-[#0f172a] border-b border-[#1e293b]/80 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-wider ${getAgentHeader()?.color}`}>
                  {getAgentHeader()?.title}
                </div>
                <div className="h-4 w-[1px] bg-slate-800"></div>
                <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                  {getAgentHeader()?.label}
                </span>
              </div>

              {/* Action indicators for saving or copying */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCopyReport}
                  className="text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-slate-500 text-slate-300 hover:bg-[#1e293b]/80 transition-all font-sans cursor-pointer flex items-center gap-1.5 active:scale-95 select-none"
                >
                  {copied ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Copiar Relatório
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Container (Editorial look) */}
            <div className="p-8 md:p-10 text-left max-w-4xl mx-auto" id="report-editorial-content">
              {/* Report Branding Title */}
              <div className="border-b border-slate-850 pb-6 mb-8 text-left">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-serif font-black text-white italic tracking-tight">
                    Relatório Financeiro Inteligente
                  </h2>
                  <span className="text-xs font-mono font-medium text-slate-500">
                    ID: CLAUDE-MCP-{activeAsset.symbol}-2026
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5 mt-3 text-slate-400 text-xs">
                  <span>Ativo Analisado: <strong className="text-white font-mono">{activeAsset.symbol} - {activeAsset.name}</strong></span>
                  <span className="text-slate-650">&bull;</span>
                  <span>Segmento: <strong>{activeAsset.segment}</strong></span>
                  <span className="text-slate-650">&bull;</span>
                  <span>Emitido em: <strong>07/06/2026</strong></span>
                  <span className="text-slate-650">&bull;</span>
                  <span>Autor: <strong className="text-[#a78bfa]">MCP Agent Core</strong></span>
                </div>
              </div>

              {/* Prompt Master context info overlay */}
              <div className="mb-6 p-3.5 bg-slate-900/55 rounded-xl border border-slate-850/85 text-[10.5px] leading-relaxed text-slate-450 font-serif italic">
                <strong>Configuração de Prompt Master Utilizada:</strong> "{promptMaster}"
              </div>

              {/* Output Content Dispatcher */}
              <div className="mt-8">
                {promptMaster.trim().toLowerCase().startsWith('/earnings') || promptMaster.trim().toLowerCase().startsWith('/') || uploadedFiles.length > 0 ? (
                  getSlashCommandOutput(selectedSymbol, promptMaster)
                ) : (
                  <>
                    {activeAgent === 'model_builder' && getValuationModelOutput(selectedSymbol)}
                    {activeAgent === 'earnings_reviewer' && getEarningsReviewOutput(selectedSymbol)}
                    {activeAgent === 'market_researcher' && getMarketCompsOutput(selectedSymbol)}
                    {activeAgent === 'morning_note' && getMorningNoteOutput(selectedSymbol)}
                  </>
                )}
              </div>

              {/* Verified Signoff block */}
              <div className="mt-10 pt-6 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-[10px] block font-bold text-white uppercase tracking-wider font-sans">
                      Parecer CNPI IA Verificado
                    </span>
                    <span className="text-[9.5px] block text-slate-500 font-mono">
                      Compilado via Anthropic Model Context Protocol (MCP) nativo
                    </span>
                  </div>
                </div>
                
                {/* Brand Logo Watermark */}
                <span className="text-slate-600 font-black text-xs font-mono tracking-tighter select-none">
                  FIIs.IA // COGNITIVE RESEARCH
                </span>
              </div>

            </div>
          </motion.section>
        )}
      </AnimatePresence>
        </>
      ) : (
        <div className="space-y-6 text-left" id="cowork-marketplace-view">
          {/* Header block with introductory help & GitHub status badge */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#070c17] border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/25">
                Guia Oficial Claude Desktop
              </span>
              <h2 className="text-lg font-bold text-white font-sans">
                Aba Claude Cowork (Customização Sem Código)
              </h2>
              <p className="text-xs text-slate-400 leading-normal max-w-2xl font-sans">
                O Claude Cowork permite plugar repositórios do GitHub como uma &ldquo;App Store&rdquo; integrada. Siga o passo a passo interativo abaixo para replicar o ambiente de produção do seu desktop local ou controle as chaves para destravar novas automações na Central Operacional.
              </p>
            </div>
            <div className="flex gap-2.5">
              <a 
                href="https://github.com/anthropics/financial-services" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 font-bold flex items-center gap-2 transition-all hover:bg-slate-950/80 cursor-pointer animate-none"
              >
                <Github size={13} />
                Repositório Oficial
                <ArrowUpRight size={11} className="text-slate-500" />
              </a>
            </div>
          </div>

          {/* SIMULATOR COMPONENT START */}
          <div className="bg-[#020617] rounded-2xl border border-[#1e293b] overflow-hidden shadow-2xl relative">
            
            {/* Real Desktop OS Style Window Header bar */}
            <div className="bg-slate-950/90 border-b border-slate-850 px-4 py-3.5 flex items-center justify-between select-none">
              {/* Window Controls beads */}
              <div className="flex items-center gap-1.5 shrink-0 select-none">
                <span className="w-3 h-3 rounded-full bg-[#ef4444] opacity-80 block shadow"></span>
                <span className="w-3 h-3 rounded-full bg-[#f59e0b] opacity-80 block shadow"></span>
                <span className="w-3 h-3 rounded-full bg-[#10b981] opacity-80 block shadow"></span>
                <span className="text-[10.5px] text-slate-500 ml-2 font-mono hidden sm:inline">Claude Desktop Application (MacOS)</span>
              </div>

              {/* Segmented Control - Mode Changer */}
              <div className="bg-slate-900 rounded-lg p-0.5 border border-slate-850 flex shrink-0">
                <button 
                  onClick={() => setCoworkModeActive(false)}
                  className={`px-3 py-1 text-[10.5px] font-black uppercase tracking-wider rounded-md font-sans transition-all cursor-pointer ${
                    !coworkModeActive 
                      ? 'bg-slate-850 text-slate-200 shadow font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Modo Chat
                </button>
                <button 
                  onClick={() => setCoworkModeActive(true)}
                  className={`px-3 py-1 text-[10.5px] font-black uppercase tracking-wider rounded-md font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                    coworkModeActive 
                      ? 'bg-[#1e293b] text-white border border-[#3b82f6]/25 font-bold shadow' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Sparkles size={11} className="text-sky-450 animate-pulse" />
                  Modo Cowork
                </button>
              </div>

              {/* Offline status indicator */}
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>CONECTADO</span>
              </div>
            </div>

            {/* MOCK APPLICATION BODY CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
              
              {/* APP SIDEBAR PANEL (Claude Customize sidebar) */}
              <div className="lg:col-span-1 bg-slate-950/40 border-r border-[#1e293b] p-4 space-y-5 text-left">
                
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-slate-500 font-mono tracking-widest block">Navegabilidade</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-xs font-sans">
                      <Sliders size={13} className="text-sky-400" />
                      Personalizar Plugins
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <span className="text-[9px] font-black uppercase text-slate-500 font-mono tracking-widest block">Categorias</span>
                  <div className="space-y-1">
                    <button className="w-full text-left py-1.5 px-2 text-xs font-sans text-slate-500 hover:text-white hover:bg-slate-900 rounded cursor-pointer transition-all">
                      Nativo (Built-in)
                    </button>
                    <button className="w-full text-left py-1.5 px-2 text-xs font-sans font-bold text-sky-400 bg-sky-500/5 border-l-2 border-sky-500 rounded-r-lg">
                      Pessoal (Personal)
                    </button>
                    <button className="w-full text-left py-1.5 px-2 text-xs font-sans text-slate-500 hover:text-white hover:bg-slate-900 rounded cursor-pointer transition-all">
                      Trabalho (Enterprise)
                    </button>
                  </div>
                </div>

                {/* GitHub Connector Action Input */}
                <div className="pt-4 border-t border-slate-800 space-y-3 font-sans">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-[9px] font-black uppercase text-slate-500 font-mono tracking-widest">
                      Novo Marketplace
                    </span>
                    <button 
                      onClick={() => setGithubUrlInput('https://github.com/anthropics/financial-services')}
                      className="text-[8.5px] text-sky-400 hover:text-white cursor-pointer bg-transparent border-none font-sans font-bold transition-all"
                    >
                      Preencher Padrão
                    </button>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input 
                        type="text"
                        value={githubUrlInput}
                        onChange={(e) => setGithubUrlInput(e.target.value)}
                        placeholder="URL do repositório github..."
                        className="w-full text-[10px] font-mono p-2 pr-6 bg-slate-950 border border-slate-850 rounded focus:outline-none focus:border-sky-500 text-slate-200"
                      />
                      <Github size={11} className="absolute right-2 top-2.5 text-slate-600" />
                    </div>

                    <button
                      onClick={() => {
                        if (githubUrlInput.trim().toLowerCase().includes('financial-services')) {
                          setIsMarketplaceLinked(true);
                        } else {
                          alert("Por favor, forneça o link correto do repositório do Github da Anthropic para a suíte financeira.");
                        }
                      }}
                      className="w-full py-1.5 rounded bg-sky-500 hover:bg-sky-600 text-[10.5px] font-black text-white hover:shadow transition-all font-sans flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus size={11} className="stroke-[2.5]" />
                      Vincular Marketplace
                    </button>
                  </div>

                  {isMarketplaceLinked && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-lg space-y-1.5 mt-2 text-left">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 font-mono leading-none">
                        <Check size={10} className="stroke-[3]" />
                        MKP VINCULADO
                      </div>
                      <p className="text-[8.5px] text-slate-400 leading-normal font-sans">
                        O Claude Desktop leu os arquivos manifestos e expôs o catálogo abaixo.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* APP CONTENT CONTAINER (The Catalog) */}
              <div className="lg:col-span-3 bg-slate-900/10 p-6 flex flex-col justify-between text-left">
                
                {/* 1. CHAT MODE IS ACTIVE WARNING SCREEN */}
                {!coworkModeActive ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full mb-3.5 animate-pulse">
                      <Info size={22} />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans mb-1">
                      Claude no Modo Chat de Texto
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans mb-5">
                      No modo convencional de chat, o Claude responde em texto simples e não ativa a nova suíte cognitiva Cowork de ferramentas autônomas instaladas via GitHub.
                    </p>
                    <button
                      onClick={() => setCoworkModeActive(true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-655 text-xs font-bold text-zinc-950 flex items-center gap-1.5 shadow transition-all cursor-pointer font-sans"
                    >
                      <Sparkles size={13} fill="currentColor" />
                      Mudar para o Modo Cowork
                    </button>
                  </div>
                ) : (
                  
                  // 2. COWORK MODE SYSTEM ENGAGED
                  <div className="flex-1 space-y-6">
                    
                    {/* Repository Header catalog banner */}
                    <div className="border-b border-[#1e293b] pb-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Workflow size={14} className="text-sky-400 animate-pulse" />
                          <h3 className="text-xs font-black uppercase text-slate-200 tracking-wider font-sans">
                            Catálogo Visual de Plugins: Anthropic Financial Services
                          </h3>
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                          Mostrando as 4 extensões cognitivas identificadas no link de tese oficial.
                        </p>
                      </div>
                      <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-[#1e293b] text-slate-400 font-mono">
                        financial-services
                      </span>
                    </div>

                    {!isMarketplaceLinked ? (
                      /* Repositorio Desvinculado placeholder */
                      <div className="py-16 text-center border-2 border-dashed border-[#1e293b] rounded-xl bg-slate-950/30">
                        <Github size={30} className="text-slate-650 mx-auto mb-3" />
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tight font-sans">Vincule o repositório Anthropic na barra lateral</h4>
                        <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto leading-relaxed mt-2 font-sans px-4">
                          Cole a URL oficial <code className="text-sky-400 font-mono">https://github.com/anthropics/financial-services</code> no campo &ldquo;Novo Marketplace&rdquo; e clique para carregar o catálogo.
                        </p>
                      </div>
                    ) : (
                      /* Active app listing catalog */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Plugin 1 */}
                        <div className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-full ${
                          installedPlugins.analysis_core
                            ? 'bg-sky-500/5 border-sky-500/35 shadow-md shadow-sky-500/5'
                            : 'bg-slate-950 border-slate-850 opacity-60 hover:opacity-90'
                        }`}>
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-2 rounded-lg ${installedPlugins.analysis_core ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-900 text-slate-500'}`}>
                                  <TrendingUp size={15} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black uppercase text-slate-200 font-sans">Financial Analysis (Core)</h4>
                                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">Valuation & Cap Rates</span>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setInstalledPlugins(prev => ({ ...prev, 'analysis_core': !prev.analysis_core }))}
                                className={`text-[9.5px] font-mono px-2 py-1 rounded cursor-pointer transition-all uppercase font-bold select-none ${
                                  installedPlugins.analysis_core 
                                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 hover:bg-red-500/10 hover:text-red-400' 
                                    : 'bg-slate-400 text-slate-950 hover:bg-slate-305'
                                }`}
                              >
                                {installedPlugins.analysis_core ? 'ATIVO' : 'ATIVAR'}
                              </button>
                            </div>
                            
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-4 font-sans">
                              Este conecta premissas fundamentais de dividendos imobiliários históricos de fundos via B3. Traz algoritmos computacionais para o modelo Gordon Growth / DDM de cap rate.
                            </p>
                          </div>
                          <div className="text-[9px] bg-slate-950 font-mono p-1.5 rounded text-sky-450 border border-slate-850/60 inline-block">
                            * Destrava agentes: <strong>Model Builder</strong> e <strong>Morning Note</strong>
                          </div>
                        </div>

                        {/* Plugin 2 */}
                        <div className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-full ${
                          installedPlugins.equity_research
                            ? 'bg-purple-500/5 border-purple-500/35 shadow-md shadow-purple-500/5'
                            : 'bg-slate-950 border-slate-850 opacity-60 hover:opacity-90'
                        }`}>
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-2 rounded-lg ${installedPlugins.equity_research ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-900 text-slate-500'}`}>
                                  <FileText size={15} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black uppercase text-slate-200 font-sans">Equity Research</h4>
                                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black font-mono">Balanços e CVM</span>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setInstalledPlugins(prev => ({ ...prev, 'equity_research': !prev.equity_research }))}
                                className={`text-[9.5px] font-mono px-2 py-1 rounded cursor-pointer transition-all uppercase font-bold select-none ${
                                  installedPlugins.equity_research 
                                    ? 'bg-purple-500/15 text-purple-450 border border-purple-500/30 hover:bg-red-500/10 hover:text-red-400' 
                                    : 'bg-slate-400 text-slate-950 hover:bg-slate-305'
                                }`}
                              >
                                {installedPlugins.equity_research ? 'ATIVO' : 'ATIVAR'}
                              </button>
                            </div>
                            
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-4 font-sans">
                              Ativa leituras profundas de atas de Conselhos e comunicados de Fatos Relevantes. Perfeito para auditar desvios de consensos em receitas e vacância física.
                            </p>
                          </div>
                          <div className="text-[9px] bg-slate-950 font-mono p-1.5 rounded text-purple-400 border border-slate-850/60 inline-block">
                            * Destrava agentes: <strong>Earnings Reviewer</strong> e <strong>Resultados</strong>
                          </div>
                        </div>

                        {/* Plugin 3 */}
                        <div className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-full ${
                          installedPlugins.wealth_mgmt
                            ? 'bg-emerald-500/5 border-emerald-500/35 shadow-md shadow-emerald-500/5'
                            : 'bg-slate-950 border-slate-850 opacity-60 hover:opacity-90'
                        }`}>
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-2 rounded-lg ${installedPlugins.wealth_mgmt ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                                  <Layers size={15} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black uppercase text-slate-200 font-sans">Wealth Management</h4>
                                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">Aportes & Rebalanceamento</span>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setInstalledPlugins(prev => ({ ...prev, 'wealth_mgmt': !prev.wealth_mgmt }))}
                                className={`text-[9.5px] font-mono px-2 py-1 rounded cursor-pointer transition-all uppercase font-bold select-none ${
                                  installedPlugins.wealth_mgmt 
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400' 
                                    : 'bg-slate-400 text-slate-950 hover:bg-slate-305'
                                }`}
                              >
                                {installedPlugins.wealth_mgmt ? 'ATIVO' : 'ATIVAR'}
                              </button>
                            </div>
                            
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-4 font-sans">
                              Compara pesos de ativos e pesos-meta ideais da carteira activa. Calcula a alocação exata da massa de novos aportes priorizando ativos com maior desprovimento.
                            </p>
                          </div>
                          <div className="text-[9px] bg-slate-950 font-mono p-1.5 rounded text-emerald-400 border border-slate-850/60 inline-block">
                            * Destrava agentes: <strong>Market Researcher</strong> e <strong>Sugestão</strong>
                          </div>
                        </div>

                        {/* Plugin 4 */}
                        <div className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between h-full ${
                          installedPlugins.data_connectors
                            ? 'bg-amber-500/5 border-amber-500/35 shadow-md shadow-amber-500/5'
                            : 'bg-slate-950 border-slate-850 opacity-60 hover:opacity-90'
                        }`}>
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className={`p-2 rounded-lg ${installedPlugins.data_connectors ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-900 text-slate-500'}`}>
                                  <Database size={15} />
                                </div>
                                <div>
                                  <h4 className="text-xs font-black uppercase text-slate-200 font-sans">Data Connectors</h4>
                                  <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">Conectores de APIs</span>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setInstalledPlugins(prev => ({ ...prev, 'data_connectors': !prev.data_connectors }))}
                                className={`text-[9.5px] font-mono px-2 py-1 rounded cursor-pointer transition-all uppercase font-bold select-none ${
                                  installedPlugins.data_connectors 
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-red-500/10 hover:text-red-400' 
                                    : 'bg-slate-400 text-slate-950 hover:bg-slate-305'
                                }`}
                              >
                                {installedPlugins.data_connectors ? 'ATIVO' : 'ATIVAR'}
                              </button>
                            </div>
                            
                            <p className="text-[10px] text-slate-400 leading-relaxed mb-4 font-sans">
                              Instala barramentos de protocolo no host do Claude Desktop. Habilita conexões dedicadas a serviços terceiros como FactSet, S&P Capital IQ e Bloomberg de forma nativa.
                            </p>
                          </div>
                          <div className="text-[9px] bg-slate-950 font-mono p-1.5 rounded text-amber-400 border border-slate-850/60 inline-block">
                            * Destrava conectores: <strong>Bloomberg, FactSet e Google Drive</strong>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* BOTTOM QUICK INSTRUCTION STEPPER FOR THE USER */}
                <div className="mt-8 border-t border-slate-850 pt-5 text-left bg-slate-950/20 p-4 rounded-xl animate-none">
                  <h4 className="text-xs font-black uppercase text-zinc-300 font-sans mb-3 flex items-center gap-1.5 leading-none">
                    <Sparkles size={13} className="text-sky-400 animate-pulse" />
                    Como Replicar isso em Produção no seu Claude Desktop:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[10px] leading-relaxed text-slate-400 font-sans">
                    <div className="space-y-1">
                      <span className="font-bold text-white block">1. Aba Cowork</span>
                      <p>Mude o seletor no topo do seu Claude Premium de <strong>&ldquo;Chat&rdquo;</strong> para <strong>&ldquo;Cowork&rdquo;</strong>.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">2. Personalizar</span>
                      <p>Na lateral esquerda, clique em <strong>Customize</strong> e depois em <strong>Browse plugins / Procurar plugins</strong>.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">3. GitHub Repo</span>
                      <p>Em <strong>Pessoal (Personal)</strong>, clique no botão <strong>+</strong>, escolha <strong>Github Marketplace</strong> e adicione o link oficial.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-white block">4. Selecionar & Ativar</span>
                      <p>Selecione as 4 extensões (Financial, Equity, Wealth, Connectors) e marque Ativo. Pronto, pronto para automatizar!</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Quick link button to go operate */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('agents_operations')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-sky-500/10 cursor-pointer hover:scale-[1.02] transition-all font-sans select-none"
            >
              Ir para a Central de Agentes & Orquestrar
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

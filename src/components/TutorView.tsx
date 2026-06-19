/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  GraduationCap, 
  Sparkles, 
  User, 
  Bot, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { AVAILABLE_FIIS } from '../data';
import { ChatMessage } from '../types';

interface TutorViewProps {
  initialSymbol?: string;
  onClearSymbol?: () => void;
}

export default function TutorView({ initialSymbol, onClearSymbol }: TutorViewProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Olá! Sou o **Tutor de FIIs.IA**, seu assistente especializado em Fundos Imobiliários brasileiros. Posso tirar dúvidas sobre valuation, vacância, tributação, relatórios gerenciais e analisar as métricas de qualquer fundo. \n\nNo que posso ajudar você hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Qual o melhor FII de Logística hoje?',
    'Como funciona a tributação dos dividendos de FII?',
    'O que significa a métrica P/VP?',
    'Análise rápida do fundo HGLG11',
    'Diferença de investir em FIIs de Tijolo e Papel'
  ];

  // Scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. Mock smart assistant responses for Brazil FII topics
    setTimeout(() => {
      let reply = '';
      const query = text.toLowerCase();

      if (query.includes('hglg11') || query.includes('cshg')) {
        reply = `O **HGLG11** (CSHG Logística) é amplamente considerado um dos fundos de logística mais robustos da bolsa:
        \n- **Preço Justo calculado por IA**: R$ 168.50 (comparado ao preço de mercado de R$ 161.42), fornecendo uma excelente margem de segurança.
        - **P/VP**: 1.02x, indicando que está negociando próximo ao seu valor de patrimônio líquido real.
        - **Vacância física**: Apenas 2.1%. Isso indica alta demanda física pelos seus galpões, a maioria de classe AAA.
        - **Dividend Yield**: 9.32% ao ano, com histórico extremamente resiliente.
        \n*Recomendação do Tutor*: Excelente ativo para compor a base de tijolo da sua carteira pela qualidade dos galpões localizados ao redor da grande São Paulo e Rio.`;
      } else if (query.includes('mxrf11') || query.includes('maxi renda')) {
        reply = `O **MXRF11** (Maxi Renda) é o maior fundo imobiliário em número de cotistas na bolsa:
        \n- **Segmento**: Recebíveis imobiliários (Papel). O fundo investe majoritariamente em CRIs (Certificados de Recebíveis Imobiliários).
        - **Dividendos**: Excelente pagador de proventos recorrentes, com dividend yield LTM de **12.85%**.
        - **P/VP**: Atualmente em 1.01x. Deve-se tomar cuidado para não comprar muito acima de 1.05x para ativos de papel.
        - **Valor nominal**: Cotação em torno de R$ 9.82, tornando-o extremamente acessível para investidores de varejo reinvestirem o troco dos dividendos.`;
      } else if (query.includes('tribut') || query.includes('impost') || query.includes('ir')) {
        reply = `Atualmente, os dividendos pagos por Fundos Imobiliários (FIIs) são **totalmente isentos de Imposto de Renda** para pessoas físicas se as seguintes condições forem atendidas:
        \n1. Suas cotas devem ser negociadas exclusivamente em Bolsa (B3).
        2. O fundo deve ter no mínimo 100 cotistas.
        3. Você, individualmente, não pode possuir mais de 10% das cotas do fundo.
        \n*Nota sobre Ganhos de Capital*: A isenção se aplica exclusivamente aos dividendos mensais. Se você vender suas cotas com lucro, esse ganho de capital é tributado em **20%** via pagamento de DARF até o último dia útil do mês subsequente.`;
      } else if (query.includes('p/vp') || query.includes('pvp') || query.includes('valor patrimonial')) {
        reply = `A relação **P/VP** (Preço sobre Valor Patrimonial) é uma das métricas mais importantes na análise de FIIs:
        \n- **P/VP = 1.0**: Significa que o fundo está sendo negociado exatamente pelo valor real estimado de seus imóveis/créditos.
        - **P/VP < 1.0**: Indica que o fundo está com **desconto** (sendo negociado abaixo do valor contábil dos ativos).
        - **P/VP > 1.0**: Indica que o fundo está negociando com **ágio** (ágio de prêmio).
        \n*Diretriz recomendada pelo Tio FIIs*:
        - Para FIIs de **Tijolo** (Galpões, Escritórios, Shoppings), um P/VP ligeiramente abaixo de 1.0 pode representar ótimas oportunidades de comprar imóveis físicos por menos.
        - Para FIIs de **Papel** (Recebíveis), evite comprar com P/VP acima de 1.03x/1.05x, pois você estará pagando ágio sobre dinheiro/créditos líquidos já contratados.`;
      } else if (query.includes('logística') || query.includes('galpão')) {
        reply = `O segmento de **Logística** está muito aquecido no Brasil, impulsionado pelo crescimento permanente do e-commerce das marcas varejistas. Os principais ativos da plataforma recomendados hoje são:
        \n1. **HGLG11**: R$ 161.42 (P/VP 1.02x, Yield 9.32% aa, Vacância 2.1%)
        2. **BTLG11**: R$ 102.15 (P/VP 1.01x, Yield 9.15% aa, Vacância 1.8% - com galpões ultra metropolitanos em SP)
        3. **XPLG11**: R$ 94.60 (P/VP 0.96x, oferecendo excelente margem de desconto de 4%).`;
      } else if (query.includes('diferença') || query.includes('tijolo') || query.includes('papel')) {
        reply = `Essa é uma dúvida fundamental! A principal diferença entre FIIs de Tijolo e FIIs de Papel reside na natureza de seus ativos subjacentes:
        \n- **FIIs de Tijolo (Ativos Reais fisico)**: Investem em imóveis físicos construídos (galpões, shoppings, lajes). A receita vem dos aluguéis reajustados anualmente pela inflação (IPCA/IGP-M). Oferecem proteção real ao longo de décadas pois os tijolos acompanham o valor do solo urbano.
        - **FIIs de Papel (Ativos Financeiros)**: Investem em títulos de dívida lastreados em imóveis (principalmente CRIs). Esse crédito rende juros mais um indexador de inflação (ex: IPCA + 6%) ou CDI (ex: CDI + 2%). Os dividendos são geralmente mais altos no curto prazo, mas não há imóveis físicos gerando ganho patrimonial real.
        \n*Dica do Tio FIIs*: Tenha uma carteira equilibrada com cerca de 50% de tijolos e 50% de papéis para conjugar ganho de capital real e alto rendimento constante.`;
      } else {
        reply = `Excelente questionamento sobre o mercado imobiliário! 
        \nCom base nas métricas consolidadas na plataforma **FIIs.IA**, os ativos mais recomendados para essa dinâmica são **HGLG11** e **MXRF11**, que garantem um balanço perfeito de Dividend Yield mensal elevado e baixo risco de desvalorização física.
        \nPara estruturarmos uma simulação estatística desse impacto no seu portfólio, recomendo abrir a aba **Direcionador** ou simular os preços justos na aba **Precificação**. Posso detalhar o que mais desejar!`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Trigger initial chat message on mount if initialSymbol is provided
  useEffect(() => {
    if (initialSymbol) {
      handleSendMessage(`Análise rápida do fundo ${initialSymbol}`);
      if (onClearSymbol) {
        onClearSymbol();
      }
    }
  }, [initialSymbol]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-140px)]" id="tutor-chat-wrapper">
      
      {/* Sidebar Suggestions */}
      <div className="xl:col-span-1 bg-[#020617]/70 border border-[#1e293b] rounded-xl p-5 space-y-5 flex flex-col justify-between shadow-lg" id="chat-sidebar-advice">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1e293b] text-sky-400">
            <BrainCircuit size={18} />
            <h2 className="text-sm font-serif font-bold tracking-tight text-white italic">Tutor de FIIs Inteligente</h2>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
            Selecione uma das perguntas rápidas abaixo ou digite no campo ao lado para obter uma análise quantitativa com nossa inteligência artificial do mercado.
          </p>

          <div className="space-y-2.5 pt-2" id="quick-questions-container">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left text-xs p-3 bg-[#020617] hover:bg-[#1e293b]/50 border border-[#1e293b] hover:border-sky-500/40 rounded-lg text-slate-300 hover:text-white cursor-pointer transition-all duration-300 flex items-center justify-between group"
              >
                <span className="truncate pr-2 font-medium font-sans">{q}</span>
                <ChevronRight size={12} className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Tip Badge */}
        <div className="p-3.5 bg-[#020617]/80 border border-[#1e293b] rounded-lg" id="chat-tips">
          <p className="text-[10px] text-sky-400 font-sans font-bold uppercase tracking-wider">Dica da Suíte:</p>
          <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
            Pergunte por fundos específicos da sua carteira (ex: "Qual o yield do HGLG11?") para obter os dados contábeis consolidados na última cotação da bolsa!
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="xl:col-span-3 bg-[#020617]/70 border border-[#1e293b] rounded-xl flex flex-col overflow-hidden h-full shadow-lg" id="chat-panel">
        
        {/* Chat top header */}
        <div className="p-4 bg-[#020617] border-b border-[#1e293b] flex items-center justify-between" id="chat-header">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-sky-500/10 to-transparent border border-sky-500/25 text-sky-400 rounded-lg">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-black text-white tracking-tight italic">Sessão de Tutoria Cognitiva</h2>
              <span className="text-[10px] text-slate-500 font-mono">Modelo Gemini ativo em português</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] bg-sky-550/5 border border-sky-500/15 px-2.5 py-1 rounded-md text-slate-300 font-sans">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full"></span>
            Chat Protegido
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans bg-[#020617]/40" id="chat-messages-scroll">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                  isBot 
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' 
                    : 'bg-violet-500/10 text-violet-400 border-violet-500/20 font-bold text-xs'
                }`}>
                  {isBot ? <Bot size={13} /> : <User size={13} />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                  isBot 
                    ? 'bg-[#020617] border-[#1e293b] text-slate-200 rounded-tl-sm' 
                    : 'bg-[#1e293b]/60 border-sky-500/20 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-sky-500/10 text-sky-400 border-sky-500/20 shrink-0">
                <Bot size={13} className="animate-spin" />
              </div>
              <div className="p-4 rounded-xl border bg-[#020617] border-[#1e293b] text-slate-400 rounded-tl-sm text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-200"></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce delay-300"></span>
                Analisando métricas de mercado...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Action input bar */}
        <div className="p-4 bg-[#020617] border-t border-[#1e293b]" id="chat-input-bar">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-3"
          >
            <input 
              type="text"
              placeholder="Pergunte sobre vacância do HGLG11, dividendos do MXRF11 ou dicas de diversificação..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#020617] border border-[#1e293b] focus:border-sky-400 rounded-lg px-4 py-3 text-xs text-white outline-none font-sans"
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold border-none rounded-lg transition-all cursor-pointer shadow-md flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

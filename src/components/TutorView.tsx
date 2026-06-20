/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  User,
  Bot,
  ChevronRight,
  BrainCircuit,
  Plus,
  MessageSquare,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { ChatMessage } from '../types';

interface TutorViewProps {
  initialSymbol?: string;
  onClearSymbol?: () => void;
}

interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

const SUGGESTED_QUESTIONS = [
  'Qual o melhor FII de Logística hoje?',
  'Como funciona a tributação dos dividendos de FII?',
  'O que significa a métrica P/VP?',
  'Análise rápida do fundo HGLG11',
  'Diferença entre FIIs de Tijolo e Papel',
  'Como calcular o preço teto de um FII?'
];

const WELCOME_MESSAGE: ChatMessage = {
  id: '1',
  sender: 'assistant',
  text: 'Olá! Sou o **Tutor de FIIs**, seu assistente especializado em Fundos Imobiliários brasileiros.\n\nPosso tirar dúvidas sobre valuation, vacância, tributação, relatórios gerenciais e analisar métricas de qualquer fundo.\n\nNo que posso ajudar você hoje?',
  timestamp: new Date()
};

function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem('fiis_ia_conversations');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem('fiis_ia_conversations', JSON.stringify(convs));
  } catch {}
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days} dia${days > 1 ? 's' : ''}`;
}

export default function TutorView({ initialSymbol, onClearSymbol }: TutorViewProps = {}) {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string | null>(() => {
    const convs = loadConversations();
    return convs.length > 0 ? convs[0].id : null;
  });
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const convs = loadConversations();
    if (convs.length > 0) return convs[0].messages;
    return [WELCOME_MESSAGE];
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const persistConversation = (id: string, msgs: ChatMessage[], title?: string) => {
    setConversations(prev => {
      const existing = prev.find(c => c.id === id);
      let updated: Conversation[];
      if (existing) {
        updated = prev.map(c => c.id === id ? { ...c, messages: msgs, title: title || c.title } : c);
      } else {
        const newConv: Conversation = {
          id,
          title: title || 'Nova conversa',
          messages: msgs,
          createdAt: new Date().toISOString()
        };
        updated = [newConv, ...prev];
      }
      saveConversations(updated);
      return updated;
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setError('');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    // Build history for API (exclude welcome message)
    const history = newMessages
      .filter(m => m.id !== '1')
      .slice(0, -1) // exclude current user message (sent separately)
      .map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: m.text }));

    try {
      const response = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      const result = await response.json();

      if (result.success) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: result.reply,
          timestamp: new Date()
        };
        const finalMessages = [...newMessages, assistantMsg];
        setMessages(finalMessages);

        // Auto-generate title from first user message
        const title = text.length > 40 ? text.slice(0, 40) + '...' : text;
        const convId = activeId || Date.now().toString();
        if (!activeId) setActiveId(convId);
        persistConversation(convId, finalMessages, title);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a IA. Tente novamente.');
      setMessages(newMessages); // revert to before bot reply
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = () => {
    const newId = Date.now().toString();
    setActiveId(newId);
    setMessages([WELCOME_MESSAGE]);
    setInputText('');
    setError('');
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveId(conv.id);
    setMessages(conv.messages);
    setError('');
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    saveConversations(updated);
    if (activeId === id) {
      if (updated.length > 0) {
        setActiveId(updated[0].id);
        setMessages(updated[0].messages);
      } else {
        setActiveId(null);
        setMessages([WELCOME_MESSAGE]);
      }
    }
  };

  // Trigger initial message if coming from another view
  useEffect(() => {
    if (initialSymbol) {
      handleNewConversation();
      setTimeout(() => handleSendMessage(`Análise rápida do fundo ${initialSymbol}`), 100);
      if (onClearSymbol) onClearSymbol();
    }
  }, [initialSymbol]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-140px)]" id="tutor-chat-wrapper">

      {/* Sidebar — Conversation History */}
      <div className="xl:col-span-1 bg-[#020617]/70 border border-[#1e293b] rounded-xl flex flex-col overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <BrainCircuit size={16} />
            <span className="text-xs font-bold text-white font-sans">Tutor de FIIs</span>
          </div>
        </div>

        {/* New conversation button */}
        <div className="p-3 border-b border-[#1e293b]">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-bold font-sans transition-all cursor-pointer"
          >
            <Plus size={13} />
            Nova conversa
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-[11px] text-slate-500 font-sans">Suas conversas aparecerão aqui</p>
              <div className="mt-3 space-y-1.5">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left text-[10px] p-2 bg-[#020617] hover:bg-[#1e293b]/50 border border-[#1e293b] hover:border-sky-500/30 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-all flex items-center gap-1.5 font-sans"
                  >
                    <ChevronRight size={10} className="text-sky-500 shrink-0" />
                    <span className="truncate">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`group flex items-start gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${
                  activeId === conv.id
                    ? 'bg-[#1e293b] border border-[#334155]'
                    : 'hover:bg-[#1e293b]/40 border border-transparent'
                }`}
              >
                <MessageSquare size={12} className="text-sky-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-200 truncate font-sans">{conv.title}</p>
                  <p className="text-[10px] text-slate-500 font-sans">{timeAgo(conv.createdAt)}</p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-500 transition-all cursor-pointer"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-3 border-t border-[#1e293b]">
          <p className="text-[9px] text-slate-600 font-sans leading-relaxed">
            Ferramenta educacional. Não constitui recomendação de investimento.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="xl:col-span-3 bg-[#020617]/70 border border-[#1e293b] rounded-xl flex flex-col overflow-hidden h-full shadow-lg">

        {/* Header */}
        <div className="p-4 bg-[#020617] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-sky-500/10 to-transparent border border-sky-500/25 text-sky-400 rounded-lg">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-black text-white tracking-tight italic">Tutor de FIIs Inteligente</h2>
              <span className="text-[10px] text-slate-500 font-mono">Gemini AI · Especialista em FIIs brasileiros</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] bg-sky-550/5 border border-sky-500/15 px-2.5 py-1 rounded-md text-slate-300 font-sans">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            IA Ativa
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans bg-[#020617]/40">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${
                  isBot ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                }`}>
                  {isBot ? <Bot size={13} /> : <User size={13} />}
                </div>
                <div className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                  isBot ? 'bg-[#020617] border-[#1e293b] text-slate-200 rounded-tl-sm' : 'bg-[#1e293b]/60 border-sky-500/20 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-sky-500/10 text-sky-400 border-sky-500/20 shrink-0">
                <Bot size={13} className="animate-spin" />
              </div>
              <div className="p-4 rounded-xl border bg-[#020617] border-[#1e293b] text-slate-400 rounded-tl-sm text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                Analisando...
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-sans max-w-[85%]">
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions (only on fresh conversation) */}
        {messages.length <= 1 && (
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="text-[10px] px-3 py-1.5 rounded-full border border-[#1e293b] hover:border-sky-500/40 bg-[#020617] text-slate-400 hover:text-white transition-all cursor-pointer font-sans"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="p-4 bg-[#020617] border-t border-[#1e293b]">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            className="flex gap-3"
          >
            <input
              type="text"
              placeholder="Pergunte sobre vacância, dividendos, P/VP, preço teto..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#020617] border border-[#1e293b] focus:border-sky-400 rounded-lg px-4 py-3 text-xs text-white outline-none font-sans"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
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

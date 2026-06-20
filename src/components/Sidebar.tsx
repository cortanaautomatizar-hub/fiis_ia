/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  GraduationCap, 
  Compass, 
  Scale, 
  DollarSign, 
  Grid,
  RefreshCw,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    {
      id: 'sync_b3',
      label: 'Sincronizar B3',
      subtitle: 'Importação de Custódia',
      icon: RefreshCw,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Central de análises',
      icon: Grid,
    },
    {
      id: 'analisador',
      label: 'Analisador',
      subtitle: 'Análise de carteira',
      icon: BarChart3,
    },
    {
      id: 'tutor',
      label: 'Tutor de FIIs',
      subtitle: 'Tire suas dúvidas',
      icon: GraduationCap,
    },
    {
      id: 'precificacao',
      label: 'Precificação',
      subtitle: 'Valuation de FIIs',
      icon: DollarSign,
    },
    {
      id: 'direcionador',
      label: 'Direcionador',
      subtitle: 'Direcione seus aportes',
      icon: Compass,
    },
    {
      id: 'enquadramento',
      label: 'Enquadramento',
      subtitle: 'Plano de rebalanceamento',
      icon: Scale,
    },
  ];

  return (
    <div className="w-[280px] bg-[#020617] border-r border-[#1e293b] text-white flex flex-col h-full select-none shrink-0" id="fiis-sidebar">
      {/* Logo */}
      <div className="h-[76px] flex items-center px-6 border-b border-[#1e293b]/80 gap-3" id="sidebar-logo">
        <div className="flex gap-1 items-end h-6">
          <div className="w-1 h-5 bg-[#0284c7] rounded-sm transition-all duration-300 hover:h-6"></div>
          <div className="w-1 h-3.5 bg-sky-400 rounded-sm transition-all duration-300 hover:h-5"></div>
          <div className="w-1 h-5.5 bg-sky-500 rounded-sm transition-all duration-300 hover:h-7"></div>
        </div>
        <div className="font-sans text-xl font-bold tracking-tight flex items-baseline">
          <span className="text-white font-black text-xl tracking-tighter">FIIs</span>
          <span className="text-sky-400 font-black text-xl">.IA</span>
        </div>
      </div>

      {/* Nav Section Label */}
      <div className="px-6 pt-8 pb-3" id="sidebar-section-label">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] font-sans">
          MENU DE NAVEGAÇÃO
        </p>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto" id="sidebar-navigation">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          const IconComponent = item.icon;

          return (
            <button
               key={item.id}
               id={`sidebar-item-${item.id}`}
               onClick={() => onViewChange(item.id)}
               className={`w-full text-left flex items-start p-3 rounded-lg transition-all duration-250 group relative ${
                 isActive
                   ? 'bg-[#1e293b] text-slate-100 border border-[#334155] shadow-sm font-semibold'
                   : 'text-slate-400 hover:text-white hover:bg-[#1e293b]/40 border border-transparent'
               }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-md shrink-0 ${isActive ? 'text-sky-450' : 'text-slate-500 group-hover:text-sky-400'}`}>
                  <IconComponent size={18} className="stroke-[2px]" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[13px] leading-tight tracking-tight font-sans font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[10px] mt-0.5 leading-none transition-colors ${isActive ? 'text-sky-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {item.subtitle}
                  </span>
                </div>
              </div>
              
              {isActive && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer copyright */}
      <div className="p-4 border-t border-[#1e293b]/60 text-center" id="sidebar-footer">
        <p className="text-[10px] text-slate-500 font-mono tracking-tight">
          &copy; 2026 FIIs.IA &bull; Editorial Suite
        </p>
      </div>
    </div>
  );
}

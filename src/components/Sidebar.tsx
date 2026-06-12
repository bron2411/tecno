import { Shield, LayoutDashboard, ShoppingCart, Users, Package, Wrench, Receipt, PhoneCall } from 'lucide-react';
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export function Sidebar({ currentView, onChangeView }: SidebarProps) {
  const menuItems: { id: ViewState; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'CLIENT', label: 'Portal Cliente', icon: <ShoppingCart size={20} />, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'SALES', label: 'Ventas (1)', icon: <LayoutDashboard size={20} />, color: 'bg-blue-50 text-blue-700' },
    { id: 'OPS', label: 'Operaciones (2)', icon: <Users size={20} />, color: 'bg-emerald-50 text-emerald-700' },
    { id: 'LOGISTICS', label: 'Logística / Inv. (3)', icon: <Package size={20} />, color: 'bg-amber-50 text-amber-700' },
    { id: 'TECH', label: 'Técnicos (4)', icon: <Wrench size={20} />, color: 'bg-rose-50 text-rose-700' },
    { id: 'BILLING', label: 'Facturación (5)', icon: <Receipt size={20} />, color: 'bg-purple-50 text-purple-700' },
    { id: 'POST_SALE', label: 'Postventa', icon: <PhoneCall size={20} />, color: 'bg-sky-50 text-sky-700' },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-white flex flex-col border-r border-slate-700 relative z-20">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold tracking-tight text-blue-400">TecnoInnova S.A.</h1>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-slate-400">Sistemas de Seguridad</p>
      </div>
      
      <div className="flex-1 py-6">
        <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Módulos del ERP
        </div>
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                currentView === item.id
                  ? 'bg-blue-600/20 text-blue-400 font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className={`shrink-0 w-2 h-2 rounded-full ${currentView === item.id ? 'bg-blue-400' : 'bg-slate-600'}`} />
              <span className={currentView === item.id ? 'text-blue-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        TecnoInnova OS v1.0
      </div>
    </aside>
  );
}

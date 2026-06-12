import React from 'react';
import { Order, Technician } from '../types';
import { Wrench, Calendar as CalIcon, MapPin, CheckCircle2, User } from 'lucide-react';

interface Props {
  orders: Order[];
  technicians: Technician[];
  onComplete: (orderId: string) => void;
}

export function TechView({ orders, technicians, onComplete }: Props) {
  const scheduledOrders = orders.filter(o => o.status === 'SCHEDULED').sort((a, b) => {
    return (new Date(a.scheduledDate || '').getTime()) - (new Date(b.scheduledDate || '').getTime());
  });

  const getTechName = (id?: string) => technicians.find(t => t.id === id)?.name || 'Desconocido';

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="border-b-2 border-blue-500 pb-2 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Wrench className="text-blue-600" size={24} />
            Portal de Técnicos
          </h2>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 italic mt-1">Cronograma de Instalaciones</h3>
        </div>
      </div>

      {scheduledOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-800">Sin trabajos programados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scheduledOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center module-header !mb-0 !border-b-0">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                  <CalIcon size={14} />
                  {order.scheduledDate}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white border border-slate-200 rounded">
                  <User size={10} />
                  {getTechName(order.technicianId)}
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{order.clientName}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>{order.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                    <Wrench size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800">{order.serviceType}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{order.details}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded p-3 mb-2 border border-blue-100">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-700">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                    Firma de cliente recolectada (Reporte adjunto).
                  </label>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-white">
                <button
                  onClick={() => onComplete(order.id)}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 size={14} />
                  Completar Instalación
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

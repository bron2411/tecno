import React, { useState } from 'react';
import { Order } from '../types';
import { PhoneCall, Star, Send } from 'lucide-react';

interface Props {
  orders: Order[];
  onFeedback: (orderId: string, level: 'Good' | 'Average' | 'Poor', notes: string) => void;
}

export function PostSalesView({ orders, onFeedback }: Props) {
  // Show orders that have been invoiced and need follow up
  const followUpOrders = orders.filter(o => o.status === 'INVOICED');
  
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [level, setLevel] = useState<'Good' | 'Average' | 'Poor'>('Good');
  const [notes, setNotes] = useState('');

  const handleSubmit = (orderId: string) => {
    onFeedback(orderId, level, notes);
    setActiveForm(null);
    setNotes('');
    setLevel('Good');
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="border-b-2 border-blue-500 pb-2 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <PhoneCall className="text-blue-600" size={24} />
            Seguimiento Postventa
          </h2>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 italic mt-1">Alertas de Calidad</h3>
        </div>
      </div>

      {followUpOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-800">Al día</p>
          <p className="text-sm">No hay alertas de seguimiento pendientes.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {followUpOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Llamada Pendiente
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">{order.clientName}</h3>
                <p className="text-xs text-slate-600 mb-3">Teléfono: <span className="font-bold">{order.phone}</span></p>
                
                <div className="bg-slate-50 rounded p-3 text-xs border border-slate-100">
                  <span className="font-bold text-slate-700">Servicio:</span> {order.serviceType} <br/>
                  <span className="text-slate-500">{order.details}</span>
                </div>
              </div>

              <div className="bg-blue-50 md:w-80 p-5 border-t md:border-t-0 md:border-l border-blue-100 flex flex-col justify-center">
                {activeForm === order.id ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nivel de Satisfacción</label>
                      <select 
                        className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                      >
                        <option value="Good">🟢 Excelente / Bueno</option>
                        <option value="Average">🟡 Regular / Con observaciones</option>
                        <option value="Poor">🔴 Malo / Reclamo</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Notas / Comentarios</label>
                      <textarea 
                        className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                        rows={3}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActiveForm(null)}
                        className="flex-1 py-1.5 bg-white border border-slate-300 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => handleSubmit(order.id)}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider rounded flex justify-center items-center gap-1"
                      >
                        <Send size={12} />
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveForm(order.id)}
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Star size={14} />
                    Registrar Satisfacción
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

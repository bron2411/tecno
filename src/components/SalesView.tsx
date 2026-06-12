import React from 'react';
import { Order } from '../types';
import { Check, X, Building, MapPin, Clock, AlertCircle } from 'lucide-react';

interface Props {
  orders: Order[];
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
}

export function SalesView({ orders, onUpdateOrder }: Props) {
  const pendingOrders = orders.filter(o => o.status === 'PENDING');

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="border-b-2 border-blue-500 pb-2 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gestión de Ventas</h2>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 italic mt-1">Validación Técnica y Financiera</h3>
        </div>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <Check className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-800">Mesa limpia</p>
          <p className="text-sm">No hay solicitudes pendientes de revisión.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Pendiente de Revisión
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(order.dateRequested).toLocaleString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <Building className="text-slate-400" size={20} />
                    {order.clientName}
                  </h3>
                  
                  <div className="text-slate-600 space-y-1 mb-4">
                    <p className="flex items-start gap-2">
                      <MapPin className="text-slate-400 shrink-0 mt-1" size={16} />
                      <span>{order.address}</span>
                    </p>
                    <p className="pl-6"><span className="font-medium text-slate-700">Servicio solicitado:</span> {order.serviceType}</p>
                    <p className="pl-6"><span className="font-medium text-slate-700">Detalles:</span> {order.details}</p>
                    <p className="pl-6"><span className="font-medium text-slate-700">Teléfono:</span> {order.phone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer"
                      checked={order.technicallyFeasible || false}
                      onChange={(e) => onUpdateOrder(order.id, { technicallyFeasible: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                      Viabilidad técnica (Zona) ok
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer"
                      checked={order.financiallyCleared || false}
                      onChange={(e) => onUpdateOrder(order.id, { financiallyCleared: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                      Historial financiero ok
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="bg-slate-50 md:w-64 p-6 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center gap-3">
                <button
                  disabled={!order.technicallyFeasible || !order.financiallyCleared}
                  onClick={() => onUpdateOrder(order.id, { status: 'APPROVED' })}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={14} />
                  Aprobar Pedido
                </button>
                <button
                  onClick={() => onUpdateOrder(order.id, { status: 'REJECTED' })}
                  className="w-full py-2 px-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <X size={14} />
                  Rechazar
                </button>
                
                {(!order.technicallyFeasible || !order.financiallyCleared) && (
                  <p className="text-xs text-amber-600 flex items-start gap-1 mt-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>Requiere validación para aprobar.</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

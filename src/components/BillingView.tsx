import React from 'react';
import { Order } from '../types';
import { Receipt, FileText, CheckCircle } from 'lucide-react';

interface Props {
  orders: Order[];
  onInvoice: (orderId: string) => void;
}

export function BillingView({ orders, onInvoice }: Props) {
  const completedOrders = orders.filter(o => o.status === 'COMPLETADO');

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="border-b-2 border-blue-500 pb-2 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="text-blue-600" size={24} />
            Facturación
          </h2>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 italic mt-1">Emisión y Cobranza</h3>
        </div>
      </div>

      {completedOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-800">Al día</p>
          <p className="text-sm">No hay instalaciones pendientes de facturar.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {completedOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-md font-bold text-slate-800">{order.clientName}</h3>
                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="font-mono">ID: {order.id}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">{order.serviceType}</span>
                  </div>
                  {order.requestedProducts && order.requestedProducts.length > 0 && (
                    <div className="mt-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Productos Requeridos:</span>
                      <ul className="list-disc list-inside mt-0.5">
                        {order.requestedProducts.map(p => (
                          <li key={p.productId}>{p.quantity}x {p.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full sm:w-auto flex shrink-0">
                <button
                  onClick={() => onInvoice(order.id)}
                  className="w-full sm:w-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Receipt size={14} />
                  Emitir Factura
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

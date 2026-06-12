import React from 'react';
import { Product } from '../types';
import { PackageSearch, AlertTriangle, ArrowUpRight, Box } from 'lucide-react';

interface Props {
  products: Product[];
  onRequestRestock: (productId: string) => void;
}

export function LogisticsView({ products, onRequestRestock }: Props) {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="border-b-2 border-blue-500 pb-2 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Box className="text-blue-600" size={24} />
            Control de Inventario
          </h2>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 italic mt-1">Gestión de Stock y Reposiciones</h3>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded p-2 text-amber-800 text-[10px] flex items-center gap-2 max-w-[200px]">
          <AlertTriangle size={16} className="text-amber-500 shrink-0" />
          <p><strong>Reposición Auto:</strong> Activa basado en reservas.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm">Inventario Actual</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 border-b text-[11px] uppercase text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Código</th>
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Stock Físico</th>
                <th className="p-4 font-semibold">Reservado</th>
                <th className="p-4 font-semibold">Disponible Real</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => {
                const available = product.stock - product.reserved;
                const isLowStock = available < 5;

                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-500">{product.id}</td>
                    <td className="p-4 text-xs font-bold text-slate-800">{product.name}</td>
                    <td className="p-4 text-xs text-slate-700">{product.stock}</td>
                    <td className="p-4 text-xs text-red-600 font-bold">{product.reserved}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        isLowStock 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {available} unds
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onRequestRestock(product.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                      >
                        <ArrowUpRight size={12} />
                        Reponer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

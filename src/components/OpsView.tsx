import React, { useState } from 'react';
import { Order, Technician } from '../types';
import { Calendar, User, CheckCircle, ClipboardList, MapPin } from 'lucide-react';

interface Props {
  orders: Order[];
  technicians: Technician[];
  onSchedule: (orderId: string, technicianId: string, date: string) => void;
}

export function OpsView({ orders, technicians, onSchedule }: Props) {
  const approvedOrders = orders.filter(o => o.status === 'APPROVED');
  const [assignments, setAssignments] = useState<Record<string, { techId: string; date: string }>>({});

  const handleAssignmentChange = (orderId: string, field: 'techId' | 'date', value: string) => {
    setAssignments(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="border-b-2 border-blue-500 pb-2 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} />
            Operaciones y Despacho
          </h2>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 italic mt-1">Asignación y Programación</h3>
        </div>
      </div>

      {approvedOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center text-slate-500">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-800">No hay pedidos por programar</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {approvedOrders.map(order => {
            const assignment = assignments[order.id] || { techId: '', date: '' };
            const canSchedule = assignment.techId !== '' && assignment.date !== '';

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Listo para Programar
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {order.id}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{order.clientName}</h3>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mb-2">
                    <MapPin size={14} className="text-slate-400" />
                    {order.address}
                  </p>
                  
                  <div className="bg-slate-50 rounded p-3 text-sm border border-slate-100">
                    <span className="font-medium text-slate-700">Servicio:</span> {order.serviceType}
                    <br />
                    <span className="font-medium text-slate-700">Detalles:</span> {order.details}
                  </div>
                </div>

                <div className="bg-slate-50 md:w-80 p-6 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 uppercase tracking-wider">
                      <User size={14} /> Asignar Técnico
                    </label>
                    <select
                      className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={assignment.techId}
                      onChange={(e) => handleAssignmentChange(order.id, 'techId', e.target.value)}
                    >
                      <option value="">Seleccione un técnico...</option>
                      {technicians.map(tech => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name} ({tech.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 uppercase tracking-wider">
                      <Calendar size={14} /> Fecha de Instalación
                    </label>
                    <input
                      type="date"
                      className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={assignment.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleAssignmentChange(order.id, 'date', e.target.value)}
                    />
                  </div>

                  <button
                    disabled={!canSchedule}
                    onClick={() => onSchedule(order.id, assignment.techId, assignment.date)}
                    className="w-full mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={14} />
                    Confirmar Programación
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

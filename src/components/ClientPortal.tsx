import React, { useState } from 'react';
import { Order } from '../types';
import { ShieldCheck, Plus } from 'lucide-react';

interface Props {
  onCreateOrder: (order: Omit<Order, 'id' | 'status' | 'dateRequested'>) => void;
}

export function ClientPortal({ onCreateOrder }: Props) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    address: '',
    serviceType: 'Cámaras de videovigilancia',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateOrder(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        clientName: '',
        phone: '',
        address: '',
        serviceType: 'Cámaras de videovigilancia',
        details: ''
      });
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#0f172a] px-8 py-8 text-white border-b-4 border-blue-600">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-blue-400" size={28} />
            <h2 className="text-2xl font-bold tracking-tight text-white">Solicitar Instalación</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Protege tu hogar o negocio con TecnoInnova. Completa el formulario y nos contactaremos para evaluar la factibilidad.
          </p>
        </div>

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">¡Pedido Recibido!</h3>
              <p className="text-slate-600">Nuestro equipo revisará tu solicitud y se pondrá en contacto pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Nombre Completo / Empresa</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Teléfono</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Dirección de Instalación</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Tipo de Servicio</label>
                <select
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option>Cámaras de videovigilancia</option>
                  <option>Sensores de movimiento</option>
                  <option>Sistemas de Alarmas</option>
                  <option>Control de Acceso</option>
                  <option>Mantenimiento de Equipos</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Detalles Adicionales</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all resize-none"
                  placeholder="Describe brevemente tus necesidades específicas..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white text-sm font-bold uppercase tracking-wider py-2.5 rounded hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 mt-4"
                >
                  <Plus size={16} />
                  Enviar Solicitud
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

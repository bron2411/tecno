import React, { useState } from 'react';
import { Order, Product } from '../types';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

interface Props {
  onCreateOrder: (order: Omit<Order, 'id' | 'status' | 'dateRequested'>) => void;
  products: Product[];
}

export function ClientPortal({ onCreateOrder, products }: Props) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    address: '',
    serviceType: 'Cámaras de videovigilancia',
    details: ''
  });
  
  const [selectedProducts, setSelectedProducts] = useState<{productId: string, quantity: number, name: string}[]>([]);
  const [currentProduct, setCurrentProduct] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleAddProduct = () => {
    if (!currentProduct) return;
    const prod = products.find(p => p.id === currentProduct);
    if (!prod) return;
    
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.productId === currentProduct);
      if (existing) {
        return prev.map(p => p.productId === currentProduct ? { ...p, quantity: p.quantity + currentQuantity } : p);
      }
      return [...prev, { productId: prod.id, quantity: currentQuantity, name: prod.name }];
    });
    
    setCurrentProduct('');
    setCurrentQuantity(1);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onCreateOrder({ ...formData, requestedProducts: selectedProducts.length > 0 ? selectedProducts : undefined });
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
      setSelectedProducts([]);
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
                <label className="text-sm font-medium text-slate-700">Equipos Requeridos (Opcional)</label>
                <div className="flex gap-2 items-start">
                  <select
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
                    value={currentProduct}
                    onChange={(e) => setCurrentProduct(e.target.value)}
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    className="w-20 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                  />
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    disabled={!currentProduct}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Agregar
                  </button>
                </div>
                
                {selectedProducts.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Productos Seleccionados</h4>
                    {selectedProducts.map(p => (
                      <div key={p.productId} className="flex items-center justify-between bg-white px-3 py-2 border border-slate-100 rounded shadow-sm text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">{p.quantity}x</span>
                          <span className="text-slate-700">{p.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(p.productId)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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

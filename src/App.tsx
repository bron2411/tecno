import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ClientPortal } from './components/ClientPortal';
import { SalesView } from './components/SalesView';
import { OpsView } from './components/OpsView';
import { LogisticsView } from './components/LogisticsView';
import { TechView } from './components/TechView';
import { BillingView } from './components/BillingView';
import { PostSalesView } from './components/PostSalesView';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_TECHNICIANS } from './data';
import { ViewState, Order } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('SALES');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [technicians, setTechnicians] = useState(INITIAL_TECHNICIANS);

  // --- Actions ---

  const handleCreateOrder = (newOrderData: Omit<Order, 'id' | 'status' | 'dateRequested'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: `ORD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      status: 'PENDING',
      dateRequested: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    
    // Simulate automatic reservation based on serviceType if approved
    if (updates.status === 'APPROVED') {
      const order = orders.find(o => o.id === id);
      if (order) {
        setProducts(prev => prev.map(p => {
          if (order.serviceType.toLowerCase().includes('cámara') && p.name.includes('Cámara')) {
            return { ...p, reserved: p.reserved + 2 };
          }
          if (order.serviceType.toLowerCase().includes('alarma') && p.name.includes('Alarma')) {
            return { ...p, reserved: p.reserved + 1 };
          }
          return p;
        }));
      }
    }
  };

  const handleSchedule = (orderId: string, technicianId: string, date: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'SCHEDULED', technicianId, scheduledDate: date } 
        : o
    ));
    setTechnicians(prev => prev.map(t => 
      t.id === technicianId ? { ...t, status: 'Busy' } : t
    ));
  };

  const handleRequestRestock = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock + 10 } : p
    ));
    alert('Solicitud de reposición enviada al proveedor (Simulación: Se sumaron 10 unidades).');
  };

  const handleComplete = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'COMPLETED' } : o
    ));
  };

  const handleInvoice = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'INVOICED' } : o
    ));
    alert('Factura generada y enviada al cliente. Datos sincronizados con contabilidad.');
  };

  const handleFeedback = (orderId: string, level: string, notes: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'FOLLOW_UP_DONE', satisfactionLevel: level as any, postSaleNotes: notes } 
        : o
    ));
  };

  // --- Routing Simulator ---
  const renderView = () => {
    switch (currentView) {
      case 'CLIENT':
        return <ClientPortal onCreateOrder={handleCreateOrder} />;
      case 'SALES':
        return <SalesView orders={orders} onUpdateOrder={handleUpdateOrder} />;
      case 'OPS':
        return <OpsView orders={orders} technicians={technicians} onSchedule={handleSchedule} />;
      case 'LOGISTICS':
        return <LogisticsView products={products} onRequestRestock={handleRequestRestock} />;
      case 'TECH':
        return <TechView orders={orders} technicians={technicians} onComplete={handleComplete} />;
      case 'BILLING':
        return <BillingView orders={orders} onInvoice={handleInvoice} />;
      case 'POST_SALE':
        return <PostSalesView orders={orders} onFeedback={handleFeedback} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-900 bg-slate-50">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">Panel de Control Automatizado</h2>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

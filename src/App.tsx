import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ClientPortal } from './components/ClientPortal';
import { SalesView } from './components/SalesView';
import { OpsView } from './components/OpsView';
import { LogisticsView } from './components/LogisticsView';
import { TechView } from './components/TechView';
import { BillingView } from './components/BillingView';
import { PostSalesView } from './components/PostSalesView';
import { Login } from './components/Login';
import { INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_TECHNICIANS } from './data';
import { ViewState, Order, Product, Technician } from './types';
import { supabase } from './lib/supabase';
import { LogOut } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewState>('SALES');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [loading, setLoading] = useState(true);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && supabaseUrl) {
        fetchData();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && supabaseUrl) {
        fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseUrl]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData, techsData] = await Promise.all([
        supabase.from('orders').select('*').order('date_requested', { ascending: false }),
        supabase.from('products').select('*').order('name'),
        supabase.from('technicians').select('*').order('name')
      ]);

      if (ordersData.data) {
        // Map snake_case to camelCase
        const mappedOrders: Order[] = ordersData.data.map((o: any) => ({
          id: o.id,
          clientName: o.client_name,
          phone: o.phone,
          address: o.address,
          serviceType: o.service_type,
          details: o.details,
          requestedProducts: o.requested_products,
          status: o.status,
          dateRequested: o.date_requested,
          technicallyFeasible: o.technically_feasible,
          financiallyCleared: o.financially_cleared,
          technicianId: o.technician_id,
          scheduledDate: o.scheduled_date,
          satisfactionLevel: o.satisfaction_level,
          postSaleNotes: o.post_sale_notes
        }));
        setOrders(mappedOrders);
      }
      if (productsData.data) setProducts(productsData.data);
      if (techsData.data) setTechnicians(techsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  // --- Actions ---

  const handleCreateOrder = async (newOrderData: Omit<Order, 'id' | 'status' | 'dateRequested'>) => {
    const newId = `ORD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    if (supabaseUrl && session) {
      const dbOrder = {
        id: newId,
        client_name: newOrderData.clientName,
        phone: newOrderData.phone,
        address: newOrderData.address,
        service_type: newOrderData.serviceType,
        details: newOrderData.details,
        requested_products: newOrderData.requestedProducts || null,
        status: 'PENDIENTE'
      };
      await supabase.from('orders').insert([dbOrder]);
      fetchData();
    } else {
      const newOrder: Order = {
        ...newOrderData,
        id: newId,
        status: 'PENDIENTE',
        dateRequested: new Date().toISOString()
      };
      setOrders(prev => [newOrder, ...prev]);
    }
  };

  const handleUpdateOrder = async (id: string, updates: Partial<Order>) => {
    if (supabaseUrl && session) {
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.technicallyFeasible !== undefined) dbUpdates.technically_feasible = updates.technicallyFeasible;
      if (updates.financiallyCleared !== undefined) dbUpdates.financially_cleared = updates.financiallyCleared;
      
      await supabase.from('orders').update(dbUpdates).eq('id', id);
      
      // Update inventory reservations if approved
      if (updates.status === 'APROBADO') {
        const order = orders.find(o => o.id === id);
        if (order && order.requestedProducts && order.requestedProducts.length > 0) {
          order.requestedProducts.forEach(async requestedItem => {
            const product = products.find(p => p.id === requestedItem.productId);
            if (product) {
              await supabase.from('products').update({ reserved: product.reserved + requestedItem.quantity }).eq('id', product.id);
            }
          });
        } else if (order) {
          // Fallback logic if no explicit products requested
          products.forEach(async p => {
            if (order.serviceType.toLowerCase().includes('cámara') && p.name.includes('Cámara')) {
              await supabase.from('products').update({ reserved: p.reserved + 2 }).eq('id', p.id);
            }
            if (order.serviceType.toLowerCase().includes('alarma') && p.name.includes('Alarma')) {
              await supabase.from('products').update({ reserved: p.reserved + 1 }).eq('id', p.id);
            }
          });
        }
      }
      fetchData();
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
      
      // Update inventory reservations if approved
      if (updates.status === 'APROBADO') {
        const order = orders.find(o => o.id === id);
        if (order && order.requestedProducts && order.requestedProducts.length > 0) {
          setProducts(prev => prev.map(p => {
            const requestedItem = order.requestedProducts?.find(rp => rp.productId === p.id);
            if (requestedItem) {
              return { ...p, reserved: p.reserved + requestedItem.quantity };
            }
            return p;
          }));
        } else if (order) {
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
    }
  };

  const handleSchedule = async (orderId: string, technicianId: string, date: string) => {
    if (supabaseUrl && session) {
      await supabase.from('orders').update({ 
        status: 'PROGRAMADO', 
        technician_id: technicianId, 
        scheduled_date: date 
      }).eq('id', orderId);
      await supabase.from('technicians').update({ status: 'Ocupado' }).eq('id', technicianId);
      fetchData();
    } else {
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? { ...o, status: 'PROGRAMADO', technicianId, scheduledDate: date } 
          : o
      ));
      setTechnicians(prev => prev.map(t => 
        t.id === technicianId ? { ...t, status: 'Ocupado' } : t
      ));
    }
  };

  const handleRequestRestock = async (productId: string) => {
    if (supabaseUrl && session) {
      const product = products.find(p => p.id === productId);
      if (product) {
        await supabase.from('products').update({ stock: product.stock + 10 }).eq('id', productId);
        alert('Solicitud de reposición enviada al proveedor (Simulación: Se sumaron 10 unidades).');
        fetchData();
      }
    } else {
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, stock: p.stock + 10 } : p
      ));
      alert('Solicitud de reposición enviada al proveedor (Simulación: Se sumaron 10 unidades).');
    }
  };

  const handleComplete = async (orderId: string) => {
    if (supabaseUrl && session) {
      await supabase.from('orders').update({ status: 'COMPLETADO' }).eq('id', orderId);
      
      // Free up technician
      const order = orders.find(o => o.id === orderId);
      if (order && order.technicianId) {
        await supabase.from('technicians').update({ status: 'Disponible' }).eq('id', order.technicianId);
      }
      fetchData();
    } else {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'COMPLETADO' } : o
      ));
    }
  };

  const handleInvoice = async (orderId: string) => {
    if (supabaseUrl && session) {
      await supabase.from('orders').update({ status: 'FACTURADO' }).eq('id', orderId);
      alert('Factura generada y enviada al cliente. Datos sincronizados con contabilidad.');
      fetchData();
    } else {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'FACTURADO' } : o
      ));
      alert('Factura generada y enviada al cliente. Datos sincronizados con contabilidad.');
    }
  };

  const handleFeedback = async (orderId: string, level: string, notes: string) => {
    if (supabaseUrl && session) {
      await supabase.from('orders').update({ 
        status: 'POSTVENTA_COMPLETADA', 
        satisfaction_level: level, 
        post_sale_notes: notes 
      }).eq('id', orderId);
      fetchData();
    } else {
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? { ...o, status: 'POSTVENTA_COMPLETADA', satisfactionLevel: level as any, postSaleNotes: notes } 
          : o
      ));
    }
  };

  // --- Routing Simulator ---
  const renderView = () => {
    switch (currentView) {
      case 'CLIENT':
        return <ClientPortal onCreateOrder={handleCreateOrder} products={products} />;
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

  if (!supabaseUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Configuración Pendiente</h2>
          <p className="text-slate-600 mb-6">
            Para completar tu asignación, debes crear tu proyecto en Supabase y agregar las variables de entorno <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> a Vercel.
          </p>
          <p className="text-sm text-slate-500">
            También recuerda ejecutar el script SQL <code>supabase_schema.sql</code> en el editor SQL de Supabase para crear las tablas y datos de prueba.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!session) {
    return <Login onLoginSuccess={() => fetchData()} />;
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-900 bg-slate-50">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">Panel de Control Automatizado</h2>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors text-xs font-bold uppercase"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

import { Order, Product, Technician } from './types';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    clientName: 'Juan Pérez',
    phone: '555-0123',
    address: 'Av. Siempre Viva 123',
    serviceType: 'Cámaras de videovigilancia',
    details: 'Instalación de 4 cámaras en exterior con DVR',
    status: 'PENDING',
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'ORD-002',
    clientName: 'Empresa Logistics S.A.',
    phone: '555-0987',
    address: 'Parque Industrial Lote 4',
    serviceType: 'Alarmas',
    details: 'Sistema de alarma perimetral con sensores',
    status: 'APPROVED',
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    technicallyFeasible: true,
    financiallyCleared: true,
  },
  {
    id: 'ORD-003',
    clientName: 'Colegio San Antonio',
    phone: '555-3456',
    address: 'Calle Falsa 456',
    serviceType: 'Sensores de movimiento',
    details: 'Sensores en pasillos principales',
    status: 'SCHEDULED',
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    technicallyFeasible: true,
    financiallyCleared: true,
    technicianId: 'TECH-1',
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split('T')[0],
  },
  {
    id: 'ORD-004',
    clientName: 'María Rodríguez',
    phone: '555-8888',
    address: 'Residencial Los Pinos',
    serviceType: 'Cámaras de videovigilancia',
    details: '1 cámara IP en entrada',
    status: 'COMPLETED',
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    technicallyFeasible: true,
    financiallyCleared: true,
    technicianId: 'TECH-2',
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0],
  },
  {
    id: 'ORD-005',
    clientName: 'Restaurante El Buen Sabor',
    phone: '555-1111',
    address: 'Plaza Central Local 5',
    serviceType: 'Cámaras y Alarmas',
    details: 'Sistema mixto con supervisión remota',
    status: 'INVOICED',
    dateRequested: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    technicallyFeasible: true,
    financiallyCleared: true,
    technicianId: 'TECH-1',
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString().split('T')[0],
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'PROD-CAM-01', name: 'Cámara Exterior IP 1080p', stock: 15, reserved: 4 },
  { id: 'PROD-SEN-01', name: 'Sensor de Movimiento PIR', stock: 30, reserved: 0 },
  { id: 'PROD-ALM-01', name: 'Panel de Alarma Central', stock: 5, reserved: 1 },
  { id: 'PROD-DVR-01', name: 'DVR 8 Canales HDD 1TB', stock: 2, reserved: 1 },
];

export const INITIAL_TECHNICIANS: Technician[] = [
  { id: 'TECH-1', name: 'Carlos Mendoza', status: 'Available' },
  { id: 'TECH-2', name: 'Ana Gómez', status: 'Busy' },
  { id: 'TECH-3', name: 'Luis Vargas', status: 'Available' },
];

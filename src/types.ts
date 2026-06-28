export type OrderStatus =
  | 'PENDIENTE'
  | 'APROBADO'
  | 'RECHAZADO'
  | 'PROGRAMADO'
  | 'COMPLETADO'
  | 'FACTURADO'
  | 'POSTVENTA_COMPLETADA';

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  address: string;
  serviceType: string;
  details: string;
  requestedProducts?: { productId: string, quantity: number, name: string }[];
  status: OrderStatus;
  dateRequested: string;
  technicallyFeasible?: boolean;
  financiallyCleared?: boolean;
  technicianId?: string;
  scheduledDate?: string;
  satisfactionLevel?: 'Bueno' | 'Regular' | 'Malo';
  postSaleNotes?: string;
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  reserved: number;
}

export interface Technician {
  id: string;
  name: string;
  status: 'Disponible' | 'Ocupado';
}

export type ViewState =
  | 'CLIENT'
  | 'SALES'
  | 'OPS'
  | 'LOGISTICS'
  | 'TECH'
  | 'BILLING'
  | 'POST_SALE';

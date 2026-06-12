export type OrderStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'INVOICED'
  | 'FOLLOW_UP_DONE';

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  address: string;
  serviceType: string;
  details: string;
  status: OrderStatus;
  dateRequested: string;
  technicallyFeasible?: boolean;
  financiallyCleared?: boolean;
  technicianId?: string;
  scheduledDate?: string;
  satisfactionLevel?: 'Good' | 'Average' | 'Poor';
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
  status: 'Available' | 'Busy';
}

export type ViewState =
  | 'CLIENT'
  | 'SALES'
  | 'OPS'
  | 'LOGISTICS'
  | 'TECH'
  | 'BILLING'
  | 'POST_SALE';

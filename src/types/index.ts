export interface Fees {
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  lastPaymentDate: string | null;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  mode: 'Cash' | 'Online';
  date: string;
  note?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
  parentName: string;
  contactNumber: string;
  address: string;
  admissionDate: string;
  createdAt: string;
  fees: Fees;
}

export interface StudentFormData {
  name: string;
  age: number;
  class: string;
  parentName: string;
  contactNumber: string;
  address: string;
  admissionDate: string;
  totalFees: number;
  paidFees: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalFeesCollected: number;
  totalPendingFees: number;
  totalFees: number;
}

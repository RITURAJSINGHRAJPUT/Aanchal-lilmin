import { useState, useCallback } from 'react';
import type { Payment, Student } from '../types';
import { getPayments, addStudentPayment, deleteStudentPayment } from '../services/firebase';
import toast from 'react-hot-toast';

export function usePayments(studentId: string | undefined) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getPayments(studentId);
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments');
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const addPayment = async (
    amount: number,
    mode: 'Cash' | 'Online',
    date: string,
    note: string,
    student: Student
  ) => {
    try {
      if (!studentId) throw new Error('Student ID is missing');
      await addStudentPayment(
        studentId,
        amount,
        mode,
        date,
        note,
        student.fees.paidFees,
        student.fees.totalFees
      );
      toast.success('Payment recorded successfully! 💰');
      await fetchPayments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment');
      throw err;
    }
  };

  const removePayment = async (payment: Payment, student: Student) => {
    try {
      if (!studentId) throw new Error('Student ID is missing');
      await deleteStudentPayment(
        studentId,
        payment.id,
        payment.amount,
        student.fees.paidFees,
        student.fees.totalFees
      );
      toast.success('Payment deleted successfully');
      await fetchPayments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete payment');
      throw err;
    }
  };

  return {
    payments,
    loading,
    error,
    fetchPayments,
    addPayment,
    removePayment,
  };
}

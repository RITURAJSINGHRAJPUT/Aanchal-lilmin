import { useState, useEffect, useCallback } from 'react';
import type { Student } from '../types';
import {
  getStudents,
  addStudent,
  updateStudent as updateStudentService,
  deleteStudent as deleteStudentService,
  updatePayment as updatePaymentService,
} from '../services/firebase';
import type { StudentFormData } from '../types';
import toast from 'react-hot-toast';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStudents();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const createStudent = async (data: StudentFormData) => {
    try {
      await addStudent(data);
      toast.success('Student added successfully! 🎉');
      await fetchStudents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add student');
      throw err;
    }
  };

  const updateStudent = async (id: string, data: StudentFormData) => {
    try {
      await updateStudentService(id, data);
      toast.success('Student updated successfully! ✏️');
      await fetchStudents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update student');
      throw err;
    }
  };

  const removeStudent = async (id: string) => {
    try {
      await deleteStudentService(id);
      toast.success('Student deleted successfully');
      await fetchStudents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete student');
      throw err;
    }
  };

  const recordPayment = async (
    id: string,
    amount: number,
    currentPaid: number,
    totalFees: number
  ) => {
    try {
      await updatePaymentService(id, amount, currentPaid, totalFees);
      toast.success(`Payment of ₹${amount.toLocaleString()} recorded! 💰`);
      await fetchStudents();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment');
      throw err;
    }
  };

  return {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    removeStudent,
    recordPayment,
    refetch: fetchStudents,
  };
}

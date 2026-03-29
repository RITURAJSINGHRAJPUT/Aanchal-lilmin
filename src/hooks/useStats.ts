import { useMemo } from 'react';
import type { Student, DashboardStats } from '../types';

export function useStats(students: Student[]): DashboardStats {
  return useMemo(() => {
    const totalStudents = students.length;
    const totalFeesCollected = students.reduce(
      (sum, s) => sum + s.fees.paidFees,
      0
    );
    const totalPendingFees = students.reduce(
      (sum, s) => sum + s.fees.pendingFees,
      0
    );
    const totalFees = students.reduce(
      (sum, s) => sum + s.fees.totalFees,
      0
    );

    return {
      totalStudents,
      totalFeesCollected,
      totalPendingFees,
      totalFees,
    };
  }, [students]);
}

import type { Student } from '../types';
import { CreditCard, AlertCircle, CheckCircle2, IndianRupee } from 'lucide-react';

interface Props {
  students: Student[];
  onUpdatePayment: (student: Student) => void;
  onViewPayments: (student: Student) => void;
}

export default function FeesTable({ students, onUpdatePayment, onViewPayments }: Props) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block glass-card rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-500 to-green-400 text-white">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Class</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Total Fees</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Paid</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider">Pending</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Last Payment</th>
                <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50">
              {students.map((student, index) => {
                const isPaid = student.fees.pendingFees <= 0;
                return (
                  <tr
                    key={student.id}
                    className="table-row-hover animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm
                          ${isPaid ? 'bg-gradient-to-br from-green-400 to-green-600' : 'gradient-teal'}`}
                        >
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-teal-800 text-sm">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-teal-700 text-sm">
                      ₹{student.fees.totalFees.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600 text-sm">
                      ₹{student.fees.paidFees.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold text-sm ${isPaid ? 'text-green-500' : 'text-orange-500'}`}>
                        {isPaid ? '₹0' : `₹${student.fees.pendingFees.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-teal-500">
                      {student.fees.lastPaymentDate
                        ? new Date(student.fees.lastPaymentDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-600 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => onUpdatePayment(student)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-teal text-white text-xs font-bold btn-hover transition-all duration-200"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Update
                          </button>
                        )}
                        <button
                          onClick={() => onViewPayments(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          <IndianRupee className="w-3.5 h-3.5" /> History
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {students.map((student, index) => {
          const isPaid = student.fees.pendingFees <= 0;
          const progress = student.fees.totalFees > 0
            ? (student.fees.paidFees / student.fees.totalFees) * 100
            : 0;

          return (
            <div
              key={student.id}
              className="glass-card rounded-2xl p-4 animate-fade-in-up opacity-0 card-hover"
              style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold
                    ${isPaid ? 'bg-gradient-to-br from-green-400 to-green-600' : 'gradient-teal'}`}
                  >
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-teal-800 text-sm">{student.name}</div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold">
                      {student.class}
                    </span>
                  </div>
                </div>
                {isPaid ? (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-600 text-xs font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-100 text-orange-500 text-xs font-bold">
                    <AlertCircle className="w-3 h-3" />
                    Due
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="bg-teal-100 rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPaid ? 'bg-green-400' : 'bg-gradient-to-r from-teal-400 to-mint-400'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div>
                  <div className="text-[10px] text-teal-400 font-bold uppercase">Total</div>
                  <div className="text-sm font-bold text-teal-700">₹{student.fees.totalFees.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-green-400 font-bold uppercase">Paid</div>
                  <div className="text-sm font-bold text-green-600">₹{student.fees.paidFees.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-orange-400 font-bold uppercase">Pending</div>
                  <div className={`text-sm font-bold ${isPaid ? 'text-green-500' : 'text-orange-500'}`}>
                    ₹{student.fees.pendingFees.toLocaleString()}
                  </div>
                </div>
              </div>

              {!isPaid && (
                <button
                  onClick={() => onUpdatePayment(student)}
                  className="w-full py-2.5 rounded-xl gradient-teal text-white text-sm font-bold btn-hover flex items-center justify-center gap-2 mb-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Update Payment
                </button>
              )}
              <button
                onClick={() => onViewPayments(student)}
                className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold btn-hover flex items-center justify-center gap-2"
              >
                <IndianRupee className="w-4 h-4" />
                View History
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

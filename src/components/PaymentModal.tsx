import { useState } from 'react';
import type { Student } from '../types';
import { X, CreditCard, IndianRupee } from 'lucide-react';

interface Props {
  student: Student;
  onSubmit: (id: string, amount: number, currentPaid: number, totalFees: number) => Promise<void>;
  onClose: () => void;
}

export default function PaymentModal({ student, onSubmit, onClose }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const remaining = student.fees.pendingFees;
  const newPending = remaining - amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amount > remaining) {
      setError('Amount cannot exceed pending fees');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(student.id, amount, student.fees.paidFees, student.fees.totalFees);
      onClose();
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const quickAmounts = [
    Math.round(remaining * 0.25),
    Math.round(remaining * 0.5),
    Math.round(remaining * 0.75),
    remaining,
  ].filter((a) => a > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in p-4">
      <div className="glass-card rounded-2xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-teal-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-teal-800">Record Payment</h2>
                <p className="text-xs text-teal-500">{student.name} • {student.class}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-teal-100 transition-colors"
            >
              <X className="w-5 h-5 text-teal-500" />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 pb-4">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-teal-50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-teal-400 font-bold uppercase mb-1">Total</div>
              <div className="text-sm font-bold text-teal-700">₹{student.fees.totalFees.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-green-400 font-bold uppercase mb-1">Paid</div>
              <div className="text-sm font-bold text-green-600">₹{student.fees.paidFees.toLocaleString()}</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <div className="text-[10px] text-orange-400 font-bold uppercase mb-1">Pending</div>
              <div className="text-sm font-bold text-orange-500">₹{remaining.toLocaleString()}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Amount Input */}
            <label className="block text-sm font-semibold text-teal-700 mb-2">
              Payment Amount (₹)
            </label>
            <div className="relative mb-3">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => {
                  setAmount(parseFloat(e.target.value) || 0);
                  setError('');
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-lg font-bold ${
                  error ? 'border-red-300 bg-red-50 text-red-700' : 'border-teal-200 bg-white/80 text-teal-800'
                } transition-all duration-200`}
                placeholder="Enter amount"
                min={0}
                max={remaining}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs font-semibold mb-3">{error}</p>}

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quickAmounts.map((qa) => (
                <button
                  key={qa}
                  type="button"
                  onClick={() => {
                    setAmount(qa);
                    setError('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    amount === qa
                      ? 'gradient-teal text-white'
                      : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                  }`}
                >
                  ₹{qa.toLocaleString()}
                </button>
              ))}
            </div>

            {/* New balance preview */}
            {amount > 0 && amount <= remaining && (
              <div className="bg-teal-50 rounded-xl p-3 mb-4 flex items-center justify-between animate-fade-in">
                <span className="text-sm font-semibold text-teal-600">New Pending Balance</span>
                <span className={`text-lg font-bold ${newPending <= 0 ? 'text-green-500' : 'text-orange-500'}`}>
                  ₹{Math.max(newPending, 0).toLocaleString()}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-teal-200 text-teal-700 font-semibold text-sm
                hover:bg-teal-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || amount <= 0}
                className="flex-1 px-4 py-2.5 rounded-xl gradient-green text-white font-semibold text-sm
                btn-hover disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

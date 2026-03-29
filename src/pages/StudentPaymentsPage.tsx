import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePayments } from '../hooks/usePayments';
import { getStudent } from '../services/firebase';
import type { Student } from '../types';
import {
  ArrowLeft,
  IndianRupee,
  CreditCard,
  Banknote,
  FileText,
  Calendar,
  Trash2,
  Download,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../components/Skeleton';

export default function StudentPaymentsPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const { payments, loading: loadingPayments, fetchPayments, addPayment, removePayment } = usePayments(id);

  // Form State
  const [amount, setAmount] = useState<number | ''>('');
  const [mode, setMode] = useState<'Cash' | 'Online'>('Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoadingStudent(true);
        const data = await getStudent(id);
        setStudent(data);
        await fetchPayments();
      } catch (err) {
        toast.error('Failed to load student details');
      } finally {
        setLoadingStudent(false);
      }
    }
    loadData();
  }, [id, fetchPayments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!student) return;

    setSubmitting(true);
    try {
      await addPayment(Number(amount), mode, date, note, student);
      // Reset form
      setAmount('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Refresh student to get new fee totals
      const updatedStudent = await getStudent(student.id);
      setStudent(updatedStudent);
    } catch (err) {
      // Error is handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (payment: any) => {
    if (!student) return;
    if (window.confirm('Are you sure you want to delete this payment? This will revert the fee totals.')) {
      try {
        await removePayment(payment, student);
        // Refresh student to get new fee totals
        const updatedStudent = await getStudent(student.id);
        setStudent(updatedStudent);
      } catch (err) {
        // Error handled in hook
      }
    }
  };

  const exportPDF = () => {
    if (!student) return;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(74, 158, 158);
    doc.text('Little Millennium', 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(31, 77, 77);
    doc.text(`Payment History: ${student.name}`, 14, 32);
    
    doc.setFontSize(10);
    doc.text(`Class: ${student.class} | Guardian: ${student.parentName}`, 14, 40);
    doc.text(`Total Paid: Rs. ${student.fees.paidFees.toLocaleString()}`, 14, 46);
    doc.text(`Total Pending: Rs. ${student.fees.pendingFees.toLocaleString()}`, 14, 52);

    const tableData = payments.map((p) => [
      new Date(p.date).toLocaleDateString('en-IN'),
      `Rs. ${p.amount.toLocaleString()}`,
      p.mode,
      p.note || '—'
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Date', 'Amount', 'Mode', 'Note']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [74, 158, 158] },
    });

    doc.save(`Payments_${student.name.replace(/\s+/g, '_')}.pdf`);
  };

  if (loadingStudent) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-teal-800">Student Not Found</h2>
        <Link to="/students" className="text-teal-500 hover:underline mt-2 inline-block">
          Return to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <Link
          to="/students"
          className="p-2.5 rounded-xl bg-white text-teal-600 hover:bg-teal-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-800 bg-clip-text">
            {student.name}'s Payments
          </h1>
          <p className="text-teal-500 font-medium mt-1">
            Class {student.class} • Guardian: {student.parentName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary Card */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            <h3 className="text-lg font-bold text-teal-800 mb-4">Fee Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-teal-50">
                <span className="text-teal-600 font-medium">Total Fees</span>
                <span className="font-bold text-teal-800">₹{student.fees.totalFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-green-50">
                <span className="text-green-600 font-medium">Total Paid</span>
                <span className="font-bold text-green-700">₹{student.fees.paidFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50">
                <span className="text-orange-600 font-medium">Pending Dues</span>
                <span className="font-bold text-orange-700">₹{student.fees.pendingFees.toLocaleString()}</span>
              </div>
            </div>
            {student.fees.pendingFees <= 0 && (
              <div className="mt-4 p-3 rounded-xl bg-green-100 text-green-700 text-center font-bold text-sm">
                Fully Paid 🎉
              </div>
            )}
          </div>

          {/* Add Payment Form */}
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-teal-500" />
              Add Payment
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-teal-700 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className={'w-full px-4 py-2.5 rounded-xl border-2 border-teal-100 bg-white text-teal-800 font-semibold focus:border-teal-400 focus:outline-none transition-colors'}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-teal-700 mb-1.5">Payment Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('Cash')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-bold text-sm transition-colors ${
                      mode === 'Cash' 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-teal-100 bg-white text-teal-500 hover:bg-teal-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4" /> Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('Online')}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-bold text-sm transition-colors ${
                      mode === 'Online' 
                        ? 'border-teal-500 bg-teal-50 text-teal-700' 
                        : 'border-teal-100 bg-white text-teal-500 hover:bg-teal-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Online
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-teal-700 mb-1.5">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={'w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-teal-100 bg-white text-teal-800 font-semibold focus:border-teal-400 focus:outline-none transition-colors'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-teal-700 mb-1.5">Note (Optional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-teal-400" />
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className={'w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-teal-100 bg-white text-teal-800 font-semibold focus:border-teal-400 focus:outline-none transition-colors resize-none'}
                    placeholder="e.g. November Term"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || (student.fees.pendingFees <= 0 && amount === '')}
                className={'w-full py-3 rounded-xl gradient-teal text-white font-bold text-[15px] shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 mt-2'}
              >
                {submitting ? 'Recording...' : 'Record Payment'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History Table */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 h-full animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-teal-800">Payment History</h3>
              {payments.length > 0 && (
                <button
                  onClick={exportPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-600 font-bold text-xs hover:bg-teal-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
              )}
            </div>

            {loadingPayments ? (
              <TableSkeleton rows={4} />
            ) : payments.length === 0 ? (
              <div className="text-center py-12 bg-white/50 rounded-2xl border border-teal-50">
                <IndianRupee className="w-12 h-12 text-teal-200 mx-auto mb-3" />
                <p className="text-teal-600 font-bold mb-1">No Payments Yet</p>
                <p className="text-sm text-teal-400">Record a payment to see it here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-teal-100 text-left">
                      <th className="pb-3 text-xs font-bold text-teal-500 uppercase">Date</th>
                      <th className="pb-3 text-xs font-bold text-teal-500 uppercase">Amount</th>
                      <th className="pb-3 text-xs font-bold text-teal-500 uppercase">Mode</th>
                      <th className="pb-3 text-xs font-bold text-teal-500 uppercase">Note</th>
                      <th className="pb-3 text-xs font-bold text-teal-500 uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-50">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="table-row-hover">
                        <td className="py-4 text-sm font-semibold text-teal-800">
                          {new Date(payment.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className="py-4 text-sm font-bold text-green-600">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
                            payment.mode === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {payment.mode === 'Online' ? <CreditCard className="w-3 h-3" /> : <Banknote className="w-3 h-3" />}
                            {payment.mode}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-teal-600 max-w-[150px] truncate">
                          {payment.note || '—'}
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDelete(payment)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors inline-block"
                            title="Delete Payment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

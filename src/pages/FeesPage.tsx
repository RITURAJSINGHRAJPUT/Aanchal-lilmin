import { useState, useMemo } from 'react';
import { useStudents } from '../hooks/useStudents';
import { useStats } from '../hooks/useStats';
import FeesTable from '../components/FeesTable';
import PaymentModal from '../components/PaymentModal';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { TableSkeleton, CardSkeleton } from '../components/Skeleton';
import type { Student } from '../types';
import { IndianRupee, Download, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function FeesPage() {
  const { students, loading, recordPayment } = useStudents();
  const stats = useStats(students);
  const [paymentStudent, setPaymentStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Classes
  const classes = useMemo(() => {
    const classSet = new Set(students.map((s) => s.class));
    return Array.from(classSet).sort();
  }, [students]);

  // Filter
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = filterClass === '' || s.class === filterClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, filterClass]);

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(74, 158, 158);
    doc.text('Little Millennium', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Student Fees Report', 14, 30);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, 36);

    // Summary
    doc.setFontSize(10);
    doc.setTextColor(31, 77, 77);
    doc.text(`Total Students: ${stats.totalStudents}`, 14, 46);
    doc.text(`Total Collected: ₹${stats.totalFeesCollected.toLocaleString()}`, 14, 52);
    doc.text(`Total Pending: ₹${stats.totalPendingFees.toLocaleString()}`, 14, 58);

    // Table
    const tableData = filtered.map((s) => [
      s.name,
      s.class,
      s.parentName,
      `₹${s.fees.totalFees.toLocaleString()}`,
      `₹${s.fees.paidFees.toLocaleString()}`,
      `₹${s.fees.pendingFees.toLocaleString()}`,
      s.fees.lastPaymentDate
        ? new Date(s.fees.lastPaymentDate).toLocaleDateString('en-IN')
        : '—',
    ]);

    autoTable(doc, {
      startY: 65,
      head: [['Student', 'Class', 'Parent', 'Total', 'Paid', 'Pending', 'Last Payment']],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [74, 158, 158],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [230, 247, 245],
      },
    });

    doc.save('Little-Millennium-Fees-Report.pdf');
  };

  const paidStudents = students.filter((s) => s.fees.pendingFees <= 0).length;
  const pendingStudents = students.filter((s) => s.fees.pendingFees > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-800">Fees Management</h1>
          <p className="text-teal-500 font-medium mt-1">
            Track and manage student fee payments
          </p>
        </div>
        {students.length > 0 && (
          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-green text-white 
            font-bold text-sm btn-hover shadow-lg shadow-green-500/20"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
        )}
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 animate-fade-in-up card-hover" style={{ animationDelay: '50ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-teal-600">Collected</span>
            </div>
            <div className="text-2xl font-extrabold text-teal-800">
              ₹{stats.totalFeesCollected.toLocaleString()}
            </div>
            <div className="text-xs text-teal-400 font-medium mt-1">
              {stats.totalFees > 0 ? Math.round((stats.totalFeesCollected / stats.totalFees) * 100) : 0}% of total
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 animate-fade-in-up card-hover" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm font-semibold text-teal-600">Pending</span>
            </div>
            <div className="text-2xl font-extrabold text-orange-500">
              ₹{stats.totalPendingFees.toLocaleString()}
            </div>
            <div className="text-xs text-teal-400 font-medium mt-1">
              {pendingStudents} student{pendingStudents !== 1 ? 's' : ''} with dues
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 animate-fade-in-up card-hover" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm font-semibold text-teal-600">Fully Paid</span>
            </div>
            <div className="text-2xl font-extrabold text-green-500">
              {paidStudents}
            </div>
            <div className="text-xs text-teal-400 font-medium mt-1">
              {students.length > 0 ? Math.round((paidStudents / students.length) * 100) : 0}% of students
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterClass={filterClass}
        onFilterChange={setFilterClass}
        classes={classes}
        placeholder="Search by student or parent name..."
      />

      {/* Fees Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={IndianRupee}
          title={students.length === 0 ? 'No Fee Records' : 'No Results Found'}
          description={
            students.length === 0
              ? 'Add students to start tracking their fees.'
              : 'Try adjusting your search or filter criteria.'
          }
        />
      ) : (
        <FeesTable students={filtered} onUpdatePayment={(s) => setPaymentStudent(s)} />
      )}

      {/* Payment Modal */}
      {paymentStudent && (
        <PaymentModal
          student={paymentStudent}
          onSubmit={recordPayment}
          onClose={() => setPaymentStudent(null)}
        />
      )}
    </div>
  );
}

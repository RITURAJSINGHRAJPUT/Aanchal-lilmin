import { useState, useMemo } from 'react';
import { useStudents } from '../hooks/useStudents';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import SearchBar from '../components/SearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/Skeleton';
import type { Student, StudentFormData } from '../types';
import { UserPlus, Users, RefreshCw } from 'lucide-react';

export default function StudentsPage() {
  const { students, loading, createStudent, updateStudent, removeStudent } = useStudents();
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Get unique classes
  const classes = useMemo(() => {
    const classSet = new Set(students.map((s) => s.class));
    return Array.from(classSet).sort();
  }, [students]);

  // Filter students
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contactNumber.includes(searchQuery);
      const matchesClass = filterClass === '' || s.class === filterClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, filterClass]);

  const handleCreate = async (data: StudentFormData) => {
    await createStudent(data);
  };

  const handleUpdate = async (data: StudentFormData) => {
    if (editStudent) {
      await updateStudent(editStudent.id, data);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeStudent(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-800">Students</h1>
          <p className="text-teal-500 font-medium mt-1">
            {students.length} student{students.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => {
            setEditStudent(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-teal text-white 
          font-bold text-sm btn-hover shadow-lg shadow-teal-500/20"
        >
          <UserPlus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Search & Filter */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterClass={filterClass}
        onFilterChange={setFilterClass}
        classes={classes}
        placeholder="Search by name, parent, or phone..."
      />

      {/* Content */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Students Yet"
            description="Start by adding your first student to the system. All student data including fees will be managed here."
            action={
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-teal text-white 
                font-bold text-sm btn-hover"
              >
                <UserPlus className="w-5 h-5" />
                Add First Student
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No Results Found"
            description="Try adjusting your search or filter criteria to find students."
            action={
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterClass('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-200 
                text-teal-700 font-semibold text-sm hover:bg-teal-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Clear Filters
              </button>
            }
          />
        )
      ) : (
        <StudentTable
          students={filtered}
          onEdit={(student) => {
            setEditStudent(student);
            setShowForm(true);
          }}
          onDelete={(student) => setDeleteTarget(student)}
        />
      )}

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm
          onSubmit={editStudent ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditStudent(null);
          }}
          initialData={editStudent}
          isEditing={!!editStudent}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone and all associated fee data will be lost.`}
        confirmLabel="Delete Student"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

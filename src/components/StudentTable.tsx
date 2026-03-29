import type { Student } from '../types';
import { Edit, Trash2, Phone, MapPin, Calendar } from 'lucide-react';

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export default function StudentTable({ students, onEdit, onDelete }: Props) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block glass-card rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-teal-500 to-mint-400 text-white">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Class</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Parent</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Admission</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider">Fees Status</th>
                <th className="text-center px-6 py-4 text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50">
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className="table-row-hover animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-teal-800 text-sm">{student.name}</div>
                        <div className="text-xs text-teal-400">Age: {student.age} yrs</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-teal-700">{student.parentName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-teal-600">
                      <Phone className="w-3.5 h-3.5" />
                      {student.contactNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-teal-500">
                    {new Date(student.admissionDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-green-600">₹{student.fees.paidFees.toLocaleString()}</span>
                        <span className="text-teal-300">/</span>
                        <span className="text-teal-500">₹{student.fees.totalFees.toLocaleString()}</span>
                      </div>
                      {student.fees.pendingFees > 0 && (
                        <span className="text-xs text-orange-500 font-semibold">
                          ₹{student.fees.pendingFees.toLocaleString()} pending
                        </span>
                      )}
                      {student.fees.pendingFees <= 0 && (
                        <span className="text-xs text-green-500 font-semibold">Fully Paid ✓</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2 rounded-lg hover:bg-teal-100 text-teal-500 hover:text-teal-700 transition-all duration-200"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(student)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {students.map((student, index) => (
          <div
            key={student.id}
            className="glass-card rounded-2xl p-4 animate-fade-in-up opacity-0 card-hover"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-lg">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-teal-800">{student.name}</div>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                    {student.class}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(student)}
                  className="p-2 rounded-lg hover:bg-teal-100 text-teal-500 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(student)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="flex items-center gap-1.5 text-teal-600">
                <Phone className="w-3.5 h-3.5" />
                <span className="font-medium">{student.contactNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>Age: {student.age} yrs</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-500 col-span-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{student.parentName}</span>
              </div>
            </div>

            <div className="bg-teal-50 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-xs text-teal-500 font-medium">Fees Paid</div>
                <div className="text-sm font-bold text-green-600">
                  ₹{student.fees.paidFees.toLocaleString()} / ₹{student.fees.totalFees.toLocaleString()}
                </div>
              </div>
              {student.fees.pendingFees > 0 ? (
                <span className="px-2 py-1 rounded-lg bg-orange-100 text-orange-600 text-xs font-bold">
                  ₹{student.fees.pendingFees.toLocaleString()} due
                </span>
              ) : (
                <span className="px-2 py-1 rounded-lg bg-green-100 text-green-600 text-xs font-bold">
                  Paid ✓
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

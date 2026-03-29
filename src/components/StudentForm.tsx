import { useState, useEffect } from 'react';
import type { StudentFormData, Student } from '../types';
import { X, Save, UserPlus } from 'lucide-react';

interface Props {
  onSubmit: (data: StudentFormData) => Promise<void>;
  onClose: () => void;
  initialData?: Student | null;
  isEditing?: boolean;
}

const classOptions = [
  'Nursery',
  'LKG',
  'UKG',
  'Playgroup',
  'Pre-Nursery',
];

const defaultForm: StudentFormData = {
  name: '',
  age: 3,
  class: 'Nursery',
  parentName: '',
  contactNumber: '',
  address: '',
  admissionDate: new Date().toISOString().split('T')[0],
  totalFees: 0,
  paidFees: 0,
};

export default function StudentForm({
  onSubmit,
  onClose,
  initialData,
  isEditing = false,
}: Props) {
  const [form, setForm] = useState<StudentFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        age: initialData.age,
        class: initialData.class,
        parentName: initialData.parentName,
        contactNumber: initialData.contactNumber,
        address: initialData.address,
        admissionDate: initialData.admissionDate,
        totalFees: initialData.fees.totalFees,
        paidFees: initialData.fees.paidFees,
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.age < 1 || form.age > 10) newErrors.age = 'Age must be 1-10';
    if (!form.parentName.trim()) newErrors.parentName = 'Parent name is required';
    if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact is required';
    if (form.contactNumber.length < 10) newErrors.contactNumber = 'Enter valid phone number';
    if (form.totalFees < 0) newErrors.totalFees = 'Cannot be negative';
    if (form.paidFees < 0) newErrors.paidFees = 'Cannot be negative';
    if (form.paidFees > form.totalFees) newErrors.paidFees = 'Cannot exceed total fees';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof StudentFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop animate-fade-in p-4">
      <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-6 pb-4 border-b border-teal-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
                {isEditing ? (
                  <Save className="w-5 h-5 text-white" />
                ) : (
                  <UserPlus className="w-5 h-5 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-teal-800">
                {isEditing ? 'Edit Student' : 'Add New Student'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-teal-100 transition-colors"
            >
              <X className="w-5 h-5 text-teal-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Student Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-teal-200 bg-white/80'
                } text-teal-800 font-medium text-sm transition-all duration-200`}
                placeholder="Enter student name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Age *
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.age ? 'border-red-300 bg-red-50' : 'border-teal-200 bg-white/80'
                } text-teal-800 font-medium text-sm transition-all duration-200`}
                min={1}
                max={10}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Class *
              </label>
              <select
                value={form.class}
                onChange={(e) => handleChange('class', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 bg-white/80
                text-teal-800 font-medium text-sm appearance-none cursor-pointer transition-all duration-200"
              >
                {classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Parent Name *
              </label>
              <input
                type="text"
                value={form.parentName}
                onChange={(e) => handleChange('parentName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.parentName ? 'border-red-300 bg-red-50' : 'border-teal-200 bg-white/80'
                } text-teal-800 font-medium text-sm transition-all duration-200`}
                placeholder="Enter parent name"
              />
              {errors.parentName && (
                <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Contact Number *
              </label>
              <input
                type="tel"
                value={form.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.contactNumber ? 'border-red-300 bg-red-50' : 'border-teal-200 bg-white/80'
                } text-teal-800 font-medium text-sm transition-all duration-200`}
                placeholder="Enter phone number"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
              )}
            </div>

            {/* Admission Date */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Admission Date
              </label>
              <input
                type="date"
                value={form.admissionDate}
                onChange={(e) => handleChange('admissionDate', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 bg-white/80
                text-teal-800 font-medium text-sm transition-all duration-200"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-teal-200 bg-white/80
                text-teal-800 font-medium text-sm transition-all duration-200 resize-none"
                rows={2}
                placeholder="Enter address"
              />
            </div>

            {/* Divider */}
            <div className="md:col-span-2 my-2">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-teal-100" />
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Fee Details</span>
                <div className="h-px flex-1 bg-teal-100" />
              </div>
            </div>

            {/* Total Fees */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Total Fees (₹)
              </label>
              <input
                type="number"
                value={form.totalFees}
                onChange={(e) => handleChange('totalFees', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.totalFees ? 'border-red-300 bg-red-50' : 'border-teal-200 bg-white/80'
                } text-teal-800 font-medium text-sm transition-all duration-200`}
                min={0}
              />
              {errors.totalFees && (
                <p className="text-red-500 text-xs mt-1">{errors.totalFees}</p>
              )}
            </div>

            {/* Paid Fees */}
            <div>
              <label className="block text-sm font-semibold text-teal-700 mb-1.5">
                Paid Fees (₹)
              </label>
              <input
                type="number"
                value={form.paidFees}
                onChange={(e) => handleChange('paidFees', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.paidFees ? 'border-red-300 bg-red-50' : 'border-teal-200 bg-white/80'
                } text-teal-800 font-medium text-sm transition-all duration-200`}
                min={0}
              />
              {errors.paidFees && (
                <p className="text-red-500 text-xs mt-1">{errors.paidFees}</p>
              )}
            </div>

            {/* Pending Preview */}
            <div className="md:col-span-2">
              <div className="bg-teal-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-teal-600">Pending Fees</span>
                <span className={`text-lg font-bold ${
                  form.totalFees - form.paidFees > 0 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  ₹{(form.totalFees - form.paidFees).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-teal-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-teal-200 text-teal-700 font-semibold text-sm
              hover:bg-teal-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl gradient-teal text-white font-semibold text-sm
              btn-hover disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isEditing ? 'Save Changes' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

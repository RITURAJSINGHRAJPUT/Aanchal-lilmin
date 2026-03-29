import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Student } from '../types';

interface Props {
  students: Student[];
}

export default function FeesChart({ students }: Props) {
  // Aggregate by class
  const classMap = new Map<string, { paid: number; pending: number }>();

  students.forEach((s) => {
    const existing = classMap.get(s.class) || { paid: 0, pending: 0 };
    classMap.set(s.class, {
      paid: existing.paid + s.fees.paidFees,
      pending: existing.pending + s.fees.pendingFees,
    });
  });

  const data = Array.from(classMap.entries()).map(([name, values]) => ({
    name,
    paid: values.paid,
    pending: values.pending,
  }));

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up">
        <p className="text-teal-400 font-semibold">No data available for chart</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl p-3 shadow-lg border border-teal-100">
          <p className="font-bold text-teal-800 text-sm mb-1">{label}</p>
          {payload.map((entry: any, i: number) => (
            <p key={i} className="text-xs font-semibold" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in-up">
      <h3 className="text-lg font-bold text-teal-800 mb-4">Fees Overview by Class</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e6f7f5" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#4a9e9e', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#b3ece5' }}
            />
            <YAxis
              tick={{ fill: '#4a9e9e', fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: '#b3ece5' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, fontWeight: 700 }}
            />
            <Bar dataKey="paid" name="Paid" radius={[6, 6, 0, 0]} fill="#2dc8b2" />
            <Bar dataKey="pending" name="Pending" radius={[6, 6, 0, 0]} fill="#fb923c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

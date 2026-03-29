import { Users, IndianRupee, AlertCircle, TrendingUp, UserPlus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import FeesChart from '../components/FeesChart';
import { CardSkeleton } from '../components/Skeleton';
import { useStudents } from '../hooks/useStudents';
import { useStats } from '../hooks/useStats';

export default function DashboardPage() {
  const { students, loading } = useStudents();
  const stats = useStats(students);

  // Recent students (last 5)
  const recentStudents = students.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-800">
          Dashboard
        </h1>
        <p className="text-teal-500 font-medium mt-1">
          Welcome back! Here's your kindergarten overview.
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <DashboardCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle="Currently enrolled"
            icon={Users}
            gradient="teal"
            delay={50}
          />
          <DashboardCard
            title="Fees Collected"
            value={`₹${stats.totalFeesCollected.toLocaleString()}`}
            subtitle="Total received"
            icon={IndianRupee}
            gradient="green"
            delay={100}
          />
          <DashboardCard
            title="Pending Fees"
            value={`₹${stats.totalPendingFees.toLocaleString()}`}
            subtitle="Awaiting payment"
            icon={AlertCircle}
            gradient="mint"
            delay={150}
          />
          <DashboardCard
            title="Collection Rate"
            value={`${stats.totalFees > 0 ? Math.round((stats.totalFeesCollected / stats.totalFees) * 100) : 0}%`}
            subtitle="Of total fees"
            icon={TrendingUp}
            gradient="dark"
            delay={200}
          />
        </div>
      )}

      {/* Charts & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3">
          {!loading && <FeesChart students={students} />}
        </div>

        {/* Recent Students */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-teal-800">Recent Students</h3>
              <Link
                to="/students"
                className="text-xs font-bold text-teal-500 hover:text-teal-700 flex items-center gap-1 transition-colors"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton w-10 h-10 rounded-xl" />
                    <div className="flex-1">
                      <div className="skeleton h-4 w-24 mb-1" />
                      <div className="skeleton h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentStudents.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="w-10 h-10 text-teal-300 mx-auto mb-2" />
                <p className="text-sm text-teal-400 font-medium">No students yet</p>
                <Link
                  to="/students"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl gradient-teal text-white text-xs font-bold btn-hover"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add First Student
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentStudents.map((student, i) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-teal-50 transition-colors
                    animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${(i + 3) * 80}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-teal-800 text-sm truncate">{student.name}</div>
                      <div className="text-xs text-teal-400">{student.class} • Age {student.age}</div>
                    </div>
                    <div className="text-right shrink-0">
                      {student.fees.pendingFees > 0 ? (
                        <span className="text-xs font-bold text-orange-500">
                          ₹{student.fees.pendingFees.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-green-500">Paid ✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h3 className="text-lg font-bold text-teal-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/students"
            className="flex items-center gap-3 p-4 rounded-xl bg-teal-50 hover:bg-teal-100 transition-all duration-200 card-hover"
          >
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-teal-800">Add Student</div>
              <div className="text-xs text-teal-500">Register new student</div>
            </div>
          </Link>
          <Link
            to="/fees"
            className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-200 card-hover"
          >
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-teal-800">Manage Fees</div>
              <div className="text-xs text-teal-500">Record payments</div>
            </div>
          </Link>
          <Link
            to="/students"
            className="flex items-center gap-3 p-4 rounded-xl bg-teal-50 hover:bg-teal-100 transition-all duration-200 card-hover"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-700 to-teal-800 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-teal-800">View Students</div>
              <div className="text-xs text-teal-500">Browse all records</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

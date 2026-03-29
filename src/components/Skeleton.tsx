export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-white/60 animate-pulse">
      <div className="skeleton w-12 h-12 rounded-xl mb-4" />
      <div className="skeleton h-8 w-24 mb-2" />
      <div className="skeleton h-4 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="skeleton h-10 w-full mb-4 rounded-lg" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 mb-3">
            <div className="skeleton h-8 flex-1 rounded-lg" />
            <div className="skeleton h-8 w-20 rounded-lg" />
            <div className="skeleton h-8 w-24 rounded-lg" />
            <div className="skeleton h-8 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="skeleton h-8 w-48 mb-6 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton h-4 w-24 mb-2 rounded" />
            <div className="skeleton h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="skeleton h-12 w-40 mt-6 rounded-xl" />
    </div>
  );
}

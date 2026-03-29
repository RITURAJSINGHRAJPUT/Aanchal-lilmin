import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-bounce-in">
        <div className="text-8xl font-extrabold text-teal-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-teal-800 mb-2">Page Not Found</h1>
        <p className="text-teal-500 mb-8 max-w-sm mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-teal text-white font-bold text-sm btn-hover"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

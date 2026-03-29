import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'toast-custom',
          style: {
            borderRadius: '12px',
            padding: '12px 20px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#e6f7f5',
              color: '#1f4d4d',
              border: '1px solid #b3ece5',
            },
            iconTheme: {
              primary: '#2dc8b2',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
      <Sidebar />
      <main className="lg:ml-72 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

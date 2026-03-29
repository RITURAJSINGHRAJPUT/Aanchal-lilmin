import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <div className="px-4 py-2 mt-auto">
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-mint-400 to-green-500 text-white font-bold text-sm shadow-[0_4px_15px_rgba(74,158,158,0.3)] hover:shadow-[0_6px_20px_rgba(74,158,158,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 w-full"
      >
        <Download className="w-5 h-5" />
        Install App
      </button>
    </div>
  );
}

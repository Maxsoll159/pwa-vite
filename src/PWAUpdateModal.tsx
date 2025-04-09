import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function PWAUpdateModal() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        } else {
          console.log('User dismissed install');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className={`fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg rounded-lg ${(offlineReady || needRefresh || isInstallable) ? 'block' : 'hidden'}`}>
      {isInstallable && (
        <div className="mb-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleInstallClick}
          >
            Instalar Aplicación
          </button>
        </div>
      )}
      <div className="mb-2">
        {offlineReady ? (
          <span>Aplicación lista para trabajar offline</span>
        ) : needRefresh ? (
          <span>Nueva actualización disponible</span>
        ) : null}
      </div>
      {needRefresh && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => updateServiceWorker(true)}
        >
          Recargar
        </button>
      )}
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={close}
      >
        Cerrar
      </button>
    </div>
  );
}
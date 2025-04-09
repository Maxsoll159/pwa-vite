// src/components/PWAUpdateModal.tsx
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Añade esta declaración de tipos en tu archivo (o mejor, en un archivo de tipos global)
declare module 'virtual:pwa-register/react' {
  export interface RegisterSWOptions {
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: any) => void;
    immediate?: boolean;
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    offlineReady: [boolean, (value: boolean) => void];
    needRefresh: [boolean, (value: boolean) => void];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}

export function PWAUpdateModal() {
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

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className={`fixed bottom-0 right-0 m-4 p-4 bg-white shadow-lg rounded-lg ${offlineReady || needRefresh ? 'block' : 'hidden'}`}
    >
      <div className="mb-2">
        {offlineReady ? (
          <span>Aplicación lista para trabajar offline</span>
        ) : (
          <span>Nueva actualización disponible, haz clic en "Recargar" para actualizar.</span>
        )}
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        onClick={() => void updateServiceWorker(true)}
      >
        Recargar
      </button>

      <button
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={close}
      >
        Cerrar
      </button>
    </div>
  );
}
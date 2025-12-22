import React from 'react';

export function VenueDashboardHeader() {
  return (
    <header className="mb-10 text-center px-2 sm:px-8 mt-8">
      <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-black dark:text-white mb-2 drop-shadow-sm">
        Panel de Contrataciones
      </h1>
      <p className="text-muted-foreground text-base font-light max-w-xl mx-auto">
        Controla tus pagos y eventos con artistas desde aquí
      </p>
    </header>
  );
}

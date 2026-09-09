import React from 'react';
import { AppProvider, useApp } from './application/AppContext';
import { Header } from './presentation/components/layout/Header';
import { BottomNav } from './presentation/components/layout/BottomNav';
import { KanbanBoard } from './presentation/components/kanban/KanbanBoard';
import { ClientesList } from './presentation/components/clientes/ClientesList';
import { EmpresaView } from './presentation/components/empresa/EmpresaView';
import { RelatoriosView } from './presentation/components/relatorios/RelatoriosView';
import { ConfigView } from './presentation/components/config/ConfigView';
import { ClienteModal } from './presentation/components/clientes/ClienteModal';
import { OrdemModal } from './presentation/components/ordens/OrdemModal';
import { ReciboModal } from './presentation/components/recibo/ReciboModal';
import { BackupModal } from './presentation/components/backup/BackupModal';
import { ConfirmModal } from './presentation/components/layout/ConfirmModal';

const AppContent: React.FC = () => {
  const { abaAtiva } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {abaAtiva === 'kanban' && <KanbanBoard />}
        {abaAtiva === 'clientes' && <ClientesList />}
        {abaAtiva === 'relatorios' && <RelatoriosView />}
        {abaAtiva === 'empresa' && <EmpresaView />}
        {abaAtiva === 'configuracoes' && <ConfigView />}
      </main>

      <BottomNav />

      {/* Modais Globais */}
      <ClienteModal />
      <OrdemModal />
      <ReciboModal />
      <BackupModal />
      <ConfirmModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

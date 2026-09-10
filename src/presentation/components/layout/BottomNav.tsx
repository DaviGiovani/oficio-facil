import React from 'react';
import { useApp } from '../../../application/AppContext';
import { LayoutDashboard, Users, Plus, TrendingUp, Building2, Database, Package } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { abaAtiva, setAbaAtiva, setIsOrdemModalOpen, setOrdemParaEditar } = useApp();

  const handleNovaOs = () => {
    setOrdemParaEditar(null);
    setIsOrdemModalOpen(true);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-0.5 py-1 shadow-lg safe-bottom transition-colors duration-200">
      <div className="grid grid-cols-7 items-center justify-items-center">
        <button
          type="button"
          onClick={() => setAbaAtiva('kanban')}
          className={`flex flex-col items-center justify-center w-full py-1.5 transition-colors ${
            abaAtiva === 'kanban'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span className="text-[8px]">Quadro</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('clientes')}
          className={`flex flex-col items-center justify-center w-full py-1.5 transition-colors ${
            abaAtiva === 'clientes'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[8px]">Clientes</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('catalogo')}
          className={`flex flex-col items-center justify-center w-full py-1.5 transition-colors ${
            abaAtiva === 'catalogo'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          <span className="text-[8px]">Catálogo</span>
        </button>

        <button
          type="button"
          onClick={handleNovaOs}
          className="flex flex-col items-center justify-center w-full py-0.5 text-indigo-600 dark:text-indigo-400 focus:outline-hidden"
        >
          <div className="w-9 h-9 -mt-3 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-300 dark:shadow-none active:scale-95 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-[8px] font-medium text-slate-700 dark:text-slate-300 mt-0.5">Nova OS</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('relatorios')}
          className={`flex flex-col items-center justify-center w-full py-1.5 transition-colors ${
            abaAtiva === 'relatorios'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span className="text-[8px]">Relatórios</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('empresa')}
          className={`flex flex-col items-center justify-center w-full py-1.5 transition-colors ${
            abaAtiva === 'empresa'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Building2 className="w-4 h-4 mb-0.5" />
          <span className="text-[8px]">Empresa</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('configuracoes')}
          className={`flex flex-col items-center justify-center w-full py-1.5 transition-colors ${
            abaAtiva === 'configuracoes'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Database className="w-4 h-4 mb-0.5" />
          <span className="text-[8px]">Backup</span>
        </button>
      </div>
    </nav>
  );
};

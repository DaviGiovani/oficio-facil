import React from 'react';
import { useApp } from '../../../application/AppContext';
import { formatarMoeda } from '../../utils/formatters';
import {
  Wrench,
  Plus,
  LayoutDashboard,
  Users,
  Building2,
  Database,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    abaAtiva,
    setAbaAtiva,
    setIsOrdemModalOpen,
    setOrdemParaEditar,
    dadosEmpresa,
    totalOrdensAtivas,
    faturamentoConcluido,
    ticketMedio,
    tema,
    alternarTema,
  } = useApp();

  const handleNovaOs = () => {
    setOrdemParaEditar(null);
    setIsOrdemModalOpen(true);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Linha Superior: Logo e Navegação */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Marca / Identidade */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Ofício<span className="text-indigo-600 dark:text-indigo-400">Fácil</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-[280px]">
                {dadosEmpresa.nome || 'Gestão e Precificação de Serviços'}
              </p>
            </div>
          </div>

          {/* Controles da Direita: Tema + Navegação Desktop e Botão de Ação */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão de Alternar Tema Claro / Escuro */}
            <button
              type="button"
              onClick={alternarTema}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
              title={tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              aria-label="Alternar tema claro/escuro"
            >
              {tema === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Navegação Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <nav className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAbaAtiva('kanban')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    abaAtiva === 'kanban'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Quadro OS
                </button>
                <button
                  type="button"
                  onClick={() => setAbaAtiva('clientes')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    abaAtiva === 'clientes'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Clientes
                </button>
                <button
                  type="button"
                  onClick={() => setAbaAtiva('relatorios')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    abaAtiva === 'relatorios'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Relatórios
                </button>
                <button
                  type="button"
                  onClick={() => setAbaAtiva('empresa')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    abaAtiva === 'empresa'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Minha Empresa
                </button>
                <button
                  type="button"
                  onClick={() => setAbaAtiva('configuracoes')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    abaAtiva === 'configuracoes'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  Backup
                </button>
              </nav>

              <button
                type="button"
                onClick={handleNovaOs}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200 dark:shadow-none shrink-0"
              >
                <Plus className="w-4 h-4" />
                Nova OS
              </button>
            </div>
          </div>
        </div>

        {/* Faixa de Métricas Rápidas */}
        <div className="py-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 sm:gap-4 text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-lg p-2 sm:px-3 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Em Aberto</p>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {totalOrdensAtivas} <span className="text-[11px] font-normal text-slate-400">OS</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-lg p-2 sm:px-3 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Faturamento</p>
              <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 leading-tight truncate">
                {formatarMoeda(faturamentoConcluido)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-lg p-2 sm:px-3 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Ticket Médio</p>
              <p className="text-sm sm:text-base font-bold text-indigo-700 dark:text-indigo-400 leading-tight truncate">
                {formatarMoeda(ticketMedio)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useMemo } from 'react';
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
  Package,
  ChevronDown,
  DollarSign,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    abaAtiva,
    setAbaAtiva,
    setIsOrdemModalOpen,
    setOrdemParaEditar,
    dadosEmpresa,
    ordens,
    clientes,
    servicosCatalogo,
    pecasCatalogo,
    totalOrdensAtivas,
    faturamentoConcluido,
    ticketMedio,
    tema,
    alternarTema,
  } = useApp();

  const [isDropdownMetricasAberto, setIsDropdownMetricasAberto] = useState(false);

  const previsaoReceita = useMemo(() => {
    return ordens
      .filter((o) => o.status !== 'concluido' && o.status !== 'cancelado')
      .reduce((acc, o) => acc + (o.financeiro?.valorFinal || 0), 0);
  }, [ordens]);

  const totalOrdensConcluidas = useMemo(() => {
    return ordens.filter((o) => o.status === 'concluido').length;
  }, [ordens]);

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
                  onClick={() => setAbaAtiva('catalogo')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    abaAtiva === 'catalogo'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Catálogo
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

        {/* Métrica no Mobile: Dropdown Expansível Interativo */}
        <div className="sm:hidden py-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsDropdownMetricasAberto(!isDropdownMetricasAberto)}
            className="w-full flex items-center justify-between p-2.5 bg-slate-50/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all text-left shadow-2xs active:scale-[0.99]"
            aria-expanded={isDropdownMetricasAberto}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Resumo do Negócio
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                    {totalOrdensAtivas} OS ativas
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Faturamento:{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatarMoeda(faturamentoConcluido)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
              <span>{isDropdownMetricasAberto ? 'Fechar' : 'Métricas'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownMetricasAberto ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Conteúdo Expandido do Dropdown no Mobile */}
          {isDropdownMetricasAberto && (
            <div className="mt-2 p-3 bg-white dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  Métricas & Indicadores Rápidos
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ● Tempo Real
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* 1. Em Aberto */}
                <div className="p-2.5 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 mb-1 font-medium">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">OS em Aberto</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {totalOrdensAtivas} <span className="text-xs font-normal text-slate-400">OS</span>
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                    Orçamentos e em andamento
                  </span>
                </div>

                {/* 2. Previsão a Receber */}
                <div className="p-2.5 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 mb-1 font-medium">
                    <DollarSign className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Previsão a Receber</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-400 leading-tight truncate">
                    {formatarMoeda(previsaoReceita)}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                    Pipeline das OS abertas
                  </span>
                </div>

                {/* 3. Faturamento Total */}
                <div className="p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 mb-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Faturamento</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 leading-tight truncate">
                    {formatarMoeda(faturamentoConcluido)}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                    {totalOrdensConcluidas} OS finalizadas
                  </span>
                </div>

                {/* 4. Ticket Médio */}
                <div className="p-2.5 bg-indigo-50/80 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40">
                  <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 mb-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Ticket Médio</span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-indigo-700 dark:text-indigo-400 leading-tight truncate">
                    {formatarMoeda(ticketMedio)}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                    Média por OS concluída
                  </span>
                </div>

                {/* 5. Clientes */}
                <div className="p-2.5 bg-purple-50/80 dark:bg-purple-950/30 rounded-xl border border-purple-200/60 dark:border-purple-900/40">
                  <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 mb-1 font-medium">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Clientes Ativos</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {clientes.length}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                    Cadastrados na sua base
                  </span>
                </div>

                {/* 6. Itens no Catálogo */}
                <div className="p-2.5 bg-slate-100/80 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mb-1 font-medium">
                    <Package className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Itens no Catálogo</span>
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {servicosCatalogo.length + pecasCatalogo.length}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                    {servicosCatalogo.length} serv. • {pecasCatalogo.length} peças
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Faixa de Métricas Rápidas no Desktop (4 Colunas) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 py-2.5 border-t border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">OS em Aberto</p>
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {totalOrdensAtivas} <span className="text-[11px] font-normal text-slate-400">OS</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Previsão a Receber</p>
              <p className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-400 leading-tight truncate">
                {formatarMoeda(previsaoReceita)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Faturamento</p>
              <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-400 leading-tight truncate">
                {formatarMoeda(faturamentoConcluido)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
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

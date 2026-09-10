import React, { useState, useMemo } from 'react';
import { useApp } from '../../../application/AppContext';
import { OrdemServico, StatusOrdem } from '../../../domain/types';
import { KanbanCard } from './KanbanCard';
import { formatarMoeda } from '../../utils/formatters';
import {
  FileText,
  CheckCircle2,
  PlayCircle,
  CheckCheck,
  XCircle,
  Search,
} from 'lucide-react';

interface ColunaConfig {
  id: StatusOrdem;
  titulo: string;
  icone: React.ElementType;
  corBorda: string;
  corBadge: string;
  corPonto: string;
}

const COLUNAS: ColunaConfig[] = [
  {
    id: 'orcamento',
    titulo: 'Orçamento',
    icone: FileText,
    corBorda: 'border-amber-300 dark:border-amber-500/40',
    corBadge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 dark:border dark:border-amber-800/60',
    corPonto: 'bg-amber-500',
  },
  {
    id: 'aprovado',
    titulo: 'Aprovado',
    icone: CheckCircle2,
    corBorda: 'border-blue-300 dark:border-blue-500/40',
    corBadge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 dark:border dark:border-blue-800/60',
    corPonto: 'bg-blue-600',
  },
  {
    id: 'em_andamento',
    titulo: 'Em Andamento',
    icone: PlayCircle,
    corBorda: 'border-purple-300 dark:border-purple-500/40',
    corBadge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 dark:border dark:border-purple-800/60',
    corPonto: 'bg-purple-600',
  },
  {
    id: 'concluido',
    titulo: 'Concluído',
    icone: CheckCheck,
    corBorda: 'border-emerald-300 dark:border-emerald-500/40',
    corBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border dark:border-emerald-800/60',
    corPonto: 'bg-emerald-600',
  },
  {
    id: 'cancelado',
    titulo: 'Cancelado',
    icone: XCircle,
    corBorda: 'border-slate-300 dark:border-slate-700',
    corBadge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700',
    corPonto: 'bg-zinc-500',
  },
];

type FiltroTempoConcluidas = '7d' | '30d' | 'todas';

export const KanbanBoard: React.FC = () => {
  const { ordens, clientes, filtroTexto, setFiltroTexto } = useApp();
  const [colunaMobileAtiva, setColunaMobileAtiva] = useState<StatusOrdem | 'todas'>('todas');
  const [filtroTempoConcluidas, setFiltroTempoConcluidas] = useState<FiltroTempoConcluidas>('7d');

  // Filtra as ordens de acordo com o campo de busca local do quadro
  const ordensFiltradas = useMemo(() => {
    const termo = filtroTexto.toLowerCase().trim();
    if (!termo) return ordens;

    return ordens.filter((ordem) => {
      const cliente = clientes.find((c) => c.id === ordem.clienteId);
      const nomeCliente = cliente ? cliente.nome.toLowerCase() : '';
      const numero = String(ordem.numeroOs);
      const titulo = ordem.tituloServico.toLowerCase();
      const defeito = ordem.descricaoDefeito.toLowerCase();

      return (
        numero.includes(termo) ||
        titulo.includes(termo) ||
        nomeCliente.includes(termo) ||
        defeito.includes(termo)
      );
    });
  }, [ordens, clientes, filtroTexto]);

  const totalConcluidasGeral = useMemo(() => {
    return ordensFiltradas.filter((o) => o.status === 'concluido').length;
  }, [ordensFiltradas]);

  // Agrupa ordens por status, aplicando filtro temporal seletivo para Concluídas
  const ordensPorStatus = useMemo(() => {
    const mapa: Record<StatusOrdem, OrdemServico[]> = {
      orcamento: [],
      aprovado: [],
      em_andamento: [],
      concluido: [],
      cancelado: [],
    };

    const agora = new Date().getTime();

    ordensFiltradas.forEach((o) => {
      if (o.status === 'concluido' && filtroTempoConcluidas !== 'todas') {
        const dataReferencia = new Date(o.atualizadoEm || o.prazoEntrega || o.criadoEm).getTime();
        const diasDiff = Math.floor((agora - dataReferencia) / (1000 * 60 * 60 * 24));
        const limiteDias = filtroTempoConcluidas === '7d' ? 7 : 30;
        if (diasDiff > limiteDias) {
          return;
        }
      }

      if (mapa[o.status]) {
        mapa[o.status].push(o);
      }
    });
    return mapa;
  }, [ordensFiltradas, filtroTempoConcluidas]);

  // Totais por coluna
  const totalPorStatus = useMemo(() => {
    const totais: Record<StatusOrdem, number> = {
      orcamento: 0,
      aprovado: 0,
      em_andamento: 0,
      concluido: 0,
      cancelado: 0,
    };
    Object.entries(ordensPorStatus).forEach(([status, lista]) => {
      totais[status as StatusOrdem] = lista.reduce(
        (acc, o) => acc + (o.financeiro?.valorFinal || 0),
        0
      );
    });
    return totais;
  }, [ordensPorStatus]);

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Barra Superior do Quadro: Título e Busca Integrada */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Quadro de Ordens de Serviço</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acompanhe e gerencie as etapas de atendimento dos seus serviços
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrar por OS, cliente ou serviço..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
          {filtroTexto && (
            <button
              type="button"
              onClick={() => setFiltroTexto('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Controles Mobile: Seletor de Colunas */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setColunaMobileAtiva('todas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            colunaMobileAtiva === 'todas'
              ? 'bg-slate-900 dark:bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Todas ({ordensFiltradas.length})
        </button>

        {COLUNAS.map((col) => {
          const qtd = ordensPorStatus[col.id].length;
          const ativo = colunaMobileAtiva === col.id;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setColunaMobileAtiva(col.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                ativo
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${col.corPonto}`} />
              <span>{col.titulo}</span>
              <span className="opacity-75">({qtd})</span>
            </button>
          );
        })}
      </div>

      {/* Grid do Kanban (5 colunas no Desktop, colunas selecionadas no Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUNAS.map((coluna) => {
          const cards = ordensPorStatus[coluna.id];
          const valorColuna = totalPorStatus[coluna.id];
          const Icone = coluna.icone;

          // Se estiver no mobile e filtrado por coluna específica, oculta as outras
          if (colunaMobileAtiva !== 'todas' && colunaMobileAtiva !== coluna.id) {
            return null;
          }

          return (
            <div
              key={coluna.id}
              className={`bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl border-t-4 ${coluna.corBorda} border-x border-b border-slate-200 dark:border-slate-800 p-3.5 flex flex-col min-h-[300px] md:min-h-[600px] shadow-xs transition-colors duration-200`}
            >
              {/* Cabeçalho da Coluna */}
              <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${coluna.corPonto}`} />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{coluna.titulo}</h3>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${coluna.corBadge}`}
                >
                  {coluna.id === 'concluido' && cards.length !== totalConcluidasGeral
                    ? `${cards.length}/${totalConcluidasGeral}`
                    : cards.length}
                </span>
              </div>

              {/* Filtro Temporal Exclusivo da Coluna Concluído */}
              {coluna.id === 'concluido' && (
                <div className="grid grid-cols-3 gap-1 bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-lg mb-2.5 text-[11px] font-medium text-center">
                  <button
                    type="button"
                    onClick={() => setFiltroTempoConcluidas('7d')}
                    className={`py-1 rounded-md transition-all ${
                      filtroTempoConcluidas === '7d'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    7 dias
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroTempoConcluidas('30d')}
                    className={`py-1 rounded-md transition-all ${
                      filtroTempoConcluidas === '30d'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    30 dias
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroTempoConcluidas('todas')}
                    className={`py-1 rounded-md transition-all ${
                      filtroTempoConcluidas === 'todas'
                        ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Todas
                  </button>
                </div>
              )}

              {/* Subtotal da Coluna */}
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between px-1">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatarMoeda(valorColuna)}</span>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="space-y-3 flex-1">
                {cards.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                    <Icone className="w-5 h-5 text-slate-300 dark:text-slate-600 mb-1" />
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Nenhuma OS</p>
                  </div>
                ) : (
                  cards.map((ordem) => <KanbanCard key={ordem.id} ordem={ordem} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

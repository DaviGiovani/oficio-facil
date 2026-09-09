import React, { useState, useMemo } from 'react';
import { useApp } from '../../../application/AppContext';
import {
  ReportsEngine,
  FiltroRelatorio,
  PeriodoRelatorio,
} from '../../../domain/reports';
import { formatarMoeda } from '../../utils/formatters';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Users,
  Percent,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const RelatoriosView: React.FC = () => {
  const { ordens, clientes, dadosEmpresa } = useApp();

  const [periodo, setPeriodo] = useState<PeriodoRelatorio>('todos');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [mostrarAjudaDre, setMostrarAjudaDre] = useState(false);

  const filtro: FiltroRelatorio = useMemo(
    () => ({
      periodo,
      dataInicio: periodo === 'personalizado' ? dataInicio : undefined,
      dataFim: periodo === 'personalizado' ? dataFim : undefined,
    }),
    [periodo, dataInicio, dataFim]
  );

  const relatorio = useMemo(() => {
    return ReportsEngine.gerarRelatorioCompleto(ordens, clientes, filtro);
  }, [ordens, clientes, filtro]);

  const handleExportarDre = () => {
    const csv = ReportsEngine.gerarCsvDre(relatorio, dadosEmpresa.nome || 'OfícioFácil');
    const nomeArquivo = `dre_financeiro_${periodo}_${new Date().toISOString().slice(0, 10)}.csv`;
    ReportsEngine.baixarCsv(csv, nomeArquivo);
  };

  const handleExportarOrdens = () => {
    const csv = ReportsEngine.gerarCsvOrdens(relatorio.ordensFiltradas, clientes);
    const nomeArquivo = `relatorio_ordens_${periodo}_${new Date().toISOString().slice(0, 10)}.csv`;
    ReportsEngine.baixarCsv(csv, nomeArquivo);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Relatórios Financeiros & DRE
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Demonstração de resultados operacionais, margens de lucro e exportação em CSV.
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Exportação CSV */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportarDre}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Baixar Demonstrativo DRE no formato CSV para Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Exportar DRE (.csv)</span>
          </button>

          <button
            type="button"
            onClick={handleExportarOrdens}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
            title="Baixar lista completa de ordens filtradas no formato CSV para Excel"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Ordens (.csv)</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros de Período */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Filtrar Período:</span>
            <span className="font-normal text-slate-500 dark:text-slate-400">
              ({relatorio.periodoDescricao})
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: 'todos', label: 'Todo o Histórico' },
                { id: 'mes_atual', label: 'Este Mês' },
                { id: 'mes_anterior', label: 'Mês Passado' },
                { id: 'ano_atual', label: 'Este Ano' },
                { id: 'personalizado', label: 'Personalizado' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPeriodo(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  periodo === opt.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs de Data Personalizada */}
        {periodo === 'personalizado' && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">De:</span>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Até:</span>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Receita Operacional Bruta */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Receita Faturada</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatarMoeda(relatorio.dre.receitaBruta)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{relatorio.kpis.totalOsConcluidas} OS concluída(s)</span>
          </p>
        </div>

        {/* Lucro Operacional Líquido */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Lucro Líquido Realizado</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {formatarMoeda(relatorio.dre.lucroOperacionalLiquido)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Margem Líquida:{' '}
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {relatorio.dre.percentualMargemLiquida}%
            </span>
          </p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Ticket Médio</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatarMoeda(relatorio.kpis.ticketMedio)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Médio por serviço finalizado
          </p>
        </div>

        {/* Taxa de Conversão */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Conversão de Orçamentos</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {relatorio.kpis.taxaConversaoPercentual}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {relatorio.kpis.orcamentosConvertidos} de {relatorio.kpis.totalOrcamentosGerados} propostas
          </p>
        </div>
      </div>

      {/* Seção Principal: DRE Simplificado + Distribuição por Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DRE Simplificado Estruturado (2 Colunas no Desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                DRE Simplificado (Serviços Concluídos)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMostrarAjudaDre(!mostrarAjudaDre)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="O que é o DRE?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Dica Acadêmica e Didática sobre o DRE */}
          {mostrarAjudaDre && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-1 animate-in fade-in">
              <p className="font-bold">O que é a Demonstração do Resultado (DRE)?</p>
              <p className="leading-relaxed text-indigo-900/90 dark:text-indigo-300">
                O DRE é o relatório financeiro padrão que evidencia se a sua operação gerou lucro ou prejuízo.
                Ele confronta a receita total faturada com os custos de materiais e o valor da sua mão de obra,
                revelando exatamente o retorno limpo obtido pelo seu negócio.
              </p>
            </div>
          )}

          {/* Estrutura do DRE em Linhas */}
          <div className="space-y-2.5 pt-1">
            {/* Linha 1: Receita Bruta */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  (+) Receita Operacional Bruta
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total cobrado dos clientes pelas ordens finalizadas
                </p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  {formatarMoeda(relatorio.dre.receitaBruta)}
                </span>
                <p className="text-[11px] font-bold text-slate-400">100,0%</p>
              </div>
            </div>

            {/* Linha 2: Custos de Materiais e Peças */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                  (-) Custos de Materiais e Insumos (CPV)
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Peças, componentes e suprimentos adquiridos para os serviços
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm sm:text-base">
                  -{formatarMoeda(relatorio.dre.custoMateriais)}
                </span>
                <p className="text-[11px] font-semibold text-rose-500">
                  {relatorio.dre.receitaBruta > 0
                    ? ((relatorio.dre.custoMateriais / relatorio.dre.receitaBruta) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Linha 3: Margem de Contribuição / Lucro Bruto */}
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm">
                  (=) Margem de Contribuição / Lucro Bruto
                </span>
                <p className="text-[11px] text-indigo-900/60 dark:text-indigo-400">
                  Valor que sobra da receita após pagar todos os materiais
                </p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-sm sm:text-base">
                  {formatarMoeda(relatorio.dre.margemContribuicao)}
                </span>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {relatorio.dre.percentualMargemContribuicao}%
                </p>
              </div>
            </div>

            {/* Linha 4: Custo Operacional de Mão de Obra */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-amber-600 dark:text-amber-400 text-xs sm:text-sm">
                  (-) Custo de Mão de Obra Operacional
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Remuneração do tempo técnico investido ({relatorio.kpis.totalHorasConcluidas}h trabalhadas)
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm sm:text-base">
                  -{formatarMoeda(relatorio.dre.custoMaoDeObra)}
                </span>
                <p className="text-[11px] font-semibold text-amber-500">
                  {relatorio.dre.receitaBruta > 0
                    ? ((relatorio.dre.custoMaoDeObra / relatorio.dre.receitaBruta) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Linha 5: Lucro Operacional Líquido */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">
                  (=) Lucro Operacional Líquido
                </span>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                  Resultado real que fortalece o caixa e o crescimento do seu negócio
                </p>
              </div>
              <div className="text-right">
                <span className="font-black text-emerald-700 dark:text-emerald-300 text-base sm:text-lg">
                  {formatarMoeda(relatorio.dre.lucroOperacionalLiquido)}
                </span>
                <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  Margem: {relatorio.dre.percentualMargemLiquida}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribuição por Etapas do Kanban (1 Coluna no Desktop) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Volume por Etapa
            </h2>
          </div>

          <div className="space-y-3">
            {relatorio.resumoStatus.map((res) => {
              const corBarra =
                res.status === 'concluido'
                  ? 'bg-emerald-500'
                  : res.status === 'em_andamento'
                  ? 'bg-indigo-500'
                  : res.status === 'aprovado'
                  ? 'bg-blue-500'
                  : res.status === 'orcamento'
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

              return (
                <div key={res.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {res.titulo}{' '}
                      <span className="text-slate-400 font-normal">({res.quantidade})</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatarMoeda(res.valorTotal)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${corBarra} transition-all duration-300`}
                      style={{ width: `${Math.min(res.percentualValor, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Pipeline Ativo (Aprovado + Em Andamento):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatarMoeda(relatorio.kpis.pipelinePrevisto)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Perdas por Cancelamento:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {formatarMoeda(relatorio.kpis.totalCancelado)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Inferior: Top Clientes + Resumo de Ordens do Período */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Clientes do Período */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Top Clientes do Período
            </h2>
          </div>

          {relatorio.topClientes.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
              Nenhum cliente com ordens no período selecionado.
            </p>
          ) : (
            <div className="space-y-2.5">
              {relatorio.topClientes.map((c, idx) => (
                <div
                  key={c.clienteId}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {c.nomeCliente}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {c.totalOrdens} ordem(ns) de serviço
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {formatarMoeda(c.valorTotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabela de Ordens do Período (2 Colunas no Desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Ordens no Período ({relatorio.ordensFiltradas.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleExportarOrdens}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar todas em CSV
            </button>
          </div>

          {relatorio.ordensFiltradas.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-8 text-center">
              Nenhuma ordem de serviço cadastrada neste período.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[11px]">
                    <th className="py-2.5 px-2">OS</th>
                    <th className="py-2.5 px-2">Data</th>
                    <th className="py-2.5 px-2">Cliente / Serviço</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Materiais</th>
                    <th className="py-2.5 px-2 text-right">Mão Obra</th>
                    <th className="py-2.5 px-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {relatorio.ordensFiltradas.slice(0, 8).map((ordem) => {
                    const cliente = clientes.find((c) => c.id === ordem.clienteId);
                    const dataFormatada = new Date(ordem.criadoEm).toLocaleDateString('pt-BR');

                    const badgeCor =
                      ordem.status === 'concluido'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : ordem.status === 'em_andamento'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        : ordem.status === 'aprovado'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : ordem.status === 'orcamento'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300';

                    return (
                      <tr key={ordem.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                          #{ordem.numeroOs}
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {dataFormatada}
                        </td>
                        <td className="py-2.5 px-2 min-w-[140px]">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {cliente?.nome || 'Cliente não identificado'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {ordem.tituloServico}
                          </p>
                        </td>
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeCor}`}>
                            {ordem.status === 'concluido'
                              ? 'Concluído'
                              : ordem.status === 'em_andamento'
                              ? 'Em Andamento'
                              : ordem.status === 'aprovado'
                              ? 'Aprovado'
                              : ordem.status === 'orcamento'
                              ? 'Orçamento'
                              : 'Cancelado'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-500 dark:text-slate-400">
                          {formatarMoeda(ordem.financeiro?.subtotalMateriais || 0)}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-500 dark:text-slate-400">
                          {formatarMoeda(ordem.financeiro?.custoMaoDeObra || 0)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-slate-900 dark:text-white">
                          {formatarMoeda(ordem.financeiro?.valorFinal || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {relatorio.ordensFiltradas.length > 8 && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-3">
                  Exibindo as 8 primeiras ordens. Clique em "Exportar todas em CSV" para ver a lista completa.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

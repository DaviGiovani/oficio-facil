import React from 'react';
import { ServicoCatalogo } from '../../../domain/types';
import { useApp } from '../../../application/AppContext';
import { formatarMoeda, formatarHorasExibicao, formatarData } from '../../utils/formatters';
import { X, Wrench, Clock, DollarSign, Calendar, Edit2, Calculator } from 'lucide-react';

interface ServicoDetalhesModalProps {
  servico: ServicoCatalogo | null;
  onClose: () => void;
  onEditar: (servico: ServicoCatalogo) => void;
}

export const ServicoDetalhesModal: React.FC<ServicoDetalhesModalProps> = ({
  servico,
  onClose,
  onEditar,
}) => {
  const { dadosEmpresa } = useApp();

  if (!servico) return null;

  const valorHoraPadrao = dadosEmpresa.valorHoraPadrao || 0;
  const valorCalculadoPorHora = valorHoraPadrao > 0 ? valorHoraPadrao * servico.horasEstimadas : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-4">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {servico.nome}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ficha do Serviço Cadastrado no Catálogo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Descrição / Escopo */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Descrição / Escopo do Trabalho
            </span>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {servico.descricao?.trim() ? (
                servico.descricao
              ) : (
                <span className="text-slate-400 dark:text-slate-500 italic">
                  Nenhuma descrição detalhada informada para este serviço.
                </span>
              )}
            </div>
          </div>

          {/* Métricas Principais: Tempo Estimado e Valor Sugerido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold">Tempo Estimado</span>
              </div>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {formatarHorasExibicao(servico.horasEstimadas)}
              </p>
              <span className="text-[11px] text-slate-400">
                {servico.horasEstimadas}h de execução
              </span>
            </div>

            <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-semibold">Mão de Obra Sugerida</span>
              </div>
              <p className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">
                {formatarMoeda(servico.valorSugerido)}
              </p>
              <span className="text-[11px] text-slate-400">
                Preço tabelado base
              </span>
            </div>
          </div>

          {/* Comparação com Hora Técnica Padrão da Empresa (se configurada) */}
          {valorCalculadoPorHora !== null && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3 text-xs">
              <Calculator className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-slate-600 dark:text-slate-300 space-y-0.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Cálculo pela Hora Técnica ({formatarMoeda(valorHoraPadrao)}/h):
                </p>
                <p>
                  Com base no seu custo/hora padrão, este serviço equivaleria a{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {formatarMoeda(valorCalculadoPorHora)}
                  </strong>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Rodapé com Data de Criação */}
          {servico.criadoEm && (
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Cadastrado em {formatarData(servico.criadoEm)}</span>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditar(servico);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar Serviço</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

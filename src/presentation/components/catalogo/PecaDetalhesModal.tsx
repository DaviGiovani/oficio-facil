import React from 'react';
import { PecaCatalogo } from '../../../domain/types';
import { formatarMoeda, formatarData } from '../../utils/formatters';
import {
  X,
  Package,
  Tag,
  TrendingUp,
  Calendar,
  Edit2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface PecaDetalhesModalProps {
  peca: PecaCatalogo | null;
  onClose: () => void;
  onEditar: (peca: PecaCatalogo) => void;
}

const UNIDADES_LABELS: Record<string, string> = {
  un: 'Unidade (un)',
  m: 'Metro linear (m)',
  kg: 'Quilograma (kg)',
  l: 'Litro (L)',
  par: 'Par (par)',
  pacote: 'Pacote (pct)',
  outro: 'Outro',
};

export const PecaDetalhesModal: React.FC<PecaDetalhesModalProps> = ({
  peca,
  onClose,
  onEditar,
}) => {
  if (!peca) return null;

  const lucroUnitario = peca.precoVenda - peca.precoCusto;
  const markupPercentual = peca.precoCusto > 0 ? (lucroUnitario / peca.precoCusto) * 100 : 0;
  const margemPercentual = peca.precoVenda > 0 ? (lucroUnitario / peca.precoVenda) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-4">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {peca.nome}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ficha da Peça / Insumo Cadastrado
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
          {/* Identificação de Código e Unidade de Medida */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Unidade: {UNIDADES_LABELS[peca.unidade] || peca.unidade}</span>
            </div>

            {peca.codigo ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-xs font-mono font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <Tag className="w-3.5 h-3.5" />
                <span>Código / Ref: {peca.codigo}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                Sem código ou referência cadastrada
              </span>
            )}
          </div>

          {/* Comparativo de Preço: Custo vs Preço de Venda */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Custo de Aquisição
              </span>
              <p className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-200">
                {formatarMoeda(peca.precoCusto)}
              </p>
              <span className="text-[11px] text-slate-400">
                por {peca.unidade}
              </span>
            </div>

            <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 block mb-1">
                Preço de Venda ao Cliente
              </span>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {formatarMoeda(peca.precoVenda)}
              </p>
              <span className="text-[11px] text-slate-400">
                por {peca.unidade}
              </span>
            </div>
          </div>

          {/* Painel de Rentabilidade e Margem */}
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Lucro Bruto Unitário
              </span>
              <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                +{formatarMoeda(lucroUnitario)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Markup sobre custo:</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {markupPercentual.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Margem sobre receita:</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {margemPercentual.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Rodapé com Data de Cadastro */}
          {peca.criadoEm && (
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Cadastrada em {formatarData(peca.criadoEm)}</span>
            </div>
          )}
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEditar(peca);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar Peça</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

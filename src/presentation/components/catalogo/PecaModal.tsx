import React, { useState, useEffect } from 'react';
import { useApp } from '../../../application/AppContext';
import { UnidadeMedida } from '../../../domain/types';
import {
  formatarMoeda,
  aplicarMascaraMoeda,
  converterMoedaParaNumero,
} from '../../utils/formatters';
import { X, Package, Save, DollarSign, TrendingUp, Tag } from 'lucide-react';

const UNIDADES: Array<{ valor: UnidadeMedida; rotulo: string }> = [
  { valor: 'un', rotulo: 'Unidade (un)' },
  { valor: 'm', rotulo: 'Metro (m)' },
  { valor: 'kg', rotulo: 'Quilograma (kg)' },
  { valor: 'l', rotulo: 'Litro (l)' },
  { valor: 'par', rotulo: 'Par (par)' },
  { valor: 'pacote', rotulo: 'Pacote (pct)' },
  { valor: 'outro', rotulo: 'Outro' },
];

export const PecaModal: React.FC = () => {
  const {
    isPecaModalOpen,
    setIsPecaModalOpen,
    pecaParaEditar,
    setPecaParaEditar,
    criarPecaCatalogo,
    atualizarPecaCatalogo,
  } = useApp();

  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [unidade, setUnidade] = useState<UnidadeMedida>('un');
  const [precoCusto, setPrecoCusto] = useState('0,00');
  const [precoVenda, setPrecoVenda] = useState('0,00');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (pecaParaEditar) {
      setNome(pecaParaEditar.nome);
      setCodigo(pecaParaEditar.codigo || '');
      setUnidade(pecaParaEditar.unidade);
      setPrecoCusto(aplicarMascaraMoeda(pecaParaEditar.precoCusto));
      setPrecoVenda(aplicarMascaraMoeda(pecaParaEditar.precoVenda));
    } else {
      setNome('');
      setCodigo('');
      setUnidade('un');
      setPrecoCusto('');
      setPrecoVenda('');
    }
    setErro(null);
  }, [pecaParaEditar, isPecaModalOpen]);

  if (!isPecaModalOpen) return null;

  const custoNum = converterMoedaParaNumero(precoCusto);
  const vendaNum = converterMoedaParaNumero(precoVenda);
  const lucro = vendaNum - custoNum;
  const markupPercentual = custoNum > 0 ? (lucro / custoNum) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('Por favor, informe o nome da peça ou material.');
      return;
    }

    if (vendaNum < custoNum) {
      setErro('O preço de venda não pode ser menor que o preço de custo.');
      return;
    }

    if (pecaParaEditar) {
      atualizarPecaCatalogo(pecaParaEditar.id, {
        nome: nome.trim(),
        codigo: codigo.trim() || undefined,
        unidade,
        precoCusto: custoNum,
        precoVenda: vendaNum,
      });
    } else {
      criarPecaCatalogo({
        nome: nome.trim(),
        codigo: codigo.trim() || undefined,
        unidade,
        precoCusto: custoNum,
        precoVenda: vendaNum,
      });
    }

    fecharModal();
  };

  const fecharModal = () => {
    setIsPecaModalOpen(false);
    setPecaParaEditar(null);
    setErro(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {pecaParaEditar ? 'Editar Peça / Material' : 'Nova Peça ou Material'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cadastre insumos para facilitar o lançamento de custos na OS.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fecharModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Nome da Peça / Insumo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Disjuntor DIN 20A, Óleo Motor 5W30, Fita Isolante"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                Código / Ref (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: DISJ-20A, CAB-25"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Unidade de Medida
              </label>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value as UnidadeMedida)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              >
                {UNIDADES.map((u) => (
                  <option key={u.valor} value={u.valor}>
                    {u.rotulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="h-5 flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">
                  Preço de Custo
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={precoCusto}
                  onChange={(e) => setPrecoCusto(aplicarMascaraMoeda(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
                Quanto você pagou no fornecedor
              </span>
            </div>

            <div>
              <div className="h-5 flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">
                  Preço de Venda *
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="0,00"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(aplicarMascaraMoeda(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
                Valor lançado para o cliente na OS
              </span>
            </div>
          </div>

          {/* Card de Simulação de Lucro na Peça */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${lucro > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Lucro Bruto por Item:</p>
                <p className="text-xs text-slate-400">
                  {custoNum > 0 ? `Markup de ${markupPercentual.toFixed(0)}% sobre custo` : 'Sem custo informado'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-bold ${
                  lucro > 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : lucro === 0
                    ? 'text-slate-600 dark:text-slate-400'
                    : 'text-rose-600'
                }`}
              >
                {formatarMoeda(lucro)}
              </span>
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={fecharModal}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-amber-200 dark:shadow-none active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              {pecaParaEditar ? 'Salvar Alterações' : 'Cadastrar Peça'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

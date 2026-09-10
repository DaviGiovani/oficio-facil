import React, { useState, useEffect } from 'react';
import { useApp } from '../../../application/AppContext';
import {
  aplicarMascaraMoeda,
  converterMoedaParaNumero,
  aplicarMascaraHora,
  normalizarHoraInput,
  converterHoraParaDecimal,
  formatarHorasParaInput,
} from '../../utils/formatters';
import { X, Wrench, Save, Clock, DollarSign } from 'lucide-react';

export const ServicoModal: React.FC = () => {
  const {
    isServicoModalOpen,
    setIsServicoModalOpen,
    servicoParaEditar,
    setServicoParaEditar,
    criarServicoCatalogo,
    atualizarServicoCatalogo,
  } = useApp();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horasEstimadas, setHorasEstimadas] = useState('01:30');
  const [valorSugerido, setValorSugerido] = useState('80,00');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (servicoParaEditar) {
      setNome(servicoParaEditar.nome);
      setDescricao(servicoParaEditar.descricao || '');
      setHorasEstimadas(formatarHorasParaInput(servicoParaEditar.horasEstimadas));
      setValorSugerido(aplicarMascaraMoeda(servicoParaEditar.valorSugerido));
    } else {
      setNome('');
      setDescricao('');
      setHorasEstimadas('01:30');
      setValorSugerido('80,00');
    }
    setErro(null);
  }, [servicoParaEditar, isServicoModalOpen]);

  if (!isServicoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('Por favor, informe o nome do serviço.');
      return;
    }

    const horasNum = converterHoraParaDecimal(horasEstimadas);
    const valorNum = converterMoedaParaNumero(valorSugerido);

    if (servicoParaEditar) {
      atualizarServicoCatalogo(servicoParaEditar.id, {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        horasEstimadas: horasNum,
        valorSugerido: valorNum,
      });
    } else {
      criarServicoCatalogo({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        horasEstimadas: horasNum,
        valorSugerido: valorNum,
      });
    }

    fecharModal();
  };

  const fecharModal = () => {
    setIsServicoModalOpen(false);
    setServicoParaEditar(null);
    setErro(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {servicoParaEditar ? 'Editar Serviço' : 'Novo Serviço Padrão'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cadastre o serviço para agilizar a criação de ordens de serviço.
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
              Nome do Serviço *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Formatação de Computador, Troca de Óleo, Instalação 220V"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="h-5 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">
                  Tempo Estimado
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="01:30"
                  value={horasEstimadas}
                  onChange={(e) => setHorasEstimadas(aplicarMascaraHora(e.target.value))}
                  onBlur={() => setHorasEstimadas((prev) => normalizarHoraInput(prev))}
                  className="w-full pl-3.5 pr-14 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                  HH:mm
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
                Preenche as horas na OS automaticamente
              </span>
            </div>

            <div>
              <div className="h-5 flex items-center gap-1.5 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">
                  Mão de Obra Sugerida
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
                  value={valorSugerido}
                  onChange={(e) => setValorSugerido(aplicarMascaraMoeda(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block truncate">
                Valor de referência para o orçamento
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Descrição Padrão / Escopo do Serviço (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Descreva as etapas ou o que está incluso neste serviço para adiantar o preenchimento da OS..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
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
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              {servicoParaEditar ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

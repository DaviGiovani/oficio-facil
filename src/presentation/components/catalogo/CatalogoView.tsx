import React, { useState, useMemo } from 'react';
import { useApp } from '../../../application/AppContext';
import { ServicoCatalogo, PecaCatalogo } from '../../../domain/types';
import { formatarMoeda, formatarHorasExibicao } from '../../utils/formatters';
import {
  Wrench,
  Package,
  Plus,
  Search,
  Clock,
  Edit2,
  Trash2,
  TrendingUp,
  Tag,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { ServicoModal } from './ServicoModal';
import { PecaModal } from './PecaModal';
import { ServicoDetalhesModal } from './ServicoDetalhesModal';
import { PecaDetalhesModal } from './PecaDetalhesModal';

type SubAbaCatalogo = 'servicos' | 'pecas';

export const CatalogoView: React.FC = () => {
  const {
    servicosCatalogo,
    pecasCatalogo,
    setIsServicoModalOpen,
    setServicoParaEditar,
    removerServicoCatalogo,
    setIsPecaModalOpen,
    setPecaParaEditar,
    removerPecaCatalogo,
    confirmarAcao,
  } = useApp();

  const [subAba, setSubAba] = useState<SubAbaCatalogo>('servicos');
  const [busca, setBusca] = useState('');
  const [servicoParaVisualizar, setServicoParaVisualizar] = useState<ServicoCatalogo | null>(null);
  const [pecaParaVisualizar, setPecaParaVisualizar] = useState<PecaCatalogo | null>(null);
  const [mostrarDica, setMostrarDica] = useState(() => {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
      return storage?.getItem('@oficio_facil:dica_catalogo') !== 'oculto';
    } catch {
      return true;
    }
  });

  const handleFecharDica = () => {
    setMostrarDica(false);
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
      storage?.setItem('@oficio_facil:dica_catalogo', 'oculto');
    } catch {
      // fallback
    }
  };

  // Filtros de busca em tempo real
  const servicosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return servicosCatalogo;
    return servicosCatalogo.filter(
      (s) =>
        s.nome.toLowerCase().includes(termo) ||
        (s.descricao && s.descricao.toLowerCase().includes(termo))
    );
  }, [servicosCatalogo, busca]);

  const pecasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return pecasCatalogo;
    return pecasCatalogo.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        (p.codigo && p.codigo.toLowerCase().includes(termo))
    );
  }, [pecasCatalogo, busca]);

  // Handlers para Serviços
  const handleNovoServico = () => {
    setServicoParaEditar(null);
    setIsServicoModalOpen(true);
  };

  const handleEditarServico = (servico: ServicoCatalogo) => {
    setServicoParaEditar(servico);
    setIsServicoModalOpen(true);
  };

  const handleExcluirServico = (servico: ServicoCatalogo) => {
    confirmarAcao({
      titulo: 'Excluir Serviço do Catálogo',
      mensagem: `Deseja realmente remover o serviço "${servico.nome}" do catálogo?`,
      detalhe: 'Esta ação removerá o serviço da lista rápida de orçamentos. Ordens de serviço já existentes não serão afetadas.',
      variante: 'perigo',
      textoConfirmar: 'Sim, Excluir',
      aoConfirmar: () => removerServicoCatalogo(servico.id),
    });
  };

  // Handlers para Peças
  const handleNovaPeca = () => {
    setPecaParaEditar(null);
    setIsPecaModalOpen(true);
  };

  const handleEditarPeca = (peca: PecaCatalogo) => {
    setPecaParaEditar(peca);
    setIsPecaModalOpen(true);
  };

  const handleExcluirPeca = (peca: PecaCatalogo) => {
    confirmarAcao({
      titulo: 'Excluir Peça do Catálogo',
      mensagem: `Deseja realmente remover "${peca.nome}" do catálogo?`,
      detalhe: 'Esta ação não afetará ordens de serviço ou recibos já emitidos com esta peça.',
      variante: 'perigo',
      textoConfirmar: 'Sim, Excluir',
      aoConfirmar: () => removerPecaCatalogo(peca.id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Catálogo de Preços & Peças
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cadastre seus serviços mais comuns e peças frequentes para preencher ordens de serviço em segundos.
          </p>
        </div>

        {/* Botão de Ação Dinâmico */}
        <div className="flex items-center gap-2">
          {subAba === 'servicos' ? (
            <button
              type="button"
              onClick={handleNovoServico}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Novo Serviço
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNovaPeca}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-amber-200 dark:shadow-none active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Nova Peça / Insumo
            </button>
          )}
        </div>
      </div>

      {/* Dica de Integração */}
      {mostrarDica && (
        <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
              <p className="font-semibold text-slate-900 dark:text-white">
                💡 Agilidade Máxima no Atendimento ao Cliente:
              </p>
              <p>
                Ao criar uma <strong>Nova OS</strong>, utilize os botões <em>"Do Catálogo"</em> para puxar qualquer item desta tabela com um único toque, sem precisar digitar no celular.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFecharDica}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-indigo-100/60 dark:hover:bg-indigo-900/60 transition-colors shrink-0"
            title="Fechar dica"
            aria-label="Fechar dica"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de Controles: Alternador de Sub-Aba + Campo de Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Alternador de Sub-Aba (Centralizado e proporcional no mobile, sem sobra de espaço) */}
        <div className="grid grid-cols-2 sm:flex sm:w-auto items-center bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setSubAba('servicos')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subAba === 'servicos'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>Serviços</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold shrink-0">
              {servicosCatalogo.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubAba('pecas')}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subAba === 'pecas'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span className="truncate">Peças & Materiais</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold shrink-0">
              {pecasCatalogo.length}
            </span>
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={subAba === 'servicos' ? 'Buscar serviços cadastrados...' : 'Buscar peças ou código...'}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Conteúdo: Lista de Serviços */}
      {subAba === 'servicos' && (
        <div>
          {servicosFiltrados.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {busca ? 'Nenhum serviço encontrado' : 'Nenhum serviço padrão cadastrado'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {busca
                  ? 'Tente buscar com outro termo ou limpe o campo de busca.'
                  : 'Cadastre os serviços que você executa repetidamente para poupar tempo ao emitir orçamentos.'}
              </p>
              {!busca && (
                <button
                  type="button"
                  onClick={handleNovoServico}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Cadastrar Primeiro Serviço
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicosFiltrados.map((servico) => (
                <div
                  key={servico.id}
                  onClick={() => setServicoParaVisualizar(servico)}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {servico.nome}
                      </h3>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditarServico(servico);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Editar serviço"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExcluirServico(servico);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Excluir serviço"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {servico.descricao && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                        {servico.descricao}
                      </p>
                    )}
                  </div>

                  {/* Informações Numéricas de Rodapé */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{formatarHorasExibicao(servico.horasEstimadas)} est.</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Mão de obra:</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatarMoeda(servico.valorSugerido)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conteúdo: Lista de Peças e Materiais */}
      {subAba === 'pecas' && (
        <div>
          {pecasFiltradas.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {busca ? 'Nenhuma peça encontrada' : 'Nenhuma peça cadastrada no catálogo'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {busca
                  ? 'Verifique a digitação ou busque por outro termo.'
                  : 'Cadastre os materiais e insumos que você costuma repassar ou utilizar nas manutenções.'}
              </p>
              {!busca && (
                <button
                  type="button"
                  onClick={handleNovaPeca}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Cadastrar Primeira Peça
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pecasFiltradas.map((peca) => {
                const lucro = peca.precoVenda - peca.precoCusto;
                const markup = peca.precoCusto > 0 ? (lucro / peca.precoCusto) * 100 : 0;

                return (
                  <div
                    key={peca.id}
                    onClick={() => setPecaParaVisualizar(peca)}
                    className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-600 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {peca.nome}
                          </h3>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {peca.unidade}
                            </span>
                            {peca.codigo && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
                                <Tag className="w-2.5 h-2.5" />
                                {peca.codigo}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditarPeca(peca);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Editar peça"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExcluirPeca(peca);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Excluir peça"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bloco Financeiro de Custos e Venda */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Custo de compra:</span>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {formatarMoeda(peca.precoCusto)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Preço de venda:</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                          {formatarMoeda(peca.precoVenda)}
                        </span>
                      </div>

                      {/* Pílula de Margem / Lucro */}
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Lucro unitário:
                        </span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-200">
                          +{formatarMoeda(lucro)} ({markup.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modais de Cadastro e Edição */}
      <ServicoModal />
      <PecaModal />

      {/* Modais de Visualização Rápida de Detalhes */}
      <ServicoDetalhesModal
        servico={servicoParaVisualizar}
        onClose={() => setServicoParaVisualizar(null)}
        onEditar={(s) => {
          setServicoParaVisualizar(null);
          handleEditarServico(s);
        }}
      />
      <PecaDetalhesModal
        peca={pecaParaVisualizar}
        onClose={() => setPecaParaVisualizar(null)}
        onEditar={(p) => {
          setPecaParaVisualizar(null);
          handleEditarPeca(p);
        }}
      />
    </div>
  );
};

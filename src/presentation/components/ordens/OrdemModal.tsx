import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../application/AppContext';
import { StatusOrdem } from '../../../domain/types';
import { PricingEngine } from '../../../domain/pricing';
import { formatarMoeda } from '../../utils/formatters';
import {
  X,
  FilePlus,
  Save,
  Plus,
  Trash2,
  Calculator,
  UserPlus,
  Clock,
  Package,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { CalculadoraHoraModal } from '../calculadora/CalculadoraHoraModal';

interface ItemForm {
  idTemp: string;
  descricao: string;
  quantidade: number | string;
  valorUnitario: number | string;
}

export const OrdemModal: React.FC = () => {
  const {
    isOrdemModalOpen,
    setIsOrdemModalOpen,
    ordemParaEditar,
    setOrdemParaEditar,
    clientes,
    itens,
    criarOrdem,
    atualizarOrdem,
    setIsClienteModalOpen,
    setClienteParaEditar,
    dadosEmpresa,
  } = useApp();

  // Controle do Modal de Calculadora de Custo Hora
  const [isCalculadoraAberta, setIsCalculadoraAberta] = useState(false);

  // Campos do Formulário
  const [clienteId, setClienteId] = useState('');
  const [tituloServico, setTituloServico] = useState('');
  const [descricaoDefeito, setDescricaoDefeito] = useState('');
  const [status, setStatus] = useState<StatusOrdem>('orcamento');
  const [prazoEntrega, setPrazoEntrega] = useState('');

  // Parâmetros de Precificação (permite string para não forçar 0 ao apagar)
  const [valorHoraTecnica, setValorHoraTecnica] = useState<number | string>(60);
  const [horasEstimadas, setHorasEstimadas] = useState<number | string>(2);
  const [margemLucroPercentual, setMargemLucroPercentual] = useState<number | string>(25);

  // Lista de Peças/Materiais
  const [listaItens, setListaItens] = useState<ItemForm[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  // Inicialização e Carregamento de dados para edição
  useEffect(() => {
    if (ordemParaEditar) {
      setClienteId(ordemParaEditar.clienteId);
      setTituloServico(ordemParaEditar.tituloServico);
      setDescricaoDefeito(ordemParaEditar.descricaoDefeito);
      setStatus(ordemParaEditar.status);
      setPrazoEntrega(ordemParaEditar.prazoEntrega.split('T')[0]);
      setValorHoraTecnica(ordemParaEditar.valorHoraTecnica);
      setHorasEstimadas(ordemParaEditar.horasEstimadas);
      setMargemLucroPercentual(ordemParaEditar.margemLucroPercentual);

      // Carrega os itens da ordem existente
      const itensExistentes = itens.filter((i) => i.ordemId === ordemParaEditar.id);
      setListaItens(
        itensExistentes.map((i) => ({
          idTemp: i.id,
          descricao: i.descricao,
          quantidade: i.quantidade,
          valorUnitario: i.valorUnitario,
        }))
      );
    } else {
      // Padrão para nova ordem
      setClienteId(clientes.length > 0 ? clientes[0].id : '');
      setTituloServico('');
      setDescricaoDefeito('');
      setStatus('orcamento');

      // Prazo padrão: daqui a 5 dias
      const dataPrazo = new Date();
      dataPrazo.setDate(dataPrazo.getDate() + 5);
      setPrazoEntrega(dataPrazo.toISOString().split('T')[0]);

      setValorHoraTecnica(dadosEmpresa.valorHoraPadrao || 65);
      setHorasEstimadas(2);
      setMargemLucroPercentual(25);
      setListaItens([]);
    }
    setErro(null);
  }, [ordemParaEditar, isOrdemModalOpen, clientes, itens, dadosEmpresa.valorHoraPadrao]);

  // Motor Matemático Reativo em Tempo Real
  const resumoFinanceiro = useMemo(() => {
    const itensValidos = listaItens
      .filter((i) => i.descricao.trim().length > 0)
      .map((i) => ({
        quantidade: Math.max(0, Number(i.quantidade) || 0),
        valorUnitario: Math.max(0, Number(i.valorUnitario) || 0),
      }));

    const h = Math.max(0, Number(horasEstimadas) || 0);
    const vh = Math.max(0, Number(valorHoraTecnica) || 0);
    const m = Math.max(0, Number(margemLucroPercentual) || 0);

    return PricingEngine.calcularPrecoFinal(itensValidos, h, vh, m);
  }, [listaItens, horasEstimadas, valorHoraTecnica, margemLucroPercentual]);

  if (!isOrdemModalOpen) return null;

  const handleFechar = () => {
    setIsOrdemModalOpen(false);
    setOrdemParaEditar(null);
  };

  const handleAdicionarItem = () => {
    setListaItens([
      ...listaItens,
      {
        idTemp: String(Date.now() + Math.random()),
        descricao: '',
        quantidade: 1,
        valorUnitario: '',
      },
    ]);
  };

  const handleAtualizarItem = (idTemp: string, campo: keyof ItemForm, valor: any) => {
    setListaItens(
      listaItens.map((item) => {
        if (item.idTemp === idTemp) {
          return { ...item, [campo]: valor };
        }
        return item;
      })
    );
  };

  const handleRemoverItem = (idTemp: string) => {
    setListaItens(listaItens.filter((item) => item.idTemp !== idTemp));
  };

  const handleCadastrarNovoClienteRapido = () => {
    setClienteParaEditar(null);
    setIsClienteModalOpen(true);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setErro('Por favor, selecione ou cadastre um cliente.');
      return;
    }
    if (!tituloServico.trim()) {
      setErro('O título do serviço é obrigatório.');
      return;
    }
    if (!prazoEntrega) {
      setErro('O prazo estimado de entrega é obrigatório.');
      return;
    }

    const itensParaSalvar = listaItens
      .filter((i) => i.descricao.trim() !== '')
      .map((i) => ({
        descricao: i.descricao.trim(),
        quantidade: Math.max(0.1, Number(i.quantidade) || 1),
        valorUnitario: Math.max(0, Number(i.valorUnitario) || 0),
      }));

    if (ordemParaEditar) {
      atualizarOrdem(ordemParaEditar.id, {
        clienteId,
        tituloServico,
        descricaoDefeito,
        status,
        valorHoraTecnica: Math.max(0, Number(valorHoraTecnica) || 0),
        horasEstimadas: Math.max(0, Number(horasEstimadas) || 0),
        margemLucroPercentual: Math.max(0, Number(margemLucroPercentual) || 0),
        prazoEntrega,
        itens: itensParaSalvar,
      });
    } else {
      criarOrdem({
        clienteId,
        tituloServico,
        descricaoDefeito,
        status,
        valorHoraTecnica: Math.max(0, Number(valorHoraTecnica) || 0),
        horasEstimadas: Math.max(0, Number(horasEstimadas) || 0),
        margemLucroPercentual: Math.max(0, Number(margemLucroPercentual) || 0),
        prazoEntrega,
        itens: itensParaSalvar,
      });
    }

    handleFechar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-800 my-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <FilePlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">
              {ordemParaEditar
                ? `Editar Ordem de Serviço #${ordemParaEditar.numeroOs}`
                : 'Nova Ordem de Serviço'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleFechar}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSalvar} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {erro && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Seção 1: Cliente e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleCadastrarNovoClienteRapido}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  + Novo Cliente
                </button>
              </div>
              <select
                required
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {clientes.length === 0 ? (
                  <option value="">Nenhum cliente cadastrado</option>
                ) : (
                  clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} - {c.telefone}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estágio Inicial <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusOrdem)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="orcamento">Orçamento</option>
                <option value="aprovado">Aprovado</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Seção 2: Título, Descrição e Prazo */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título do Serviço <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Reparo em Placa Controladora / Troca de Fiação"
                  value={tituloServico}
                  onChange={(e) => setTituloServico(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prazo de Entrega <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={prazoEntrega}
                  onChange={(e) => setPrazoEntrega(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Descrição do Defeito / Escopo do Atendimento
              </label>
              <textarea
                rows={2}
                placeholder="Detalhes sobre o problema relatado pelo cliente ou requisitos específicos..."
                value={descricaoDefeito}
                onChange={(e) => setDescricaoDefeito(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* Seção 3: Peças, Componentes e Materiais */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Peças e Materiais Utilizados
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAdicionarItem}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Peça / Insumo
              </button>
            </div>

            {listaItens.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2 bg-slate-50 dark:bg-slate-800/40 px-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                Nenhum material adicionado. O custo da OS será baseado exclusivamente na mão de obra técnica.
              </p>
            ) : (
              <div className="space-y-2">
                {listaItens.map((item) => {
                  const subtotalItem = (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0);

                  return (
                    <div
                      key={item.idTemp}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Descrição da peça ou insumo"
                        value={item.descricao}
                        onChange={(e) =>
                          handleAtualizarItem(item.idTemp, 'descricao', e.target.value)
                        }
                        className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />

                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            placeholder="Qtd"
                            value={item.quantidade}
                            onChange={(e) =>
                              handleAtualizarItem(item.idTemp, 'quantidade', e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="w-24">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="R$"
                            value={item.valorUnitario}
                            onChange={(e) =>
                              handleAtualizarItem(item.idTemp, 'valorUnitario', e.target.value)
                            }
                            className="w-full px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <span className="w-24 text-right font-semibold text-slate-700 dark:text-slate-200">
                          {formatarMoeda(subtotalItem)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoverItem(item.idTemp)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Seção 4: Homem-Hora e Margem de Lucro */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Homem-Hora Técnica e Margem de Lucro Real
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Horas Estimadas
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.25"
                    value={horasEstimadas}
                    onChange={(e) => setHorasEstimadas(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    hrs
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Valor da Hora
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCalculadoraAberta(true)}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    title="Calcular com base nos custos reais e pró-labore do MEI"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Calcular Minha Hora
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    R$
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={valorHoraTecnica}
                    onChange={(e) => setValorHoraTecnica(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Margem de Lucro Desejada
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={margemLucroPercentual}
                    onChange={(e) => setMargemLucroPercentual(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 5: PAINEL DE RESUMO EM TEMPO REAL */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 text-indigo-900 dark:text-indigo-200">
              <Calculator className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
              <h4 className="font-bold text-sm">Resumo da Formação de Preço (Tempo Real)</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block">Subtotal Materiais</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">
                  {formatarMoeda(resumoFinanceiro.subtotalMateriais)}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block">Mão de Obra</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">
                  {formatarMoeda(resumoFinanceiro.custoMaoDeObra)}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block">Custo de Produção</span>
                <span className="font-bold text-slate-800 dark:text-white text-sm">
                  {formatarMoeda(resumoFinanceiro.custoTotal)}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 block">Lucro Calculado</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  +{formatarMoeda(resumoFinanceiro.lucroEsperado)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-200/80 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-medium text-indigo-900 dark:text-indigo-200">
                  Preço Sugerido para o Cliente Final:
                </span>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                  Garante cobertura integral de custos operacionais e margem líquida.
                </p>
              </div>

              <div className="text-xl sm:text-2xl font-black text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 px-4 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm text-right">
                {formatarMoeda(resumoFinanceiro.valorFinal)}
              </div>
            </div>
          </div>

          {/* Rodapé e Botões */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleFechar}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-all"
            >
              <Save className="w-4 h-4" />
              {ordemParaEditar ? 'Gravar Alterações' : 'Gravar Ordem de Serviço'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal da Calculadora de Custo Hora Real */}
      <CalculadoraHoraModal
        isOpen={isCalculadoraAberta}
        onClose={() => setIsCalculadoraAberta(false)}
        onApplyRate={(novaTaxa) => setValorHoraTecnica(novaTaxa)}
      />
    </div>
  );
};

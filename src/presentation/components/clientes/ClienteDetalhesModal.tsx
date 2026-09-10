import React from 'react';
import { Cliente, OrdemServico } from '../../../domain/types';
import { useApp } from '../../../application/AppContext';
import { formatarMoeda, formatarData, formatarTelefone } from '../../utils/formatters';
import {
  X,
  User,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  MessageCircle,
  Edit2,
  Calendar,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { abrirWhatsApp } from '../../utils/whatsapp';

interface ClienteDetalhesModalProps {
  cliente: Cliente | null;
  onClose: () => void;
  onEditar: (cliente: Cliente) => void;
}

export const ClienteDetalhesModal: React.FC<ClienteDetalhesModalProps> = ({
  cliente,
  onClose,
  onEditar,
}) => {
  const { ordens, dadosEmpresa, setOrdemSelecionadaParaRecibo } = useApp();

  if (!cliente) return null;

  // Ordens de serviço deste cliente
  const ordensDoCliente = ordens.filter((o) => o.clienteId === cliente.id);

  const totalGasto = ordensDoCliente
    .filter((o) => o.status === 'concluido')
    .reduce((acc, o) => acc + (o.financeiro?.valorFinal || 0), 0);

  const handleWhatsApp = () => {
    const nomeEmp = dadosEmpresa.nome?.trim() || 'OfícioFácil';
    const msg = `Olá, *${cliente.nome}*! Tudo bem?\nAqui é da *${nomeEmp}*. Como podemos te ajudar hoje?`;
    abrirWhatsApp(cliente.telefone, msg);
  };

  const handleVerOrdem = (ordem: OrdemServico) => {
    onClose();
    setOrdemSelecionadaParaRecibo(ordem);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'orcamento':
        return {
          texto: 'Orçamento',
          classe: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
        };
      case 'aprovado':
        return {
          texto: 'Aprovado',
          classe: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
        };
      case 'em_andamento':
        return {
          texto: 'Em Execução',
          classe: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
        };
      case 'concluido':
        return {
          texto: 'Concluído',
          classe: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
        };
      case 'cancelado':
        return {
          texto: 'Cancelado',
          classe: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
      default:
        return { texto: status, classe: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-4">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {cliente.nome}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ficha Cadastral e Histórico de Ordens
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

        {/* Corpo com Informações */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Dados de Contato e Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Telefone / WhatsApp
              </span>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formatarTelefone(cliente.telefone)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                CPF / CNPJ
              </span>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {cliente.documento || 'Não informado'}
                </span>
              </div>
            </div>

            {cliente.endereco && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Endereço
                </span>
                <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{cliente.endereco}</span>
                </div>
              </div>
            )}

            {cliente.criadoEm && (
              <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Cliente cadastrado em {formatarData(cliente.criadoEm)}</span>
              </div>
            )}
          </div>

          {/* Resumo Financeiro com o Cliente */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 block">
                Total de Serviços
              </span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {ordensDoCliente.length} {ordensDoCliente.length === 1 ? 'OS' : 'OSs'}
              </p>
            </div>

            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block">
                Faturamento Concluído
              </span>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {formatarMoeda(totalGasto)}
              </p>
            </div>
          </div>

          {/* Histórico de Ordens de Serviço */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Histórico de Ordens de Serviço ({ordensDoCliente.length})
              </h3>
            </div>

            {ordensDoCliente.length === 0 ? (
              <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                Nenhuma Ordem de Serviço vinculada a este cliente até o momento.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {ordensDoCliente.map((ordem) => {
                  const badge = getStatusBadge(ordem.status);

                  return (
                    <button
                      key={ordem.id}
                      type="button"
                      onClick={() => handleVerOrdem(ordem)}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            #{ordem.numeroOs}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.classe}`}
                          >
                            {badge.texto}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {ordem.tituloServico}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Prazo: {formatarData(ordem.prazoEntrega)}
                        </p>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {formatarMoeda(ordem.financeiro?.valorFinal || 0)}
                          </span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                            Ver Recibo
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 rounded-xl transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditar(cliente);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar</span>
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
    </div>
  );
};

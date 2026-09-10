import React from 'react';
import { OrdemServico, StatusOrdem } from '../../../domain/types';
import { useApp } from '../../../application/AppContext';
import { formatarMoeda, avaliarPrazo } from '../../utils/formatters';
import {
  User,
  Clock,
  ArrowRight,
  ArrowLeft,
  Printer,
  Trash2,
  Edit,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { abrirWhatsApp, gerarMensagemOrdemWhatsApp } from '../../utils/whatsapp';

interface KanbanCardProps {
  ordem: OrdemServico;
}

const FLUXO_STATUS: StatusOrdem[] = [
  'orcamento',
  'aprovado',
  'em_andamento',
  'concluido',
];

export const KanbanCard: React.FC<KanbanCardProps> = ({ ordem }) => {
  const {
    clientes,
    itens,
    dadosEmpresa,
    atualizarStatusOrdem,
    removerOrdem,
    setOrdemParaEditar,
    setIsOrdemModalOpen,
    setOrdemSelecionadaParaRecibo,
    confirmarAcao,
  } = useApp();

  const cliente = clientes.find((c) => c.id === ordem.clienteId);
  const infoPrazo = avaliarPrazo(ordem.prazoEntrega);

  const indiceAtual = FLUXO_STATUS.indexOf(ordem.status);

  const podeAvancar = indiceAtual !== -1 && indiceAtual < FLUXO_STATUS.length - 1;
  const podeVoltar = indiceAtual > 0;

  const handleAvancar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (podeAvancar) {
      atualizarStatusOrdem(ordem.id, FLUXO_STATUS[indiceAtual + 1]);
    }
  };

  const handleVoltar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (podeVoltar) {
      atualizarStatusOrdem(ordem.id, FLUXO_STATUS[indiceAtual - 1]);
    }
  };

  const handleCancelar = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmarAcao({
      titulo: `Cancelar OS #${ordem.numeroOs}`,
      mensagem: `Deseja marcar a OS #${ordem.numeroOs} como Cancelada?`,
      detalhe: 'A ordem será movida para o estágio Cancelado, mas poderá ser reaberta a qualquer momento.',
      textoConfirmar: 'Cancelar OS',
      variante: 'aviso',
      aoConfirmar: () => atualizarStatusOrdem(ordem.id, 'cancelado'),
    });
  };

  const handleReabrir = (e: React.MouseEvent) => {
    e.stopPropagation();
    atualizarStatusOrdem(ordem.id, 'orcamento');
  };

  const handleExcluir = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmarAcao({
      titulo: `Excluir OS #${ordem.numeroOs}`,
      mensagem: `Tem certeza que deseja excluir permanentemente a OS #${ordem.numeroOs}?`,
      detalhe: `Todos os materiais e itens vinculados ao serviço "${ordem.tituloServico}" serão apagados do sistema.`,
      textoConfirmar: 'Excluir OS',
      variante: 'perigo',
      aoConfirmar: () => removerOrdem(ordem.id),
    });
  };

  const handleEditar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrdemParaEditar(ordem);
    setIsOrdemModalOpen(true);
  };

  const handleImprimir = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrdemSelecionadaParaRecibo(ordem);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const itensDaOrdem = itens.filter((i) => i.ordemId === ordem.id);
    const mensagem = gerarMensagemOrdemWhatsApp({
      ordem,
      cliente,
      empresa: dadosEmpresa,
      itens: itensDaOrdem,
    });
    abrirWhatsApp(cliente?.telefone || '', mensagem);
  };

  return (
    <div
      onClick={() => setOrdemSelecionadaParaRecibo(ordem)}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex flex-col justify-between gap-3 group overflow-hidden cursor-pointer"
    >
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0">
            #{ordem.numeroOs}
          </span>

          {/* Indicador de Prazo (Apenas para ordens ativas em orçamento, aprovadas ou em andamento) */}
          {ordem.status !== 'concluido' && ordem.status !== 'cancelado' && (
            <div
              className={`flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 leading-tight ${infoPrazo.classeCor}`}
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span>{infoPrazo.texto}</span>
            </div>
          )}
        </div>

        {/* Cliente e Título */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{cliente?.nome || 'Cliente não identificado'}</span>
          </div>

          <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {ordem.tituloServico}
          </h4>

          {ordem.descricaoDefeito && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
              {ordem.descricaoDefeito}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-700">
        {/* Valor Final em Destaque (Linha Completa) */}
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] uppercase font-semibold text-slate-400 dark:text-slate-400">
            Total OS
          </span>
          <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            {formatarMoeda(ordem.financeiro.valorFinal)}
          </span>
        </div>

        {/* Ações Rápidas de Visualização e Edição (Grid 4 colunas 100% proporcional) */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={handleWhatsApp}
            title={
              cliente?.telefone
                ? `Enviar no WhatsApp de ${cliente.nome}`
                : 'Enviar Orçamento via WhatsApp'
            }
            className="flex items-center justify-center py-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 rounded-lg border border-emerald-200/60 dark:border-emerald-900/50 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleImprimir}
            title="Visualizar / Imprimir Recibo A4"
            className="flex items-center justify-center py-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg border border-slate-200/60 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleEditar}
            title="Editar OS"
            className="flex items-center justify-center py-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg border border-slate-200/60 dark:border-slate-700 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleExcluir}
            title="Excluir OS"
            className="flex items-center justify-center py-1.5 text-slate-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-50 dark:bg-slate-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg border border-slate-200/60 dark:border-slate-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Barra de Transição de Estágios do Kanban */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
          {ordem.status === 'cancelado' ? (
            <button
              type="button"
              onClick={handleReabrir}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-200/60 dark:border-indigo-800/60"
            >
              Reabrir Orçamento
            </button>
          ) : (
            <div className="flex items-center justify-between gap-1 w-full min-w-0">
              {/* Controles da Esquerda: Voltar e Cancelar */}
              <div className="flex items-center gap-1 min-w-0">
                {podeVoltar && (
                  <button
                    type="button"
                    onClick={handleVoltar}
                    title="Voltar estágio anterior"
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCancelar}
                  title="Cancelar OS"
                  className="px-1.5 py-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors whitespace-nowrap shrink-0"
                >
                  Cancelar
                </button>
              </div>

              {/* Controles da Direita: Avançar ou Concluído */}
              <div className="shrink-0">
                {podeAvancar ? (
                  <button
                    type="button"
                    onClick={handleAvancar}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg transition-all shadow-2xs whitespace-nowrap"
                  >
                    <span>Avançar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 rounded whitespace-nowrap">
                    <CheckCircle className="w-3 h-3" /> Concluído
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

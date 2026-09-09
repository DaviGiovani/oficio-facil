import React from 'react';
import { useApp } from '../../../application/AppContext';
import { formatarMoeda, formatarData, formatarTelefone } from '../../utils/formatters';
import { X, Printer, Wrench, ShieldCheck, MessageCircle } from 'lucide-react';
import { abrirWhatsApp, gerarMensagemOrdemWhatsApp } from '../../utils/whatsapp';

export const ReciboModal: React.FC = () => {
  const {
    ordemSelecionadaParaRecibo,
    setOrdemSelecionadaParaRecibo,
    clientes,
    itens,
    dadosEmpresa,
  } = useApp();

  if (!ordemSelecionadaParaRecibo) return null;

  const cliente = clientes.find((c) => c.id === ordemSelecionadaParaRecibo.clienteId);
  const itensDaOrdem = itens.filter((i) => i.ordemId === ordemSelecionadaParaRecibo.id);

  const handleFechar = () => {
    setOrdemSelecionadaParaRecibo(null);
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const mensagem = gerarMensagemOrdemWhatsApp({
      ordem: ordemSelecionadaParaRecibo,
      cliente,
      empresa: dadosEmpresa,
      itens: itensDaOrdem,
    });
    abrirWhatsApp(cliente?.telefone || '', mensagem);
  };

  const statusFormatado = {
    orcamento: 'Orçamento Preliminar',
    aprovado: 'Serviço Aprovado',
    em_andamento: 'Em Execução',
    concluido: 'Serviço Concluído',
    cancelado: 'Ordem Cancelada',
  }[ordemSelecionadaParaRecibo.status];

  const enderecoEmpresa = [dadosEmpresa.endereco, dadosEmpresa.cidadeUf].filter(Boolean).join(' - ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto modal-backdrop">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-800 my-4 modal-content">
        {/* Barra de Ações Superior (Ocultada na Impressão) */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white">
            <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-sm">
              Visualização de Recibo & Comprovante A4
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm transition-all"
              title="Enviar orçamento/recibo formatado no WhatsApp do cliente"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleImprimir}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              type="button"
              onClick={handleFechar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CORPO DO RECIBO / ORÇAMENTO (Visível na tela e capturado pelo @media print) */}
        {/* ========================================================================= */}
        <div id="recibo-container" className="p-6 sm:p-8 bg-white text-slate-800 font-sans">
          {/* Cabeçalho Formal: IDENTIFICAÇÃO DA EMPRESA PRESTADORA */}
          <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 print:border print:border-black">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                {/* Nome da Empresa que está usando o sistema */}
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                  {dadosEmpresa.nome || 'Oficina Técnica de Serviços'}
                </h1>
                {/* Função Técnica / Ramo de Atuação */}
                <p className="text-xs font-bold text-indigo-600 print:text-black mt-0.5">
                  {dadosEmpresa.funcao || 'Prestação de Serviços Especializados'}
                </p>
                {/* Contatos e Endereço da Empresa Prestadora */}
                <div className="text-[11px] text-slate-600 print:text-black mt-1 space-y-0.5">
                  {dadosEmpresa.documento && (
                    <p><strong>CNPJ / CPF:</strong> {dadosEmpresa.documento}</p>
                  )}
                  {dadosEmpresa.telefone && (
                    <p><strong>Contato:</strong> {formatarTelefone(dadosEmpresa.telefone)} {dadosEmpresa.email ? `• ${dadosEmpresa.email}` : ''}</p>
                  )}
                  {enderecoEmpresa && (
                    <p><strong>Local:</strong> {enderecoEmpresa}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-block border-2 border-slate-800 rounded-lg px-3 py-1 bg-slate-50 print:bg-white">
                <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none">
                  Ordem de Serviço
                </span>
                <span className="text-lg font-black text-slate-900 font-mono leading-tight">
                  #{ordemSelecionadaParaRecibo.numeroOs}
                </span>
              </div>
              <div className="text-xs text-slate-600 print:text-black mt-2 space-y-0.5">
                <p>
                  <strong>Emissão:</strong> {formatarData(ordemSelecionadaParaRecibo.criadoEm)}
                </p>
                <p>
                  <strong>Prazo:</strong> {formatarData(ordemSelecionadaParaRecibo.prazoEntrega)}
                </p>
                <p>
                  <strong>Situação:</strong>{' '}
                  <span className="font-bold uppercase text-slate-800">{statusFormatado}</span>
                </p>
                <p className="text-[10px] text-slate-400 print:text-slate-600 pt-0.5">
                  Sistema: OfícioFácil
                </p>
              </div>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="mt-4 p-3 bg-slate-50 print:bg-white border border-slate-200 print:border-slate-400 rounded-lg text-xs space-y-1">
            <h2 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-1.5 border-b border-slate-200 pb-1">
              Identificação do Cliente
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <p>
                  <strong className="text-slate-900">Nome:</strong>{' '}
                  {cliente?.nome || 'Cliente Não Identificado'}
                </p>
                <p>
                  <strong className="text-slate-900">Telefone / WhatsApp:</strong>{' '}
                  {cliente ? formatarTelefone(cliente.telefone) : '--'}
                </p>
              </div>
              <div>
                {cliente?.documento && (
                  <p>
                    <strong className="text-slate-900">CPF / CNPJ:</strong> {cliente.documento}
                  </p>
                )}
                <p>
                  <strong className="text-slate-900">Endereço:</strong>{' '}
                  {cliente?.endereco || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          {/* Especificação do Serviço */}
          <div className="mt-4 border border-slate-200 print:border-slate-400 rounded-lg p-3 text-xs">
            <h2 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-1.5 border-b border-slate-200 pb-1">
              Descrição do Serviço / Atendimento Solicitado
            </h2>
            <p className="font-bold text-sm text-slate-900 mb-1">
              {ordemSelecionadaParaRecibo.tituloServico}
            </p>
            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
              {ordemSelecionadaParaRecibo.descricaoDefeito ||
                'Nenhum detalhe adicional informado no registro.'}
            </p>
          </div>

          {/* Tabela de Peças e Materiais */}
          <div className="mt-4">
            <h2 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-2">
              Discriminação de Peças, Componentes e Insumos
            </h2>
            <table className="recibo-tabela w-full text-xs text-left border border-slate-300">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-200 text-slate-900">
                  <th className="p-2 border border-slate-300 font-bold">Descrição da Peça / Insumo</th>
                  <th className="p-2 border border-slate-300 text-center w-20 font-bold">Qtd.</th>
                  <th className="p-2 border border-slate-300 text-right w-28 font-bold">Valor Unit.</th>
                  <th className="p-2 border border-slate-300 text-right w-28 font-bold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {itensDaOrdem.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-2.5 text-center text-slate-500 italic border border-slate-300"
                    >
                      Nenhum material adicional utilizado neste atendimento.
                    </td>
                  </tr>
                ) : (
                  itensDaOrdem.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200">
                      <td className="p-2 border border-slate-300">{item.descricao}</td>
                      <td className="p-2 border border-slate-300 text-center">{item.quantidade}</td>
                      <td className="p-2 border border-slate-300 text-right">
                        {formatarMoeda(item.valorUnitario)}
                      </td>
                      <td className="p-2 border border-slate-300 text-right font-medium">
                        {formatarMoeda(item.quantidade * item.valorUnitario)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mão de Obra e Consolidação Financeira */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 print:border-slate-400 rounded-lg p-3 space-y-1">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                Composição de Mão de Obra
              </h3>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Tempo Técnico Estimado:</span>
                <span className="font-medium text-slate-900">
                  {ordemSelecionadaParaRecibo.horasEstimadas} horas
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-600">Taxa Horária Aplicada:</span>
                <span className="font-medium text-slate-900">
                  {formatarMoeda(ordemSelecionadaParaRecibo.valorHoraTecnica)} / hora
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-slate-100 pt-1">
                <span className="font-semibold text-slate-700">Subtotal Mão de Obra:</span>
                <span className="font-bold text-slate-900">
                  {formatarMoeda(ordemSelecionadaParaRecibo.financeiro.custoMaoDeObra)}
                </span>
              </div>
            </div>

            <div className="border border-slate-300 print:border-slate-800 rounded-lg p-3 bg-slate-50 print:bg-white flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Total de Materiais:</span>
                  <span className="font-medium text-slate-900">
                    {formatarMoeda(ordemSelecionadaParaRecibo.financeiro.subtotalMateriais)}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-600">Total de Mão de Obra:</span>
                  <span className="font-medium text-slate-900">
                    {formatarMoeda(ordemSelecionadaParaRecibo.financeiro.custoMaoDeObra)}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-slate-800 pt-2 mt-2 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900 uppercase">
                  Valor Total do Serviço:
                </span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {formatarMoeda(ordemSelecionadaParaRecibo.financeiro.valorFinal)}
                </span>
              </div>
            </div>
          </div>

          {/* Termo de Garantia Legal CDC */}
          <div className="mt-4 p-3 bg-slate-50 print:bg-white border border-slate-200 print:border-slate-400 rounded-lg text-[11px] text-slate-600 print:text-black">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600 print:text-black" />
              <span>Condições de Garantia Legal e Recebimento</span>
            </div>
            <p className="leading-relaxed">
              Fica assegurada a garantia legal de <strong>90 (noventa) dias</strong> sobre os
              serviços executados e peças substituídas, contados a partir da data de entrega, em
              estrita conformidade com o Artigo 26, inciso II da Lei Federal nº 8.078/1990 (Código de
              Defesa do Consumidor). A garantia não cobre danos decorrentes de mau uso, sobretensão
              elétrica ou intervenções de terceiros não autorizados.
            </p>
          </div>

          {/* Assinaturas */}
          <div className="assinatura-area mt-10 flex justify-between items-center pt-8 text-xs text-center text-slate-800">
            <div className="campo-assinatura w-[44%] border-t border-slate-800 pt-1">
              <p className="font-bold">{cliente?.nome || 'Assinatura do Cliente'}</p>
              <p className="text-[10px] text-slate-500 print:text-black">Cliente / Contratante</p>
            </div>

            <div className="campo-assinatura w-[44%] border-t border-slate-800 pt-1">
              <p className="font-bold">{dadosEmpresa.nome || 'Prestador de Serviços'}</p>
              <p className="text-[10px] text-slate-600 print:text-black">
                {dadosEmpresa.funcao || 'Responsável Técnico'}
              </p>
              {dadosEmpresa.documento && (
                <p className="text-[9px] text-slate-400 print:text-black">
                  CNPJ/CPF: {dadosEmpresa.documento}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé da Modal na Tela (Ocultado na Impressão) */}
        <div className="no-print flex items-center justify-end gap-3 px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleFechar}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enviar no WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleImprimir}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Recibo (A4 / PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

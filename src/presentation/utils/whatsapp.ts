import { OrdemServico, Cliente, DadosEmpresa, ItemServico } from '../../domain/types';
import { formatarMoeda, formatarData } from './formatters';

/**
 * Sanitiza o número de telefone para o padrão internacional aceito pelo WhatsApp (wa.me).
 * Se for número brasileiro sem DDI (10 ou 11 dígitos com DDD), adiciona o DDI 55.
 */
export function sanitizarTelefoneWhatsApp(telefone: string): string {
  if (!telefone) return '';
  const digitos = telefone.replace(/\D/g, '');

  if (!digitos) return '';

  // Se tem 10 ou 11 dígitos (DDD + número brasileiro), adiciona o DDI do Brasil (55)
  if (digitos.length === 10 || digitos.length === 11) {
    return `55${digitos}`;
  }

  // Se já possui 12 ou 13 dígitos e começa com 55, mantém como está
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) {
    return digitos;
  }

  return digitos;
}

export interface ParametrosMensagemOS {
  ordem: OrdemServico;
  cliente?: Cliente;
  empresa?: DadosEmpresa;
  itens?: ItemServico[];
}

/**
 * Gera mensagem profissional formatada com sintaxe do WhatsApp (*negrito*, emojis).
 */
export function gerarMensagemOrdemWhatsApp({
  ordem,
  cliente,
  empresa,
  itens = [],
}: ParametrosMensagemOS): string {
  const nomeCliente = cliente?.nome?.trim() || 'Cliente';
  const nomeEmpresa = empresa?.nome?.trim() || 'OfícioFácil';
  const statusFormatado = {
    orcamento: 'Orçamento Preliminar',
    aprovado: 'Serviço Aprovado',
    em_andamento: 'Em Execução',
    concluido: 'Serviço Concluído',
    cancelado: 'Cancelado',
  }[ordem.status] || 'Orçamento';

  const linhas: string[] = [
    `Olá, *${nomeCliente}*! Tudo bem?`,
    '',
    `Aqui é da *${nomeEmpresa}*. Segue o resumo da sua Ordem de Serviço:`,
    '',
    `📋 *Ordem de Serviço #${ordem.numeroOs}*`,
    `🛠️ *Serviço:* ${ordem.tituloServico}`,
    `📌 *Situação:* ${statusFormatado}`,
    `📅 *Previsão de Entrega:* ${formatarData(ordem.prazoEntrega)}`,
  ];

  if (ordem.descricaoDefeito?.trim()) {
    linhas.push(`📝 *Detalhes:* ${ordem.descricaoDefeito.trim()}`);
  }

  if (itens && itens.length > 0) {
    linhas.push('');
    linhas.push('📦 *Peças & Materiais Utilizados:*');
    itens.forEach((item) => {
      const subtotal = item.quantidade * item.valorUnitario;
      linhas.push(`• ${item.quantidade}x ${item.descricao} (${formatarMoeda(subtotal)})`);
    });
  }

  linhas.push('');
  linhas.push(`💰 *Valor Total:* *${formatarMoeda(ordem.financeiro.valorFinal)}*`);
  linhas.push('');
  linhas.push('Ficamos à disposição para qualquer dúvida ou para confirmar a aprovação!');

  return linhas.join('\n');
}

/**
 * Constrói o link oficial do WhatsApp (wa.me) com mensagem pré-preenchida e codificada.
 */
export function gerarLinkWhatsApp(telefone: string, mensagem: string): string {
  const telefoneLimpo = sanitizarTelefoneWhatsApp(telefone);
  const textoCodificado = encodeURIComponent(mensagem);

  if (telefoneLimpo) {
    return `https://wa.me/${telefoneLimpo}?text=${textoCodificado}`;
  }

  // Se não houver telefone cadastrado, abre o WhatsApp permitindo que o usuário escolha o contato
  return `https://wa.me/?text=${textoCodificado}`;
}

/**
 * Dispara a abertura do WhatsApp em nova aba do navegador ou app nativo.
 */
export function abrirWhatsApp(telefone: string, mensagem: string): void {
  const url = gerarLinkWhatsApp(telefone, mensagem);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

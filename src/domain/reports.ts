import { Cliente, OrdemServico, StatusOrdem } from './types';

export type PeriodoRelatorio = 'todos' | 'mes_atual' | 'mes_anterior' | 'ano_atual' | 'personalizado';

export interface FiltroRelatorio {
  periodo: PeriodoRelatorio;
  dataInicio?: string; // YYYY-MM-DD
  dataFim?: string;    // YYYY-MM-DD
}

export interface DreSimplificado {
  receitaBruta: number;
  custoMateriais: number;
  margemContribuicao: number;
  percentualMargemContribuicao: number;
  custoMaoDeObra: number;
  lucroOperacionalLiquido: number;
  percentualMargemLiquida: number;
}

export interface KpisFinanceiros {
  totalOsConcluidas: number;
  ticketMedio: number;
  totalHorasConcluidas: number;
  receitaPorHora: number;
  totalOrcamentosGerados: number;
  orcamentosConvertidos: number;
  taxaConversaoPercentual: number;
  pipelinePrevisto: number; // Aprovado + Em Andamento
  osEmPipeline: number;
  totalCancelado: number;
  osCanceladas: number;
}

export interface ResumoPorStatus {
  status: StatusOrdem;
  titulo: string;
  quantidade: number;
  valorTotal: number;
  percentualValor: number;
}

export interface TopCliente {
  clienteId: string;
  nomeCliente: string;
  telefone: string;
  totalOrdens: number;
  valorTotal: number;
}

export interface RelatorioFinanceiroCompleto {
  filtro: FiltroRelatorio;
  periodoDescricao: string;
  dre: DreSimplificado;
  kpis: KpisFinanceiros;
  resumoStatus: ResumoPorStatus[];
  topClientes: TopCliente[];
  ordensFiltradas: OrdemServico[];
}

export const TITULOS_STATUS: Record<StatusOrdem, string> = {
  orcamento: 'Orçamento',
  aprovado: 'Aprovado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export class ReportsEngine {
  /**
   * Filtra uma lista de ordens de serviço pelo período especificado.
   */
  public static filtrarOrdensPorPeriodo(
    ordens: OrdemServico[],
    filtro: FiltroRelatorio,
    dataReferencia: Date = new Date()
  ): OrdemServico[] {
    if (filtro.periodo === 'todos') {
      return ordens;
    }

    const refAno = dataReferencia.getFullYear();
    const refMes = dataReferencia.getMonth(); // 0-indexed

    return ordens.filter((ordem) => {
      const dataCriacao = new Date(ordem.criadoEm);
      if (isNaN(dataCriacao.getTime())) return false;

      if (filtro.periodo === 'mes_atual') {
        return dataCriacao.getFullYear() === refAno && dataCriacao.getMonth() === refMes;
      }

      if (filtro.periodo === 'mes_anterior') {
        const mesAnterior = refMes === 0 ? 11 : refMes - 1;
        const anoMesAnterior = refMes === 0 ? refAno - 1 : refAno;
        return (
          dataCriacao.getFullYear() === anoMesAnterior &&
          dataCriacao.getMonth() === mesAnterior
        );
      }

      if (filtro.periodo === 'ano_atual') {
        return dataCriacao.getFullYear() === refAno;
      }

      if (filtro.periodo === 'personalizado') {
        const inicio = filtro.dataInicio ? new Date(`${filtro.dataInicio}T00:00:00.000`) : null;
        const fim = filtro.dataFim ? new Date(`${filtro.dataFim}T23:59:59.999`) : null;

        if (inicio && dataCriacao < inicio) return false;
        if (fim && dataCriacao > fim) return false;
        return true;
      }

      return true;
    });
  }

  /**
   * Gera a descrição legível do período selecionado.
   */
  public static obterDescricaoPeriodo(
    filtro: FiltroRelatorio,
    dataReferencia: Date = new Date()
  ): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    const refAno = dataReferencia.getFullYear();
    const refMes = dataReferencia.getMonth();

    switch (filtro.periodo) {
      case 'mes_atual':
        return `${meses[refMes]} de ${refAno}`;
      case 'mes_anterior': {
        const mesAnt = refMes === 0 ? 11 : refMes - 1;
        const anoAnt = refMes === 0 ? refAno - 1 : refAno;
        return `${meses[mesAnt]} de ${anoAnt}`;
      }
      case 'ano_atual':
        return `Ano de ${refAno}`;
      case 'personalizado': {
        const dIni = filtro.dataInicio ? filtro.dataInicio.split('-').reverse().join('/') : 'Início';
        const dFim = filtro.dataFim ? filtro.dataFim.split('-').reverse().join('/') : 'Atual';
        return `${dIni} até ${dFim}`;
      }
      case 'todos':
      default:
        return 'Todo o histórico';
    }
  }

  /**
   * Calcula o Demonstrativo do Resultado do Exercício (DRE) para as ordens concluídas.
   */
  public static calcularDre(ordensConcluidas: OrdemServico[]): DreSimplificado {
    let receitaBruta = 0;
    let custoMateriais = 0;
    let custoMaoDeObra = 0;

    for (const ordem of ordensConcluidas) {
      receitaBruta += ordem.financeiro?.valorFinal || 0;
      custoMateriais += ordem.financeiro?.subtotalMateriais || 0;
      custoMaoDeObra += ordem.financeiro?.custoMaoDeObra || 0;
    }

    const margemContribuicao = receitaBruta - custoMateriais;
    const percentualMargemContribuicao =
      receitaBruta > 0 ? (margemContribuicao / receitaBruta) * 100 : 0;

    const lucroOperacionalLiquido = margemContribuicao - custoMaoDeObra;
    const percentualMargemLiquida =
      receitaBruta > 0 ? (lucroOperacionalLiquido / receitaBruta) * 100 : 0;

    return {
      receitaBruta: Number(receitaBruta.toFixed(2)),
      custoMateriais: Number(custoMateriais.toFixed(2)),
      margemContribuicao: Number(margemContribuicao.toFixed(2)),
      percentualMargemContribuicao: Number(percentualMargemContribuicao.toFixed(1)),
      custoMaoDeObra: Number(custoMaoDeObra.toFixed(2)),
      lucroOperacionalLiquido: Number(lucroOperacionalLiquido.toFixed(2)),
      percentualMargemLiquida: Number(percentualMargemLiquida.toFixed(1)),
    };
  }

  /**
   * Calcula os principais KPIs de desempenho operacional e comercial.
   */
  public static calcularKpis(ordensFiltradas: OrdemServico[]): KpisFinanceiros {
    const concluidas = ordensFiltradas.filter((o) => o.status === 'concluido');
    const pipeline = ordensFiltradas.filter((o) => o.status === 'aprovado' || o.status === 'em_andamento');
    const canceladas = ordensFiltradas.filter((o) => o.status === 'cancelado');

    const totalReceitaConcluida = concluidas.reduce(
      (acc, o) => acc + (o.financeiro?.valorFinal || 0),
      0
    );
    const totalHorasConcluidas = concluidas.reduce(
      (acc, o) => acc + (o.horasEstimadas || 0),
      0
    );

    const ticketMedio = concluidas.length > 0 ? totalReceitaConcluida / concluidas.length : 0;
    const receitaPorHora = totalHorasConcluidas > 0 ? totalReceitaConcluida / totalHorasConcluidas : 0;

    const pipelinePrevisto = pipeline.reduce(
      (acc, o) => acc + (o.financeiro?.valorFinal || 0),
      0
    );
    const totalCancelado = canceladas.reduce(
      (acc, o) => acc + (o.financeiro?.valorFinal || 0),
      0
    );

    // Conversão de orçamentos: todos que avançaram além de orçamento vs cancelados
    const totalOrcamentosGerados = ordensFiltradas.length;
    const orcamentosConvertidos = concluidas.length + pipeline.length;
    const taxaConversaoPercentual =
      totalOrcamentosGerados > 0
        ? (orcamentosConvertidos / totalOrcamentosGerados) * 100
        : 0;

    return {
      totalOsConcluidas: concluidas.length,
      ticketMedio: Number(ticketMedio.toFixed(2)),
      totalHorasConcluidas: Number(totalHorasConcluidas.toFixed(1)),
      receitaPorHora: Number(receitaPorHora.toFixed(2)),
      totalOrcamentosGerados,
      orcamentosConvertidos,
      taxaConversaoPercentual: Number(taxaConversaoPercentual.toFixed(1)),
      pipelinePrevisto: Number(pipelinePrevisto.toFixed(2)),
      osEmPipeline: pipeline.length,
      totalCancelado: Number(totalCancelado.toFixed(2)),
      osCanceladas: canceladas.length,
    };
  }

  /**
   * Agrupa e totaliza ordens de serviço por cada um dos 5 status.
   */
  public static calcularResumoPorStatus(ordensFiltradas: OrdemServico[]): ResumoPorStatus[] {
    const statusList: StatusOrdem[] = ['orcamento', 'aprovado', 'em_andamento', 'concluido', 'cancelado'];
    const totalGeral = ordensFiltradas.reduce((acc, o) => acc + (o.financeiro?.valorFinal || 0), 0);

    return statusList.map((st) => {
      const ordensDoStatus = ordensFiltradas.filter((o) => o.status === st);
      const valorTotal = ordensDoStatus.reduce((acc, o) => acc + (o.financeiro?.valorFinal || 0), 0);
      const percentualValor = totalGeral > 0 ? (valorTotal / totalGeral) * 100 : 0;

      return {
        status: st,
        titulo: TITULOS_STATUS[st],
        quantidade: ordensDoStatus.length,
        valorTotal: Number(valorTotal.toFixed(2)),
        percentualValor: Number(percentualValor.toFixed(1)),
      };
    });
  }

  /**
   * Identifica os clientes de maior faturamento dentro do período selecionado.
   */
  public static calcularTopClientes(
    ordensFiltradas: OrdemServico[],
    clientes: Cliente[],
    limite: number = 5
  ): TopCliente[] {
    const mapaClientes = new Map<string, { totalOrdens: number; valorTotal: number }>();

    for (const ordem of ordensFiltradas) {
      if (ordem.status === 'cancelado') continue; // Não pontua cancelados no ranking

      const atual = mapaClientes.get(ordem.clienteId) || { totalOrdens: 0, valorTotal: 0 };
      atual.totalOrdens += 1;
      atual.valorTotal += ordem.financeiro?.valorFinal || 0;
      mapaClientes.set(ordem.clienteId, atual);
    }

    const lista: TopCliente[] = [];
    for (const [clienteId, dados] of mapaClientes.entries()) {
      const cliente = clientes.find((c) => c.id === clienteId);
      lista.push({
        clienteId,
        nomeCliente: cliente?.nome || 'Cliente não identificado',
        telefone: cliente?.telefone || '',
        totalOrdens: dados.totalOrdens,
        valorTotal: Number(dados.valorTotal.toFixed(2)),
      });
    }

    return lista.sort((a, b) => b.valorTotal - a.valorTotal).slice(0, limite);
  }

  /**
   * Consolida todos os cálculos em um relatório estruturado completo.
   */
  public static gerarRelatorioCompleto(
    ordens: OrdemServico[],
    clientes: Cliente[],
    filtro: FiltroRelatorio,
    dataReferencia: Date = new Date()
  ): RelatorioFinanceiroCompleto {
    const ordensFiltradas = this.filtrarOrdensPorPeriodo(ordens, filtro, dataReferencia);
    const ordensConcluidas = ordensFiltradas.filter((o) => o.status === 'concluido');
    const periodoDescricao = this.obterDescricaoPeriodo(filtro, dataReferencia);

    return {
      filtro,
      periodoDescricao,
      dre: this.calcularDre(ordensConcluidas),
      kpis: this.calcularKpis(ordensFiltradas),
      resumoStatus: this.calcularResumoPorStatus(ordensFiltradas),
      topClientes: this.calcularTopClientes(ordensFiltradas, clientes),
      ordensFiltradas,
    };
  }

  /**
   * Gera o conteúdo de arquivo CSV contendo a Demonstração do Resultado (DRE) e Indicadores.
   * Utiliza encoding UTF-8 com BOM e delimitador ';' para compatibilidade nativa com o Excel em português.
   */
  public static gerarCsvDre(
    relatorio: RelatorioFinanceiroCompleto,
    nomeEmpresa: string = 'OfícioFácil'
  ): string {
    const formatMoeda = (num: number) => num.toFixed(2).replace('.', ',');
    const formatPct = (num: number) => `${num.toFixed(1).replace('.', ',')}%`;

    const linhas: string[] = [];

    // Cabeçalho da Empresa e Relatório
    linhas.push(`RELATÓRIO FINANCEIRO E DRE SIMPLIFICADO - ${nomeEmpresa.toUpperCase()}`);
    linhas.push(`Período de Referência;${relatorio.periodoDescricao}`);
    linhas.push(`Data de Emissão;${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`);
    linhas.push('');

    // Seção 1: Demonstração do Resultado (DRE)
    linhas.push('DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO (DRE SIMPLIFICADO - ORDENS CONCLUÍDAS);;');
    linhas.push('Estrutura de Resultados;Valor (R$);% s/ Faturamento');
    linhas.push(`(+) Receita Operacional Bruta;${formatMoeda(relatorio.dre.receitaBruta)};100,0%`);
    linhas.push(`(-) Custos de Peças e Insumos (CPV);${formatMoeda(relatorio.dre.custoMateriais)};${formatPct(relatorio.dre.receitaBruta > 0 ? (relatorio.dre.custoMateriais / relatorio.dre.receitaBruta) * 100 : 0)}`);
    linhas.push(`(=) Lucro Bruto / Margem de Contribuição;${formatMoeda(relatorio.dre.margemContribuicao)};${formatPct(relatorio.dre.percentualMargemContribuicao)}`);
    linhas.push(`(-) Custo Operacional de Mão de Obra;${formatMoeda(relatorio.dre.custoMaoDeObra)};${formatPct(relatorio.dre.receitaBruta > 0 ? (relatorio.dre.custoMaoDeObra / relatorio.dre.receitaBruta) * 100 : 0)}`);
    linhas.push(`(=) Lucro Operacional Líquido;${formatMoeda(relatorio.dre.lucroOperacionalLiquido)};${formatPct(relatorio.dre.percentualMargemLiquida)}`);
    linhas.push('');

    // Seção 2: Indicadores Chave de Desempenho (KPIs)
    linhas.push('INDICADORES DE PERFORMANCE E METRICA COMERCIAL;;');
    linhas.push('Indicador;Resultado;');
    linhas.push(`Ordens Concluídas;${relatorio.kpis.totalOsConcluidas};`);
    linhas.push(`Ticket Médio por OS Concluída;R$ ${formatMoeda(relatorio.kpis.ticketMedio)};`);
    linhas.push(`Total de Horas Trabalhadas (Concluídas);${relatorio.kpis.totalHorasConcluidas.toString().replace('.', ',')} horas;`);
    linhas.push(`Faturamento Médio por Hora;R$ ${formatMoeda(relatorio.kpis.receitaPorHora)};`);
    linhas.push(`Taxa de Conversão de Orçamentos;${formatPct(relatorio.kpis.taxaConversaoPercentual)};`);
    linhas.push(`Pipeline em Andamento / A Receber;R$ ${formatMoeda(relatorio.kpis.pipelinePrevisto)} (${relatorio.kpis.osEmPipeline} OSs);`);
    linhas.push(`Orçamentos Cancelados;R$ ${formatMoeda(relatorio.kpis.totalCancelado)} (${relatorio.kpis.osCanceladas} OSs);`);
    linhas.push('');

    // Seção 3: Resumo por Etapa do Kanban
    linhas.push('DISTRIBUIÇÃO POR ETAPA NO QUADRO KANBAN;;');
    linhas.push('Etapa;Quantidade;Volume Financeiro (R$);% do Volume');
    for (const res of relatorio.resumoStatus) {
      linhas.push(`${res.titulo};${res.quantidade};${formatMoeda(res.valorTotal)};${formatPct(res.percentualValor)}`);
    }

    return '\uFEFF' + linhas.join('\r\n');
  }

  /**
   * Gera o conteúdo de arquivo CSV detalhado de todas as Ordens de Serviço filtradas.
   */
  public static gerarCsvOrdens(ordens: OrdemServico[], clientes: Cliente[]): string {
    const formatMoeda = (num: number) => (num || 0).toFixed(2).replace('.', ',');

    const cabecalhos = [
      'Número OS',
      'Data de Abertura',
      'Prazo de Entrega',
      'Status',
      'Cliente',
      'Telefone',
      'Título do Serviço',
      'Horas Estimadas',
      'Valor Hora (R$)',
      'Subtotal Peças/Materiais (R$)',
      'Custo Mão de Obra (R$)',
      'Lucro Esperado (R$)',
      'Valor Total Cobrado (R$)',
    ];

    const linhas: string[] = [cabecalhos.join(';')];

    for (const ordem of ordens) {
      const cliente = clientes.find((c) => c.id === ordem.clienteId);
      const dataCriacao = new Date(ordem.criadoEm).toLocaleDateString('pt-BR');
      const prazo = ordem.prazoEntrega ? ordem.prazoEntrega.split('-').reverse().join('/') : '-';

      const linha = [
        `#${ordem.numeroOs}`,
        dataCriacao,
        prazo,
        TITULOS_STATUS[ordem.status] || ordem.status,
        `"${(cliente?.nome || 'Cliente não identificado').replace(/"/g, '""')}"`,
        cliente?.telefone || '',
        `"${ordem.tituloServico.replace(/"/g, '""')}"`,
        (ordem.horasEstimadas || 0).toString().replace('.', ','),
        formatMoeda(ordem.valorHoraTecnica),
        formatMoeda(ordem.financeiro?.subtotalMateriais || 0),
        formatMoeda(ordem.financeiro?.custoMaoDeObra || 0),
        formatMoeda(ordem.financeiro?.lucroEsperado || 0),
        formatMoeda(ordem.financeiro?.valorFinal || 0),
      ];

      linhas.push(linha.join(';'));
    }

    return '\uFEFF' + linhas.join('\r\n');
  }

  /**
   * Dispara o download de um arquivo CSV no navegador.
   */
  public static baixarCsv(conteudoCsv: string, nomeArquivo: string): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const blob = new Blob([conteudoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

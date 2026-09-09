import { describe, it, expect } from 'vitest';
import { ReportsEngine, FiltroRelatorio } from './reports';
import { Cliente, OrdemServico } from './types';

describe('ReportsEngine - Motor de Relatórios Financeiros e DRE Simplificado', () => {
  const clienteMock: Cliente = {
    id: 'cli-1',
    nome: 'Carlos Mecânico',
    telefone: '(43) 99999-1111',
    criadoEm: '2026-03-01T10:00:00.000Z',
  };

  const ordensMock: OrdemServico[] = [
    {
      id: 'os-1',
      numeroOs: 1001,
      clienteId: 'cli-1',
      tituloServico: 'Reparo Placa',
      descricaoDefeito: 'Defeito teste',
      status: 'concluido',
      valorHoraTecnica: 70,
      horasEstimadas: 2,
      margemLucroPercentual: 30,
      financeiro: {
        subtotalMateriais: 50,
        custoMaoDeObra: 140,
        custoTotal: 190,
        lucroEsperado: 57,
        valorFinal: 247,
      },
      prazoEntrega: '2026-03-10',
      criadoEm: '2026-03-05T10:00:00.000Z',
      atualizadoEm: '2026-03-06T10:00:00.000Z',
    },
    {
      id: 'os-2',
      numeroOs: 1002,
      clienteId: 'cli-1',
      tituloServico: 'Troca de Disjuntor',
      descricaoDefeito: 'Curto circuito',
      status: 'concluido',
      valorHoraTecnica: 80,
      horasEstimadas: 3,
      margemLucroPercentual: 20,
      financeiro: {
        subtotalMateriais: 100,
        custoMaoDeObra: 240,
        custoTotal: 340,
        lucroEsperado: 68,
        valorFinal: 408,
      },
      prazoEntrega: '2026-03-12',
      criadoEm: '2026-03-07T14:00:00.000Z',
      atualizadoEm: '2026-03-08T14:00:00.000Z',
    },
    {
      id: 'os-3',
      numeroOs: 1003,
      clienteId: 'cli-1',
      tituloServico: 'Instalação Elétrica',
      descricaoDefeito: 'Em andamento',
      status: 'em_andamento',
      valorHoraTecnica: 60,
      horasEstimadas: 4,
      margemLucroPercentual: 25,
      financeiro: {
        subtotalMateriais: 80,
        custoMaoDeObra: 240,
        custoTotal: 320,
        lucroEsperado: 80,
        valorFinal: 400,
      },
      prazoEntrega: '2026-03-20',
      criadoEm: '2026-03-10T09:00:00.000Z',
      atualizadoEm: '2026-03-10T09:00:00.000Z',
    },
    {
      id: 'os-4',
      numeroOs: 1004,
      clienteId: 'cli-1',
      tituloServico: 'Orçamento Reparo',
      descricaoDefeito: 'Cancelado pelo cliente',
      status: 'cancelado',
      valorHoraTecnica: 60,
      horasEstimadas: 1,
      margemLucroPercentual: 20,
      financeiro: {
        subtotalMateriais: 0,
        custoMaoDeObra: 60,
        custoTotal: 60,
        lucroEsperado: 12,
        valorFinal: 72,
      },
      prazoEntrega: '2026-03-22',
      criadoEm: '2026-03-02T08:00:00.000Z',
      atualizadoEm: '2026-03-02T08:00:00.000Z',
    },
  ];

  it('deve calcular o DRE Simplificado corretamente para ordens concluídas', () => {
    const concluidas = ordensMock.filter((o) => o.status === 'concluido');
    const dre = ReportsEngine.calcularDre(concluidas);

    // Receita Bruta = 247 + 408 = 655
    expect(dre.receitaBruta).toBe(655);
    // Custo Materiais = 50 + 100 = 150
    expect(dre.custoMateriais).toBe(150);
    // Margem de Contribuição = 655 - 150 = 505
    expect(dre.margemContribuicao).toBe(505);
    // % Margem de Contribuição = (505 / 655) * 100 = 77.1%
    expect(dre.percentualMargemContribuicao).toBe(77.1);
    // Custo Mão de Obra = 140 + 240 = 380
    expect(dre.custoMaoDeObra).toBe(380);
    // Lucro Líquido = 505 - 380 = 125
    expect(dre.lucroOperacionalLiquido).toBe(125);
    // % Margem Líquida = (125 / 655) * 100 = 19.1%
    expect(dre.percentualMargemLiquida).toBe(19.1);
  });

  it('deve calcular os KPIs operacionais e comerciais corretamente', () => {
    const kpis = ReportsEngine.calcularKpis(ordensMock);

    expect(kpis.totalOsConcluidas).toBe(2);
    // Ticket médio = 655 / 2 = 327.5
    expect(kpis.ticketMedio).toBe(327.5);
    // Horas trabalhadas concluídas = 2 + 3 = 5
    expect(kpis.totalHorasConcluidas).toBe(5);
    // Faturamento por hora = 655 / 5 = 131
    expect(kpis.receitaPorHora).toBe(131);
    // Total orçamentos = 4
    expect(kpis.totalOrcamentosGerados).toBe(4);
    // Pipeline previsto (em_andamento os-3) = 400
    expect(kpis.pipelinePrevisto).toBe(400);
    // Cancelados = 72
    expect(kpis.totalCancelado).toBe(72);
    expect(kpis.osCanceladas).toBe(1);
    // Conversão: (2 concluídas + 1 em andamento) / 4 = 75%
    expect(kpis.taxaConversaoPercentual).toBe(75);
  });

  it('deve filtrar ordens de serviço por período com precisão', () => {
    const dataRef = new Date('2026-03-15T12:00:00.000Z');

    const filtroMesAtual: FiltroRelatorio = { periodo: 'mes_atual' };
    const filtradas = ReportsEngine.filtrarOrdensPorPeriodo(ordensMock, filtroMesAtual, dataRef);
    expect(filtradas).toHaveLength(4);

    const filtroPersonalizado: FiltroRelatorio = {
      periodo: 'personalizado',
      dataInicio: '2026-03-05',
      dataFim: '2026-03-08',
    };
    const filtradasPeriodo = ReportsEngine.filtrarOrdensPorPeriodo(ordensMock, filtroPersonalizado, dataRef);
    // os-1 (05/03) e os-2 (07/03)
    expect(filtradasPeriodo).toHaveLength(2);
  });

  it('deve gerar CSV do DRE com BOM UTF-8 e delimitador ponto e vírgula', () => {
    const relatorio = ReportsEngine.gerarRelatorioCompleto(
      ordensMock,
      [clienteMock],
      { periodo: 'todos' }
    );
    const csv = ReportsEngine.gerarCsvDre(relatorio, 'Oficina Teste');

    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('RELATÓRIO FINANCEIRO E DRE SIMPLIFICADO - OFICINA TESTE');
    expect(csv).toContain('(+) Receita Operacional Bruta;655,00;100,0%');
    expect(csv).toContain('(=) Lucro Operacional Líquido;125,00;19,1%');
  });

  it('deve gerar CSV detalhado de ordens com colunas completas', () => {
    const csv = ReportsEngine.gerarCsvOrdens(ordensMock, [clienteMock]);

    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('Número OS;Data de Abertura;Prazo de Entrega;Status;Cliente');
    expect(csv).toContain('#1001');
    expect(csv).toContain('Carlos Mecânico');
    expect(csv).toContain('247,00');
  });
});

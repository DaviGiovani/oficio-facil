import { Cliente, ItemServico, OrdemServico, DadosEmpresa } from '../domain/types';
import { PricingEngine } from '../domain/pricing';
import { databaseService } from './databaseService';

export function inicializarDadosDemonstrativos(): boolean {
  const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
  const jaInicializado = storage?.getItem('@oficio_facil:seed_inicializada');

  // Se o sistema já foi inicializado anteriormente (ou resetado pelo usuário), não carrega a demonstração novamente
  if (jaInicializado) {
    return false;
  }

  const clientesExistentes = databaseService.getClientes();
  const ordensExistentes = databaseService.getOrdens();

  // Apenas inicializa se o banco de dados estiver completamente vazio
  if (clientesExistentes.length > 0 || ordensExistentes.length > 0) {
    storage?.setItem('@oficio_facil:seed_inicializada', 'true');
    return false;
  }

  // 1. Clientes Realistas de Londrina/PR
  const cliente1: Cliente = {
    id: 'c1111111-1111-4111-8111-111111111111',
    nome: 'Carlos Eduardo Silva',
    telefone: '(43) 99123-4567',
    documento: '12345678900',
    endereco: 'Rua Sergipe, 450 - Centro, Londrina/PR',
    criadoEm: '2026-03-01T10:00:00.000Z',
  };

  const cliente2: Cliente = {
    id: 'c2222222-2222-4222-8222-222222222222',
    nome: 'Mariana Souza Santos',
    telefone: '(43) 98877-6655',
    documento: '98765432111',
    endereco: 'Av. Higienópolis, 1200 - Guanabara, Londrina/PR',
    criadoEm: '2026-03-02T11:30:00.000Z',
  };

  const cliente3: Cliente = {
    id: 'c3333333-3333-4333-8333-333333333333',
    nome: 'Roberto Mendes Ribeiro',
    telefone: '(43) 99654-3210',
    documento: '45678912322',
    endereco: 'Av. Duque de Caxias, 880 - Vila Brasil, Londrina/PR',
    criadoEm: '2026-03-03T14:15:00.000Z',
  };

  databaseService.salvarCliente(cliente1);
  databaseService.salvarCliente(cliente2);
  databaseService.salvarCliente(cliente3);

  // 2. Ordens de Serviço cobrindo os 5 status do sistema
  const ordem1Id = 'o1111111-1111-4111-8111-111111111111';
  const itensOrdem1: ItemServico[] = [
    {
      id: 'i1111111-1111-4111-8111-111111111111',
      ordemId: ordem1Id,
      descricao: 'Capacitores eletrolíticos de alta capacitância',
      quantidade: 2,
      valorUnitario: 22.50,
    },
    {
      id: 'i1111111-1111-4111-8111-111111111112',
      ordemId: ordem1Id,
      descricao: 'Pasta térmica condutiva prata 10g',
      quantidade: 1,
      valorUnitario: 25.00,
    },
  ];

  const ordem1: OrdemServico = {
    id: ordem1Id,
    numeroOs: 1001,
    clienteId: cliente1.id,
    tituloServico: 'Reparo em Placa Controladora de Geladeira Inverter',
    descricaoDefeito: 'Aparelho desliga repentinamente após alguns minutos e acusa código de erro no display principal.',
    status: 'orcamento',
    valorHoraTecnica: 70.00,
    horasEstimadas: 2.5,
    margemLucroPercentual: 30,
    financeiro: PricingEngine.calcularPrecoFinal(itensOrdem1, 2.5, 70.00, 30),
    prazoEntrega: '2026-03-15',
    criadoEm: '2026-03-04T09:00:00.000Z',
    atualizadoEm: '2026-03-04T09:00:00.000Z',
  };

  const ordem2Id = 'o2222222-2222-4222-8222-222222222222';
  const itensOrdem2: ItemServico[] = [
    {
      id: 'i2222222-2222-4222-8222-222222222221',
      ordemId: ordem2Id,
      descricao: 'Disjuntor Bipolar DIN 50A Curva C',
      quantidade: 1,
      valorUnitario: 68.00,
    },
    {
      id: 'i2222222-2222-4222-8222-222222222222',
      ordemId: ordem2Id,
      descricao: 'Barramento tipo pente bifásico 12 módulos',
      quantidade: 1,
      valorUnitario: 42.50,
    },
  ];

  const ordem2: OrdemServico = {
    id: ordem2Id,
    numeroOs: 1002,
    clienteId: cliente2.id,
    tituloServico: 'Revisão e Substituição de Disjuntores do Quadro Geral',
    descricaoDefeito: 'Disjuntor principal desarmando constantemente com chuveiro e ar condicionado operando em conjunto.',
    status: 'aprovado',
    valorHoraTecnica: 80.00,
    horasEstimadas: 3.0,
    margemLucroPercentual: 25,
    financeiro: PricingEngine.calcularPrecoFinal(itensOrdem2, 3.0, 80.00, 25),
    prazoEntrega: '2026-03-12',
    criadoEm: '2026-03-04T10:30:00.000Z',
    atualizadoEm: '2026-03-04T11:00:00.000Z',
  };

  const ordem3Id = 'o3333333-3333-4333-8333-333333333333';
  const itensOrdem3: ItemServico[] = [
    {
      id: 'i3333333-3333-4333-8333-333333333331',
      ordemId: ordem3Id,
      descricao: 'Linha reforçada de alfaiataria e entretela importada',
      quantidade: 1,
      valorUnitario: 35.00,
    },
  ];

  const ordem3: OrdemServico = {
    id: ordem3Id,
    numeroOs: 1003,
    clienteId: cliente3.id,
    tituloServico: 'Ajuste Fino de Medidas em Terno Completo',
    descricaoDefeito: 'Redução de manga de paletó estruturado e ajuste de cós e bainha italiana na calça social.',
    status: 'em_andamento',
    valorHoraTecnica: 60.00,
    horasEstimadas: 4.0,
    margemLucroPercentual: 20,
    financeiro: PricingEngine.calcularPrecoFinal(itensOrdem3, 4.0, 60.00, 20),
    prazoEntrega: '2026-03-10',
    criadoEm: '2026-03-05T08:20:00.000Z',
    atualizadoEm: '2026-03-05T14:00:00.000Z',
  };

  const ordem4Id = 'o4444444-4444-4444-8444-444444444444';
  const itensOrdem4: ItemServico[] = [
    {
      id: 'i4444444-4444-4444-8444-444444444441',
      ordemId: ordem4Id,
      descricao: 'Jogo de escovas de carvão de alta durabilidade',
      quantidade: 2,
      valorUnitario: 18.00,
    },
  ];

  const ordem4: OrdemServico = {
    id: ordem4Id,
    numeroOs: 1004,
    clienteId: cliente1.id,
    tituloServico: 'Manutenção Preventiva de Furadeira de Bancada',
    descricaoDefeito: 'Fagulhamento excessivo no coletor do induzido e ruído de rolamentos.',
    status: 'concluido',
    valorHoraTecnica: 75.00,
    horasEstimadas: 1.5,
    margemLucroPercentual: 35,
    financeiro: PricingEngine.calcularPrecoFinal(itensOrdem4, 1.5, 75.00, 35),
    prazoEntrega: '2026-03-06',
    criadoEm: '2026-03-02T13:00:00.000Z',
    atualizadoEm: '2026-03-06T16:00:00.000Z',
  };

  const ordem5Id = 'o5555555-5555-4555-8555-555555555555';
  const itensOrdem5: ItemServico[] = [];

  const ordem5: OrdemServico = {
    id: ordem5Id,
    numeroOs: 1005,
    clienteId: cliente2.id,
    tituloServico: 'Restauração de Armário em Madeira de Demolição',
    descricaoDefeito: 'Cliente desistiu do orçamento preliminar optando por adquirir um novo móvel planejado.',
    status: 'cancelado',
    valorHoraTecnica: 65.00,
    horasEstimadas: 5.0,
    margemLucroPercentual: 25,
    financeiro: PricingEngine.calcularPrecoFinal(itensOrdem5, 5.0, 65.00, 25),
    prazoEntrega: '2026-03-20',
    criadoEm: '2026-03-01T15:40:00.000Z',
    atualizadoEm: '2026-03-02T09:00:00.000Z',
  };

  databaseService.salvarOrdem(ordem1, itensOrdem1);
  databaseService.salvarOrdem(ordem2, itensOrdem2);
  databaseService.salvarOrdem(ordem3, itensOrdem3);
  databaseService.salvarOrdem(ordem4, itensOrdem4);
  databaseService.salvarOrdem(ordem5, itensOrdem5);

  // 3. Dados da Empresa Prestadora (Oficina Modelo Londrina/PR)
  const empresaDemonstrativa: DadosEmpresa = {
    nome: 'LondriFix Soluções Técnicas',
    funcao: 'Assistência Técnica Especializada e Manutenção Geral',
    documento: '34.892.145/0001-08',
    telefone: '(43) 3344-5566',
    email: 'contato@londrifix.com.br',
    endereco: 'Rua Mato Grosso, 320 - Centro',
    cidadeUf: 'Londrina - PR',
    valorHoraPadrao: 70,
    parametrosHora: {
      salarioDesejado: 4500,
      custosFixosMensais: 950,
      diasPorSemana: 5,
      horasPorDia: 8,
      margemOciosidadePercentual: 20,
    },
  };
  databaseService.salvarDadosEmpresa(empresaDemonstrativa);
  storage?.setItem('@oficio_facil:seed_inicializada', 'true');

  return true;
}

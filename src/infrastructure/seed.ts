import { Cliente, ItemServico, OrdemServico, DadosEmpresa, ServicoCatalogo, PecaCatalogo } from '../domain/types';
import { PricingEngine } from '../domain/pricing';
import { databaseService } from './databaseService';

export const SEED_VERSAO_COMPLETA = 'v4_stress_kanban_set2026';

export function inicializarDadosDemonstrativos(forcar = false): boolean {
  const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
  const versaoAtual = storage?.getItem('@oficio_facil:seed_versao');

  // Se já foi populado com esta versão e não foi forçado, mantém os dados
  if (!forcar && versaoAtual === SEED_VERSAO_COMPLETA) {
    return false;
  }

  const clientesExistentes = databaseService.getClientes();
  const ordensExistentes = databaseService.getOrdens();

  if (!forcar && versaoAtual && (clientesExistentes.length > 0 || ordensExistentes.length > 0)) {
    return false;
  }

  // Limpa o banco anterior para garantir um estado consistente e sem duplicações
  databaseService.limparBanco();

  // =========================================================================
  // 1. BASE DE CLIENTES (10 Clientes Reais de Londrina/PR)
  // =========================================================================
  const clientes: Cliente[] = [
    {
      id: 'c1111111-1111-4111-8111-111111111111',
      nome: 'Carlos Eduardo Silva',
      telefone: '(43) 99123-4567',
      documento: '123.456.789-00',
      endereco: 'Rua Sergipe, 450 - Centro, Londrina/PR',
      criadoEm: '2026-08-15T09:00:00.000Z',
    },
    {
      id: 'c2222222-2222-4222-8222-222222222222',
      nome: 'Mariana Souza Santos',
      telefone: '(43) 98877-6655',
      documento: '987.654.321-11',
      endereco: 'Av. Higienópolis, 1200 - Guanabara, Londrina/PR',
      criadoEm: '2026-08-18T10:30:00.000Z',
    },
    {
      id: 'c3333333-3333-4333-8333-333333333333',
      nome: 'Roberto Mendes Ribeiro',
      telefone: '(43) 99654-3210',
      documento: '456.789.123-22',
      endereco: 'Av. Duque de Caxias, 880 - Vila Brasil, Londrina/PR',
      criadoEm: '2026-08-20T14:15:00.000Z',
    },
    {
      id: 'c4444444-4444-4444-8444-444444444444',
      nome: 'Dra. Patrícia Alencar',
      telefone: '(43) 99811-2233',
      documento: '234.567.890-33',
      endereco: 'Rua Santos, 610 - Jardim Bela Vista, Londrina/PR',
      criadoEm: '2026-08-25T11:00:00.000Z',
    },
    {
      id: 'c5555555-5555-4555-8555-555555555555',
      nome: 'Construtora e Reformas Rocha Ltda',
      telefone: '(43) 3322-9988',
      documento: '12.345.678/0001-90',
      endereco: 'Rod. Celso Garcia Cid, km 376 - Esperança, Londrina/PR',
      criadoEm: '2026-08-28T16:20:00.000Z',
    },
    {
      id: 'c6666666-6666-4666-8666-666666666666',
      nome: 'Lucas Ferreira Lima',
      telefone: '(43) 99765-4321',
      documento: '345.678.901-44',
      endereco: 'Rua Salgado Filho, 230 - Aeroporto, Londrina/PR',
      criadoEm: '2026-09-01T08:45:00.000Z',
    },
    {
      id: 'c7777777-7777-4777-8777-777777777777',
      nome: 'Beatriz Albuquerque',
      telefone: '(43) 98456-7890',
      documento: '567.890.123-55',
      endereco: 'Rua Ponta Grossa, 145 - Shangri-lá, Londrina/PR',
      criadoEm: '2026-09-02T13:10:00.000Z',
    },
    {
      id: 'c8888888-8888-4888-8888-888888888888',
      nome: 'Restaurante & Pizzaria Bella Itália',
      telefone: '(43) 3345-1234',
      documento: '98.765.432/0001-21',
      endereco: 'Av. Maringá, 1850 - Vitória, Londrina/PR',
      criadoEm: '2026-09-03T15:30:00.000Z',
    },
    {
      id: 'c9999999-9999-4999-8999-999999999999',
      nome: 'Dr. Henrique Prado (Clínica PetCare)',
      telefone: '(43) 99188-4422',
      documento: '876.543.210-99',
      endereco: 'Rua Paranaguá, 920 - Centro, Londrina/PR',
      criadoEm: '2026-09-04T10:00:00.000Z',
    },
    {
      id: 'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      nome: 'Auto Posto & Conveniência Igapó',
      telefone: '(43) 3377-8899',
      documento: '01.234.567/0001-89',
      endereco: 'Av. Ayrton Senna da Silva, 500 - Gleba Palhano, Londrina/PR',
      criadoEm: '2026-09-04T14:30:00.000Z',
    },
  ];
  clientes.forEach((c) => databaseService.salvarCliente(c));

  // =========================================================================
  // 2. CATÁLOGO DE SERVIÇOS (8 Serviços Profissionais)
  // =========================================================================
  const servicosDemo: ServicoCatalogo[] = [
    {
      id: 's1111111-1111-4111-8111-111111111111',
      nome: 'Diagnóstico e Perícia Técnica em Bancada',
      descricao: 'Desmontagem técnica com testes em osciloscópio e multímetro digital, culminando em laudo preliminar detalhado.',
      horasEstimadas: 1.0,
      valorSugerido: 60.00,
      criadoEm: '2026-08-20T08:00:00.000Z',
    },
    {
      id: 's2222222-2222-4222-8222-222222222222',
      nome: 'Higienização Química e Revisão de Ar Split',
      descricao: 'Limpeza química bactericida de serpentina e turbina, desobstrução de dreno e teste de estanqueidade de gás.',
      horasEstimadas: 2.0,
      valorSugerido: 180.00,
      criadoEm: '2026-08-20T08:15:00.000Z',
    },
    {
      id: 's3333333-3333-4333-8333-333333333333',
      nome: 'Reparo em Placa Controladora Inverter',
      descricao: 'Diagnóstico e troca de capacitores eletrolíticos, ressoldagem de trilhas SMD e teste com carga de bancada.',
      horasEstimadas: 2.5,
      valorSugerido: 220.00,
      criadoEm: '2026-08-20T08:30:00.000Z',
    },
    {
      id: 's4444444-4444-4444-8444-444444444444',
      nome: 'Instalação de Ponto Elétrico Dedicado 220V',
      descricao: 'Passagem de cabeamento normatizado em eletroduto, disjuntor individual no quadro e tomada de sobrepor 20A.',
      horasEstimadas: 1.5,
      valorSugerido: 120.00,
      criadoEm: '2026-08-20T08:45:00.000Z',
    },
    {
      id: 's5555555-5555-4555-8555-555555555555',
      nome: 'Revisão e Balanceamento de Quadro Elétrico',
      descricao: 'Reaperto geral com torquímetro, balanceamento entre fases R-S-T, identificação de circuitos e troca de disjuntores.',
      horasEstimadas: 3.5,
      valorSugerido: 280.00,
      criadoEm: '2026-08-20T09:00:00.000Z',
    },
    {
      id: 's6666666-6666-4666-8666-666666666666',
      nome: 'Formatação, SSD e Manutenção Térmica',
      descricao: 'Instalação limpa do Windows 11 com drivers oficiais, substituição de pasta térmica por prata e backup prévio de arquivos.',
      horasEstimadas: 2.0,
      valorSugerido: 160.00,
      criadoEm: '2026-08-20T09:15:00.000Z',
    },
    {
      id: 's7777777-7777-4777-8777-777777777777',
      nome: 'Troca de Rolamentos e Vedação em Motor Elétrico',
      descricao: 'Desmontagem, extração hidráulica de rolamentos danificados, instalação de rolamentos blindados novos e teste de isolação.',
      horasEstimadas: 3.0,
      valorSugerido: 240.00,
      criadoEm: '2026-08-20T09:30:00.000Z',
    },
    {
      id: 's8888888-8888-4888-8888-888888888888',
      nome: 'Substituição de Resistência e Termostato',
      descricao: 'Substituição de resistência tubular blindada, ajuste de termostato de segurança e teste de consumo sob carga.',
      horasEstimadas: 1.5,
      valorSugerido: 130.00,
      criadoEm: '2026-08-20T09:45:00.000Z',
    },
  ];
  servicosDemo.forEach((s) => databaseService.salvarServicoCatalogo(s));

  // =========================================================================
  // 3. CATÁLOGO DE PEÇAS & MATERIAIS (12 Peças com Margens Reais)
  // =========================================================================
  const pecasDemo: PecaCatalogo[] = [
    {
      id: 'p1111111-1111-4111-8111-111111111111',
      nome: 'Cabo Flexível 2,5mm² Antichama 750V',
      codigo: 'CAB-25',
      unidade: 'm',
      precoCusto: 2.20,
      precoVenda: 4.50,
      criadoEm: '2026-08-20T10:00:00.000Z',
    },
    {
      id: 'p2222222-2222-4222-8222-222222222222',
      nome: 'Cabo Flexível 4,0mm² Antichama 750V',
      codigo: 'CAB-40',
      unidade: 'm',
      precoCusto: 3.80,
      precoVenda: 7.50,
      criadoEm: '2026-08-20T10:05:00.000Z',
    },
    {
      id: 'p3333333-3333-4333-8333-333333333333',
      nome: 'Disjuntor Bipolar DIN 32A Curva C',
      codigo: 'DISJ-32B',
      unidade: 'un',
      precoCusto: 24.00,
      precoVenda: 48.00,
      criadoEm: '2026-08-20T10:10:00.000Z',
    },
    {
      id: 'p4444444-4444-4444-8444-444444444444',
      nome: 'Disjuntor Bipolar DIN 50A Curva C',
      codigo: 'DISJ-50B',
      unidade: 'un',
      precoCusto: 32.00,
      precoVenda: 68.00,
      criadoEm: '2026-08-20T10:15:00.000Z',
    },
    {
      id: 'p5555555-5555-4555-8555-555555555555',
      nome: 'Fita Isolante 3M Imperial 20m',
      codigo: 'FITA-3M',
      unidade: 'un',
      precoCusto: 7.50,
      precoVenda: 15.00,
      criadoEm: '2026-08-20T10:20:00.000Z',
    },
    {
      id: 'p6666666-6666-4666-8666-666666666666',
      nome: 'SSD 480GB SATA III Kingston A400',
      codigo: 'SSD-480',
      unidade: 'un',
      precoCusto: 145.00,
      precoVenda: 240.00,
      criadoEm: '2026-08-20T10:25:00.000Z',
    },
    {
      id: 'p7777777-7777-4777-8777-777777777777',
      nome: 'Memória RAM 8GB DDR4 3200MHz',
      codigo: 'RAM-8GB',
      unidade: 'un',
      precoCusto: 95.00,
      precoVenda: 160.00,
      criadoEm: '2026-08-20T10:30:00.000Z',
    },
    {
      id: 'p8888888-8888-4888-8888-888888888888',
      nome: 'Pasta Térmica Prata Alta Condutividade 5g',
      codigo: 'PAS-PRAT',
      unidade: 'un',
      precoCusto: 18.00,
      precoVenda: 35.00,
      criadoEm: '2026-08-20T10:35:00.000Z',
    },
    {
      id: 'p9999999-9999-4999-8999-999999999999',
      nome: 'Gás Refrigerante R410A DuPont (Carga/Kg)',
      codigo: 'GAS-R410',
      unidade: 'kg',
      precoCusto: 45.00,
      precoVenda: 90.00,
      criadoEm: '2026-08-20T10:40:00.000Z',
    },
    {
      id: 'paaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      nome: 'Capacitor Duplo 45+5 uF 440V',
      codigo: 'CAP-455',
      unidade: 'un',
      precoCusto: 28.00,
      precoVenda: 65.00,
      criadoEm: '2026-08-20T10:45:00.000Z',
    },
    {
      id: 'pbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      nome: 'Rolamento Blindado 6204 DDU NSK',
      codigo: 'ROL-6204',
      unidade: 'un',
      precoCusto: 22.00,
      precoVenda: 52.00,
      criadoEm: '2026-08-20T10:50:00.000Z',
    },
    {
      id: 'pccccccc-cccc-4ccc-8ccc-cccccccccccc',
      nome: 'Tubo de Cobre Flexível 1/4" Panqueca',
      codigo: 'COB-14',
      unidade: 'm',
      precoCusto: 16.00,
      precoVenda: 32.00,
      criadoEm: '2026-08-20T10:55:00.000Z',
    },
  ];
  pecasDemo.forEach((p) => databaseService.salvarPecaCatalogo(p));

  // =========================================================================
  // 4. ORDENS DE SERVIÇO (22 OSs PARA ESTRESSAR O KANBAN)
  // Data base de referência: 10/09/2026
  // =========================================================================
  const criarOS = (
    id: string,
    numeroOs: number,
    clienteId: string,
    tituloServico: string,
    descricaoDefeito: string,
    status: 'orcamento' | 'aprovado' | 'em_andamento' | 'concluido' | 'cancelado',
    horasEstimadas: number,
    valorHoraTecnica: number,
    margemLucroPercentual: number,
    prazoEntrega: string,
    criadoEm: string,
    itens: Array<{ descricao: string; quantidade: number; valorUnitario: number }>
  ) => {
    const itensComId: ItemServico[] = itens.map((item, idx) => ({
      id: `item-${numeroOs}-${idx + 1}`,
      ordemId: id,
      descricao: item.descricao,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
    }));

    const financeiro = PricingEngine.calcularPrecoFinal(
      itensComId,
      horasEstimadas,
      valorHoraTecnica,
      margemLucroPercentual
    );

    const ordem: OrdemServico = {
      id,
      numeroOs,
      clienteId,
      tituloServico,
      descricaoDefeito,
      status,
      valorHoraTecnica,
      horasEstimadas,
      margemLucroPercentual,
      financeiro,
      prazoEntrega,
      criadoEm,
      atualizadoEm: criadoEm,
    };

    databaseService.salvarOrdem(ordem, itensComId);
  };

  // --- 1. ORÇAMENTOS (6 OSs) ---
  criarOS(
    'o1001-1111-4111-8111-111111111111',
    1001,
    clientes[1].id, // Mariana Souza
    'Reparo em Placa Controladora de Ar-Condicionado VRF',
    'Unidade externa desliga repentinamente após 10 minutos com código de falha E4 no display.',
    'orcamento',
    2.5,
    80.00,
    30,
    '2026-09-16',
    '2026-09-08T09:00:00.000Z',
    [
      { descricao: 'Capacitor Duplo 45+5 uF 440V', quantidade: 1, valorUnitario: 65.00 },
      { descricao: 'Pasta Térmica Prata Alta Condutividade 5g', quantidade: 1, valorUnitario: 35.00 },
    ]
  );

  criarOS(
    'o1002-2222-4222-8222-222222222222',
    1002,
    clientes[6].id, // Beatriz Albuquerque
    'Instalação de Circuito 220V Dedicado para Forno Elétrico',
    'Cliente adquiriu forno elétrico de embutir 220V/3500W e necessita de circuito individual com disjuntor bipolar.',
    'orcamento',
    2.0,
    75.00,
    25,
    '2026-09-17',
    '2026-09-08T11:20:00.000Z',
    [
      { descricao: 'Cabo Flexível 4,0mm² Antichama 750V', quantidade: 15, valorUnitario: 7.50 },
      { descricao: 'Disjuntor Bipolar DIN 32A Curva C', quantidade: 1, valorUnitario: 48.00 },
      { descricao: 'Fita Isolante 3M Imperial 20m', quantidade: 1, valorUnitario: 15.00 },
    ]
  );

  criarOS(
    'o1003-3333-4333-8333-333333333333',
    1003,
    clientes[0].id, // Carlos Eduardo
    'Upgrade de Armazenamento e Limpeza Notebook Dell G15',
    'Lentidão no carregamento de programas e aquecimento alto. Solicita SSD rápido e limpeza interna.',
    'orcamento',
    1.5,
    80.00,
    20,
    '2026-09-14',
    '2026-09-09T08:30:00.000Z',
    [
      { descricao: 'SSD 480GB SATA III Kingston A400', quantidade: 1, valorUnitario: 240.00 },
      { descricao: 'Pasta Térmica Prata Alta Condutividade 5g', quantidade: 1, valorUnitario: 35.00 },
    ]
  );

  criarOS(
    'o1004-4444-4444-8444-444444444444',
    1004,
    clientes[8].id, // Dr. Henrique Prado
    'Automação de Iluminação e Tomadas de Centro Cirúrgico Pet',
    'Adequação de circuitos de emergência e tomadas para equipamentos veterinários de monitoramento.',
    'orcamento',
    3.0,
    85.00,
    25,
    '2026-09-18',
    '2026-09-09T14:00:00.000Z',
    [
      { descricao: 'Cabo Flexível 2,5mm² Antichama 750V', quantidade: 20, valorUnitario: 4.50 },
      { descricao: 'Disjuntor Bipolar DIN 32A Curva C', quantidade: 2, valorUnitario: 48.00 },
    ]
  );

  criarOS(
    'o1005-5555-4555-8555-555555555555',
    1005,
    clientes[9].id, // Auto Posto Igapó
    'Troca de Bomba de Recirculação e Termostato de Lavajato',
    'Bomba de alta pressão com desarme térmico intermitente ao operar por mais de 30 minutos.',
    'orcamento',
    2.5,
    80.00,
    20,
    '2026-09-16',
    '2026-09-09T15:20:00.000Z',
    [
      { descricao: 'Rolamento Blindado 6204 DDU NSK', quantidade: 2, valorUnitario: 52.00 },
      { descricao: 'Fita Isolante 3M Imperial 20m', quantidade: 1, valorUnitario: 15.00 },
    ]
  );

  criarOS(
    'o1006-6666-4666-8666-666666666666',
    1006,
    clientes[4].id, // Construtora Rocha
    'Revisão de Nobreak Senoidal 3kVA de Servidor de Câmeras',
    'Nobreak não segura carga no teste de corte de energia e acusa necessidade de calibração de baterias.',
    'orcamento',
    2.0,
    85.00,
    30,
    '2026-09-19',
    '2026-09-10T08:00:00.000Z',
    [
      { descricao: 'Pasta Térmica Prata Alta Condutividade 5g', quantidade: 1, valorUnitario: 35.00 },
    ]
  );

  // --- 2. APROVADOS (4 OSs) ---
  criarOS(
    'o1007-7777-4777-8777-777777777777',
    1007,
    clientes[7].id, // Bella Itália
    'Revisão e Substituição de Disjuntores do Quadro Elétrico',
    'Disjuntor geral desarmando em horários de pico do forno elétrico e refrigeradores industriais.',
    'aprovado',
    3.5,
    80.00,
    25,
    '2026-09-13',
    '2026-09-07T14:00:00.000Z',
    [
      { descricao: 'Disjuntor Bipolar DIN 50A Curva C', quantidade: 2, valorUnitario: 68.00 },
      { descricao: 'Cabo Flexível 4,0mm² Antichama 750V', quantidade: 8, valorUnitario: 7.50 },
      { descricao: 'Fita Isolante 3M Imperial 20m', quantidade: 2, valorUnitario: 15.00 },
    ]
  );

  criarOS(
    'o1008-8888-4888-8888-888888888888',
    1008,
    clientes[4].id, // Construtora Rocha
    'Substituição de Rolamentos em Exaustor Industrial',
    'Ruído de atrito e aquecimento anormal no motor do exaustor principal da cabine de jateamento.',
    'aprovado',
    3.0,
    85.00,
    25,
    '2026-09-14',
    '2026-09-07T16:30:00.000Z',
    [
      { descricao: 'Rolamento Blindado 6204 DDU NSK', quantidade: 2, valorUnitario: 52.00 },
    ]
  );

  criarOS(
    'o1009-9999-4999-8999-999999999999',
    1009,
    clientes[7].id, // Bella Itália
    'Troca de Compressores e Carga em Câmara Fria de Carnes',
    'Câmara fria com temperatura oscilando em 8°C. Aprovada substituição de componentes e carga completa de fluido.',
    'aprovado',
    4.0,
    85.00,
    30,
    '2026-09-12', // Vence em 2 dias
    '2026-09-08T10:00:00.000Z',
    [
      { descricao: 'Gás Refrigerante R410A DuPont (Carga/Kg)', quantidade: 2.5, valorUnitario: 90.00 },
      { descricao: 'Tubo de Cobre Flexível 1/4" Panqueca', quantidade: 5, valorUnitario: 32.00 },
    ]
  );

  criarOS(
    'o1010-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    1010,
    clientes[2].id, // Roberto Mendes
    'Instalação de Ponto Trifásico 220V para Torno Mecânico',
    'Passagem de cabos de 4mm² em perfilado metálico com chave seccionadora rotativa de segurança.',
    'aprovado',
    3.0,
    75.00,
    20,
    '2026-09-15',
    '2026-09-08T15:30:00.000Z',
    [
      { descricao: 'Cabo Flexível 4,0mm² Antichama 750V', quantidade: 18, valorUnitario: 7.50 },
      { descricao: 'Disjuntor Bipolar DIN 50A Curva C', quantidade: 1, valorUnitario: 68.00 },
    ]
  );

  // --- 3. EM ANDAMENTO (5 OSs - Com prazos críticos e vencendo hoje!) ---
  criarOS(
    'o1011-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    1011,
    clientes[3].id, // Dra. Patrícia
    'Carga de Gás e Correção de Vazamento em Ar Split Inverter',
    'Aparelho do consultório parou de refrigerar. Detectado microvazamento na união de cobre da linha de sucção.',
    'em_andamento',
    2.5,
    80.00,
    30,
    '2026-09-10', // VENCE HOJE!
    '2026-09-06T10:15:00.000Z',
    [
      { descricao: 'Gás Refrigerante R410A DuPont (Carga/Kg)', quantidade: 1.5, valorUnitario: 90.00 },
      { descricao: 'Tubo de Cobre Flexível 1/4" Panqueca', quantidade: 3, valorUnitario: 32.00 },
    ]
  );

  criarOS(
    'o1012-cccc-4ccc-8ccc-cccccccccccc',
    1012,
    clientes[7].id, // Bella Itália
    'Reforma e Troca de Fiação Elétrica de Cozinha Comercial',
    'Fiação antiga de 1,5mm² sofrendo aquecimento nas tomadas das fritadeiras elétricas industriais.',
    'em_andamento',
    4.0,
    75.00,
    20,
    '2026-09-11', // VENCE EM 1 DIA!
    '2026-09-06T13:40:00.000Z',
    [
      { descricao: 'Cabo Flexível 2,5mm² Antichama 750V', quantidade: 25, valorUnitario: 4.50 },
      { descricao: 'Cabo Flexível 4,0mm² Antichama 750V', quantidade: 15, valorUnitario: 7.50 },
      { descricao: 'Fita Isolante 3M Imperial 20m', quantidade: 2, valorUnitario: 15.00 },
    ]
  );

  criarOS(
    'o1013-dddd-4ddd-8ddd-dddddddddddd',
    1013,
    clientes[9].id, // Auto Posto Igapó
    'Manutenção de Grupo Gerador Diesel de Emergência',
    'Gerador demorando para assumir carga de bombas. Troca de filtros, ajuste de regulador AVR e teste com carga.',
    'em_andamento',
    3.5,
    90.00,
    25,
    '2026-09-09', // 1 DIA EM ATRASO (Para testar badge vermelha de atraso!)
    '2026-09-05T08:00:00.000Z',
    [
      { descricao: 'Disjuntor Bipolar DIN 50A Curva C', quantidade: 1, valorUnitario: 68.00 },
      { descricao: 'Fita Isolante 3M Imperial 20m', quantidade: 1, valorUnitario: 15.00 },
    ]
  );

  criarOS(
    'o1014-eeee-4eee-8eee-eeeeeeeeeeee',
    1014,
    clientes[8].id, // Dr. Henrique Prado
    'Recuperação de Módulo Eletrônico de Raio-X Veterinário',
    'Fonte chaveada de alta voltagem queimou após raio. Trocados MOSFETs de potência e capacitores de filtro.',
    'em_andamento',
    3.0,
    85.00,
    30,
    '2026-09-12', // Vence em 2 dias
    '2026-09-07T09:30:00.000Z',
    [
      { descricao: 'Pasta Térmica Prata Alta Condutividade 5g', quantidade: 2, valorUnitario: 35.00 },
      { descricao: 'Capacitor Duplo 45+5 uF 440V', quantidade: 1, valorUnitario: 65.00 },
    ]
  );

  criarOS(
    'o1015-ffff-4fff-8fff-ffffffffffff',
    1015,
    clientes[5].id, // Lucas Ferreira
    'Instalação de Quadro Geral e Barramento Bifásico',
    'Montagem de quadro de embutir 18 módulos com barramento pente e DPS classe II contra surtos elétricos.',
    'em_andamento',
    3.0,
    75.00,
    20,
    '2026-09-13',
    '2026-09-07T15:00:00.000Z',
    [
      { descricao: 'Cabo Flexível 4,0mm² Antichama 750V', quantidade: 10, valorUnitario: 7.50 },
      { descricao: 'Disjuntor Bipolar DIN 32A Curva C', quantidade: 2, valorUnitario: 48.00 },
    ]
  );

  // --- 4. CONCLUÍDAS (5 OSs - Com datas recentes de Setembro/2026) ---
  criarOS(
    'o1016-0001-4001-8001-000000000001',
    1016,
    clientes[5].id, // Lucas Ferreira
    'Troca de Capacitor e Higienização de Ar-Condicionado',
    'Compressor não partia e ventilação estava fraca. Trocado capacitor e efetuada limpeza completa.',
    'concluido',
    2.0,
    75.00,
    25,
    '2026-09-05',
    '2026-09-02T09:00:00.000Z',
    [
      { descricao: 'Capacitor Duplo 45+5 uF 440V', quantidade: 1, valorUnitario: 65.00 },
    ]
  );

  criarOS(
    'o1017-0002-4002-8002-000000000002',
    1017,
    clientes[0].id, // Carlos Eduardo
    'Instalação de Ponto 20A e Disjuntor para Lava-Louças',
    'Ponto original era 10A e derreteu a tomada. Instalado circuito independente de 20A com disjuntor dedicado.',
    'concluido',
    1.5,
    70.00,
    20,
    '2026-09-06',
    '2026-09-03T11:00:00.000Z',
    [
      { descricao: 'Cabo Flexível 2,5mm² Antichama 750V', quantidade: 12, valorUnitario: 4.50 },
      { descricao: 'Disjuntor Bipolar DIN 32A Curva C', quantidade: 1, valorUnitario: 48.00 },
    ]
  );

  criarOS(
    'o1018-0003-4003-8003-000000000003',
    1018,
    clientes[1].id, // Mariana Souza
    'Recuperação de Placa Inverter Lavadora Lava e Seca',
    'Lavadora não ligava após surto de tensão elétrica em dia de tempestade. Reparada etapa de retificação.',
    'concluido',
    3.0,
    80.00,
    30,
    '2026-09-07',
    '2026-09-03T14:30:00.000Z',
    [
      { descricao: 'Pasta Térmica Prata Alta Condutividade 5g', quantidade: 1, valorUnitario: 35.00 },
    ]
  );

  criarOS(
    'o1019-0004-4004-8004-000000000004',
    1019,
    clientes[4].id, // Construtora Rocha
    'Diagnóstico, Limpeza e Otimização de Servidor Local',
    'Servidor de arquivos da empresa desligando por temperatura. Realizada limpeza física e upgrade de memória RAM.',
    'concluido',
    2.5,
    85.00,
    25,
    '2026-09-08',
    '2026-09-04T16:00:00.000Z',
    [
      { descricao: 'Memória RAM 8GB DDR4 3200MHz', quantidade: 2, valorUnitario: 160.00 },
      { descricao: 'Pasta Térmica Prata Alta Condutividade 5g', quantidade: 1, valorUnitario: 35.00 },
    ]
  );

  criarOS(
    'o1020-0005-4005-8005-000000000005',
    1020,
    clientes[7].id, // Bella Itália
    'Substituição de Resistência e Termostato de Forno de Pizza',
    'Forno elétrico industrial não atingia 300°C. Substituída resistência inferior de 4000W e termostato capilar.',
    'concluido',
    2.0,
    80.00,
    25,
    '2026-09-09',
    '2026-09-05T11:00:00.000Z',
    [
      { descricao: 'Cabo Flexível 4,0mm² Antichama 750V', quantidade: 6, valorUnitario: 7.50 },
      { descricao: 'Fita Isolante 3M Imperial 20m', quantidade: 1, valorUnitario: 15.00 },
    ]
  );

  // --- 5. CANCELADAS (2 OSs) ---
  criarOS(
    'o1021-0006-4006-8006-000000000006',
    1021,
    clientes[2].id, // Roberto Mendes
    'Rebobinamento de Motor Trifásico 5CV de Esteira',
    'Curto-circuito no bobinamento de campo. Cliente optou por adquirir motor novo direto do fabricante.',
    'cancelado',
    4.0,
    70.00,
    20,
    '2026-09-18',
    '2026-09-02T15:00:00.000Z',
    []
  );

  criarOS(
    'o1022-0007-4007-8007-000000000007',
    1022,
    clientes[6].id, // Beatriz Albuquerque
    'Instalação de Painel Solar Fotovoltaico Off-Grid',
    'Orçamento para instalação de placas solares em chácara. Cliente adiou o projeto para o próximo semestre.',
    'cancelado',
    5.0,
    80.00,
    25,
    '2026-09-22',
    '2026-09-04T13:00:00.000Z',
    []
  );

  // =========================================================================
  // 5. DADOS DA EMPRESA PRESTADORA (Oficina Modelo Completa)
  // =========================================================================
  const empresaDemonstrativa: DadosEmpresa = {
    nome: 'TecSul Soluções Técnicas & Elétrica',
    funcao: 'Assistência Técnica Especializada, Elétrica & Refrigeração',
    documento: '34.892.145/0001-08',
    telefone: '(43) 99123-4567',
    email: 'contato@tecsulsolucoes.com.br',
    endereco: 'Rua Mato Grosso, 320 - Centro',
    cidadeUf: 'Londrina - PR',
    valorHoraPadrao: 80,
    parametrosHora: {
      salarioDesejado: 5000,
      custosFixosMensais: 1200,
      diasPorSemana: 5,
      horasPorDia: 8,
      margemOciosidadePercentual: 20,
    },
  };
  databaseService.salvarDadosEmpresa(empresaDemonstrativa);

  // Registra a nova versão de stress test e a marcação de inicialização
  storage?.setItem('@oficio_facil:seed_versao', SEED_VERSAO_COMPLETA);
  storage?.setItem('@oficio_facil:seed_inicializada', 'true');

  return true;
}

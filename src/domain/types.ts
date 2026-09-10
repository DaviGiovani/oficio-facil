export type StatusOrdem = 'orcamento' | 'aprovado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface Cliente {
  id: string; // UUID v4
  nome: string;
  telefone: string;
  documento?: string; // CPF ou CNPJ (apenas dígitos)
  endereco?: string;
  criadoEm: string; // Formato ISO 8601 UTC
}

export interface ItemServico {
  id: string; // UUID v4
  ordemId: string; // FK
  descricao: string;
  quantidade: number; // Inteiro ou decimal positivo > 0
  valorUnitario: number; // Decimal positivo >= 0
}

export interface ResumoFinanceiro {
  subtotalMateriais: number;
  custoMaoDeObra: number;
  custoTotal: number;
  lucroEsperado: number;
  valorFinal: number;
}

export interface OrdemServico {
  id: string; // UUID v4
  numeroOs: number; // Inteiro sequencial incremental (ex: 1001)
  clienteId: string; // FK
  tituloServico: string;
  descricaoDefeito: string;
  status: StatusOrdem;

  // Parâmetros de Precificação Base
  valorHoraTecnica: number;
  horasEstimadas: number;
  margemLucroPercentual: number; // Ex: 30 representa 30%

  // Consolidação Financeira (Calculada pelo Domínio)
  financeiro: ResumoFinanceiro;

  prazoEntrega: string; // Data ISO (YYYY-MM-DD)
  criadoEm: string;
  atualizadoEm: string;
}

export interface ParametrosHoraTecnica {
  salarioDesejado: number; // Retirada mensal pretendida / Pró-labore (R$)
  custosFixosMensais: number; // Custos mensais operacionais (DAS-MEI, celular, combustível, etc.)
  diasPorSemana: number; // Dias de expediente semanal (ex: 5 ou 6)
  horasPorDia: number; // Horas diárias dedicadas à atividade (ex: 8)
  margemOciosidadePercentual: number; // % do tempo dedicado a orçamentos, deslocamento, compras (ex: 20%)
}

export interface ResultadoHoraTecnica {
  horasMesBrutas: number;
  horasMesProdutivas: number;
  custoTotalMensal: number;
  valorHoraRecomendado: number;
}

export interface DadosEmpresa {
  nome: string; // Nome fantasia ou razão social da empresa/oficina
  funcao: string; // Especialidade / Função técnica prestada (ex: "Manutenção e Reparos Eletroeletrônicos")
  documento?: string; // CNPJ ou CPF do prestador
  telefone: string;
  email?: string;
  endereco?: string;
  cidadeUf?: string;
  valorHoraPadrao?: number; // Valor padrão da hora técnica (R$)
  parametrosHora?: ParametrosHoraTecnica; // Parâmetros detalhados da calculadora
}

export type UnidadeMedida = 'un' | 'm' | 'kg' | 'l' | 'par' | 'pacote' | 'outro';

export interface ServicoCatalogo {
  id: string; // UUID v4
  nome: string;
  descricao?: string;
  horasEstimadas: number;
  valorSugerido: number;
  criadoEm: string;
}

export interface PecaCatalogo {
  id: string; // UUID v4
  nome: string;
  codigo?: string;
  unidade: UnidadeMedida;
  precoCusto: number;
  precoVenda: number;
  criadoEm: string;
}

export interface DatabaseBackup {
  versao: string;
  dataExportacao: string;
  tabelas: {
    clientes: Cliente[];
    ordens: OrdemServico[];
    itens: ItemServico[];
    servicosCatalogo?: ServicoCatalogo[];
    pecasCatalogo?: PecaCatalogo[];
  };
  empresa?: DadosEmpresa;
}


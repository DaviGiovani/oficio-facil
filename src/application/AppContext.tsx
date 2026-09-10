import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Cliente,
  OrdemServico,
  ItemServico,
  StatusOrdem,
  DadosEmpresa,
  ServicoCatalogo,
  PecaCatalogo,
  UnidadeMedida,
} from '../domain/types';
import { PricingEngine } from '../domain/pricing';
import { databaseService, DADOS_EMPRESA_PADRAO } from '../infrastructure/databaseService';

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export type AbaNavegacao = 'kanban' | 'clientes' | 'catalogo' | 'relatorios' | 'empresa' | 'configuracoes';

export interface DialogConfirmacaoConfig {
  titulo: string;
  mensagem: string;
  detalhe?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: 'perigo' | 'aviso' | 'padrao';
  aoConfirmar: () => void;
}

export type Tema = 'light' | 'dark';

export interface NovoClienteInput {
  nome: string;
  telefone: string;
  documento?: string;
  endereco?: string;
}

export interface NovoServicoCatalogoInput {
  nome: string;
  descricao?: string;
  horasEstimadas: number;
  valorSugerido: number;
}

export interface NovaPecaCatalogoInput {
  nome: string;
  codigo?: string;
  unidade: UnidadeMedida;
  precoCusto: number;
  precoVenda: number;
}

export interface NovaOrdemInput {
  clienteId: string;
  tituloServico: string;
  descricaoDefeito: string;
  status: StatusOrdem;
  valorHoraTecnica: number;
  horasEstimadas: number;
  margemLucroPercentual: number;
  prazoEntrega: string;
  itens: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
  }>;
}

interface AppContextData {
  clientes: Cliente[];
  ordens: OrdemServico[];
  itens: ItemServico[];
  filtroTexto: string;
  setFiltroTexto: (texto: string) => void;
  abaAtiva: AbaNavegacao;
  setAbaAtiva: (aba: AbaNavegacao) => void;
  
  // Tema Visual
  tema: Tema;
  alternarTema: () => void;
  
  // Controle de Modais
  isOrdemModalOpen: boolean;
  setIsOrdemModalOpen: (aberto: boolean) => void;
  ordemParaEditar: OrdemServico | null;
  setOrdemParaEditar: (ordem: OrdemServico | null) => void;
  
  isClienteModalOpen: boolean;
  setIsClienteModalOpen: (aberto: boolean) => void;
  clienteParaEditar: Cliente | null;
  setClienteParaEditar: (cliente: Cliente | null) => void;

  ordemSelecionadaParaRecibo: OrdemServico | null;
  setOrdemSelecionadaParaRecibo: (ordem: OrdemServico | null) => void;

  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (aberto: boolean) => void;

  // Diálogo de Confirmação Global do Sistema (Substitui window.confirm)
  dialogConfirmacao: DialogConfirmacaoConfig | null;
  confirmarAcao: (config: DialogConfirmacaoConfig) => void;
  fecharConfirmacao: () => void;

  // Dados da Empresa Prestadora
  dadosEmpresa: DadosEmpresa;
  atualizarDadosEmpresa: (dados: DadosEmpresa) => void;

  // Operações
  criarCliente: (dados: NovoClienteInput) => Cliente;
  atualizarCliente: (id: string, dados: Partial<NovoClienteInput>) => void;
  removerCliente: (id: string) => { success: boolean; error?: string };

  criarOrdem: (dados: NovaOrdemInput) => OrdemServico;
  atualizarOrdem: (id: string, dados: NovaOrdemInput) => void;
  atualizarStatusOrdem: (id: string, novoStatus: StatusOrdem) => void;
  removerOrdem: (id: string) => void;

  // Catálogo
  servicosCatalogo: ServicoCatalogo[];
  pecasCatalogo: PecaCatalogo[];
  isServicoModalOpen: boolean;
  setIsServicoModalOpen: (aberto: boolean) => void;
  servicoParaEditar: ServicoCatalogo | null;
  setServicoParaEditar: (servico: ServicoCatalogo | null) => void;

  isPecaModalOpen: boolean;
  setIsPecaModalOpen: (aberto: boolean) => void;
  pecaParaEditar: PecaCatalogo | null;
  setPecaParaEditar: (peca: PecaCatalogo | null) => void;

  criarServicoCatalogo: (dados: NovoServicoCatalogoInput) => ServicoCatalogo;
  atualizarServicoCatalogo: (id: string, dados: Partial<NovoServicoCatalogoInput>) => void;
  removerServicoCatalogo: (id: string) => void;

  criarPecaCatalogo: (dados: NovaPecaCatalogoInput) => PecaCatalogo;
  atualizarPecaCatalogo: (id: string, dados: Partial<NovaPecaCatalogoInput>) => void;
  removerPecaCatalogo: (id: string) => void;

  recarregarDados: () => void;

  // Métricas
  totalOrdensAtivas: number;
  faturamentoConcluido: number;
  ticketMedio: number;
}

const AppContext = createContext<AppContextData | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [itens, setItens] = useState<ItemServico[]>([]);
  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>('kanban');

  const [isOrdemModalOpen, setIsOrdemModalOpen] = useState(false);
  const [ordemParaEditar, setOrdemParaEditar] = useState<OrdemServico | null>(null);

  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<Cliente | null>(null);

  const [ordemSelecionadaParaRecibo, setOrdemSelecionadaParaRecibo] = useState<OrdemServico | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [dadosEmpresa, setDadosEmpresa] = useState<DadosEmpresa>(DADOS_EMPRESA_PADRAO);

  // Catálogo (Serviços e Peças/Materiais)
  const [servicosCatalogo, setServicosCatalogo] = useState<ServicoCatalogo[]>([]);
  const [pecasCatalogo, setPecasCatalogo] = useState<PecaCatalogo[]>([]);
  const [isServicoModalOpen, setIsServicoModalOpen] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState<ServicoCatalogo | null>(null);
  const [isPecaModalOpen, setIsPecaModalOpen] = useState(false);
  const [pecaParaEditar, setPecaParaEditar] = useState<PecaCatalogo | null>(null);

  // Confirmação Global do Sistema
  const [dialogConfirmacao, setDialogConfirmacao] = useState<DialogConfirmacaoConfig | null>(null);

  const confirmarAcao = (config: DialogConfirmacaoConfig) => {
    setDialogConfirmacao(config);
  };

  const fecharConfirmacao = () => {
    setDialogConfirmacao(null);
  };

  // Gerenciamento de Tema (Dark / Light)
  const [tema, setTema] = useState<Tema>(() => {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
      if (storage) {
        const salvo = storage.getItem('@oficio_facil:tema');
        if (salvo === 'dark' || salvo === 'light') return salvo;
      }
      if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        if (tema === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
      if (storage) {
        storage.setItem('@oficio_facil:tema', tema);
      }
    } catch {
      // fallback
    }
  }, [tema]);

  const alternarTema = () => {
    setTema((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Carrega e sincroniza estados locais
  const recarregarDados = () => {
    setClientes(databaseService.getClientes());
    setOrdens(databaseService.getOrdens());
    setItens(databaseService.getItens());
    setDadosEmpresa(databaseService.getDadosEmpresa());
    setServicosCatalogo(databaseService.getServicosCatalogo());
    setPecasCatalogo(databaseService.getPecasCatalogo());
  };

  const atualizarDadosEmpresa = (novosDados: DadosEmpresa) => {
    databaseService.salvarDadosEmpresa(novosDados);
    setDadosEmpresa(novosDados);
  };

  useEffect(() => {
    recarregarDados();
  }, []);

  // Operações de Clientes
  const criarCliente = (dados: NovoClienteInput): Cliente => {
    const novo: Cliente = {
      id: generateUUID(),
      nome: dados.nome.trim(),
      telefone: dados.telefone.trim(),
      documento: dados.documento?.trim() || undefined,
      endereco: dados.endereco?.trim() || undefined,
      criadoEm: new Date().toISOString(),
    };
    databaseService.salvarCliente(novo);
    recarregarDados();
    return novo;
  };

  const atualizarCliente = (id: string, dados: Partial<NovoClienteInput>) => {
    const atual = databaseService.getClienteById(id);
    if (!atual) return;
    const atualizado: Cliente = {
      ...atual,
      nome: dados.nome !== undefined ? dados.nome.trim() : atual.nome,
      telefone: dados.telefone !== undefined ? dados.telefone.trim() : atual.telefone,
      documento: dados.documento !== undefined ? dados.documento.trim() : atual.documento,
      endereco: dados.endereco !== undefined ? dados.endereco.trim() : atual.endereco,
    };
    databaseService.salvarCliente(atualizado);
    recarregarDados();
  };

  const removerCliente = (id: string): { success: boolean; error?: string } => {
    try {
      databaseService.excluirCliente(id);
      recarregarDados();
      return { success: true };
    } catch (e) {
      const mensagem = e instanceof Error ? e.message : 'Falha ao remover cliente.';
      return { success: false, error: mensagem };
    }
  };

  // Operações de Ordens
  const criarOrdem = (dados: NovaOrdemInput): OrdemServico => {
    const ordemId = generateUUID();
    const numeroOs = databaseService.getProximoNumeroOs();
    const agora = new Date().toISOString();

    const itensMapeados: ItemServico[] = dados.itens.map((item) => ({
      id: generateUUID(),
      ordemId,
      descricao: item.descricao.trim(),
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
    }));

    const financeiro = PricingEngine.calcularPrecoFinal(
      itensMapeados,
      dados.horasEstimadas,
      dados.valorHoraTecnica,
      dados.margemLucroPercentual
    );

    const novaOrdem: OrdemServico = {
      id: ordemId,
      numeroOs,
      clienteId: dados.clienteId,
      tituloServico: dados.tituloServico.trim(),
      descricaoDefeito: dados.descricaoDefeito.trim(),
      status: dados.status,
      valorHoraTecnica: dados.valorHoraTecnica,
      horasEstimadas: dados.horasEstimadas,
      margemLucroPercentual: dados.margemLucroPercentual,
      financeiro,
      prazoEntrega: dados.prazoEntrega,
      criadoEm: agora,
      atualizadoEm: agora,
    };

    databaseService.salvarOrdem(novaOrdem, itensMapeados);
    recarregarDados();
    return novaOrdem;
  };

  const atualizarOrdem = (id: string, dados: NovaOrdemInput) => {
    const ordemExistente = databaseService.getOrdemById(id);
    if (!ordemExistente) return;

    const itensMapeados: ItemServico[] = dados.itens.map((item) => ({
      id: generateUUID(),
      ordemId: id,
      descricao: item.descricao.trim(),
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
    }));

    const financeiro = PricingEngine.calcularPrecoFinal(
      itensMapeados,
      dados.horasEstimadas,
      dados.valorHoraTecnica,
      dados.margemLucroPercentual
    );

    const ordemAtualizada: OrdemServico = {
      ...ordemExistente,
      clienteId: dados.clienteId,
      tituloServico: dados.tituloServico.trim(),
      descricaoDefeito: dados.descricaoDefeito.trim(),
      status: dados.status,
      valorHoraTecnica: dados.valorHoraTecnica,
      horasEstimadas: dados.horasEstimadas,
      margemLucroPercentual: dados.margemLucroPercentual,
      financeiro,
      prazoEntrega: dados.prazoEntrega,
      atualizadoEm: new Date().toISOString(),
    };

    databaseService.salvarOrdem(ordemAtualizada, itensMapeados);
    recarregarDados();
  };

  const atualizarStatusOrdem = (id: string, novoStatus: StatusOrdem) => {
    databaseService.atualizarStatusOrdem(id, novoStatus);
    recarregarDados();
  };

  const removerOrdem = (id: string) => {
    databaseService.excluirOrdem(id);
    recarregarDados();
  };

  // Operações de Catálogo (Serviços e Peças)
  const criarServicoCatalogo = (dados: NovoServicoCatalogoInput): ServicoCatalogo => {
    const novo: ServicoCatalogo = {
      id: generateUUID(),
      nome: dados.nome.trim(),
      descricao: dados.descricao?.trim() || undefined,
      horasEstimadas: Math.max(0, Number(dados.horasEstimadas) || 0),
      valorSugerido: Math.max(0, Number(dados.valorSugerido) || 0),
      criadoEm: new Date().toISOString(),
    };
    databaseService.salvarServicoCatalogo(novo);
    recarregarDados();
    return novo;
  };

  const atualizarServicoCatalogo = (id: string, dados: Partial<NovoServicoCatalogoInput>) => {
    const atual = databaseService.getServicoCatalogoById(id);
    if (!atual) return;
    const atualizado: ServicoCatalogo = {
      ...atual,
      nome: dados.nome !== undefined ? dados.nome.trim() : atual.nome,
      descricao: dados.descricao !== undefined ? dados.descricao.trim() || undefined : atual.descricao,
      horasEstimadas: dados.horasEstimadas !== undefined ? Math.max(0, Number(dados.horasEstimadas) || 0) : atual.horasEstimadas,
      valorSugerido: dados.valorSugerido !== undefined ? Math.max(0, Number(dados.valorSugerido) || 0) : atual.valorSugerido,
    };
    databaseService.salvarServicoCatalogo(atualizado);
    recarregarDados();
  };

  const removerServicoCatalogo = (id: string) => {
    databaseService.excluirServicoCatalogo(id);
    recarregarDados();
  };

  const criarPecaCatalogo = (dados: NovaPecaCatalogoInput): PecaCatalogo => {
    const nova: PecaCatalogo = {
      id: generateUUID(),
      nome: dados.nome.trim(),
      codigo: dados.codigo?.trim() || undefined,
      unidade: dados.unidade || 'un',
      precoCusto: Math.max(0, Number(dados.precoCusto) || 0),
      precoVenda: Math.max(0, Number(dados.precoVenda) || 0),
      criadoEm: new Date().toISOString(),
    };
    databaseService.salvarPecaCatalogo(nova);
    recarregarDados();
    return nova;
  };

  const atualizarPecaCatalogo = (id: string, dados: Partial<NovaPecaCatalogoInput>) => {
    const atual = databaseService.getPecaCatalogoById(id);
    if (!atual) return;
    const atualizada: PecaCatalogo = {
      ...atual,
      nome: dados.nome !== undefined ? dados.nome.trim() : atual.nome,
      codigo: dados.codigo !== undefined ? dados.codigo.trim() || undefined : atual.codigo,
      unidade: dados.unidade !== undefined ? dados.unidade : atual.unidade,
      precoCusto: dados.precoCusto !== undefined ? Math.max(0, Number(dados.precoCusto) || 0) : atual.precoCusto,
      precoVenda: dados.precoVenda !== undefined ? Math.max(0, Number(dados.precoVenda) || 0) : atual.precoVenda,
    };
    databaseService.salvarPecaCatalogo(atualizada);
    recarregarDados();
  };

  const removerPecaCatalogo = (id: string) => {
    databaseService.excluirPecaCatalogo(id);
    recarregarDados();
  };

  // Métricas Consolidadas
  const totalOrdensAtivas = useMemo(() => {
    return ordens.filter((o) =>
      ['orcamento', 'aprovado', 'em_andamento'].includes(o.status)
    ).length;
  }, [ordens]);

  const faturamentoConcluido = useMemo(() => {
    return ordens
      .filter((o) => o.status === 'concluido')
      .reduce((acc, o) => acc + o.financeiro.valorFinal, 0);
  }, [ordens]);

  const ticketMedio = useMemo(() => {
    const concluidas = ordens.filter((o) => o.status === 'concluido');
    if (concluidas.length === 0) return 0;
    return faturamentoConcluido / concluidas.length;
  }, [ordens, faturamentoConcluido]);

  return (
    <AppContext.Provider
      value={{
        clientes,
        ordens,
        itens,
        filtroTexto,
        setFiltroTexto,
        abaAtiva,
        setAbaAtiva,
        tema,
        alternarTema,
        isOrdemModalOpen,
        setIsOrdemModalOpen,
        ordemParaEditar,
        setOrdemParaEditar,
        isClienteModalOpen,
        setIsClienteModalOpen,
        clienteParaEditar,
        setClienteParaEditar,
        ordemSelecionadaParaRecibo,
        setOrdemSelecionadaParaRecibo,
        isBackupModalOpen,
        setIsBackupModalOpen,
        dialogConfirmacao,
        confirmarAcao,
        fecharConfirmacao,
        dadosEmpresa,
        atualizarDadosEmpresa,
        criarCliente,
        atualizarCliente,
        removerCliente,
        criarOrdem,
        atualizarOrdem,
        atualizarStatusOrdem,
        removerOrdem,
        servicosCatalogo,
        pecasCatalogo,
        isServicoModalOpen,
        setIsServicoModalOpen,
        servicoParaEditar,
        setServicoParaEditar,
        isPecaModalOpen,
        setIsPecaModalOpen,
        pecaParaEditar,
        setPecaParaEditar,
        criarServicoCatalogo,
        atualizarServicoCatalogo,
        removerServicoCatalogo,
        criarPecaCatalogo,
        atualizarPecaCatalogo,
        removerPecaCatalogo,
        recarregarDados,
        totalOrdensAtivas,
        faturamentoConcluido,
        ticketMedio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextData => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};

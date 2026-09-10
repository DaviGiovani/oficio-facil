import { Cliente, OrdemServico, ItemServico, StatusOrdem, DadosEmpresa, ServicoCatalogo, PecaCatalogo } from '../domain/types';
import { LocalStorageRepository } from './LocalStorageRepository';

export const DADOS_EMPRESA_PADRAO: DadosEmpresa = {
  nome: 'Minha Empresa de Serviços',
  funcao: 'Manutenção Técnica e Serviços Especializados',
  documento: '',
  telefone: '',
  email: '',
  endereco: '',
  cidadeUf: '',
  valorHoraPadrao: 65,
  parametrosHora: {
    salarioDesejado: 3500,
    custosFixosMensais: 600,
    diasPorSemana: 5,
    horasPorDia: 8,
    margemOciosidadePercentual: 20,
  },
};

export class DatabaseService {
  private clientesRepo = new LocalStorageRepository<Cliente>('clientes');
  private ordensRepo = new LocalStorageRepository<OrdemServico>('ordens');
  private itensRepo = new LocalStorageRepository<ItemServico>('itens');
  private servicosCatalogoRepo = new LocalStorageRepository<ServicoCatalogo>('catalogo_servicos');
  private pecasCatalogoRepo = new LocalStorageRepository<PecaCatalogo>('catalogo_pecas');
  private readonly empresaKey = '@oficio_facil:empresa';

  // --- Dados da Empresa / Prestador ---
  public getDadosEmpresa(): DadosEmpresa {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
      if (!storage) return DADOS_EMPRESA_PADRAO;

      const data = storage.getItem(this.empresaKey);
      return data ? (JSON.parse(data) as DadosEmpresa) : DADOS_EMPRESA_PADRAO;
    } catch {
      return DADOS_EMPRESA_PADRAO;
    }
  }

  public salvarDadosEmpresa(dados: DadosEmpresa): void {
    const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
    if (!storage) {
      throw new Error('Mecanismo de armazenamento LocalStorage não disponível.');
    }
    storage.setItem(this.empresaKey, JSON.stringify(dados));
  }

  // --- Clientes ---
  public getClientes(): Cliente[] {
    return this.clientesRepo.getAll();
  }

  public getClienteById(id: string): Cliente | undefined {
    return this.clientesRepo.getById(id);
  }

  public salvarCliente(cliente: Cliente): void {
    const existente = this.clientesRepo.getById(cliente.id);
    if (existente) {
      this.clientesRepo.update(cliente.id, cliente);
    } else {
      this.clientesRepo.insert(cliente);
    }
  }

  public excluirCliente(id: string): void {
    const ordensVinculadas = this.ordensRepo.getAll().filter((o) => o.clienteId === id);
    if (ordensVinculadas.length > 0) {
      throw new Error(
        `Não é possível excluir o cliente pois existem ${ordensVinculadas.length} ordem(ns) de serviço vinculada(s) a ele.`
      );
    }
    this.clientesRepo.delete(id);
  }

  // --- Ordens de Serviço ---
  public getOrdens(): OrdemServico[] {
    return this.ordensRepo.getAll();
  }

  public getOrdemById(id: string): OrdemServico | undefined {
    return this.ordensRepo.getById(id);
  }

  public getProximoNumeroOs(): number {
    const ordens = this.ordensRepo.getAll();
    if (ordens.length === 0) {
      return 1001;
    }
    const numeros = ordens.map((o) => o.numeroOs || 0);
    return Math.max(...numeros) + 1;
  }

  public salvarOrdem(ordem: OrdemServico, itens?: ItemServico[]): void {
    const existente = this.ordensRepo.getById(ordem.id);
    if (existente) {
      this.ordensRepo.update(ordem.id, ordem);
    } else {
      this.ordensRepo.insert(ordem);
    }

    if (itens) {
      // Sincroniza itens da ordem: remove os antigos e insere os atualizados
      const todosItens = this.itensRepo.getAll();
      const outrosItens = todosItens.filter((item) => item.ordemId !== ordem.id);

      // Re-salva os itens das outras ordens + novos itens desta ordem
      this.itensRepo.clear();
      [...outrosItens, ...itens].forEach((item) => {
        this.itensRepo.insert(item);
      });
    }
  }

  public atualizarStatusOrdem(id: string, status: StatusOrdem): void {
    const ordem = this.ordensRepo.getById(id);
    if (!ordem) {
      throw new Error(`Ordem de serviço ${id} não encontrada.`);
    }
    this.ordensRepo.update(id, {
      status,
      atualizadoEm: new Date().toISOString(),
    });
  }

  public excluirOrdem(id: string): void {
    // Exclusão em cascata: remove todos os itens atrelados à ordem
    const todosItens = this.itensRepo.getAll();
    const itensRestantes = todosItens.filter((item) => item.ordemId !== id);

    this.itensRepo.clear();
    itensRestantes.forEach((item) => this.itensRepo.insert(item));

    this.ordensRepo.delete(id);
  }

  // --- Itens de Serviço ---
  public getItens(): ItemServico[] {
    return this.itensRepo.getAll();
  }

  public getItensByOrdemId(ordemId: string): ItemServico[] {
    return this.itensRepo.getAll().filter((item) => item.ordemId === ordemId);
  }

  public salvarItem(item: ItemServico): void {
    const existente = this.itensRepo.getById(item.id);
    if (existente) {
      this.itensRepo.update(item.id, item);
    } else {
      this.itensRepo.insert(item);
    }
  }

  public excluirItem(id: string): void {
    this.itensRepo.delete(id);
  }

  // --- Catálogo: Serviços ---
  public getServicosCatalogo(): ServicoCatalogo[] {
    return this.servicosCatalogoRepo.getAll();
  }

  public getServicoCatalogoById(id: string): ServicoCatalogo | undefined {
    return this.servicosCatalogoRepo.getById(id);
  }

  public salvarServicoCatalogo(servico: ServicoCatalogo): void {
    const existente = this.servicosCatalogoRepo.getById(servico.id);
    if (existente) {
      this.servicosCatalogoRepo.update(servico.id, servico);
    } else {
      this.servicosCatalogoRepo.insert(servico);
    }
  }

  public excluirServicoCatalogo(id: string): void {
    this.servicosCatalogoRepo.delete(id);
  }

  // --- Catálogo: Peças e Materiais ---
  public getPecasCatalogo(): PecaCatalogo[] {
    return this.pecasCatalogoRepo.getAll();
  }

  public getPecaCatalogoById(id: string): PecaCatalogo | undefined {
    return this.pecasCatalogoRepo.getById(id);
  }

  public salvarPecaCatalogo(peca: PecaCatalogo): void {
    const existente = this.pecasCatalogoRepo.getById(peca.id);
    if (existente) {
      this.pecasCatalogoRepo.update(peca.id, peca);
    } else {
      this.pecasCatalogoRepo.insert(peca);
    }
  }

  public excluirPecaCatalogo(id: string): void {
    this.pecasCatalogoRepo.delete(id);
  }

  // --- Reset da base ---
  public limparBanco(): void {
    this.clientesRepo.clear();
    this.ordensRepo.clear();
    this.itensRepo.clear();
    this.servicosCatalogoRepo.clear();
    this.pecasCatalogoRepo.clear();
    const storage = typeof window !== 'undefined' ? window.localStorage : globalThis.localStorage;
    if (storage) {
      storage.removeItem(this.empresaKey);
      // Garante que o banco permaneça 100% limpo e não re-injete os dados de demonstração
      storage.setItem('@oficio_facil:seed_inicializada', 'true');
    }
  }
}

export const databaseService = new DatabaseService();

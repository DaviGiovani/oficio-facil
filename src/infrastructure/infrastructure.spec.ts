import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageRepository } from './LocalStorageRepository';
import { databaseService } from './databaseService';
import { inicializarDadosDemonstrativos } from './seed';
import { backupService } from './backupService';
import { Cliente, OrdemServico, ItemServico } from '../domain/types';

// Mock de Storage para execução consistente em ambiente Vitest / Node
class MockStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

// Injeta o mock caso não haja localStorage nativo
if (typeof globalThis.localStorage === 'undefined' || !globalThis.localStorage.setItem) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MockStorage(),
    writable: true,
  });
}

describe('Camada de Infraestrutura e Persistência Local', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('LocalStorageRepository', () => {
    it('deve inserir, buscar por id, listar todos e excluir itens', () => {
      interface TestItem {
        id: string;
        titulo: string;
      }
      const repo = new LocalStorageRepository<TestItem>('testes');
      expect(repo.getAll()).toEqual([]);

      const item1: TestItem = { id: 't1', titulo: 'Primeiro' };
      const item2: TestItem = { id: 't2', titulo: 'Segundo' };

      repo.insert(item1);
      repo.insert(item2);

      expect(repo.getAll()).toHaveLength(2);
      expect(repo.getById('t1')).toEqual(item1);
      expect(repo.getById('t999')).toBeUndefined();

      repo.update('t1', { titulo: 'Atualizado' });
      expect(repo.getById('t1')?.titulo).toBe('Atualizado');

      repo.delete('t1');
      expect(repo.getAll()).toHaveLength(1);
      expect(repo.getById('t1')).toBeUndefined();

      repo.clear();
      expect(repo.getAll()).toHaveLength(0);
    });
  });

  describe('DatabaseService - Integridade Referencial e Cascatas', () => {
    it('deve gerar o próximo número de OS sequencial a partir de 1001', () => {
      expect(databaseService.getProximoNumeroOs()).toBe(1001);

      const ordemSimples: OrdemServico = {
        id: 'ordem-1',
        numeroOs: 1001,
        clienteId: 'c1',
        tituloServico: 'Teste',
        descricaoDefeito: 'Defeito',
        status: 'orcamento',
        valorHoraTecnica: 50,
        horasEstimadas: 1,
        margemLucroPercentual: 20,
        financeiro: {
          subtotalMateriais: 0,
          custoMaoDeObra: 50,
          custoTotal: 50,
          lucroEsperado: 10,
          valorFinal: 60,
        },
        prazoEntrega: '2026-03-10',
        criadoEm: '2026-03-01T00:00:00Z',
        atualizadoEm: '2026-03-01T00:00:00Z',
      };

      databaseService.salvarOrdem(ordemSimples);
      expect(databaseService.getProximoNumeroOs()).toBe(1002);
    });

    it('deve permitir excluir cliente quando não houver ordens vinculadas', () => {
      const cliente: Cliente = {
        id: 'cli-sem-ordem',
        nome: 'João Sem Ordem',
        telefone: '(43) 91111-2222',
        criadoEm: new Date().toISOString(),
      };

      databaseService.salvarCliente(cliente);
      expect(databaseService.getClientes()).toHaveLength(1);

      databaseService.excluirCliente('cli-sem-ordem');
      expect(databaseService.getClientes()).toHaveLength(0);
    });

    it('deve BLOQUEAR a exclusão de cliente com ordens vinculadas e disparar erro de integridade', () => {
      const cliente: Cliente = {
        id: 'cli-com-ordem',
        nome: 'Ana Com Ordem',
        telefone: '(43) 93333-4444',
        criadoEm: new Date().toISOString(),
      };
      databaseService.salvarCliente(cliente);

      const ordem: OrdemServico = {
        id: 'ordem-vinculada',
        numeroOs: 1001,
        clienteId: 'cli-com-ordem',
        tituloServico: 'Manutenção',
        descricaoDefeito: 'Problema',
        status: 'orcamento',
        valorHoraTecnica: 60,
        horasEstimadas: 2,
        margemLucroPercentual: 20,
        financeiro: {
          subtotalMateriais: 0,
          custoMaoDeObra: 120,
          custoTotal: 120,
          lucroEsperado: 24,
          valorFinal: 144,
        },
        prazoEntrega: '2026-03-15',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      databaseService.salvarOrdem(ordem);

      expect(() => {
        databaseService.excluirCliente('cli-com-ordem');
      }).toThrow(/Não é possível excluir o cliente pois existem/);

      // Garante que o cliente permanece intacto
      expect(databaseService.getClienteById('cli-com-ordem')).toBeDefined();
    });

    it('deve excluir ordem e remover em cascata todos os itens atrelados a ela', () => {
      const ordem: OrdemServico = {
        id: 'ordem-cascata',
        numeroOs: 1001,
        clienteId: 'c1',
        tituloServico: 'Serviço com Peças',
        descricaoDefeito: 'Vários itens',
        status: 'aprovado',
        valorHoraTecnica: 50,
        horasEstimadas: 2,
        margemLucroPercentual: 10,
        financeiro: {
          subtotalMateriais: 80,
          custoMaoDeObra: 100,
          custoTotal: 180,
          lucroEsperado: 18,
          valorFinal: 198,
        },
        prazoEntrega: '2026-03-15',
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };

      const itens: ItemServico[] = [
        { id: 'it-1', ordemId: 'ordem-cascata', descricao: 'Peça A', quantidade: 2, valorUnitario: 20 },
        { id: 'it-2', ordemId: 'ordem-cascata', descricao: 'Peça B', quantidade: 1, valorUnitario: 40 },
      ];

      databaseService.salvarOrdem(ordem, itens);

      expect(databaseService.getOrdens()).toHaveLength(1);
      expect(databaseService.getItensByOrdemId('ordem-cascata')).toHaveLength(2);
      expect(databaseService.getItens()).toHaveLength(2);

      // Exclusão da ordem
      databaseService.excluirOrdem('ordem-cascata');

      expect(databaseService.getOrdens()).toHaveLength(0);
      expect(databaseService.getItensByOrdemId('ordem-cascata')).toHaveLength(0);
      expect(databaseService.getItens()).toHaveLength(0);
    });

    it('deve atualizar o status da ordem e registrar o novo timestamp de atualização', () => {
      const ordem: OrdemServico = {
        id: 'ordem-status',
        numeroOs: 1001,
        clienteId: 'c1',
        tituloServico: 'Troca de Estado',
        descricaoDefeito: 'Teste status',
        status: 'orcamento',
        valorHoraTecnica: 50,
        horasEstimadas: 1,
        margemLucroPercentual: 10,
        financeiro: {
          subtotalMateriais: 0,
          custoMaoDeObra: 50,
          custoTotal: 50,
          lucroEsperado: 5,
          valorFinal: 55,
        },
        prazoEntrega: '2026-03-10',
        criadoEm: '2026-03-01T00:00:00Z',
        atualizadoEm: '2026-03-01T00:00:00Z',
      };

      databaseService.salvarOrdem(ordem);
      databaseService.atualizarStatusOrdem('ordem-status', 'aprovado');

      const atualizada = databaseService.getOrdemById('ordem-status');
      expect(atualizada?.status).toBe('aprovado');
      expect(atualizada?.atualizadoEm).not.toBe('2026-03-01T00:00:00Z');
    });
  });

  describe('Seed Data e Demonstração Acadêmica', () => {
    it('deve preencher a base de dados quando estiver vazia', () => {
      const inicializou = inicializarDadosDemonstrativos();
      expect(inicializou).toBe(true);

      const clientes = databaseService.getClientes();
      const ordens = databaseService.getOrdens();
      const itens = databaseService.getItens();

      expect(clientes).toHaveLength(3);
      expect(ordens).toHaveLength(5);
      expect(itens.length).toBeGreaterThanOrEqual(4);

      // Verifica se todos os 5 status estão presentes
      const statusPresentes = ordens.map((o) => o.status);
      expect(statusPresentes).toContain('orcamento');
      expect(statusPresentes).toContain('aprovado');
      expect(statusPresentes).toContain('em_andamento');
      expect(statusPresentes).toContain('concluido');
      expect(statusPresentes).toContain('cancelado');
    });

    it('não deve reinicializar se a base já contiver dados', () => {
      inicializarDadosDemonstrativos();
      const reexecutou = inicializarDadosDemonstrativos();
      expect(reexecutou).toBe(false);
      expect(databaseService.getClientes()).toHaveLength(3);
    });
  });

  describe('BackupService - Exportação e Importação', () => {
    it('deve exportar e restaurar a base completa mantendo integridade', () => {
      inicializarDadosDemonstrativos();

      const backup = backupService.exportarBackupCompleto();
      expect(backup.tabelas.clientes).toHaveLength(3);
      expect(backup.tabelas.ordens).toHaveLength(5);

      // Limpa a base
      databaseService.limparBanco();
      expect(databaseService.getClientes()).toHaveLength(0);
      expect(databaseService.getOrdens()).toHaveLength(0);

      // Restaura o backup
      const sucesso = backupService.importarBackup(JSON.stringify(backup));
      expect(sucesso).toBe(true);
      expect(databaseService.getClientes()).toHaveLength(3);
      expect(databaseService.getOrdens()).toHaveLength(5);
      expect(databaseService.getItens().length).toBeGreaterThanOrEqual(4);
    });

    it('deve rejeitar e lançar erro para arquivos de backup corrompidos ou malformatados', () => {
      expect(() => {
        backupService.importarBackup('arquivo-invalido-nao-json');
      }).toThrow(/Erro na importação/);

      expect(() => {
        backupService.importarBackup(JSON.stringify({ chaveErrada: 123 }));
      }).toThrow(/seção de tabelas não encontrada/);
    });
  });

  describe('Dados da Empresa / Prestador', () => {
    it('deve salvar e carregar dados cadastrais da empresa', () => {
      const dados = {
        nome: 'Oficina do Zé Elétrica',
        funcao: 'Eletricista Residencial e Predial',
        documento: '11.222.333/0001-44',
        telefone: '(43) 98888-7777',
        email: 'ze@eletrica.com',
        endereco: 'Rua das Flores, 100',
        cidadeUf: 'Londrina - PR',
      };

      databaseService.salvarDadosEmpresa(dados);
      const recuperado = databaseService.getDadosEmpresa();

      expect(recuperado.nome).toBe('Oficina do Zé Elétrica');
      expect(recuperado.funcao).toBe('Eletricista Residencial e Predial');
      expect(recuperado.documento).toBe('11.222.333/0001-44');
    });

    it('deve exportar e restaurar dados da empresa através do BackupService', () => {
      const dados = {
        nome: 'Alfa Refrigeração',
        funcao: 'Manutenção de Ar-Condicionado e Câmaras Frias',
        documento: '55.666.777/0001-88',
        telefone: '(43) 3300-1122',
        email: 'contato@alfarefrig.com',
        endereco: 'Av. Tiradentes, 500',
        cidadeUf: 'Londrina - PR',
      };
      databaseService.salvarDadosEmpresa(dados);

      const backup = backupService.exportarBackupCompleto();
      expect(backup.empresa?.nome).toBe('Alfa Refrigeração');

      databaseService.limparBanco();
      expect(databaseService.getDadosEmpresa().nome).not.toBe('Alfa Refrigeração');

      backupService.importarBackup(JSON.stringify(backup));
      expect(databaseService.getDadosEmpresa().nome).toBe('Alfa Refrigeração');
      expect(databaseService.getDadosEmpresa().funcao).toBe('Manutenção de Ar-Condicionado e Câmaras Frias');
    });
  });
});

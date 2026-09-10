import { DatabaseBackup } from '../domain/types';
import { databaseService } from './databaseService';

export class BackupService {
  /**
   * Exporta a base completa como objeto DatabaseBackup estruturado e aciona
   * o download local do arquivo .json no navegador (caso em ambiente DOM).
   */
  public exportarBackupCompleto(): DatabaseBackup {
    const backup: DatabaseBackup = {
      versao: '1.0.0',
      dataExportacao: new Date().toISOString(),
      tabelas: {
        clientes: databaseService.getClientes(),
        ordens: databaseService.getOrdens(),
        itens: databaseService.getItens(),
        servicosCatalogo: databaseService.getServicosCatalogo(),
        pecasCatalogo: databaseService.getPecasCatalogo(),
      },
      empresa: databaseService.getDadosEmpresa(),
    };

    const jsonString = JSON.stringify(backup, null, 2);

    // Dispara o download automático se estiver no navegador
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const now = new Date();
      const ano = now.getFullYear();
      const mes = String(now.getMonth() + 1).padStart(2, '0');
      const dia = String(now.getDate()).padStart(2, '0');
      const hora = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const nomeArquivo = `backup_oficiofacil_${ano}${mes}${dia}_${hora}${min}.json`;

      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return backup;
  }

  /**
   * Valida e restaura os dados a partir de uma string JSON de backup.
   */
  public importarBackup(jsonString: string): boolean {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        throw new Error('Conteúdo do arquivo de backup vazio ou inválido.');
      }

      const backup = JSON.parse(jsonString) as DatabaseBackup;

      if (!backup || typeof backup !== 'object' || !backup.tabelas) {
        throw new Error('Formato do arquivo de backup inválido: seção de tabelas não encontrada.');
      }

      const { clientes, ordens, itens, servicosCatalogo, pecasCatalogo } = backup.tabelas;

      if (!Array.isArray(clientes) || !Array.isArray(ordens) || !Array.isArray(itens)) {
        throw new Error('Formato corrompido: listas de clientes, ordens ou itens inválidas.');
      }

      // Restauração com segurança
      databaseService.limparBanco();

      for (const cliente of clientes) {
        databaseService.salvarCliente(cliente);
      }

      for (const ordem of ordens) {
        // Encontra os itens da ordem
        const itensDaOrdem = itens.filter((i) => i.ordemId === ordem.id);
        databaseService.salvarOrdem(ordem, itensDaOrdem);
      }

      if (Array.isArray(servicosCatalogo)) {
        for (const servico of servicosCatalogo) {
          databaseService.salvarServicoCatalogo(servico);
        }
      }

      if (Array.isArray(pecasCatalogo)) {
        for (const peca of pecasCatalogo) {
          databaseService.salvarPecaCatalogo(peca);
        }
      }

      if (backup.empresa) {
        databaseService.salvarDadosEmpresa(backup.empresa);
      }

      return true;
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Falha ao restaurar o backup.';
      throw new Error(`Erro na importação: ${mensagem}`);
    }
  }
}

export const backupService = new BackupService();

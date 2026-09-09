import React, { useState, useRef } from 'react';
import { useApp } from '../../../application/AppContext';
import { backupService } from '../../../infrastructure/backupService';
import { databaseService } from '../../../infrastructure/databaseService';
import {
  X,
  Database,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  HardDrive,
  Trash2,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export const BackupModal: React.FC = () => {
  const {
    isBackupModalOpen,
    setIsBackupModalOpen,
    recarregarDados,
    clientes,
    ordens,
    itens,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  if (!isBackupModalOpen) return null;

  const handleFechar = () => {
    setIsBackupModalOpen(false);
    setMensagemSucesso(null);
    setMensagemErro(null);
  };

  const handleExportar = () => {
    try {
      backupService.exportarBackupCompleto();
      setMensagemSucesso('Arquivo de backup (.json) exportado com sucesso para o seu dispositivo.');
      setMensagemErro(null);
    } catch {
      setMensagemErro('Falha ao gerar o arquivo de backup local.');
      setMensagemSucesso(null);
    }
  };

  const handleImportarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const conteudo = event.target?.result as string;
        backupService.importarBackup(conteudo);
        recarregarDados();
        setMensagemSucesso('Base de dados restaurada com sucesso!');
        setMensagemErro(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Falha ao restaurar dados.';
        setMensagemErro(msg);
        setMensagemSucesso(null);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleRestaurarPadrao = () => {
    try {
      databaseService.limparBanco();
      recarregarDados();
      setIsConfirmModalOpen(false);
      setMensagemSucesso(
        'Todos os dados foram excluídos e o sistema foi restaurado para o padrão limpo com sucesso!'
      );
      setMensagemErro(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao restaurar dados padrão.';
      setMensagemErro(msg);
      setMensagemSucesso(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 my-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">Backup e dados</h2>
          </div>
          <button
            type="button"
            onClick={handleFechar}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 space-y-5">
          {mensagemSucesso && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{mensagemSucesso}</span>
            </div>
          )}

          {mensagemErro && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{mensagemErro}</span>
            </div>
          )}

          {/* Resumo do Banco Local */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold">Estado do Armazenamento:</span>
            </div>
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              {clientes.length} clientes • {ordens.length} ordens • {itens.length} peças
            </span>
          </div>

          {/* Opção 1: Exportar */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Exportar Cópia Completa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Baixe um arquivo JSON contendo todas as ordens, clientes e materiais.
            </p>
            <button
              type="button"
              onClick={handleExportar}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar Arquivo de Backup (.json)
            </button>
          </div>

          {/* Opção 2: Importar */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Restaurar a partir de Arquivo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Carregue um arquivo JSON gerado anteriormente pelo sistema.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportarArquivo}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-lg transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Selecionar Arquivo .json
            </button>
          </div>

          {/* Restaurar Dados para o Padrão do Sistema */}
          <div className="p-4 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Restaurar dados para o padrão do sistema
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Exclui todos os registros cadastrados (clientes, ordens e peças) e restaura as configurações iniciais, deixando o sistema completamente limpo.
            </p>
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900/60 rounded-lg transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Restaurar Padrão do Sistema
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleFechar}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal de Confirmação do Sistema (Janela Nativa Customizada) */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Topo com Ícone de Alerta */}
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto ring-6 ring-amber-100/60 dark:ring-amber-950/30">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Restaurar dados para o padrão do sistema
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Confirme a exclusão de todos os registros armazenados no seu dispositivo.
                </p>
              </div>

              {/* Box explicativo */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3.5 text-left text-xs space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  Ao confirmar esta ação:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300 text-[11.5px] pl-1">
                  <li>
                    Todas as <strong>ordens ({ordens.length})</strong>, <strong>clientes ({clientes.length})</strong> e <strong>peças ({itens.length})</strong> serão apagados do sistema.
                  </li>
                  <li>
                    Os dados da sua empresa e o cálculo do valor/hora retornarão aos valores iniciais.
                  </li>
                  <li>
                    O sistema ficará 100% limpo, sem ordens de demonstração, pronto para o seu uso real.
                  </li>
                  <li>
                    Caso queira guardar suas informações atuais, você pode cancelar e baixar uma cópia em <strong>Exportar Cópia Completa</strong>.
                  </li>
                </ul>
              </div>
            </div>

            {/* Rodapé com Ações */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRestaurarPadrao}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Confirmar e Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

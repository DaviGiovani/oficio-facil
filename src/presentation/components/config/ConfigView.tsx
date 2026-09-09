import React, { useState, useRef } from 'react';
import { useApp } from '../../../application/AppContext';
import { backupService } from '../../../infrastructure/backupService';
import { databaseService } from '../../../infrastructure/databaseService';
import {
  Database,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Trash2,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export const ConfigView: React.FC = () => {
  const { recarregarDados, ordens, clientes, itens } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleExportar = () => {
    try {
      backupService.exportarBackupCompleto();
      setSucessoMsg('Arquivo de backup (.json) exportado com sucesso para o seu dispositivo.');
      setErroMsg(null);
    } catch {
      setErroMsg('Erro ao gerar exportação do banco de dados local.');
      setSucessoMsg(null);
    }
  };

  const handleArquivoSelecionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const conteudo = event.target?.result as string;
        backupService.importarBackup(conteudo);
        recarregarDados();
        setSucessoMsg('Base de dados restaurada com sucesso a partir do arquivo selecionado.');
        setErroMsg(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Falha ao restaurar dados.';
        setErroMsg(msg);
        setSucessoMsg(null);
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
      setSucessoMsg(
        'Todos os dados foram excluídos e o sistema foi restaurado para o padrão limpo com sucesso!'
      );
      setErroMsg(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao restaurar dados padrão.';
      setErroMsg(msg);
      setSucessoMsg(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 md:pb-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Backup e dados
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Exportação, restauração de cópias de segurança e gerenciamento da base local.
        </p>
      </div>

      {sucessoMsg && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {erroMsg && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
          <span>{erroMsg}</span>
        </div>
      )}

      {/* Estatísticas de Armazenamento */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clientes Cadastrados</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{clientes.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ordens de Serviço</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{ordens.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Itens e Peças</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{itens.length}</p>
        </div>
      </div>

      {/* Ações de Backup */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Exportar Cópia de Segurança (.json)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Faça o download de todas as ordens, clientes e materiais em um único arquivo padronizado.
            </p>
            <button
              type="button"
              onClick={handleExportar}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar Base Completa
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Restaurar Dados a Partir de Backup</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Selecione um arquivo de backup previamente exportado para recuperar todas as informações.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleArquivoSelecionado}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 rounded-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              Selecionar Arquivo .json
            </button>
          </div>
        </div>
      </div>

      {/* Restaurar Dados para o Padrão do Sistema */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Restaurar dados para o padrão do sistema
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Exclui todos os registros cadastrados (clientes, ordens de serviço e peças) e restaura as configurações iniciais, deixando o sistema completamente limpo para novos trabalhos.
            </p>
            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="mt-3.5 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-600 border border-rose-200 dark:border-rose-900/60 rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Restaurar Padrão do Sistema
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação do Sistema (Janela Nativa Customizada) */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
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
                    Caso deseje salvar suas informações atuais, você pode cancelar e baixar uma cópia em <strong>Exportar Cópia de Segurança</strong>.
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


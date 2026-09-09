import React, { useState, useEffect } from 'react';
import { useApp } from '../../../application/AppContext';
import { aplicarMascaraTelefone, aplicarMascaraDocumento } from '../../utils/formatters';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

export const ClienteModal: React.FC = () => {
  const {
    isClienteModalOpen,
    setIsClienteModalOpen,
    clienteParaEditar,
    setClienteParaEditar,
    criarCliente,
    atualizarCliente,
  } = useApp();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (clienteParaEditar) {
      setNome(clienteParaEditar.nome);
      setTelefone(aplicarMascaraTelefone(clienteParaEditar.telefone));
      setDocumento(aplicarMascaraDocumento(clienteParaEditar.documento || ''));
      setEndereco(clienteParaEditar.endereco || '');
    } else {
      setNome('');
      setTelefone('');
      setDocumento('');
      setEndereco('');
    }
    setErro(null);
  }, [clienteParaEditar, isClienteModalOpen]);

  if (!isClienteModalOpen) return null;

  const handleFechar = () => {
    setIsClienteModalOpen(false);
    setClienteParaEditar(null);
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('O nome do cliente é obrigatório.');
      return;
    }
    if (!telefone.trim()) {
      setErro('O telefone/WhatsApp de contato é obrigatório.');
      return;
    }

    if (clienteParaEditar) {
      atualizarCliente(clienteParaEditar.id, {
        nome,
        telefone,
        documento,
        endereco,
      });
    } else {
      criarCliente({
        nome,
        telefone,
        documento,
        endereco,
      });
    }

    handleFechar();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white">
            <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold">
              {clienteParaEditar ? 'Editar Dados do Cliente' : 'Novo Cadastro de Cliente'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleFechar}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSalvar} className="p-6 space-y-4">
          {erro && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Eduardo Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telefone / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={15}
                placeholder="(43) 99999-0000"
                value={telefone}
                onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CPF ou CNPJ <span className="text-slate-400 dark:text-slate-500 font-normal">(Opcional)</span>
              </label>
              <input
                type="text"
                maxLength={18}
                placeholder="000.000.000-00 ou CNPJ"
                value={documento}
                onChange={(e) => setDocumento(aplicarMascaraDocumento(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Endereço Completo <span className="text-slate-400 dark:text-slate-500 font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Rua, número, bairro, cidade - UF"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleFechar}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

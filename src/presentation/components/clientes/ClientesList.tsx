import React, { useState, useMemo } from 'react';
import { useApp } from '../../../application/AppContext';
import { Cliente } from '../../../domain/types';
import { formatarTelefone } from '../../utils/formatters';
import {
  Users,
  UserPlus,
  Phone,
  MapPin,
  FileText,
  Trash2,
  Edit2,
  AlertTriangle,
  Search,
  Briefcase,
  MessageCircle,
} from 'lucide-react';
import { abrirWhatsApp } from '../../utils/whatsapp';

export const ClientesList: React.FC = () => {
  const {
    clientes,
    ordens,
    dadosEmpresa,
    setIsClienteModalOpen,
    setClienteParaEditar,
    removerCliente,
    confirmarAcao,
  } = useApp();

  const [busca, setBusca] = useState('');
  const [alertaErro, setAlertaErro] = useState<string | null>(null);

  // Mapeia quantidade de OS por cliente
  const contagemOrdensPorCliente = useMemo(() => {
    const mapa: Record<string, number> = {};
    ordens.forEach((o) => {
      mapa[o.clienteId] = (mapa[o.clienteId] || 0) + 1;
    });
    return mapa;
  }, [ordens]);

  // Filtra clientes pela busca local
  const clientesFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        c.telefone.includes(termo) ||
        (c.documento && c.documento.includes(termo)) ||
        (c.endereco && c.endereco.toLowerCase().includes(termo))
    );
  }, [clientes, busca]);

  const handleNovoCliente = () => {
    setClienteParaEditar(null);
    setIsClienteModalOpen(true);
  };

  const handleEditar = (cliente: Cliente) => {
    setClienteParaEditar(cliente);
    setIsClienteModalOpen(true);
  };

  const handleExcluir = (cliente: Cliente) => {
    setAlertaErro(null);
    confirmarAcao({
      titulo: 'Excluir Cliente',
      mensagem: `Deseja realmente excluir o cadastro de "${cliente.nome}"?`,
      detalhe: 'A exclusão só será concluída caso não existam Ordens de Serviço vinculadas a este cliente.',
      textoConfirmar: 'Excluir Cliente',
      variante: 'perigo',
      aoConfirmar: () => {
        const resultado = removerCliente(cliente.id);
        if (!resultado.success && resultado.error) {
          setAlertaErro(resultado.error);
        }
      },
    });
  };

  const handleWhatsApp = (cliente: Cliente) => {
    const nomeEmp = dadosEmpresa.nome?.trim() || 'OfícioFácil';
    const msg = `Olá, *${cliente.nome}*! Tudo bem?\nAqui é da *${nomeEmp}*. Como podemos te ajudar hoje?`;
    abrirWhatsApp(cliente.telefone, msg);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Base de Clientes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gerenciamento relacional de contatos e histórico de atendimentos
          </p>
        </div>

        <button
          type="button"
          onClick={handleNovoCliente}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Alerta de Integridade Referencial */}
      {alertaErro && (
        <div className="flex items-start justify-between p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Operação Bloqueada por Integridade de Dados</p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">{alertaErro}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAlertaErro(null)}
            className="text-xs font-semibold text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 ml-2"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Barra de Busca de Clientes */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {/* Grid de Cards de Clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Nenhum cliente localizado.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Cadastre um novo cliente para vincular às ordens de serviço.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => {
            const totalOrdens = contagemOrdensPorCliente[cliente.id] || 0;

            return (
              <div
                key={cliente.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                      {cliente.nome}
                    </h3>
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                      <Briefcase className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      {totalOrdens} {totalOrdens === 1 ? 'OS' : 'OSs'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatarTelefone(cliente.telefone)}</span>
                    </div>

                    {cliente.documento && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Doc: {cliente.documento}</span>
                      </div>
                    )}

                    {cliente.endereco && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cliente.endereco}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-700">
                  {cliente.telefone && (
                    <button
                      type="button"
                      onClick={() => handleWhatsApp(cliente)}
                      title={`Conversar com ${cliente.nome} no WhatsApp`}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEditar(cliente)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExcluir(cliente)}
                    title={
                      totalOrdens > 0
                        ? 'Cliente possui OSs vinculadas. Exclusão bloqueada.'
                        : 'Excluir cliente'
                    }
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useEffect } from 'react';
import { useApp } from '../../../application/AppContext';
import { AlertTriangle, Trash2, HelpCircle, X } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { dialogConfirmacao, fecharConfirmacao } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dialogConfirmacao) {
        fecharConfirmacao();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogConfirmacao, fecharConfirmacao]);

  if (!dialogConfirmacao) return null;

  const {
    titulo,
    mensagem,
    detalhe,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    variante = 'perigo',
    aoConfirmar,
  } = dialogConfirmacao;

  const handleConfirmar = () => {
    aoConfirmar();
    fecharConfirmacao();
  };

  const getIconeEClasses = () => {
    switch (variante) {
      case 'aviso':
        return {
          Icone: AlertTriangle,
          containerCor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 ring-6 ring-amber-100/60 dark:ring-amber-950/30',
          botaoConfirmarCor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
        };
      case 'padrao':
        return {
          Icone: HelpCircle,
          containerCor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 ring-6 ring-indigo-100/60 dark:ring-indigo-950/30',
          botaoConfirmarCor: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs',
        };
      case 'perigo':
      default:
        return {
          Icone: Trash2,
          containerCor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 ring-6 ring-rose-100/60 dark:ring-rose-950/30',
          botaoConfirmarCor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
        };
    }
  };

  const { Icone, containerCor, botaoConfirmarCor } = getIconeEClasses();

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={fecharConfirmacao}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Fechar Rápido */}
        <div className="flex items-center justify-end px-4 pt-3">
          <button
            type="button"
            onClick={fecharConfirmacao}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="px-6 pb-6 pt-1 text-center space-y-4">
          <div className={`w-12 h-12 rounded-full ${containerCor} flex items-center justify-center mx-auto`}>
            <Icone className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {titulo}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {mensagem}
            </p>
          </div>

          {detalhe && (
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400 text-left leading-relaxed">
              {detalhe}
            </div>
          )}
        </div>

        {/* Rodapé com Botões de Ação */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={fecharConfirmacao}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95 cursor-pointer ${botaoConfirmarCor}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

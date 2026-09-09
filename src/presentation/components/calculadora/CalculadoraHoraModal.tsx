import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../application/AppContext';
import { PricingEngine } from '../../../domain/pricing';
import { ParametrosHoraTecnica } from '../../../domain/types';
import { formatarMoeda } from '../../utils/formatters';
import {
  X,
  Calculator,
  Coins,
  Clock,
  Briefcase,
  TrendingUp,
  Percent,
  Check,
  Sparkles,
} from 'lucide-react';

interface CalculadoraHoraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRate?: (valorHora: number) => void;
}

export const CalculadoraHoraModal: React.FC<CalculadoraHoraModalProps> = ({
  isOpen,
  onClose,
  onApplyRate,
}) => {
  const { dadosEmpresa, atualizarDadosEmpresa } = useApp();

  const parametrosIniciais: ParametrosHoraTecnica = useMemo(() => {
    return (
      dadosEmpresa.parametrosHora || {
        salarioDesejado: 3500,
        custosFixosMensais: 650,
        diasPorSemana: 5,
        horasPorDia: 8,
        margemOciosidadePercentual: 20,
      }
    );
  }, [dadosEmpresa.parametrosHora]);

  const [salarioDesejado, setSalarioDesejado] = useState<number | string>(
    parametrosIniciais.salarioDesejado
  );
  const [custosFixosMensais, setCustosFixosMensais] = useState<number | string>(
    parametrosIniciais.custosFixosMensais
  );
  const [diasPorSemana, setDiasPorSemana] = useState<number>(parametrosIniciais.diasPorSemana);
  const [horasPorDia, setHorasPorDia] = useState<number | string>(parametrosIniciais.horasPorDia);
  const [margemOciosidadePercentual, setMargemOciosidadePercentual] = useState<number | string>(
    parametrosIniciais.margemOciosidadePercentual
  );

  const [salvoFeedback, setSalvoFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSalarioDesejado(parametrosIniciais.salarioDesejado);
      setCustosFixosMensais(parametrosIniciais.custosFixosMensais);
      setDiasPorSemana(parametrosIniciais.diasPorSemana);
      setHorasPorDia(parametrosIniciais.horasPorDia);
      setMargemOciosidadePercentual(parametrosIniciais.margemOciosidadePercentual);
    }
  }, [isOpen, parametrosIniciais]);

  // Cálculo reativo instantâneo através da Domain Layer
  const resultado = useMemo(() => {
    try {
      return PricingEngine.calcularHoraTecnica({
        salarioDesejado: Math.max(0, Number(salarioDesejado) || 0),
        custosFixosMensais: Math.max(0, Number(custosFixosMensais) || 0),
        diasPorSemana: Math.min(7, Math.max(1, Number(diasPorSemana) || 5)),
        horasPorDia: Math.min(24, Math.max(1, Number(horasPorDia) || 8)),
        margemOciosidadePercentual: Math.min(95, Math.max(0, Number(margemOciosidadePercentual) || 0)),
      });
    } catch {
      return {
        horasMesBrutas: 173.33,
        horasMesProdutivas: 138.66,
        custoTotalMensal: 0,
        valorHoraRecomendado: 0,
      };
    }
  }, [salarioDesejado, custosFixosMensais, diasPorSemana, horasPorDia, margemOciosidadePercentual]);

  if (!isOpen) return null;

  const handleSalvarComoPadrao = () => {
    const novosParametros: ParametrosHoraTecnica = {
      salarioDesejado: Number(salarioDesejado) || 0,
      custosFixosMensais: Number(custosFixosMensais) || 0,
      diasPorSemana: Number(diasPorSemana) || 5,
      horasPorDia: Number(horasPorDia) || 8,
      margemOciosidadePercentual: Number(margemOciosidadePercentual) || 0,
    };

    atualizarDadosEmpresa({
      ...dadosEmpresa,
      valorHoraPadrao: resultado.valorHoraRecomendado,
      parametrosHora: novosParametros,
    });

    setSalvoFeedback(true);
    setTimeout(() => {
      setSalvoFeedback(false);
    }, 2500);
  };

  const handleAplicarNaOS = () => {
    if (onApplyRate) {
      onApplyRate(resultado.valorHoraRecomendado);
    }
    handleSalvarComoPadrao();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl my-2 sm:my-8 border border-slate-200 dark:border-slate-800 flex flex-col max-h-[94dvh] sm:max-h-[90vh] overflow-hidden animate-in fade-in">
        {/* Cabeçalho Fixo */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold leading-tight">
                Calculadora de Hora Técnica Real do MEI
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Engenharia de custos: precifique com segurança sem pagar para trabalhar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Parâmetros Scrollável */}
        <div className="flex-1 p-4 sm:p-6 space-y-5 overflow-y-auto min-h-0">
          {/* Seção 1: Objetivos Financeiros */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              1. Metas Financeiras Mensais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pró-Labore Desejado (Salário Líquido)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    R$
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={salarioDesejado}
                    onChange={(e) => setSalarioDesejado(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Quanto você quer retirar livre por mês para suas despesas pessoais.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custos Fixos Mensais do Negócio
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    R$
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="25"
                    value={custosFixosMensais}
                    onChange={(e) => setCustosFixosMensais(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Guia DAS-MEI (~R$ 80), celular/internet, combustível, desgaste de ferramentas.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 2: Carga Horária e Ociosidade */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              2. Disponibilidade e Tempo Não Faturável
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dias por Semana
                </label>
                <select
                  value={diasPorSemana}
                  onChange={(e) => setDiasPorSemana(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={4}>4 dias (Semana reduzida)</option>
                  <option value={5}>5 dias (Segunda a Sexta)</option>
                  <option value={6}>6 dias (Segunda a Sábado)</option>
                  <option value={7}>7 dias (Todos os dias)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Horas por Dia
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={horasPorDia}
                    onChange={(e) => setHorasPorDia(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    hrs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-slate-400" />
                  Margem de Deslocamento
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="5"
                    value={margemOciosidadePercentual}
                    onChange={(e) => setMargemOciosidadePercentual(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    %
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              💡 <strong>Fator Realista</strong>: Deslocamentos no trânsito, ida a fornecedores e elaboração de orçamentos consom tipicamente 15% a 25% da jornada do autônomo.
            </p>
          </div>

          {/* Seção 3: Painel de Resultados Consolidados */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-indigo-950">
            <div className="flex items-center justify-between border-b border-indigo-700/50 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-200">
                  Resultado da Engenharia de Custos
                </span>
              </div>
              <span className="text-[11px] bg-indigo-800/80 px-2.5 py-0.5 rounded-full text-indigo-200 font-medium">
                Padrão 52 semanas/ano
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-slate-300 block">Custo Mensal Total</span>
                <span className="text-base font-bold text-white">
                  {formatarMoeda(resultado.custoTotalMensal)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Salário + Custos Fixos
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-slate-300 block">Horas Faturáveis/Mês</span>
                <span className="text-base font-bold text-white">
                  {resultado.horasMesProdutivas.toFixed(1)}h
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  de {resultado.horasMesBrutas.toFixed(1)}h brutas
                </span>
              </div>

              <div className="bg-emerald-500/20 rounded-xl p-3 border border-emerald-400/30">
                <span className="text-[11px] text-emerald-200 block font-medium">
                  Hora Técnica Mínima
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-300">
                  {formatarMoeda(resultado.valorHoraRecomendado)}
                  <span className="text-xs font-normal text-emerald-200">/h</span>
                </span>
                <span className="text-[10px] text-emerald-300/80 block mt-0.5">
                  Piso de sustentabilidade
                </span>
              </div>
            </div>

            <div className="bg-indigo-950/60 rounded-xl p-3.5 border border-indigo-800 text-xs text-indigo-100 flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Cobrar no mínimo <strong>{formatarMoeda(resultado.valorHoraRecomendado)} por hora</strong> garante que você atinja sua meta salarial de{' '}
                <strong>{formatarMoeda(Number(salarioDesejado) || 0)}</strong> cobrindo todos os custos operacionais, mesmo perdendo {margemOciosidadePercentual}% do tempo em trânsito e orçamentos.
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé e Ações */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2 text-xs">
            {salvoFeedback && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                <Check className="w-4 h-4" />
                Salvo como taxa padrão da empresa!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={handleSalvarComoPadrao}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Salvar como Padrão da Empresa
            </button>

            {onApplyRate && (
              <button
                type="button"
                onClick={handleAplicarNaOS}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Aplicar {formatarMoeda(resultado.valorHoraRecomendado)}/h neste Orçamento
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
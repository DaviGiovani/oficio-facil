import React, { useState, useEffect } from 'react';
import { useApp } from '../../../application/AppContext';
import { DadosEmpresa } from '../../../domain/types';
import {
  aplicarMascaraTelefone,
  aplicarMascaraDocumento,
  formatarMoeda,
  aplicarMascaraMoeda,
  converterMoedaParaNumero,
} from '../../utils/formatters';
import {
  Building2,
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  Eye,
  Wrench,
  Calculator,
  Sparkles,
} from 'lucide-react';
import { CalculadoraHoraModal } from '../calculadora/CalculadoraHoraModal';

export const EmpresaView: React.FC = () => {
  const { dadosEmpresa, atualizarDadosEmpresa } = useApp();

  const [form, setForm] = useState<DadosEmpresa>(dadosEmpresa);
  const [valorHoraInput, setValorHoraInput] = useState(() =>
    aplicarMascaraMoeda(dadosEmpresa.valorHoraPadrao || '')
  );
  const [salvoComSucesso, setSalvoComSucesso] = useState(false);
  const [isCalculadoraAberta, setIsCalculadoraAberta] = useState(false);

  useEffect(() => {
    setForm({
      ...dadosEmpresa,
      telefone: aplicarMascaraTelefone(dadosEmpresa.telefone),
      documento: aplicarMascaraDocumento(dadosEmpresa.documento || ''),
    });
    setValorHoraInput(aplicarMascaraMoeda(dadosEmpresa.valorHoraPadrao || ''));
  }, [dadosEmpresa]);

  const handleChange = (campo: keyof DadosEmpresa, valor: string) => {
    let valorFinal = valor;
    if (campo === 'telefone') {
      valorFinal = aplicarMascaraTelefone(valor);
    } else if (campo === 'documento') {
      valorFinal = aplicarMascaraDocumento(valor);
    }
    setForm((prev) => ({ ...prev, [campo]: valorFinal }));
    setSalvoComSucesso(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizarDadosEmpresa(form);
    setSalvoComSucesso(true);
    setTimeout(() => setSalvoComSucesso(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Minha Empresa / Prestador de Serviços
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure a identificação e os dados de contato que serão impressos oficialmente nos
          recibos, orçamentos e comprovantes emitidos pelo OfícioFácil.
        </p>
      </div>

      {salvoComSucesso && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold">Informações da empresa salvas com sucesso!</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
              Todos os novos recibos e impressões já utilizarão estes dados atualizados.
            </p>
          </div>
        </div>
      )}

      {/* Formulário de Cadastro e Edição */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-5 transition-colors duration-200">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Identificação Comercial e Função
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            O nome fantasia do seu negócio e a atividade que você desempenha.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nome da Empresa / Oficina / Prestador <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: LondriFix Soluções Técnicas / Maria Silva Alfaiataria"
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Função Técnica / Ramo de Atuação <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Assistência Técnica Especializada em Refrigeração e Eletrodomésticos"
              value={form.funcao}
              onChange={(e) => handleChange('funcao', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              CNPJ ou CPF do Prestador
            </label>
            <input
              type="text"
              maxLength={18}
              placeholder="00.000.000/0000-00 ou CPF"
              value={form.documento || ''}
              onChange={(e) => handleChange('documento', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Telefone / WhatsApp Comercial <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={15}
              placeholder="(43) 99999-0000"
              value={form.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              E-mail de Contato <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="email"
              placeholder="contato@minhaempresa.com.br"
              value={form.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Cidade / Estado <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Londrina - PR"
              value={form.cidadeUf || ''}
              onChange={(e) => handleChange('cidadeUf', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Endereço Físico Completo <span className="text-slate-400 font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Rua, número, sala, bairro"
              value={form.endereco || ''}
              onChange={(e) => handleChange('endereco', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Seção de Engenharia Financeira: Hora Técnica Padrão */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Engenharia de Custos & Hora Técnica Padrão
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                O valor hora padrão sugerido automaticamente ao abrir novos orçamentos.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCalculadoraAberta(true)}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Simular Custo da Minha Hora
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Valor Base por Hora Técnica
              </span>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={valorHoraInput}
                  onChange={(e) => {
                    const masked = aplicarMascaraMoeda(e.target.value);
                    setValorHoraInput(masked);
                    setForm((prev) => ({
                      ...prev,
                      valorHoraPadrao: converterMoedaParaNumero(masked),
                    }));
                  }}
                  className="w-full pl-9 pr-8 py-1.5 text-sm font-bold text-indigo-900 dark:text-indigo-300 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white dark:bg-slate-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                  /h
                </span>
              </div>
            </div>

            {form.parametrosHora && (
              <div className="grid grid-cols-3 gap-3 text-xs bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto shadow-2xs">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block uppercase font-medium">Pró-Labore</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatarMoeda(form.parametrosHora.salarioDesejado)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block uppercase font-medium">Custos Fixos</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatarMoeda(form.parametrosHora.custosFixosMensais)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 block uppercase font-medium">Jornada</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {form.parametrosHora.diasPorSemana}d / {form.parametrosHora.horasPorDia}h/dia
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Save className="w-4 h-4" />
            Salvar Dados da Empresa
          </button>
        </div>
      </form>

      {/* Pré-visualização do Cabeçalho Comercial dos Recibos */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-3 transition-colors duration-200">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">
          <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Pré-visualização do Cabeçalho Oficial do Recibo</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b-2 border-slate-800 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {form.nome || 'Nome da Sua Empresa'}
                </h3>
                <p className="text-xs text-indigo-600 font-bold">
                  {form.funcao || 'Função / Ramo de Atividade do Prestador'}
                </p>
                <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                  {form.documento && <p>CNPJ/CPF: {form.documento}</p>}
                  <p>Contato: {form.telefone || '(00) 00000-0000'} {form.email ? `• ${form.email}` : ''}</p>
                  {(form.endereco || form.cidadeUf) && (
                    <p>Endereço: {[form.endereco, form.cidadeUf].filter(Boolean).join(' - ')}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right sm:self-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Plataforma de Gestão
              </span>
              <span className="text-xs font-bold text-slate-700">
                Emitido via OfícioFácil
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal da Calculadora de Hora Real */}
      <CalculadoraHoraModal
        isOpen={isCalculadoraAberta}
        onClose={() => setIsCalculadoraAberta(false)}
        onApplyRate={(novaTaxa) =>
          setForm((prev) => ({
            ...prev,
            valorHoraPadrao: novaTaxa,
          }))
        }
      />
    </div>
  );
};

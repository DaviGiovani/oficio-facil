export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor || 0);
}

/**
 * Máscara dinâmica para valores monetários em Reais (R$) para campos de entrada.
 * Converte dígitos estilo ATM (deslocamento de centavos da direita para esquerda).
 * Limite de até 8 dígitos (máximo R$ 999.999,99).
 */
export function aplicarMascaraMoeda(valor: string | number): string {
  if (valor === '' || valor === null || valor === undefined) return '';

  if (typeof valor === 'number') {
    if (isNaN(valor)) return '';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  }

  // Remove qualquer caractere que não seja dígito e limita a 8 dígitos (999.999,99)
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  if (!digitos) return '';

  const centavos = parseInt(digitos, 10);
  if (centavos === 0) return '';

  const reais = centavos / 100;
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais);
}

/**
 * Converte uma string com máscara monetária ('1.250,50') ou número para float (1250.50).
 */
export function converterMoedaParaNumero(valor: string | number): number {
  if (typeof valor === 'number') {
    return isNaN(valor) ? 0 : valor;
  }
  if (!valor || typeof valor !== 'string') return 0;
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return 0;
  return parseFloat(digitos) / 100;
}

/**
 * Máscara para campos de entrada de hora no padrão HH:mm (00:00 a 99:59).
 * Permite digitação progressiva e converte vírgula ou ponto em dois-pontos.
 */
export function aplicarMascaraHora(valor: string): string {
  if (!valor) return '';

  // Substitui vírgula ou ponto por dois-pontos
  const limpo = valor.replace(/[.,]/g, ':');

  if (limpo.includes(':')) {
    let [hStr = '', mStr = ''] = limpo.split(':');
    hStr = hStr.replace(/\D/g, '').slice(0, 2);
    mStr = mStr.replace(/\D/g, '').slice(0, 2);

    // Se o usuário digitou ':' após 1 dígito (ex: '4:'), ou já começou a digitar minutos ('4:25'), padroniza hora para 2 dígitos
    if (
      hStr.length === 1 &&
      (valor.endsWith(':') || valor.endsWith('.') || valor.endsWith(',') || mStr.length > 0)
    ) {
      hStr = `0${hStr}`;
    }

    if (mStr.length === 2 && parseInt(mStr, 10) > 59) {
      mStr = '59';
    }

    return `${hStr}:${mStr}`;
  }

  const digitos = limpo.replace(/\D/g, '').slice(0, 4);
  if (digitos.length <= 2) {
    return digitos;
  }

  const h = digitos.slice(0, 2);
  let m = digitos.slice(2);
  if (m.length === 2 && parseInt(m, 10) > 59) {
    m = '59';
  }
  return `${h}:${m}`;
}

/**
 * Normaliza o valor do input de horas ao perder o foco (onBlur).
 * Ex: '4' -> '04:00', '4:2' -> '04:20', '4:25' -> '04:25'.
 */
export function normalizarHoraInput(valor: string): string {
  if (!valor || !valor.trim()) return '';
  const limpo = valor.trim().replace(/[.,]/g, ':');

  if (limpo.includes(':')) {
    let [hStr = '', mStr = ''] = limpo.split(':');
    hStr = hStr.replace(/\D/g, '').slice(0, 2);
    mStr = mStr.replace(/\D/g, '').slice(0, 2);
    const h = String(parseInt(hStr || '0', 10)).padStart(2, '0');
    let m = mStr.length === 1 ? `${mStr}0` : mStr.padStart(2, '0');
    if (parseInt(m, 10) > 59) m = '59';
    return `${h}:${m}`;
  }

  const digitos = limpo.replace(/\D/g, '');
  if (!digitos) return '';
  const num = parseInt(digitos, 10);
  return `${String(num).padStart(2, '0')}:00`;
}

/**
 * Converte string 'HH:mm' para horas em formato decimal (ex: '04:25' -> 4.4167, '01:30' -> 1.5).
 */
export function converterHoraParaDecimal(horaString: string | number): number {
  if (typeof horaString === 'number') {
    return isNaN(horaString) ? 0 : Math.max(0, horaString);
  }
  if (!horaString || typeof horaString !== 'string') return 0;

  const limpo = horaString.trim().replace(/[.,]/g, ':');
  if (!limpo) return 0;

  if (limpo.includes(':')) {
    const [hStr = '0', mStr = '0'] = limpo.split(':');
    const horas = parseInt(hStr.replace(/\D/g, ''), 10) || 0;
    const minutos = parseInt(mStr.replace(/\D/g, ''), 10) || 0;
    const decimal = horas + Math.min(59, minutos) / 60;
    return Number(decimal.toFixed(4));
  }

  const apenasDigitos = limpo.replace(/\D/g, '');
  if (!apenasDigitos) return 0;
  return Math.max(0, parseInt(apenasDigitos, 10));
}

/**
 * Converte horas decimais para string formatada de input 'HH:mm' (ex: 4.4167 -> '04:25', 1.5 -> '01:30', 2 -> '02:00').
 */
export function formatarHorasParaInput(horasDecimais?: number | string): string {
  if (horasDecimais === undefined || horasDecimais === null || horasDecimais === '') return '';
  const num =
    typeof horasDecimais === 'number'
      ? horasDecimais
      : parseFloat(String(horasDecimais).replace(',', '.'));
  if (isNaN(num) || num < 0) return '';

  const totalMinutos = Math.round(num * 60);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  const hh = String(horas).padStart(2, '0');
  const mm = String(minutos).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Formata horas decimais ou string 'HH:mm' para exibição amigável ao usuário.
 * Ex: 4.4167 -> '4h 25min', 1.5 -> '1h 30min', 2 -> '2h', 0.75 -> '45min', 0 -> '0h'.
 */
export function formatarHorasExibicao(horasDecimais?: number | string): string {
  if (horasDecimais === undefined || horasDecimais === null || horasDecimais === '') return '0h';

  let num = 0;
  if (typeof horasDecimais === 'string' && horasDecimais.includes(':')) {
    num = converterHoraParaDecimal(horasDecimais);
  } else {
    num =
      typeof horasDecimais === 'number'
        ? horasDecimais
        : parseFloat(String(horasDecimais).replace(',', '.'));
  }

  if (isNaN(num) || num <= 0) return '0h';

  const totalMinutos = Math.round(num * 60);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  if (horas > 0 && minutos > 0) {
    return `${horas}h ${minutos}min`;
  }
  if (horas > 0) {
    return `${horas}h`;
  }
  if (minutos > 0) {
    return `${minutos}min`;
  }
  return '0h';
}

export function formatarData(dataString?: string): string {
  if (!dataString) return '--/--/----';
  try {
    // Trata tanto YYYY-MM-DD quanto ISO strings completas
    const partes = dataString.split('T')[0].split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    const d = new Date(dataString);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dataString;
  }
}

/**
 * Máscara dinâmica para Telefone Fixo (10 dígitos) ou Celular (11 dígitos):
 * (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
 */
export function aplicarMascaraTelefone(valor: string): string {
  if (!valor) return '';
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatarTelefone(tel: string): string {
  return aplicarMascaraTelefone(tel);
}

/**
 * Máscara dinâmica para CPF (até 11 dígitos) ou CNPJ (até 14 dígitos):
 * CPF: 000.000.000-00
 * CNPJ: 00.000.000/0000-00
 */
export function aplicarMascaraDocumento(valor: string): string {
  if (!valor) return '';
  const d = valor.replace(/\D/g, '').slice(0, 14);
  if (d.length === 0) return '';

  // Formato CPF (até 11 dígitos)
  if (d.length <= 11) {
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }

  // Formato CNPJ (12 a 14 dígitos)
  if (d.length <= 12) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  }
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export function formatarDocumento(doc?: string): string {
  if (!doc) return '';
  return aplicarMascaraDocumento(doc);
}

export type StatusPrazo = 'normal' | 'atencao' | 'atrasado';

export function avaliarPrazo(prazoString: string): {
  status: StatusPrazo;
  texto: string;
  classeCor: string;
} {
  if (!prazoString) {
    return {
      status: 'normal',
      texto: 'Sem prazo',
      classeCor: 'text-slate-500 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700',
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [ano, mes, dia] = prazoString.split('T')[0].split('-').map(Number);
  const dataPrazo = new Date(ano, mes - 1, dia);
  dataPrazo.setHours(0, 0, 0, 0);

  const diffMs = dataPrazo.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    const atraso = Math.abs(diffDias);
    return {
      status: 'atrasado',
      texto: `${atraso}d em atraso`,
      classeCor: 'text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-950/70 dark:border-red-900/60',
    };
  }
  if (diffDias <= 2) {
    return {
      status: 'atencao',
      texto: diffDias === 0 ? 'Vence hoje' : `Vence em ${diffDias}d`,
      classeCor: 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-950/70 dark:border-amber-900/60',
    };
  }
  return {
    status: 'normal',
    texto: formatarData(prazoString),
    classeCor: 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/70 dark:border-emerald-900/60',
  };
}

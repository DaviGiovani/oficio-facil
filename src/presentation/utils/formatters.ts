export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor || 0);
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

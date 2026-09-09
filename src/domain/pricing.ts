import { ItemServico, ResumoFinanceiro, ParametrosHoraTecnica, ResultadoHoraTecnica } from './types';

export class PricingEngine {
  /**
   * Arredonda valores para duas casas decimais evitando erros de ponto flutuante IEEE 754
   */
  public static roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  /**
   * Calcula o subtotal de uma lista de itens/materiais
   */
  public static calcularSubtotalMateriais(
    itens: Array<Pick<ItemServico, 'quantidade' | 'valorUnitario'>>
  ): number {
    const total = itens.reduce((acc, item) => {
      if (item.quantidade < 0 || item.valorUnitario < 0) {
        throw new Error('Quantidade e Valor Unitário não podem ser negativos');
      }
      return acc + (item.quantidade * item.valorUnitario);
    }, 0);
    return this.roundCurrency(total);
  }

  /**
   * Calcula o custo direto de mão de obra técnica
   */
  public static calcularCustoMaoDeObra(horas: number, valorHora: number): number {
    if (horas < 0 || valorHora < 0) {
      throw new Error('Horas e Valor da Hora não podem ser negativos');
    }
    return this.roundCurrency(horas * valorHora);
  }

  /**
   * Executa a precificação consolidada da Ordem de Serviço
   */
  public static calcularPrecoFinal(
    itens: Array<Pick<ItemServico, 'quantidade' | 'valorUnitario'>>,
    horas: number,
    valorHora: number,
    margemLucroPercentual: number
  ): ResumoFinanceiro {
    if (margemLucroPercentual < 0) {
      throw new Error('A margem de lucro não pode ser negativa');
    }

    const subtotalMateriais = this.calcularSubtotalMateriais(itens);
    const custoMaoDeObra = this.calcularCustoMaoDeObra(horas, valorHora);
    const custoTotal = this.roundCurrency(subtotalMateriais + custoMaoDeObra);

    // Margem calculada sobre o custo total
    const lucroEsperado = this.roundCurrency(custoTotal * (margemLucroPercentual / 100));
    const valorFinal = this.roundCurrency(custoTotal + lucroEsperado);

    return {
      subtotalMateriais,
      custoMaoDeObra,
      custoTotal,
      lucroEsperado,
      valorFinal,
    };
  }

  /**
   * Calcula o custo da hora técnica real necessária com base no pró-labore pretendido,
   * custos fixos mensais do negócio e taxa de ociosidade/tempo não faturável.
   */
  public static calcularHoraTecnica(params: ParametrosHoraTecnica): ResultadoHoraTecnica {
    const {
      salarioDesejado,
      custosFixosMensais,
      diasPorSemana,
      horasPorDia,
      margemOciosidadePercentual,
    } = params;

    if (salarioDesejado < 0 || custosFixosMensais < 0) {
      throw new Error('Salário e custos fixos não podem ser negativos');
    }
    if (diasPorSemana <= 0 || diasPorSemana > 7) {
      throw new Error('Dias por semana deve ser entre 1 e 7');
    }
    if (horasPorDia <= 0 || horasPorDia > 24) {
      throw new Error('Horas por dia deve ser entre 0.1 e 24');
    }
    if (margemOciosidadePercentual < 0 || margemOciosidadePercentual >= 100) {
      throw new Error('Margem de ociosidade deve ser entre 0% e 99.9%');
    }

    // Padrão econômico: 52 semanas no ano / 12 meses = 4.3333333333 semanas por mês
    const semanasPorMes = 52 / 12;
    const horasMesBrutas = this.roundCurrency(diasPorSemana * horasPorDia * semanasPorMes);

    const fatorProdutividade = 1 - (margemOciosidadePercentual / 100);
    const horasMesProdutivas = this.roundCurrency(horasMesBrutas * fatorProdutividade);

    if (horasMesProdutivas <= 0) {
      throw new Error('As horas produtivas mensais calculadas devem ser maiores que zero');
    }

    const custoTotalMensal = this.roundCurrency(salarioDesejado + custosFixosMensais);
    const valorHoraRecomendado = this.roundCurrency(custoTotalMensal / horasMesProdutivas);

    return {
      horasMesBrutas,
      horasMesProdutivas,
      custoTotalMensal,
      valorHoraRecomendado,
    };
  }
}

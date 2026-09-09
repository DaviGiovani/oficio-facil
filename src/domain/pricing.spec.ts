import { describe, it, expect } from 'vitest';
import { PricingEngine } from './pricing';

describe('PricingEngine - Cálculo de Precificação de Serviços', () => {
  it('deve retornar 0 quando a lista de itens estiver vazia', () => {
    const subtotal = PricingEngine.calcularSubtotalMateriais([]);
    expect(subtotal).toBe(0);
  });

  it('deve calcular a soma correta de múltiplos materiais com decimais', () => {
    const itens = [
      { quantidade: 2, valorUnitario: 15.50 }, // 31.00
      { quantidade: 1, valorUnitario: 10.25 }, // 10.25
      { quantidade: 3, valorUnitario: 4.33 }   // 12.99
    ];
    const subtotal = PricingEngine.calcularSubtotalMateriais(itens);
    expect(subtotal).toBe(54.24);
  });

  it('deve lançar exceção se um material tiver quantidade ou valor negativo', () => {
    expect(() => {
      PricingEngine.calcularSubtotalMateriais([{ quantidade: -1, valorUnitario: 10 }]);
    }).toThrow('Quantidade e Valor Unitário não podem ser negativos');

    expect(() => {
      PricingEngine.calcularSubtotalMateriais([{ quantidade: 2, valorUnitario: -5 }]);
    }).toThrow('Quantidade e Valor Unitário não podem ser negativos');
  });

  it('deve calcular corretamente o custo de mão de obra', () => {
    const custo = PricingEngine.calcularCustoMaoDeObra(4.5, 60);
    expect(custo).toBe(270.00);
  });

  it('deve lançar exceção se horas ou valor da hora forem negativos', () => {
    expect(() => {
      PricingEngine.calcularCustoMaoDeObra(-1, 50);
    }).toThrow('Horas e Valor da Hora não podem ser negativos');

    expect(() => {
      PricingEngine.calcularCustoMaoDeObra(2, -50);
    }).toThrow('Horas e Valor da Hora não podem ser negativos');
  });

  it('deve calcular o preço final aplicando a margem de lucro sobre o custo total', () => {
    // Materiais: 100.00 | Mão de obra: 2h * 50 = 100.00 | Custo Total: 200.00
    // Margem: 30% -> Lucro esperado: 60.00 -> Valor Final: 260.00
    const itens = [{ quantidade: 1, valorUnitario: 100.00 }];
    const resultado = PricingEngine.calcularPrecoFinal(itens, 2, 50, 30);

    expect(resultado.subtotalMateriais).toBe(100.00);
    expect(resultado.custoMaoDeObra).toBe(100.00);
    expect(resultado.custoTotal).toBe(200.00);
    expect(resultado.lucroEsperado).toBe(60.00);
    expect(resultado.valorFinal).toBe(260.00);
  });

  it('deve lidar com margem de lucro 0% mantendo valor final igual ao custo total', () => {
    const resultado = PricingEngine.calcularPrecoFinal([], 1, 150, 0);
    expect(resultado.custoTotal).toBe(150.00);
    expect(resultado.lucroEsperado).toBe(0.00);
    expect(resultado.valorFinal).toBe(150.00);
  });

  it('deve lançar erro se a margem de lucro for negativa', () => {
    expect(() => {
      PricingEngine.calcularPrecoFinal([], 1, 100, -5);
    }).toThrow('A margem de lucro não pode ser negativa');
  });

  it('deve arredondar valores monetários evitando imprecisões de ponto flutuante IEEE 754', () => {
    // 0.1 + 0.2 em JS padrão = 0.30000000000000004
    expect(PricingEngine.roundCurrency(0.1 + 0.2)).toBe(0.3);
    expect(PricingEngine.roundCurrency(10.555)).toBe(10.56);
  });

  describe('Cálculo da Hora Técnica Real do MEI (calcularHoraTecnica)', () => {
    it('deve calcular corretamente as horas faturáveis e a taxa horária recomendada', () => {
      // 5 dias * 8h * (52/12) = 173.33h brutas
      // 20% ociosidade -> 173.33 * 0.8 = 138.66h produtivas
      // Custos: R$ 3500 (salário) + R$ 500 (fixo) = R$ 4000
      // Valor hora: 4000 / 138.66 = ~28.85
      const resultado = PricingEngine.calcularHoraTecnica({
        salarioDesejado: 3500,
        custosFixosMensais: 500,
        diasPorSemana: 5,
        horasPorDia: 8,
        margemOciosidadePercentual: 20,
      });

      expect(resultado.horasMesBrutas).toBe(173.33);
      expect(resultado.horasMesProdutivas).toBe(138.66);
      expect(resultado.custoTotalMensal).toBe(4000.00);
      expect(resultado.valorHoraRecomendado).toBe(28.85);
    });

    it('deve calcular corretamente quando ociosidade for 0%', () => {
      const resultado = PricingEngine.calcularHoraTecnica({
        salarioDesejado: 4000,
        custosFixosMensais: 0,
        diasPorSemana: 5,
        horasPorDia: 8,
        margemOciosidadePercentual: 0,
      });

      expect(resultado.horasMesBrutas).toBe(173.33);
      expect(resultado.horasMesProdutivas).toBe(173.33);
      expect(resultado.custoTotalMensal).toBe(4000);
      expect(resultado.valorHoraRecomendado).toBe(23.08); // 4000 / 173.33 = 23.077... -> 23.08
    });

    it('deve lançar exceção se salário ou custos forem negativos', () => {
      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: -100,
          custosFixosMensais: 500,
          diasPorSemana: 5,
          horasPorDia: 8,
          margemOciosidadePercentual: 20,
        });
      }).toThrow('Salário e custos fixos não podem ser negativos');

      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: 3000,
          custosFixosMensais: -50,
          diasPorSemana: 5,
          horasPorDia: 8,
          margemOciosidadePercentual: 20,
        });
      }).toThrow('Salário e custos fixos não podem ser negativos');
    });

    it('deve lançar exceção se dias por semana for inválido', () => {
      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: 3000,
          custosFixosMensais: 500,
          diasPorSemana: 0,
          horasPorDia: 8,
          margemOciosidadePercentual: 20,
        });
      }).toThrow('Dias por semana deve ser entre 1 e 7');

      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: 3000,
          custosFixosMensais: 500,
          diasPorSemana: 8,
          horasPorDia: 8,
          margemOciosidadePercentual: 20,
        });
      }).toThrow('Dias por semana deve ser entre 1 e 7');
    });

    it('deve lançar exceção se horas por dia for inválido', () => {
      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: 3000,
          custosFixosMensais: 500,
          diasPorSemana: 5,
          horasPorDia: 0,
          margemOciosidadePercentual: 20,
        });
      }).toThrow('Horas por dia deve ser entre 0.1 e 24');

      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: 3000,
          custosFixosMensais: 500,
          diasPorSemana: 5,
          horasPorDia: 25,
          margemOciosidadePercentual: 20,
        });
      }).toThrow('Horas por dia deve ser entre 0.1 e 24');
    });

    it('deve lançar exceção se margem de ociosidade for >= 100% ou negativa', () => {
      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: 3000,
          custosFixosMensais: 500,
          diasPorSemana: 5,
          horasPorDia: 8,
          margemOciosidadePercentual: 100,
        });
      }).toThrow('Margem de ociosidade deve ser entre 0% e 99.9%');

      expect(() => {
        PricingEngine.calcularHoraTecnica({
          salarioDesejado: 3000,
          custosFixosMensais: 500,
          diasPorSemana: 5,
          horasPorDia: 8,
          margemOciosidadePercentual: -5,
        });
      }).toThrow('Margem de ociosidade deve ser entre 0% e 99.9%');
    });
  });
});

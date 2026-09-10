import { describe, it, expect } from 'vitest';
import {
  aplicarMascaraTelefone,
  aplicarMascaraDocumento,
  aplicarMascaraMoeda,
  converterMoedaParaNumero,
  aplicarMascaraHora,
  normalizarHoraInput,
  converterHoraParaDecimal,
  formatarHorasParaInput,
  formatarHorasExibicao,
  formatarMoeda,
  formatarData,
  avaliarPrazo,
} from './formatters';

describe('Formatadores e Máscaras de Entrada', () => {
  describe('aplicarMascaraTelefone', () => {
    it('deve retornar string vazia para entrada vazia', () => {
      expect(aplicarMascaraTelefone('')).toBe('');
    });

    it('deve formatar telefone celular com 11 dígitos', () => {
      expect(aplicarMascaraTelefone('43991234567')).toBe('(43) 99123-4567');
    });

    it('deve formatar telefone fixo com 10 dígitos', () => {
      expect(aplicarMascaraTelefone('4333221100')).toBe('(43) 3322-1100');
    });

    it('deve formatar progressivamente enquanto o usuário digita', () => {
      expect(aplicarMascaraTelefone('4')).toBe('(4');
      expect(aplicarMascaraTelefone('43')).toBe('(43');
      expect(aplicarMascaraTelefone('439')).toBe('(43) 9');
      expect(aplicarMascaraTelefone('439912')).toBe('(43) 9912');
      expect(aplicarMascaraTelefone('43991234')).toBe('(43) 9912-34');
    });

    it('deve ignorar letras e caracteres especiais inseridos', () => {
      expect(aplicarMascaraTelefone('(43) 99123-4567')).toBe('(43) 99123-4567');
      expect(aplicarMascaraTelefone('43abc99123xyz4567')).toBe('(43) 99123-4567');
    });
  });

  describe('aplicarMascaraDocumento', () => {
    it('deve retornar string vazia para entrada vazia', () => {
      expect(aplicarMascaraDocumento('')).toBe('');
    });

    it('deve formatar CPF completo com 11 dígitos', () => {
      expect(aplicarMascaraDocumento('12345678900')).toBe('123.456.789-00');
    });

    it('deve formatar CNPJ completo com 14 dígitos', () => {
      expect(aplicarMascaraDocumento('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('deve formatar progressivamente enquanto o usuário digita CPF', () => {
      expect(aplicarMascaraDocumento('123')).toBe('123');
      expect(aplicarMascaraDocumento('1234')).toBe('123.4');
      expect(aplicarMascaraDocumento('1234567')).toBe('123.456.7');
      expect(aplicarMascaraDocumento('1234567890')).toBe('123.456.789-0');
    });

    it('deve alternar para formato CNPJ quando o 12º dígito for inserido', () => {
      expect(aplicarMascaraDocumento('123456780001')).toBe('12.345.678/0001');
      expect(aplicarMascaraDocumento('1234567800019')).toBe('12.345.678/0001-9');
      expect(aplicarMascaraDocumento('12345678000190')).toBe('12.345.678/0001-90');
    });

    it('deve limitar a 14 dígitos numéricos', () => {
      expect(aplicarMascaraDocumento('123456780001909999')).toBe('12.345.678/0001-90');
    });
  });

  describe('aplicarMascaraMoeda e converterMoedaParaNumero', () => {
    it('deve retornar string vazia para entrada vazia ou nula', () => {
      expect(aplicarMascaraMoeda('')).toBe('');
      expect(converterMoedaParaNumero('')).toBe(0);
    });

    it('deve formatar número já existente para formato BRL de input', () => {
      expect(aplicarMascaraMoeda(65)).toBe('65,00');
      expect(aplicarMascaraMoeda(80.5)).toBe('80,50');
      expect(aplicarMascaraMoeda(0)).toBe('0,00');
    });

    it('deve formatar progressivamente no estilo ATM (deslocamento de centavos)', () => {
      expect(aplicarMascaraMoeda('1')).toBe('0,01');
      expect(aplicarMascaraMoeda('10')).toBe('0,10');
      expect(aplicarMascaraMoeda('100')).toBe('1,00');
      expect(aplicarMascaraMoeda('1500')).toBe('15,00');
      expect(aplicarMascaraMoeda('150000')).toBe('1.500,00');
    });

    it('deve respeitar o limite máximo de 8 dígitos (R$ 999.999,99)', () => {
      expect(aplicarMascaraMoeda('99999999')).toBe('999.999,99');
      expect(aplicarMascaraMoeda('999999999')).toBe('999.999,99');
    });

    it('deve permitir limpar o campo ao apagar até zerar', () => {
      expect(aplicarMascaraMoeda('0')).toBe('');
      expect(aplicarMascaraMoeda('00')).toBe('');
    });

    it('deve converter strings formatadas em números decimais com precisão', () => {
      expect(converterMoedaParaNumero('1.250,50')).toBe(1250.5);
      expect(converterMoedaParaNumero('60,00')).toBe(60);
      expect(converterMoedaParaNumero('0,05')).toBe(0.05);
      expect(converterMoedaParaNumero(85.5)).toBe(85.5);
    });
  });

  describe('aplicarMascaraHora, normalizarHoraInput e conversores', () => {
    it('deve retornar vazio para entradas vazias', () => {
      expect(aplicarMascaraHora('')).toBe('');
      expect(normalizarHoraInput('')).toBe('');
      expect(converterHoraParaDecimal('')).toBe(0);
      expect(formatarHorasParaInput('')).toBe('');
    });

    it('deve formatar digitação progressiva com dois-pontos', () => {
      expect(aplicarMascaraHora('4')).toBe('4');
      expect(aplicarMascaraHora('4:')).toBe('04:');
      expect(aplicarMascaraHora('04:2')).toBe('04:2');
      expect(aplicarMascaraHora('04:25')).toBe('04:25');
    });

    it('deve aceitar ponto ou vírgula como separador de horas e minutos', () => {
      expect(aplicarMascaraHora('4.25')).toBe('04:25');
      expect(aplicarMascaraHora('4,30')).toBe('04:30');
    });

    it('deve limitar os minutos no máximo a 59', () => {
      expect(aplicarMascaraHora('04:88')).toBe('04:59');
    });

    it('deve normalizar horas ao sair do campo (onBlur)', () => {
      expect(normalizarHoraInput('4')).toBe('04:00');
      expect(normalizarHoraInput('4:')).toBe('04:00');
      expect(normalizarHoraInput('4:2')).toBe('04:20');
      expect(normalizarHoraInput('4:25')).toBe('04:25');
    });

    it('deve converter formato HH:mm para horas decimais com precisão', () => {
      expect(converterHoraParaDecimal('04:25')).toBe(4.4167);
      expect(converterHoraParaDecimal('01:30')).toBe(1.5);
      expect(converterHoraParaDecimal('02:00')).toBe(2);
      expect(converterHoraParaDecimal('00:45')).toBe(0.75);
      expect(converterHoraParaDecimal('2')).toBe(2);
    });

    it('deve formatar horas decimais para input HH:mm', () => {
      expect(formatarHorasParaInput(4.4167)).toBe('04:25');
      expect(formatarHorasParaInput(1.5)).toBe('01:30');
      expect(formatarHorasParaInput(2)).toBe('02:00');
      expect(formatarHorasParaInput(0.75)).toBe('00:45');
      expect(formatarHorasParaInput(0)).toBe('00:00');
    });

    it('deve formatar horas para exibição amigável (ex: 4h 25min, 2h, 45min)', () => {
      expect(formatarHorasExibicao(4.4167)).toBe('4h 25min');
      expect(formatarHorasExibicao('04:25')).toBe('4h 25min');
      expect(formatarHorasExibicao(1.5)).toBe('1h 30min');
      expect(formatarHorasExibicao('01:30')).toBe('1h 30min');
      expect(formatarHorasExibicao(2)).toBe('2h');
      expect(formatarHorasExibicao(0.75)).toBe('45min');
      expect(formatarHorasExibicao('00:45')).toBe('45min');
      expect(formatarHorasExibicao(0)).toBe('0h');
      expect(formatarHorasExibicao('')).toBe('0h');
    });
  });

  describe('formatarMoeda e formatarData', () => {
    it('deve formatar valor monetário em BRL', () => {
      const formatado = formatarMoeda(1250.5);
      expect(formatado).toContain('1.250,50');
    });

    it('deve formatar datas corretamente', () => {
      expect(formatarData('2026-03-15')).toBe('15/03/2026');
      expect(formatarData('2026-03-15T14:30:00.000Z')).toBe('15/03/2026');
    });

    it('deve avaliar status de prazo corretamente', () => {
      expect(avaliarPrazo('')).toEqual({
        status: 'normal',
        texto: 'Sem prazo',
        classeCor: 'text-slate-500 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700',
      });

      // Data no passado (atrasado)
      const resultadoAtrasado = avaliarPrazo('2020-01-01');
      expect(resultadoAtrasado.status).toBe('atrasado');
      expect(resultadoAtrasado.texto).toContain('em atraso');
      expect(resultadoAtrasado.classeCor).toContain('dark:bg-red-950/70');

      // Data no futuro distante (normal)
      const resultadoNormal = avaliarPrazo('2099-12-31');
      expect(resultadoNormal.status).toBe('normal');
      expect(resultadoNormal.classeCor).toContain('dark:bg-emerald-950/70');
    });
  });
});

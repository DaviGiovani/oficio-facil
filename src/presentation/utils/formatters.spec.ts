import { describe, it, expect } from 'vitest';
import {
  aplicarMascaraTelefone,
  aplicarMascaraDocumento,
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

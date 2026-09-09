import { describe, it, expect } from 'vitest';
import {
  sanitizarTelefoneWhatsApp,
  gerarMensagemOrdemWhatsApp,
  gerarLinkWhatsApp,
} from './whatsapp';
import { OrdemServico, Cliente, DadosEmpresa, ItemServico } from '../../domain/types';

describe('Utilitário de WhatsApp (wa.me)', () => {
  describe('sanitizarTelefoneWhatsApp', () => {
    it('deve retornar vazio quando o telefone for vazio ou nulo', () => {
      expect(sanitizarTelefoneWhatsApp('')).toBe('');
      expect(sanitizarTelefoneWhatsApp('   ')).toBe('');
    });

    it('deve adicionar 55 para números de celular brasileiros de 11 dígitos com DDD', () => {
      expect(sanitizarTelefoneWhatsApp('(43) 99123-4567')).toBe('5543991234567');
      expect(sanitizarTelefoneWhatsApp('43991234567')).toBe('5543991234567');
    });

    it('deve adicionar 55 para números de telefone fixo brasileiros de 10 dígitos com DDD', () => {
      expect(sanitizarTelefoneWhatsApp('(43) 3322-1100')).toBe('554333221100');
    });

    it('deve manter o número inalterado se já contiver DDI 55 com 12 ou 13 dígitos', () => {
      expect(sanitizarTelefoneWhatsApp('5543991234567')).toBe('5543991234567');
      expect(sanitizarTelefoneWhatsApp('+55 (43) 99123-4567')).toBe('5543991234567');
    });
  });

  describe('gerarMensagemOrdemWhatsApp', () => {
    const ordemExemplo: OrdemServico = {
      id: 'os-1',
      numeroOs: 104,
      clienteId: 'c-1',
      tituloServico: 'Manutenção em Ar-Condicionado Split',
      descricaoDefeito: 'Aparelho não resfria e faz barulho na turbina',
      status: 'aprovado',
      prazoEntrega: '2026-04-10T00:00:00.000Z',
      valorHoraTecnica: 80,
      horasEstimadas: 2,
      margemLucroPercentual: 25,
      financeiro: {
        subtotalMateriais: 120,
        custoMaoDeObra: 160,
        custoTotal: 280,
        lucroEsperado: 70,
        valorFinal: 350,
      },
      criadoEm: '2026-04-05T00:00:00.000Z',
      atualizadoEm: '2026-04-05T00:00:00.000Z',
    };

    const clienteExemplo: Cliente = {
      id: 'c-1',
      nome: 'João da Silva',
      telefone: '(43) 99888-7766',
      criadoEm: '2026-04-01',
    };

    const empresaExemplo: DadosEmpresa = {
      nome: 'ClimaFrio Soluções Térmicas',
      funcao: 'Refrigeração e Climatização',
      documento: '12.345.678/0001-90',
      telefone: '43999990000',
    };

    const itensExemplo: ItemServico[] = [
      {
        id: 'item-1',
        ordemId: 'os-1',
        descricao: 'Gás Refrigerante R410A',
        quantidade: 1,
        valorUnitario: 80,
      },
      {
        id: 'item-2',
        ordemId: 'os-1',
        descricao: 'Capacitor 35uF',
        quantidade: 1,
        valorUnitario: 40,
      },
    ];

    it('deve formatar a mensagem contendo todos os dados cruciais da OS', () => {
      const msg = gerarMensagemOrdemWhatsApp({
        ordem: ordemExemplo,
        cliente: clienteExemplo,
        empresa: empresaExemplo,
        itens: itensExemplo,
      });

      expect(msg).toContain('*João da Silva*');
      expect(msg).toContain('*ClimaFrio Soluções Térmicas*');
      expect(msg).toContain('#104');
      expect(msg).toContain('Manutenção em Ar-Condicionado Split');
      expect(msg).toContain('Serviço Aprovado');
      expect(msg).toContain('Gás Refrigerante R410A');
      expect(msg).toContain('Capacitor 35uF');
      expect(msg).toContain('350,00');
    });

    it('deve usar fallbacks elegantes quando empresa ou cliente não forem informados', () => {
      const msg = gerarMensagemOrdemWhatsApp({
        ordem: ordemExemplo,
      });

      expect(msg).toContain('*Cliente*');
      expect(msg).toContain('*OfícioFácil*');
      expect(msg).toContain('350,00');
    });
  });

  describe('gerarLinkWhatsApp', () => {
    it('deve gerar link com telefone e texto devidamente codificado para URL', () => {
      const link = gerarLinkWhatsApp('(43) 99123-4567', 'Olá João! Orçamento #123');
      expect(link).toBe('https://wa.me/5543991234567?text=Ol%C3%A1%20Jo%C3%A3o!%20Or%C3%A7amento%20%23123');
    });

    it('deve permitir envio sem telefone específico (wa.me/?text=...)', () => {
      const link = gerarLinkWhatsApp('', 'Olá!');
      expect(link).toBe('https://wa.me/?text=Ol%C3%A1!');
    });
  });
});

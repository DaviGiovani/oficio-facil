# 🛠️ OfícioFácil — Gestão e Precificação para Prestadores de Serviços

> **Projeto de Extensão Universitária**  
> Aplicativo Web e PWA desenvolvido para capacitar trabalhadores autônomos, técnicos e microempreendedores individuais (MEIs) com gestão visual de ordens de serviço, precificação matemática justa baseada em custos reais e controle financeiro simplificado (DRE).

![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-54%20Testes%20Aprovados-green?logo=vitest&logoColor=white)
![Offline First](https://img.shields.io/badge/Armazenamento-100%25%20Offline-orange)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue)

> 🔗 **Acesse a aplicação online:** [davigiovani.github.io/oficio-facil](https://davigiovani.github.io/oficio-facil/)

---

## 📌 1. Sobre o Projeto

Muitos prestadores de serviços autônomos (eletricistas, marceneiros, técnicos de refrigeração, assistências de smartphones e informática, mecânicos, costureiras e profissionais liberais) enfrentam uma barreira crítica: a **dificuldade de precificar seus serviços corretamente** e a **falta de controle do fluxo de trabalho**.

É comum que o preço seja definido no "olhômetro" ou copiando a concorrência, desconsiderando:
- O pró-labore mensal necessário para a subsistência do profissional;
- As despesas fixas da oficina (DAS-MEI, celular, combustível, ferramentas, energia);
- A margem de tempo improdutivo (deslocamentos, elaboração de orçamentos, compras);
- O custo real dos materiais e peças aplicados em cada trabalho.

O **OfícioFácil** nasceu como um **Projeto de Extensão Universitária** focado em impacto social e inclusão tecnológica, oferecendo uma solução completa, 100% gratuita, sem anúncios, sem cobrança de mensalidade e que **não depende de internet nem de servidores externos** para funcionar.

---

## ✨ 2. Principais Funcionalidades

### 📋 Quadro Kanban Operacional (5 Estágios)
- **Funil de Atendimento:** Gerenciamento visual nas etapas:
  1. `Orçamento` 🟡
  2. `Aprovado` 🔵
  3. `Em Andamento` 🟣
  4. `Concluído` 🟢
  5. `Cancelado` 🔴
- **Fluxo Inteligente:** Botões rápidos de avanço e recuo de etapas.
- **Detecção de Prazos e Atrasos:** Indicadores coloridos dinâmicos que alertam se o serviço está dentro do prazo, vence hoje ou está em atraso.
- **Layout Fluido:** Colunas com expansão natural contínua, garantindo que os cards mantenham sua largura e integridade em telas desktop e mobile.

### 🧮 Calculadora de Custo da Hora Técnica
- Algoritmo financeiro que calcula matematicamente o **valor/hora mínimo recomendado**:
  $$\text{Valor da Hora} = \frac{\text{Pró-labore Desejado} + \text{Custos Fixos Mensais}}{\text{Horas Produtivas Reais no Mês}}$$
- Considera dias trabalhados na semana, horas diárias e desconto de margem de ociosidade/deslocamento.
- Permite aplicar o valor sugerido diretamente na configuração padrão do sistema com um único clique.

### 💬 Integração Rápida com WhatsApp
- Disparo de mensagens padronizadas diretamente para o WhatsApp do cliente sem intermediários e sem depender de APIs pagas.
- Mensagens formatadas e humanizadas com dados da ordem, serviços executados, materiais utilizados, valor total e chave Pix da empresa.
- Atalhos disponíveis no card do Kanban, no recibo e na lista de clientes.

### 📊 Relatórios Financeiros & DRE Simplificado
- **Demonstração do Resultado do Exercício (DRE):**
  - `(+)` **Receita Operacional Bruta** (Ordens Concluídas)
  - `(-)` **Custos de Materiais e Peças (CPV)**
  - `(=)` **Margem de Contribuição / Lucro Bruto** (com % s/ receita)
  - `(-)` **Custo de Mão de Obra Operacional** (horas investidas)
  - `(=)` **Lucro Operacional Líquido** (margem líquida real que sobra para a empresa)
- **KPIs Estratégicos:** Ticket médio, horas técnicas trabalhadas, receita média por hora, taxa de conversão de propostas e volume de pipeline em andamento.
- **Filtros Temporais Dinâmicos:** Todo o histórico, este mês, mês passado, este ano ou período personalizado.
- **Exportação CSV para Excel:**
  - Exportação do DRE estruturado (`.csv`);
  - Exportação da listagem completa de ordens com detalhamento de custos (`.csv`);
  - Codificação **UTF-8 com BOM (`\uFEFF`)** e separador de ponto e vírgula (`;`), abrindo perfeitamente no Excel pt-BR.

### 📄 Emissão de Recibo e Orçamento A4 / PDF
- Geração automática de documento oficial para impressão ou exportação em PDF via navegador (<kbd>Ctrl + P</kbd>).
- Ocultação de elementos da interface de navegação e formatação estrita com cabeçalho da empresa, tabela detalhada de itens, totais discriminados e campos para assinatura do cliente e do prestador.

### 🌓 Tema Claro e Escuro (Dark Mode)
- Alternância instantânea de tema no cabeçalho com persistência em armazenamento local.
- Paleta refinada com alto contraste para leitura confortável em ambientes com muita luz ou no escuro.

### 🔒 Soberania de Dados e Backup Local
- **100% Offline (Local-First):** Todos os dados (clientes, ordens, configurações) ficam gravados no `localStorage` do navegador do usuário.
- **Exportação e Restauração (.json):** Possibilidade de baixar uma cópia de segurança e restaurá-la em qualquer outro computador ou celular.
- **Restauração Limpa:** Botão para limpar a base de dados mantendo o sistema pronto para uso de produção (sem re-injeção de dados demonstrativos).
- **Diálogos Universais do Sistema:** Todas as confirmações de exclusão e cancelamento usam modais internos com efeito blur, sem depender do `window.confirm` do navegador.

---

## 🏛️ 3. Arquitetura e Engenharia de Software

O projeto foi construído seguindo princípios de **Clean Architecture** e **Separação de Responsabilidades (SoC)**, facilitando a testabilidade e manutenção:

```
src/
├── domain/                      # Regras de Negócio e Cálculos Puros (sem dependência de UI)
│   ├── types.ts                 # Interfaces e tipos de dados de domínio
│   ├── pricing.ts               # Motor de precificação (materiais + mão de obra + lucro)
│   ├── pricing.spec.ts          # Testes unitários de precificação
│   ├── reports.ts               # Motor de DRE, KPIs e exportação CSV
│   └── reports.spec.ts          # Testes unitários do motor financeiro
│
├── infrastructure/              # Camada de Persistência e Acesso a Dados
│   ├── LocalStorageRepository.ts# Implementação genérica de repositório em LocalStorage
│   ├── databaseService.ts       # Serviços relacionais de clientes, ordens e empresa
│   ├── backupService.ts         # Exportação e importação de backups JSON
│   ├── seed.ts                  # Carga inicial demonstrativa de referência
│   └── infrastructure.spec.ts   # Testes unitários de persistência e repositórios
│
├── application/                 # Camada de Aplicação / Estado
│   └── AppContext.tsx           # Context API com estado reativo, tema e modais globais
│
└── presentation/                # Camada de Interface com o Usuário (UI)
    ├── components/
    │   ├── kanban/              # KanbanBoard, KanbanCard
    │   ├── ordens/               # OrdemModal (criação e edição de OS)
    │   ├── clientes/            # ClientesList, ClienteModal
    │   ├── calculadora/         # CalculadoraHoraModal
    │   ├── relatorios/          # RelatoriosView (DRE, KPIs, gráficos e CSV)
    │   ├── recibo/              # ReciboModal (impressão A4)
    │   ├── empresa/             # EmpresaView (perfil do prestador)
    │   ├── backup/              # BackupModal (importação/exportação)
    │   ├── config/              # ConfigView
    │   └── layout/              # Header, BottomNav, ConfirmModal
    └── utils/
        ├── formatters.ts        # Formatação de moedas, datas, telefones, prazos
        ├── formatters.spec.ts   # Testes de formatação
        ├── whatsapp.ts          # Gerador de links e mensagens WhatsApp
        └── whatsapp.spec.ts     # Testes da integração WhatsApp
```

---

## 🧪 4. Testes Automatizados

O sistema conta com **54 testes unitários automatizados** desenvolvidos com **Vitest**, cobrindo:
- Fórmulas de precificação e cálculo do valor final com markup;
- Demonstração do Resultado do Exercício (DRE) e indicadores de desempenho;
- Filtros temporais de relatórios e geração de arquivos CSV;
- Formatação de documentos, telefones e status de prazos;
- Geração de mensagens de WhatsApp com encoding de caracteres;
- Integridade referencial e persistência em repositórios locais.

Para rodar os testes:
```bash
npm run test
```

---

## 🚀 5. Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Gerenciador de pacotes `npm` (incluso com o Node.js)

### Passo a Passo

1. **Clonar o repositório ou abrir a pasta do projeto:**
   ```bash
   cd OficioFacil
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O terminal exibirá os links de acesso:
   - **Local:** `http://localhost:5173/`
   - **Na rede Wi-Fi:** `http://<SEU-IP-LOCAL>:5173/` *(permite acessar direto do celular)*

4. **Gerar compilação para produção:**
   ```bash
   npm run build
   ```
   Os arquivos finais otimizados serão gerados na pasta `dist/`.

---

## 📱 6. Uso em Smartphones e Tablets (PWA)

O **OfícioFácil** é totalmente responsivo e otimizado para dispositivos móveis:
- Barra inferior de navegação rápida (**BottomNav**) com acesso a todas as seções;
- Botão central elevado para abertura imediata de **Nova OS**;
- Filtros por pílulas no quadro Kanban para foco em uma etapa por vez;
- Pode ser adicionado à tela inicial do celular através do menu do navegador (*"Adicionar à tela de início"*), comportando-se como um aplicativo nativo.

---

## 🎓 7. Contexto Acadêmico

- **Instituição:** Centro Universitário Filadélfia (UniFil)
- **Curso:** Bacharelado em Engenharia de Software (EaD)
- **Disciplinas Envolvidas:** Extensão VII – Testes e Refinamento | Extensão VIII – Publicação e Divulgação
- **Aluno:** Davi Giovani
- **Objetivo Social:** Democratização de ferramentas digitais de gestão operacional e financeira para trabalhadores autônomos e microempreendedores individuais (MEIs), promovendo inclusão produtiva, soberania de dados e precificação justa.
- **Tecnologias e Conceitos:** Engenharia de Software, Arquitetura em Camadas (Clean Architecture), PWA / Jamstack (Client-Side), Testes Automatizados (Vitest) e Princípios Contábeis/Financeiros (DRE e Formação de Preço de Venda).

---

## 📄 8. Licença

Este projeto está licenciado sob a licença **MIT** — consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes. Livre para fins acadêmicos, de estudo e utilização comercial por microempreendedores.

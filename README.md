# 🛠️ OfícioFácil — Gestão e Precificação para Prestadores de Serviços

> **Projeto de Extensão Universitária**  
> Aplicativo Web e PWA desenvolvido para capacitar trabalhadores autônomos, técnicos e microempreendedores individuais (MEIs) com gestão visual de ordens de serviço, precificação matemática justa baseada em custos reais e controle financeiro simplificado (DRE).

![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-71%20Testes%20Aprovados-green?logo=vitest&logoColor=white)
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
- **Detecção de Prazos e Atrasos:** Indicadores coloridos dinâmicos que alertam se o serviço está dentro do prazo, vence hoje ou está em atraso (removidos automaticamente de ordens concluídas/canceladas para manter o foco do profissional).
- **Filtro Temporal de Concluídas:** Segmentação exclusiva na coluna de concluídos (`7 dias`, `30 dias` ou `Todas`), evitando acúmulo de cards finalizados e mantendo o fluxo visual limpo.
- **Layout Fluido:** Colunas com expansão natural contínua, garantindo que os cards mantenham sua largura e integridade em telas desktop e mobile.

### 📦 Catálogo Padronizado de Serviços e Peças
- **Tabela de Serviços:** Cadastro com tempo estimado em formato `HH:mm` e precificação automática baseada no valor/hora da empresa.
- **Peças e Materiais:** Controle de insumos com preço de custo, margem de lucro percentual (%) e cálculo dinâmico do preço de venda sugerido.
- **Importação Direta na OS ("Do Catálogo"):** Inclusão com 1 clique de serviços e peças frequentes na montagem de ordens de serviço, agilizando o orçamento.
- **Modais de Detalhes:** Clique em qualquer item do catálogo para visualizar ficha técnica completa, tempos e margens de lucro sem entrar em modo de edição.

### 👥 Gestão de Clientes e Consulta Rápida
- Cadastro completo com máscaras automáticas para CPF, CNPJ e Telefone.
- **Modal de Detalhes do Cliente:** Visualização instantânea com atalhos diretos para WhatsApp e chamada telefônica, além de dados de endereço completos.

### ⌨️ Máscaras de Entrada Inteligentes
- **Moeda em Tempo Real:** Formatação contínua de valores monetários (`R$ 0,00`) em todas as telas e modais, prevenindo erros de digitação.
- **Horas e Minutos:** Validação e máscara estrita no formato `HH:mm` em campos de tempo trabalhado e duração estimada.

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
- **100% Offline (Local-First):** Todos os dados (clientes, ordens, catálogo e configurações) ficam gravados no `localStorage` do navegador do usuário.
- **Primeiro Acesso Limpo (Produção):** O sistema inicia completamente zerado e com dados genéricos neutros, pronto para o trabalho do profissional.
- **Exportação e Restauração (.json):** Possibilidade de baixar uma cópia de segurança completa e restaurá-la a qualquer momento em qualquer computador ou celular.
- **Restauração Padrão do Sistema:** Opção para redefinir a base de dados a zero mantendo o sistema pronto para novos trabalhos.
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
    │   ├── ordens/              # OrdemModal (criação e edição de OS)
    │   ├── clientes/            # ClientesList, ClienteModal, ClienteDetalhesModal
    │   ├── catalogo/            # CatalogoView, ServicoModal, ServicoDetalhesModal, PecaModal
    │   ├── calculadora/         # CalculadoraHoraModal
    │   ├── relatorios/          # RelatoriosView (DRE, KPIs, gráficos e CSV)
    │   ├── recibo/              # ReciboModal (impressão A4)
    │   ├── empresa/             # EmpresaView (perfil do prestador)
    │   ├── backup/              # BackupModal (importação/exportação)
    │   ├── config/              # ConfigView (backup, restauração limpa)
    │   └── layout/              # Header (com dropdown mobile), BottomNav, ConfirmModal
    └── utils/
        ├── formatters.ts        # Formatação e máscaras (R$, HH:mm, CPF, CNPJ, Tel)
        ├── formatters.spec.ts   # Testes de máscaras e formatação
        ├── whatsapp.ts          # Gerador de links e mensagens WhatsApp
        └── whatsapp.spec.ts     # Testes da integração WhatsApp
```

---

## 🧪 4. Testes Automatizados

O sistema conta com **71 testes unitários automatizados** desenvolvidos com **Vitest**, cobrindo:
- Fórmulas de precificação e cálculo do valor final com markup;
- Demonstração do Resultado do Exercício (DRE) e indicadores de desempenho;
- Filtros temporais de relatórios e geração de arquivos CSV;
- Máscaras dinâmicas de valores monetários (`R$`) e campos de tempo (`HH:mm`);
- Formatação de documentos, telefones e status de prazos;
- Geração de mensagens de WhatsApp com encoding de caracteres;
- Integridade referencial, catálogo e persistência em repositórios locais.

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
- **Menu Dropdown de Métricas no Topo:** Indicadores operacionais e financeiros resumidos em menu recolhível no cabeçalho mobile, eliminando quebras de layout e cards cortados em telas menores;
- Barra inferior de navegação rápida (**BottomNav**) com acesso a todas as seções;
- Botão central elevado para abertura imediata de **Nova OS**;
- Filtros por pílulas no quadro Kanban para foco em uma etapa por vez;
- Pode ser adicionado à tela inicial do celular através do menu do navegador (*"Adicionar à tela de início"*), comportando-se como um aplicativo nativo.

---

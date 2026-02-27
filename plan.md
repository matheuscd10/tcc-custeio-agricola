# Projeto: Sistema de Custeio Agrícola para Gestão de Recursos em Propriedades Rurais
**Fase atual:** TCC II (Implementação Prática)
**Autor:** Matheus Chagas Dias

## 1. Contexto do Projeto para o Agente
Este projeto visa desenvolver um sistema de gestão financeira focado na agricultura familiar (região de Nonoai-RS). O sistema deve ser acessível, responsivo e focado no controle de custos e fluxo de caixa agrícola. 

Houve uma atualização na stack tecnológica em relação ao projeto original (TCC I). A arquitetura atual é:
* **Repositório:** Monorepo (pastas `/backend` e `/frontend`).
* **Backend:** Nest.js, TypeORM, PostgreSQL.
* **Frontend:** Quasar Framework (Vue 3, Vite, TypeScript).
* **UI/UX Design:** As telas serão prototipadas primeiramente usando a ferramenta de IA Google Stitch (focando em Material Design) e depois implementadas usando os componentes nativos do Quasar.
* **Metodologia:** Desenvolvimento Incremental.

**Instrução para o Agente:** Por favor, leia os Épicos abaixo e crie a estrutura de tarefas no board do Antigravity, mantendo os títulos e as descrições propostas.

---

## 2. Épicos e Tarefas (Backlog do Backend - Nest.js)

### Épico 1: Setup e Infraestrutura da API
* **Tarefa 1.1: Configurar Banco de Dados**
  * Descrição: Instalar `@nestjs/typeorm`, `typeorm` e `pg`. Configurar a conexão com o PostgreSQL via variáveis de ambiente (`.env`).
* **Tarefa 1.2: Configurar Swagger**
  * Descrição: Instalar `@nestjs/swagger` e gerar a documentação base da API.

### Épico 2: Autenticação e Gestão de Pessoas (RF1)
* **Tarefa 2.1: Módulo de Autenticação (JWT)**
  * Descrição: Criar `AuthModule` com Passport e JWT. Configurar AuthGuards.
* **Tarefa 2.2: CRUD de Pessoa Base**
  * Descrição: Criar Entity, DTO, Service e Controller para a tabela `pessoa`.
* **Tarefa 2.3: Especializações de Pessoa**
  * Descrição: Criar Entities e relacionamentos para `pessoa_fisica` e `pessoa_juridica`.

### Épico 3: Cadastros Financeiros de Apoio
* **Tarefa 3.1: Módulo Bancário**
  * Descrição: Criar CRUD completo para as entidades `banco` e `dados_bancarios`.
* **Tarefa 3.2: Categorização de Operações**
  * Descrição: Criar CRUD para `tipo_valor_financeiro` e `operacao_financeira`.

### Épico 4: Core do Custeio (RF2, RF3, RF4)
* **Tarefa 4.1: Lançamento de Contas a Pagar**
  * Descrição: Endpoints para despesas. Mapear entidades `titulo_pagar` e `valor_titulo_pagar`.
* **Tarefa 4.2: Lançamento de Contas a Receber**
  * Descrição: Endpoints para receitas. Mapear entidades `titulo_receber` e `valor_titulo_receber`.
* **Tarefa 4.3: Conciliação e Baixas**
  * Descrição: Lógica de efetivação de pagamentos/recebimentos, mapeando `baixa_titulo_pagar` e `baixa_titulo_receber`.

### Épico 5: Agregação de Dados e Relatórios (RF6)
* **Tarefa 5.1: Endpoint da Dashboard (Resumo)**
  * Descrição: Criar rota para retornar total de receitas, despesas e % de orçamento utilizado via TypeORM QueryBuilder.
* **Tarefa 5.2: Endpoint de Relatório Detalhado**
  * Descrição: Rota de listagem de fluxo de caixa com filtros (data, tipo, pessoa).

---

## 3. Épicos e Tarefas (Backlog do Frontend - Quasar & Stitch)

### Épico 6: Prototipação UI/UX (Google Stitch)
* **Tarefa 6.1: Gerar Design da Dashboard**
  * Descrição: Usar prompts no Stitch para gerar uma tela de resumo financeiro em Material Design (foco no agronegócio). Exportar paleta de cores para o Quasar.
* **Tarefa 6.2: Gerar Design dos Formulários de Lançamento**
  * Descrição: Prototipar no Stitch as telas de inserção de custos e receitas.

### Épico 7: Implementação Frontend (Quasar)
* **Tarefa 7.1: Setup de Layout e Navegação**
  * Descrição: Configurar roteamento, Menu Lateral (`q-drawer`) e Topbar (`q-header`). Aplicar paleta de cores gerada no Stitch no arquivo `quasar.variables.scss`.
* **Tarefa 7.2: Tela de Login e Autenticação**
  * Descrição: Integrar com a API (Épico 2) e gerenciar token no estado da aplicação.
* **Tarefa 7.3: Telas de Cadastros Base**
  * Descrição: Consumir API para criar listagens e formulários de Pessoas e Bancos usando `q-table` e `q-form`.
* **Tarefa 7.4: Telas de Lançamento (Fluxo de Caixa)**
  * Descrição: Implementar interface para inserir contas a pagar e a receber.
* **Tarefa 7.5: Tela de Dashboard (Resumo)**
  * Descrição: Construir gráficos e cards de resumo consumindo o Endpoint da Dashboard (Tarefa 5.1).
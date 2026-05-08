# Frontend - BRZ Clinic

Interface web do portal BRZ Clinic, construída com React, Vite e Bootstrap. O frontend consome a API do backend para listar pacientes, médicos, planos de saúde e consultas, além de permitir agendamento, cancelamento e encerramento de atendimentos.

## Visão Geral

A aplicação possui dois fluxos principais:

- **Área do paciente**: permite visualizar consultas, agendar novo atendimento e cancelar consultas agendadas.
- **Área do médico**: permite visualizar consultas do médico selecionado, encerrar atendimentos com pagamento e receita, e acompanhar relatório financeiro em tabela.

## Tecnologias

- React
- Vite
- React Router
- Axios
- Bootstrap
- CSS customizado

## Estrutura

```text
frontend/
├── public/                 # Arquivos públicos e imagens
├── src/
│   ├── api/                # Funções de integração com a API
│   ├── components/         # Componentes reutilizáveis
│   ├── data/               # Dados auxiliares, como horários simulados
│   ├── pages/              # Telas de login, paciente e médico
│   ├── utils/              # Formatadores de data, hora e moeda
│   ├── App.jsx             # Rotas e estado principal da aplicação
│   ├── main.jsx            # Entrada do React
│   └── styles.css          # Estilos globais
├── index.html
├── package.json
└── vite.config.js
```

## Configuração

Instale as dependências:

```bash
cd frontend
npm install
```

Opcionalmente, crie um arquivo `.env` para apontar para a API:

```env
VITE_API_URL=http://localhost:3002/api
```

Se essa variável não existir, o frontend usa `http://localhost:3002/api` como padrão.

## Como Executar

Inicie o backend antes do frontend. Depois, rode:

```bash
npm run dev
```

Endereço padrão:

```text
http://localhost:5173
```

## Build

Para gerar a versão de produção:

```bash
npm run build
```

Para pré-visualizar o build:

```bash
npm run preview
```

## Telas

### LoginScreen

Tela inicial. O usuário seleciona um paciente ou médico na barra superior e entra no perfil correspondente.

### PatientScreen

Área do paciente. Exibe consultas agendadas, histórico, resumo e botão para abrir o modal de novo agendamento.

### DoctorScreen

Área do médico. Exibe próximas consultas, formulário de encerramento e relatório financeiro em tabela.

## Componentes Principais

- `Navbar`: seleção de paciente e médico, logout e abertura do cadastro de paciente.
- `NewPacientModal`: cadastro de novo paciente com plano de saúde.
- `AppointmentModal`: agendamento de consulta com médico, data e horário.
- `StatusBadge`: exibição visual do status da consulta.
- `Header`: cabeçalho das telas internas.

## Integração com Backend

A comunicação com a API é feita por Axios e fetch. Os principais endpoints consumidos são:

```text
GET    /api/pacientes
GET    /api/pacientes/:id
GET    /api/pacientes/:id/consultas
GET    /api/medicos
GET    /api/medicos/:id/consultas
GET    /api/planos
POST   /api/pacientes
POST   /api/consultas
PATCH  /api/consultas/:id/cancelar
PATCH  /api/consultas/:id/encerrar
```

Mais detalhes estão no [README do backend](../backend/README.md).

## Fluxo de Agendamento

1. O paciente é selecionado no topo da aplicação.
2. Na área do paciente, o usuário abre o modal de agendamento.
3. O frontend carrega médicos e dados do paciente.
4. O usuário escolhe médico, data e horário.
5. A aplicação envia os dados para `POST /api/consultas`.
6. O backend valida plano, cobertura e disponibilidade.
7. A consulta é salva e a lista do paciente é atualizada.

## Fluxo de Encerramento

1. O médico é selecionado no topo da aplicação.
2. Na área do médico, são exibidas as consultas agendadas daquele profissional.
3. O médico informa pagamento e, se houver, receita.
4. A aplicação envia os dados para `PATCH /api/consultas/:id/encerrar`.
5. O backend registra pagamento, receita e altera o status para `REALIZADA`.
6. A tabela de relatório financeiro é atualizada.

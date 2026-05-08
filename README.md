# BRZ Clinic

Portal web para agendamento de consultas médicas, desenvolvido como Projeto Integrado de Desenvolvimento Web. A aplicação permite cadastrar pacientes, médicos e planos de saúde, agendar consultas com validação do plano, cancelar atendimentos, encerrar consultas com pagamento e receita, e visualizar relatórios financeiros por médico.

## Visão Geral

O projeto é dividido em duas aplicações:

- **Frontend React**: interface para paciente e médico, com telas de login por perfil, agendamento, histórico, encerramento de consulta e relatório em tabela.
- **Backend Node.js/Express**: API REST responsável pelas regras de negócio, validação de plano de saúde, persistência em MySQL e geração de relatórios.

## Principais Funcionalidades

- Cadastro e listagem de pacientes.
- Cadastro e listagem de médicos.
- Cadastro, listagem, atualização e validação de planos de saúde.
- Agendamento de consulta com paciente, médico, data, horário e valor.
- Bloqueio de agendamento quando o plano está vencido, sem cobertura ou o horário do médico já está ocupado.
- Cancelamento de consultas pelo paciente.
- Encerramento de consulta pelo médico com registro de pagamento e receita.
- Relatório financeiro com consultas, status, valores pagos e dados do paciente.
- Persistência em banco MySQL.

## Estrutura

```text
brzClinic/
├── backend/        # API, regras de negócio, banco e documentação do backend
├── frontend/       # Interface React/Vite
├── drawio/         # Diagramas do projeto
├── js/             # Simulações e scripts da atividade
└── package.json    # Scripts auxiliares para rodar frontend e backend
```

## Documentação

- [Backend](backend/README.md)
- [Frontend](frontend/README.md)

## Requisitos

- Node.js
- npm
- MySQL

## Configuração Inicial

Instale as dependências do backend e do frontend:

```bash
npm --prefix backend install
npm --prefix frontend install
```

Prepare o banco de dados:

```bash
cd backend
mysql -u root -p < db/01_schema.sql
mysql -u root -p < db/02_inserts.sql
```

Crie o arquivo `backend/.env` se precisar ajustar a conexão:

```env
PORT=3002
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=brz_clinic
NODE_ENV=development
```

O frontend usa `http://localhost:3002/api` como fallback. Caso queira configurar manualmente, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:3002/api
```

## Como Executar

Em um terminal, inicie o backend:

```bash
npm run dev:backend
```

Em outro terminal, inicie o frontend:

```bash
npm run dev:frontend
```

Endereços padrão:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3002`

## Scripts da Raiz

```bash
npm run dev:frontend     # inicia o frontend com Vite
npm run dev:backend      # inicia o backend com node --watch
npm run build:frontend   # gera build de produção do frontend
npm run start:backend    # inicia o backend em modo start
```

## Fluxo Básico de Uso

1. Selecione um paciente e/ou médico no topo da aplicação.
2. Entre como paciente para visualizar consultas e agendar um atendimento.
3. O sistema valida plano, cobertura e disponibilidade antes de salvar.
4. Entre como médico para visualizar os atendimentos.
5. Encerre uma consulta informando pagamento e receita, quando houver.
6. Consulte a tabela de relatório financeiro na área do médico.

## Banco de Dados

O schema principal está em `backend/db/01_schema.sql`. Ele cria as tabelas:

- `plano_saude`
- `paciente`
- `medico`
- `consulta`
- `receita`
- `pagamento`

Também cria:

- `validar_plano_saude`: function MySQL para validar vigência do plano.
- `vw_relatorio_financeiro`: view MySQL para consolidar dados financeiros das consultas.

## Verificação

Para validar o frontend:

```bash
npm run build:frontend
```

Para testar a API manualmente, consulte os endpoints no [README do backend](backend/README.md).

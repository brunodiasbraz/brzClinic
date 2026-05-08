# Backend - BRZ Clinic

Backend do portal de agendamento da BRZ Clinic, integrado ao frontend React e ao banco MySQL. O fluxo atual atende ao cadastro de pacientes, médicos e planos de saúde, agendamento com validação de plano, cancelamento, encerramento de consulta, pagamento, receita e relatório financeiro.

## Estrutura do Projeto

```
backend/
├── src/
│   ├── models/                    # Classes de domínio
│   │   ├── Paciente.js           # Classe responsável por gerenciar dados do paciente
│   │   ├── PlanoSaude.js         # Classe responsável pelo plano de saúde
│   │   ├── Medico.js             # Classe responsável pelos dados do médico
│   │   ├── Consulta.js           # Classe responsável pela consulta
│   │   ├── Receita.js            # Classe responsável pela receita
│   │   ├── Pagamento.js          # Classe responsável pelo pagamento
│   │   └── RelatorioFinanceiro.js# Classe responsável pelo relatório
│   │
│   ├── services/                  # Serviços de negócio
│   │   └── SistemaClinica.js      # Orquestrador principal do sistema
│   │
│   ├── controllers/               # Controllers - Lógica de requisição/resposta
│   │   └── ClinicaController.js   # Controller principal da clínica
│   │
│   └── routes/                    # Definição de rotas
│       ├── clinica.routes.js      # Rotas da API
│
├── server.js                      # Arquivo principal do servidor
├── test-api.js                    # Script de testes da API
├── package.json                   # Dependências do projeto
└── db/                            # Scripts SQL do banco de dados
```

## Como Usar

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Preparar o Banco

Execute os scripts SQL na ordem abaixo:

```bash
mysql -u root -p < db/01_schema.sql
mysql -u root -p < db/02_inserts.sql
```

O arquivo `db/01_schema.sql` cria as tabelas, a function `validar_plano_saude` e a view `vw_relatorio_financeiro`.

### 3. Iniciar o Servidor

Modo desenvolvimento:
```bash
npm run dev
```

Modo produção:
```bash
npm start
```

O servidor roda em `http://localhost:3002` ou na porta configurada em `.env`.

### 4. Testar a API

Execute o script de testes:
```bash
node test-api.js
```

Este script testa os endpoints da API em sequência.

## Documentação das Rotas

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/pacientes` | Cadastrar paciente |
| GET | `/api/pacientes` | Listar pacientes |
| GET | `/api/pacientes/:id` | Buscar paciente |
| GET | `/api/pacientes/:id/consultas` | Listar consultas do paciente |
| POST | `/api/medicos` | Cadastrar médico |
| GET | `/api/medicos` | Listar médicos |
| GET | `/api/medicos/:id/consultas` | Listar consultas e relatórios do médico |
| POST | `/api/planos` | Cadastrar plano |
| GET | `/api/planos` | Listar planos |
| GET | `/api/planos/:id` | Buscar plano |
| PUT | `/api/planos/:id` | Atualizar plano |
| POST | `/api/planos/validar` | Validar plano para consulta |
| POST | `/api/vincular-plano` | Vincular plano ao paciente |
| POST | `/api/consultas` | Agendar consulta |
| GET | `/api/consultas` | Listar consultas |
| GET | `/api/consultas/agendadas` | Listar agendadas |
| PATCH | `/api/consultas/:id/cancelar` | Cancelar consulta |
| PATCH | `/api/consultas/:id/encerrar` | Encerrar consulta com pagamento e receita |
| POST | `/api/pagamentos` | Registrar pagamento |
| POST | `/api/receitas` | Emitir receita |
| GET | `/api/relatorio-financeiro` | Gerar relatório financeiro geral |
| GET | `/api/relatorio-financeiro?medicoId=1` | Gerar relatório financeiro por médico |

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados (integração existente)
- **CORS** - Proteção de requisições cross-origin
- **dotenv** - Gerenciamento de variáveis de ambiente

## Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/`:

```env
PORT=3002
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=brz_clinic
NODE_ENV=development
```

## Fluxo de Uso

1. **Cadastrar Plano de Saúde** → Criar um novo plano
2. **Cadastrar Paciente** → Registrar paciente no sistema
3. **Cadastrar Médico** → Registrar médico no sistema
4. **Vincular Plano** → Associar plano ao paciente
5. **Agendar Consulta** → Criar agendamento validando validade do plano, cobertura e horário do médico
6. **Cancelar Consulta** → Paciente pode cancelar consultas agendadas
7. **Encerrar Consulta** → Médico informa pagamento e, quando houver, dados da receita
8. **Gerar Relatório** → Médico visualiza todas as suas consultas em tabela e o total recebido

## Recursos Principais

### Validações Automáticas
- Verificação de plano de saúde válido
- Validação de data de validade do plano
- Validação de limite de cobertura
- Bloqueio de horário já ocupado para o mesmo médico
- Rastreamento de pagamentos

### Características
- Persistência em MySQL para consultas, pagamentos e receitas
- Relatório financeiro geral e por médico
- Cálculo de valor total pago
- Emissão de receitas
- Validação de dados de entrada
- Tratamento robusto de erros

## Integração Frontend

O frontend React usa a variável `VITE_API_URL` apontando para a API, por exemplo:

```env
VITE_API_URL=http://localhost:3002/api
```

Exemplo de agendamento:

```javascript
const response = await fetch('http://localhost:3002/api/consultas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pacienteId: 1,
    medicoId: 1,
    dataConsulta: '2026-05-08 09:30:00',
    valor: 250
  })
});

const data = await response.json();
```

Exemplo de encerramento:

```javascript
await fetch('http://localhost:3002/api/consultas/1/encerrar', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    valorPagamento: 250,
    dataPagamento: '2026-05-08',
    descricao: 'Medicamento para controle dos sintomas',
    dosagem: '1 comprimido a cada 8 horas',
    tempoTratamento: '5 dias'
  })
});
```

## Troubleshooting

**Erro: "Paciente sem plano de saúde vinculado"**
- Verifique se o paciente tem um plano associado antes de agendar

**Erro: "Plano de saúde vencido"**
- Confirme que a data da consulta está antes da data de validade do plano

**Erro: "Valor excede limite de cobertura"**
- O valor da consulta deve ser menor que o limite do plano

**Erro: "Já existe consulta agendada para este médico neste horário"**
- Escolha outro horário disponível no agendamento.

## Licença

Este projeto é parte do sistema BRZ Clinic.

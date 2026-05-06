# 📋 Backend - BRZ Clinic

Estrutura completa do backend da clínica com classes de domínio, serviços, controllers e rotas REST.

## 📁 Estrutura do Projeto

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

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Iniciar o Servidor

**Modo desenvolvimento** (com hot reload):
```bash
npm run dev
```

**Modo produção**:
```bash
npm start
```

O servidor rodará em `http://localhost:3002` (ou a porta configurada em `.env`)

### 3. Testar a API

Execute o script de testes:
```bash
node test-api.js
```

Este script testa todos os endpoints da API em sequência.

## 📚 Documentação das Rotas

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/pacientes` | Cadastrar paciente |
| GET | `/api/pacientes` | Listar pacientes |
| POST | `/api/medicos` | Cadastrar médico |
| GET | `/api/medicos` | Listar médicos |
| POST | `/api/planos` | Cadastrar plano |
| GET | `/api/planos` | Listar planos |
| POST | `/api/vincular-plano` | Vincular plano ao paciente |
| POST | `/api/consultas` | Agendar consulta |
| GET | `/api/consultas` | Listar consultas |
| GET | `/api/consultas/agendadas` | Listar agendadas |
| POST | `/api/pagamentos` | Registrar pagamento |
| POST | `/api/receitas` | Emitir receita |
| GET | `/api/relatorio-financeiro` | Gerar relatório |

## 🛠️ Tecnologias

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

## 🎯 Fluxo de Uso

1. **Cadastrar Plano de Saúde** → Criar um novo plano
2. **Cadastrar Paciente** → Registrar paciente no sistema
3. **Cadastrar Médico** → Registrar médico no sistema
4. **Vincular Plano** → Associar plano ao paciente
5. **Agendar Consulta** → Criar agendamento (valida plano e cobertura)
6. **Registrar Pagamento** → Registrar pagamento da consulta
7. **Emitir Receita** → Médico emite receita após consulta
8. **Gerar Relatório** → Consultar dados financeiros

## ✨ Recursos Principais

### Validações Automáticas
- Verificação de plano de saúde válido
- Validação de data de validade do plano
- Validação de limite de cobertura
- Rastreamento de pagamentos

### Características
- Relatório financeiro automático
- Cálculo de valor total pago
- Emissão de receitas
- Validação de dados de entrada
- Tratamento robusto de erros

## Integração Frontend

O frontend pode consumir a API através de requisições HTTP:

```javascript
// Exemplo com Fetch API
const response = await fetch('http://localhost:3002/api/pacientes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    // ... outros dados
  })
});

const data = await response.json();
```

## 🐛 Troubleshooting

**Erro: "Paciente sem plano de saúde vinculado"**
- Verifique se o paciente tem um plano associado antes de agendar

**Erro: "Plano de saúde vencido"**
- Confirm que a data da consulta está antes da data de validade do plano

**Erro: "Valor excede limite de cobertura"**
- O valor da consulta deve ser menor que o limite do plano

## 📄 Licença

Este projeto é parte do sistema BRZ Clinic.

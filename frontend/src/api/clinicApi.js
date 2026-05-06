const API_URL = "http://localhost:3002/api";

// ==================== PACIENTES ====================

export async function cadastrarPaciente(dados) {
  const response = await fetch(`${API_URL}/pacientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return response.json();
}

export async function obterPacientes() {
  const response = await fetch(`${API_URL}/pacientes`);
  return response.json();
}

// ==================== MÉDICOS ====================

export async function cadastrarMedico(dados) {
  const response = await fetch(`${API_URL}/medicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return response.json();
}

export async function obterMedicos() {
  const response = await fetch(`${API_URL}/medicos`);
  return response.json();
}

// ==================== PLANOS ====================

export async function cadastrarPlano(dados) {
  const response = await fetch(`${API_URL}/planos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return response.json();
}

export async function obterPlanos() {
  const response = await fetch(`${API_URL}/planos`);
  return response.json();
}

export async function vincularPlano(pacienteId, planoId) {
  const response = await fetch(`${API_URL}/vincular-plano`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pacienteId, planoId })
  });
  return response.json();
}

// ==================== CONSULTAS ====================

export async function agendarConsulta(dados) {
  const response = await fetch(`${API_URL}/consultas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return response.json();
}

export async function obterConsultas() {
  const response = await fetch(`${API_URL}/consultas`);
  return response.json();
}

export async function obterConsultasAgendadas() {
  const response = await fetch(`${API_URL}/consultas/agendadas`);
  return response.json();
}

// ==================== PAGAMENTOS ====================

export async function registrarPagamento(dados) {
  const response = await fetch(`${API_URL}/pagamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return response.json();
}

// ==================== RECEITAS ====================

export async function emitirReceita(dados) {
  const response = await fetch(`${API_URL}/receitas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return response.json();
}

// ==================== RELATÓRIOS ====================

export async function gerarRelatorioFinanceiro() {
  const response = await fetch(`${API_URL}/relatorio-financeiro`);
  return response.json();
}

// ==================== EXEMPLO DE USO ====================

/*
// 1. Cadastrar plano
const plano = await cadastrarPlano({
  id: 1,
  nome: "Saude Total",
  limiteCobertura: 1000,
  dataValidade: "2026-12-31"
});

// 2. Cadastrar paciente
const paciente = await cadastrarPaciente({
  id: 1,
  nome: "Ana Silva",
  endereco: "Rua das Flores, 100",
  dataNascimento: "1995-04-12",
  telefone: "(11) 99999-0000",
  email: "ana@email.com",
  cpf: "123.456.789-00"
});

// 3. Cadastrar médico
const medico = await cadastrarMedico({
  id: 1,
  nome: "Dr. Carlos Mendes",
  especialidade: "Clínica Geral",
  crm: "CRM-MG 123456"
});

// 4. Vincular plano ao paciente
await vincularPlano(1, 1);

// 5. Agendar consulta
const consulta = await agendarConsulta({
  pacienteId: 1,
  medicoId: 1,
  data: "2026-05-04",
  valor: 250
});

// 6. Registrar pagamento
await registrarPagamento({
  consultaId: 1,
  valor: 250,
  dataPagamento: "2026-05-04"
});

// 7. Emitir receita
await emitirReceita({
  consultaId: 1,
  descricao: "Medicamento para controle dos sintomas",
  dosagem: "1 comprimido a cada 8 horas",
  tempoTratamento: "5 dias"
});

// 8. Obter relatório
const relatorio = await gerarRelatorioFinanceiro();
console.log(relatorio);
*/

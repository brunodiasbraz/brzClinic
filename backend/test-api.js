import axios from "axios";

const API_URL = "http://localhost:3002/api";

async function testarAPI() {
  try {
    console.log("🏥 Iniciando testes da API da Clínica...\n");

    // 1. Cadastrar Plano
    console.log("1️⃣ Cadastrando plano de saúde...");
    const planoResponse = await axios.post(`${API_URL}/planos`, {
      id: 1,
      nome: "Saude Total",
      limiteCobertura: 1000,
      dataValidade: "2026-12-31"
    });
    console.log("✅ Plano criado:", planoResponse.data.data);

    // 2. Cadastrar Paciente
    console.log("\n2️⃣ Cadastrando paciente...");
    const pacienteResponse = await axios.post(`${API_URL}/pacientes`, {
      id: 1,
      nome: "Ana Silva",
      endereco: "Rua das Flores, 100",
      dataNascimento: "1995-04-12",
      telefone: "(11) 99999-0000",
      email: "ana@email.com",
      cpf: "123.456.789-00"
    });
    console.log("✅ Paciente criado:", pacienteResponse.data.data);

    // 3. Cadastrar Médico
    console.log("\n3️⃣ Cadastrando médico...");
    const medicoResponse = await axios.post(`${API_URL}/medicos`, {
      id: 1,
      nome: "Dr. Carlos Mendes",
      especialidade: "Clínica Geral",
      crm: "CRM-MG 123456"
    });
    console.log("✅ Médico criado:", medicoResponse.data.data);

    // 4. Vincular Plano ao Paciente
    console.log("\n4️⃣ Vinculando plano ao paciente...");
    const vinculoResponse = await axios.post(`${API_URL}/vincular-plano`, {
      pacienteId: 1,
      planoId: 1
    });
    console.log("✅ Plano vinculado ao paciente");

    // 5. Agendar Consulta
    console.log("\n5️⃣ Agendando consulta...");
    const consultaResponse = await axios.post(`${API_URL}/consultas`, {
      pacienteId: 1,
      medicoId: 1,
      data: "2026-05-04",
      valor: 250
    });
    console.log("✅ Consulta agendada:", consultaResponse.data.data);

    // 6. Registrar Pagamento
    console.log("\n6️⃣ Registrando pagamento...");
    const pagamentoResponse = await axios.post(`${API_URL}/pagamentos`, {
      consultaId: 1,
      valor: 250,
      dataPagamento: "2026-05-04"
    });
    console.log("✅ Pagamento registrado");

    // 7. Emitir Receita
    console.log("\n7️⃣ Emitindo receita...");
    const receitaResponse = await axios.post(`${API_URL}/receitas`, {
      consultaId: 1,
      descricao: "Medicamento para controle dos sintomas",
      dosagem: "1 comprimido a cada 8 horas",
      tempoTratamento: "5 dias"
    });
    console.log("✅ Receita emitida:", receitaResponse.data.data);

    // 8. Listar Pacientes
    console.log("\n8️⃣ Listando pacientes...");
    const pacientesResponse = await axios.get(`${API_URL}/pacientes`);
    console.log("✅ Pacientes:", pacientesResponse.data.data);

    // 9. Listar Médicos
    console.log("\n9️⃣ Listando médicos...");
    const medicosResponse = await axios.get(`${API_URL}/medicos`);
    console.log("✅ Médicos:", medicosResponse.data.data);

    // 10. Listar Consultas
    console.log("\n🔟 Listando consultas...");
    const consultasResponse = await axios.get(`${API_URL}/consultas`);
    console.log("✅ Consultas:", consultasResponse.data.data);

    // 11. Listar Consultas Agendadas
    console.log("\n1️⃣1️⃣ Listando consultas agendadas...");
    const consultasAgendadasResponse = await axios.get(`${API_URL}/consultas/agendadas`);
    console.log("✅ Consultas Agendadas:", consultasAgendadasResponse.data.data);

    // 12. Gerar Relatório Financeiro
    console.log("\n1️⃣2️⃣ Gerando relatório financeiro...");
    const relatorioResponse = await axios.get(`${API_URL}/relatorio-financeiro`);
    console.log("✅ Relatório Financeiro:", relatorioResponse.data.data);

    console.log("\n✨ Todos os testes foram bem-sucedidos!");
  } catch (error) {
    if (error.response) {
      console.error("❌ Erro:", error.response.status, error.response.data);
    } else {
      console.error("❌ Erro:", error.message);
    }
    process.exit(1);
  }
}

testarAPI();

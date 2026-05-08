import { ConsultaRepository } from "../repositories/ConsultaRepository.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { PacienteRepository } from "../repositories/PacienteRepository.js";
import { PlanoSaudeRepository } from "../repositories/PlanoSaudeRepository.js";

export class SistemaClinica {
  constructor(db) {
    this.db = db;
    this.planoRepo = new PlanoSaudeRepository(db);
    this.pacienteRepo = new PacienteRepository(db);
    this.medicoRepo = new MedicoRepository(db);
    this.consultaRepo = new ConsultaRepository(db);
  }

  async cadastrarPaciente(paciente) {
    const id = await this.pacienteRepo.criar(paciente);
    return await this.pacienteRepo.buscarPorId(id);
  }

  async cadastrarMedico(medico) {
    const id = await this.medicoRepo.criar(medico);
    return await this.medicoRepo.buscarPorId(id);
  }

  async cadastrarPlano(plano) {
    const id = await this.planoRepo.criar(plano);
    return await this.planoRepo.buscarPorId(id);
  }

  async obterPacientes() {
    return await this.pacienteRepo.buscarTodos();
  }

  async obterPacientePorId(id) {
    const paciente = await this.pacienteRepo.buscarPorId(id);
    if (!paciente) throw new Error("Paciente não encontrado");
    return paciente;
  }

  async obterMedicos() {
    return await this.medicoRepo.buscarTodos();
  }

  async obterMedicoPorId(id) {
    const medico = await this.medicoRepo.buscarPorId(id);
    if (!medico) throw new Error("Médico não encontrado");
    return medico;
  }

  async obterPlanos() {
    return await this.planoRepo.buscarTodos();
  }

  async obterPlanoPorId(id) {
    const plano = await this.planoRepo.buscarPorId(id);
    if (!plano) throw new Error("Plano não encontrado");
    return plano;
  }

  async validarPlanoParaConsulta(planoId, valorConsulta, dataConsulta) {
    const plano = await this.obterPlanoPorId(planoId);

    if (!plano.validarPlano(dataConsulta)) {
      return {
        valido: false,
        motivo: "Plano de saúde vencido",
      };
    }

    if (!plano.cobreValor(Number(valorConsulta))) {
      return {
        valido: false,
        motivo: "Valor da consulta excede o limite de cobertura do plano",
      };
    }

    return {
      valido: true,
      motivo: "Plano válido",
    };
  }

  async atualizarPlano(id, dados) {
    return await this.planoRepo.atualizar(id, dados);
  }

  async vincularPlano(pacienteId, planoId) {
    await this.obterPlanoPorId(planoId);
    const paciente = await this.obterPacientePorId(pacienteId);
    paciente.vincularPlano({ id: planoId });
    await this.pacienteRepo.atualizar(pacienteId, paciente);
    return await this.obterPacientePorId(pacienteId);
  }

  async agendarConsulta({ pacienteId, medicoId, dataConsulta, valor }) {
    const paciente = await this.obterPacientePorId(pacienteId);
    await this.obterMedicoPorId(medicoId);

    if (!paciente.planoSaudeId) {
      throw new Error("Paciente sem plano de saúde vinculado");
    }

    const validacaoPlano = await this.validarPlanoParaConsulta(
      paciente.planoSaudeId,
      valor,
      dataConsulta,
    );

    if (!validacaoPlano.valido) {
      throw new Error(validacaoPlano.motivo);
    }

    const horarioOcupado = await this.consultaRepo.existeHorarioOcupado(
      medicoId,
      dataConsulta,
    );

    if (horarioOcupado) {
      throw new Error("Já existe consulta agendada para este médico neste horário");
    }

    return await this.consultaRepo.criar({
      pacienteId,
      medicoId,
      dataConsulta,
      valor,
    });
  }

  async obterConsultas() {
    return await this.consultaRepo.buscarTodos();
  }

  async obterConsultaPorId(id) {
    const consulta = await this.consultaRepo.buscarPorId(id);
    if (!consulta) throw new Error("Consulta não encontrada");
    return consulta;
  }

  async obterConsultasPorPaciente(pacienteId) {
    await this.obterPacientePorId(pacienteId);
    return await this.consultaRepo.buscarPorPaciente(pacienteId);
  }

  async obterConsultasPorMedico(medicoId) {
    await this.obterMedicoPorId(medicoId);
    return await this.consultaRepo.buscarPorMedico(medicoId);
  }

  async obterConsultasAgendadas() {
    return await this.consultaRepo.buscarAgendadas();
  }

  async cancelarConsulta(id) {
    const consulta = await this.obterConsultaPorId(id);
    if (consulta.status === "REALIZADA") {
      throw new Error("Consultas realizadas não podem ser canceladas");
    }

    return await this.consultaRepo.atualizarStatus(id, "CANCELADA");
  }

  async registrarPagamento({ consultaId, valor, dataPagamento }) {
    await this.obterConsultaPorId(consultaId);
    return await this.consultaRepo.registrarPagamento({
      consultaId,
      valor,
      dataPagamento,
    });
  }

  async emitirReceita({ consultaId, descricao, dosagem, tempoTratamento }) {
    const consulta = await this.obterConsultaPorId(consultaId);
    await this.consultaRepo.emitirReceita({
      consultaId,
      medicoId: consulta.medico.id,
      descricao,
      dosagem,
      tempoTratamento,
    });

    return await this.obterConsultaPorId(consultaId);
  }

  async encerrarConsulta({
    consultaId,
    valorPagamento,
    dataPagamento,
    descricao,
    dosagem,
    tempoTratamento,
  }) {
    const consulta = await this.obterConsultaPorId(consultaId);

    if (consulta.status !== "AGENDADA") {
      throw new Error("Apenas consultas agendadas podem ser encerradas");
    }

    const pagamento = Number(valorPagamento || consulta.saldo || consulta.valor);
    if (pagamento > 0) {
      await this.registrarPagamento({
        consultaId,
        valor: pagamento,
        dataPagamento: dataPagamento || new Date().toISOString().split("T")[0],
      });
    }

    if (descricao && dosagem && tempoTratamento) {
      await this.consultaRepo.emitirReceita({
        consultaId,
        medicoId: consulta.medico.id,
        descricao,
        dosagem,
        tempoTratamento,
      });
    }

    return await this.consultaRepo.atualizarStatus(consultaId, "REALIZADA");
  }

  async gerarRelatorioFinanceiro(medicoId = null) {
    return await this.consultaRepo.gerarRelatorioFinanceiro(medicoId);
  }
}

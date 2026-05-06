import { Consulta } from "../models/Consulta.js";
import { PlanoSaude } from "../models/PlanoSaude.js";
import { RelatorioFinanceiro } from "../models/RelatorioFinanceiro.js";
import { ConsultaRepository } from "../repositories/ConsultaRepository.js";
import { MedicoRepository } from "../repositories/MedicoRepository.js";
import { PacienteRepository } from "../repositories/PacienteRepository.js";
import { PlanoSaudeRepository } from "../repositories/PlanoSaudeRepository.js";

export class SistemaClinica {
  constructor(db) {
    this.db = db;
    this.planoRepo = new PlanoSaudeRepository(db);
    this.pacienteRepo = new PacienteRepository(db);
    this.madicoRepo = new MedicoRepository(db);
    this.consultaRepo = new ConsultaRepository(db);
  }

  async cadastrarPaciente(paciente) {
    return await this.pacienteRepo.criar(paciente);
  }

  async cadastrarMedico(medico) {
    return await this.madicoRepo.criar(medico);
  }

  async cadastrarPlano(dados) {
    const plano = new PlanoSaude(
      null,
      dados.nome,
      dados.limiteCobertura,
      dados.dataValidade,
    );

    return await this.planoRepo.criar(plano);
  }

  agendarConsulta(paciente, medico, data, valor) {
    const consulta = new Consulta(
      this.consultas.length + 1,
      data,
      valor,
      paciente,
      medico,
    );
    consulta.agendar();
    this.consultas.push(consulta);
    return consulta;
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
    return await this.madicoRepo.buscarTodos();
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
    const plano = await this.planoRepo.buscarPorId(planoId);

    if (!plano) {
      throw new Error("Plano não encontrado");
    }

    if (!plano.validarPlano(dataConsulta)) {
      return {
        valido: false,
        motivo: "Plano vencido",
      };
    }

    if (!plano.cobreValor(valorConsulta)) {
      return {
        valido: false,
        motivo: "Valor excede cobertura",
      };
    }

    return {
      valido: true,
      motivo: "Plano válido",
    };
  }

  async atualizarPlano(id, dados) {
    const plano = new PlanoSaude(
      id,
      dados.nome,
      dados.limiteCobertura,
      dados.dataValidade,
    );

    return await this.planoRepo.atualizar(id, plano);
  }

  obterConsultas() {
    return this.consultas;
  }

  async obterConsultasPorPaciente(pacienteId) {
    return await this.consultaRepo.obterConsultasPorPaciente(pacienteId);
  }

  obterConsultasAgendadas() {
    return this.consultas.filter((c) => c.status === "Agendada");
  }

  gerarRelatorioFinanceiro() {
    const relatorio = new RelatorioFinanceiro(
      1,
      new Date().toLocaleDateString("pt-BR"),
      this.consultas,
    );
    return relatorio.gerarRelatorio();
  }
}

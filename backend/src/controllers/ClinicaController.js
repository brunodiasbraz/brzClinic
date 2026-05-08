import { Medico } from "../models/Medico.js";
import { Paciente } from "../models/Paciente.js";
import { PlanoSaude } from "../models/PlanoSaude.js";

export class ClinicaController {
  constructor(sistemaClinica) {
    this.sistema = sistemaClinica;
  }

  responderErro(res, error, status = 500) {
    res.status(status).json({
      success: false,
      message: error.message,
    });
  }

  async obterPacientes(req, res) {
    try {
      const pacientes = await this.sistema.obterPacientes();
      res.status(200).json({ success: true, data: pacientes });
    } catch (error) {
      this.responderErro(res, error);
    }
  }

  async obterPacientePorId(req, res) {
    try {
      const paciente = await this.sistema.obterPacientePorId(req.params.id);
      res.status(200).json({ success: true, data: paciente });
    } catch (error) {
      this.responderErro(res, error, 404);
    }
  }

  async cadastrarPaciente(req, res) {
    try {
      const {
        nome,
        endereco,
        dataNascimento,
        telefone,
        email,
        cpf,
        planoSaudeId,
      } = req.body;

      if (!nome || !telefone || !email || !cpf || !planoSaudeId) {
        return res.status(400).json({
          success: false,
          message: "Nome, telefone, email, CPF e plano de saúde são obrigatórios",
        });
      }

      const paciente = new Paciente(
        null,
        nome,
        endereco,
        dataNascimento,
        telefone,
        email,
        cpf,
        planoSaudeId,
      );
      const pacienteCriado = await this.sistema.cadastrarPaciente(paciente);

      res.status(201).json({
        success: true,
        message: "Paciente cadastrado com sucesso",
        data: pacienteCriado,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async obterMedicos(req, res) {
    try {
      const medicos = await this.sistema.obterMedicos();
      res.status(200).json({ success: true, data: medicos });
    } catch (error) {
      this.responderErro(res, error);
    }
  }

  async cadastrarMedico(req, res) {
    try {
      const { nome, especialidade, crm } = req.body;

      if (!nome || !especialidade || !crm) {
        return res.status(400).json({
          success: false,
          message: "Nome, especialidade e CRM são obrigatórios",
        });
      }

      const medico = new Medico(null, nome, especialidade, crm);
      const medicoCriado = await this.sistema.cadastrarMedico(medico);

      res.status(201).json({
        success: true,
        message: "Médico cadastrado com sucesso",
        data: medicoCriado,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async obterPlanos(req, res) {
    try {
      const planos = await this.sistema.obterPlanos();
      res.status(200).json({ success: true, data: planos });
    } catch (error) {
      this.responderErro(res, error);
    }
  }

  async obterPlanoPorId(req, res) {
    try {
      const plano = await this.sistema.obterPlanoPorId(req.params.id);
      res.status(200).json({ success: true, data: plano });
    } catch (error) {
      this.responderErro(res, error, 404);
    }
  }

  async cadastrarPlano(req, res) {
    try {
      const { nome, limiteCobertura, dataValidade } = req.body;

      if (!nome || !limiteCobertura || !dataValidade) {
        return res.status(400).json({
          success: false,
          message: "Nome, limite de cobertura e data de validade são obrigatórios",
        });
      }

      const plano = new PlanoSaude(null, nome, limiteCobertura, dataValidade);
      const planoCriado = await this.sistema.cadastrarPlano(plano);

      res.status(201).json({
        success: true,
        message: "Plano cadastrado com sucesso",
        data: planoCriado,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async atualizarPlano(req, res) {
    try {
      await this.sistema.atualizarPlano(req.params.id, req.body);
      const plano = await this.sistema.obterPlanoPorId(req.params.id);
      res.status(200).json({
        success: true,
        message: "Plano atualizado com sucesso",
        data: plano,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async validarPlano(req, res) {
    try {
      const { planoId, valorConsulta, dataConsulta } = req.body;
      const validacao = await this.sistema.validarPlanoParaConsulta(
        planoId,
        valorConsulta,
        dataConsulta,
      );
      res.status(200).json({ success: true, data: validacao });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async vincularPlano(req, res) {
    try {
      const { pacienteId, planoId } = req.body;
      const paciente = await this.sistema.vincularPlano(pacienteId, planoId);

      res.status(200).json({
        success: true,
        message: "Plano vinculado com sucesso",
        data: paciente,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async agendarConsulta(req, res) {
    try {
      const pacienteId = req.body.pacienteId || req.body.paciente_id;
      const medicoId = req.body.medicoId || req.body.medico_id;
      const dataConsulta = req.body.dataConsulta || req.body.data_consulta || req.body.data;
      const valor = req.body.valor;

      if (!pacienteId || !medicoId || !dataConsulta || !valor) {
        return res.status(400).json({
          success: false,
          message: "Paciente, médico, data e valor são obrigatórios",
        });
      }

      const consulta = await this.sistema.agendarConsulta({
        pacienteId,
        medicoId,
        dataConsulta,
        valor,
      });

      res.status(201).json({
        success: true,
        message: "Consulta agendada com sucesso",
        data: consulta,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async obterConsultas(req, res) {
    try {
      const consultas = await this.sistema.obterConsultas();
      res.status(200).json({ success: true, data: consultas });
    } catch (error) {
      this.responderErro(res, error);
    }
  }

  async obterConsultasAgendadas(req, res) {
    try {
      const consultas = await this.sistema.obterConsultasAgendadas();
      res.status(200).json({ success: true, data: consultas });
    } catch (error) {
      this.responderErro(res, error);
    }
  }

  async obterConsultasPorPaciente(req, res) {
    try {
      const consultas = await this.sistema.obterConsultasPorPaciente(req.params.id);
      res.status(200).json({ success: true, data: consultas });
    } catch (error) {
      this.responderErro(res, error, 404);
    }
  }

  async obterConsultasPorMedico(req, res) {
    try {
      const consultas = await this.sistema.obterConsultasPorMedico(req.params.id);
      res.status(200).json({ success: true, data: consultas });
    } catch (error) {
      this.responderErro(res, error, 404);
    }
  }

  async cancelarConsulta(req, res) {
    try {
      const consulta = await this.sistema.cancelarConsulta(req.params.id);
      res.status(200).json({
        success: true,
        message: "Consulta cancelada com sucesso",
        data: consulta,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async encerrarConsulta(req, res) {
    try {
      const consulta = await this.sistema.encerrarConsulta({
        consultaId: req.params.id,
        ...req.body,
      });

      res.status(200).json({
        success: true,
        message: "Consulta encerrada com sucesso",
        data: consulta,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async registrarPagamento(req, res) {
    try {
      const pagamento = await this.sistema.registrarPagamento(req.body);
      res.status(201).json({
        success: true,
        message: "Pagamento registrado com sucesso",
        data: pagamento,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async emitirReceita(req, res) {
    try {
      const consulta = await this.sistema.emitirReceita(req.body);
      res.status(201).json({
        success: true,
        message: "Receita emitida com sucesso",
        data: consulta,
      });
    } catch (error) {
      this.responderErro(res, error, 400);
    }
  }

  async gerarRelatorioFinanceiro(req, res) {
    try {
      const relatorio = await this.sistema.gerarRelatorioFinanceiro(
        req.query.medicoId || null,
      );
      res.status(200).json({ success: true, data: relatorio });
    } catch (error) {
      this.responderErro(res, error);
    }
  }
}

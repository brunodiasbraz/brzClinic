import { Paciente } from "../models/Paciente.js";
import { PlanoSaude } from "../models/PlanoSaude.js";
import { Medico } from "../models/Medico.js";
import { Pagamento } from "../models/Pagamento.js";

export class ClinicaController {
  constructor(sistemaClinica) {
    this.sistema = sistemaClinica;
  }

  async obterPacientes(req, res) {
    try {
      const pacientes = await this.sistema.obterPacientes();
      res.status(200).json({
        success: true,
        data: pacientes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obterPacientePorId(req, res) {
    try {
      const paciente = await this.sistema.obterPacientePorId(req.params.id);
      if (!paciente) {
        return res.status(404).json({
          success: false,
          message: "Paciente não encontrado",
        });
      }
      res.status(200).json({
        success: true,
        data: paciente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obterConsultasPorPaciente(req, res) {
    try {
      const paciente = await this.sistema.obterPacientePorId(req.params.id);
      if (!paciente) {
        return res.status(404).json({
          success: false,
          message: "Paciente não encontrado",
        });
      }
      const consultas = await this.sistema.obterConsultasPorPaciente(paciente.id);
      res.status(200).json({
        success: true,
        data: consultas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  
  cadastrarPaciente(req, res) {
    try {
      const {
        id,
        nome,
        endereco,
        dataNascimento,
        telefone,
        email,
        cpf,
        planoSaudeId,
      } = req.body;

      if (!nome || !email || !cpf || !planoSaudeId) {
        return res.status(400).json({
          success: false,
          message: "Nome, email, CPF e ID do plano de saúde são obrigatórios",
        });
      }

      const paciente = new Paciente(
        id,
        nome,
        endereco,
        dataNascimento,
        telefone,
        email,
        cpf,
        planoSaudeId
      );

      this.sistema.cadastrarPaciente(paciente);

      res.status(201).json({
        success: true,
        message: "Paciente cadastrado com sucesso",
        data: paciente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  cadastrarMedico(req, res) {
    try {
      const { id, nome, especialidade, crm } = req.body;

      if (!nome || !especialidade || !crm) {
        return res.status(400).json({
          success: false,
          message: "Nome, especialidade e CRM são obrigatórios",
        });
      }

      const medico = new Medico(id, nome, especialidade, crm);
      this.sistema.cadastrarMedico(medico);

      res.status(201).json({
        success: true,
        message: "Médico cadastrado com sucesso",
        data: medico,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  cadastrarPlano(req, res) {
    try {
      const { id, nome, limiteCobertura, dataValidade } = req.body;

      if (!nome || !limiteCobertura || !dataValidade) {
        return res.status(400).json({
          success: false,
          message:
            "Nome, limite de cobertura e data de validade são obrigatórios",
        });
      }

      const plano = new PlanoSaude(id, nome, limiteCobertura, dataValidade);
      this.sistema.cadastrarPlano(plano);

      res.status(201).json({
        success: true,
        message: "Plano cadastrado com sucesso",
        data: plano,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  vincularPlano(req, res) {
    try {
      const { pacienteId, planoId } = req.body;

      const paciente = this.sistema
        .obterPacientes()
        .find((p) => p.id === pacienteId);
      const plano = this.sistema.obterPlanos().find((p) => p.id === planoId);

      if (!paciente || !plano) {
        return res.status(404).json({
          success: false,
          message: "Paciente ou plano não encontrado",
        });
      }

      paciente.vincularPlano(plano);

      res.status(200).json({
        success: true,
        message: "Plano vinculado com sucesso",
        data: paciente,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obterPacientes(req, res) {
    try {
      const pacientes = await this.sistema.obterPacientes();
      res.status(200).json({
        success: true,
        data: pacientes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  obterMedicos(req, res) {
    try {
      const medicos = this.sistema.obterMedicos();
      res.status(200).json({
        success: true,
        data: medicos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obterPlanos(req, res) {
    try {
      const planos = await this.sistema.obterPlanos();
      res.status(200).json({
        success: true,
        data: planos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obterPlanoPorId(req, res) {
    try {
      const plano = await this.sistema.obterPlanoPorId(req.params.id);
      res.status(200).json({
        success: true,
        data: plano,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  agendarConsulta(req, res) {
    try {
      const { pacienteId, medicoId, data, valor } = req.body;

      const paciente = this.sistema
        .obterPacientes()
        .find((p) => p.id === pacienteId);
      const medico = this.sistema.obterMedicos().find((m) => m.id === medicoId);

      if (!paciente || !medico) {
        return res.status(404).json({
          success: false,
          message: "Paciente ou médico não encontrado",
        });
      }

      const consulta = this.sistema.agendarConsulta(
        paciente,
        medico,
        data,
        valor,
      );

      res.status(201).json({
        success: true,
        message: "Consulta agendada com sucesso",
        data: {
          id: consulta.id,
          data: consulta.data,
          valor: consulta.valor,
          status: consulta.status,
          paciente: {
            id: paciente.id,
            nome: paciente.nome,
            email: paciente.email,
          },
          medico: {
            id: medico.id,
            nome: medico.nome,
            especialidade: medico.especialidade,
          },
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  obterConsultas(req, res) {
    try {
      const consultas = this.sistema.obterConsultas().map((c) => ({
        id: c.id,
        data: c.data,
        valor: c.valor,
        status: c.status,
        paciente: {
          id: c.paciente.id,
          nome: c.paciente.nome,
          email: c.paciente.email,
          cpf: c.paciente.cpf,
        },
        medico: {
          id: c.medico.id,
          nome: c.medico.nome,
          especialidade: c.medico.especialidade,
          crm: c.medico.crm,
        },
        receita: c.receita
          ? {
              id: c.receita.id,
              descricao: c.receita.descricao,
              dosagem: c.receita.dosagem,
              tempoTratamento: c.receita.tempoTratamento,
              emitida: c.receita.emitida,
            }
          : null,
        pagamentos: c.pagamentos.map((p) => ({
          id: p.id,
          valor: p.valor,
          dataPagamento: p.dataPagamento,
        })),
      }));
      res.status(200).json({
        success: true,
        data: consultas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  obterConsultasAgendadas(req, res) {
    try {
      const consultas = this.sistema.obterConsultasAgendadas().map((c) => ({
        id: c.id,
        data: c.data,
        valor: c.valor,
        status: c.status,
        paciente: {
          id: c.paciente.id,
          nome: c.paciente.nome,
          email: c.paciente.email,
          cpf: c.paciente.cpf,
        },
        medico: {
          id: c.medico.id,
          nome: c.medico.nome,
          especialidade: c.medico.especialidade,
          crm: c.medico.crm,
        },
        receita: c.receita
          ? {
              id: c.receita.id,
              descricao: c.receita.descricao,
              dosagem: c.receita.dosagem,
              tempoTratamento: c.receita.tempoTratamento,
              emitida: c.receita.emitida,
            }
          : null,
        pagamentos: c.pagamentos.map((p) => ({
          id: p.id,
          valor: p.valor,
          dataPagamento: p.dataPagamento,
        })),
      }));
      res.status(200).json({
        success: true,
        data: consultas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  registrarPagamento(req, res) {
    try {
      const { consultaId, valor, dataPagamento } = req.body;

      const consulta = this.sistema
        .obterConsultas()
        .find((c) => c.id === consultaId);

      if (!consulta) {
        return res.status(404).json({
          success: false,
          message: "Consulta não encontrada",
        });
      }

      const pagamento = new Pagamento(1, valor, dataPagamento, consulta);
      pagamento.registrar();

      res.status(201).json({
        success: true,
        message: "Pagamento registrado com sucesso",
        data: {
          pagamentoId: pagamento.id,
          valor: pagamento.valor,
          dataPagamento: pagamento.dataPagamento,
          consultaId: consulta.id,
          statusConsulta: consulta.status,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  emitirReceita(req, res) {
    try {
      const { consultaId, descricao, dosagem, tempoTratamento } = req.body;

      const consulta = this.sistema
        .obterConsultas()
        .find((c) => c.id === consultaId);

      if (!consulta) {
        return res.status(404).json({
          success: false,
          message: "Consulta não encontrada",
        });
      }

      const receita = consulta.medico.emitirReceita(
        consulta,
        descricao,
        dosagem,
        tempoTratamento,
      );

      res.status(201).json({
        success: true,
        message: "Receita emitida com sucesso",
        data: {
          id: receita.id,
          descricao: receita.descricao,
          dosagem: receita.dosagem,
          tempoTratamento: receita.tempoTratamento,
          emitida: receita.emitida,
          medico: {
            id: receita.medico.id,
            nome: receita.medico.nome,
            especialidade: receita.medico.especialidade,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  gerarRelatorioFinanceiro(req, res) {
    try {
      const relatorio = this.sistema.gerarRelatorioFinanceiro();
      res.status(200).json({
        success: true,
        data: relatorio,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obterMedicos(req, res) {
    try {
      const medicos = await this.sistema.obterMedicos();
      res.status(200).json({
        success: true,
        data: medicos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

import { Consulta } from "../models/Consulta.js";
import { Medico } from "../models/Medico.js";
import { Paciente } from "../models/Paciente.js";

export class ConsultaRepository {
  constructor(db) {
    this.db = db;
    this.tabela = "consulta";
  }

  mapToModel(row) {
    const medico = new Medico(row.medico_id, row.medico, row.especialidade);

    const paciente = new Paciente(row.paciente_id, row.paciente);

    return new Consulta(
      row.id,
      row.data_consulta,
      row.valor,
      row.status,
      paciente,
      medico,
    );
  }

  async salvarConsulta(consulta) {
    const { medico, paciente, dataHora, motivo } = consulta;

    const id = await this.db.insert(this.tabela, {
      medico_id: medico.id,
      paciente_id: paciente.id,
      data_hora: dataHora,
      motivo,
    });

    return id;
  }

  async obterConsultas() {
    const rows = await this.db.buscarTodos(this.tabela);
    return rows.map((row) => ({
      id: row.id,
      medicoId: row.medico_id,
      pacienteId: row.paciente_id,
      dataHora: row.data_hora,
      motivo: row.motivo,
    }));
  }

  async obterConsultasPorPaciente(pacienteId) {
    const rows = await this.db.query(
      `SELECT
      c.id,
      c.paciente_id,
      c.medico_id,
      p.nome AS paciente,
      p.plano_saude_id,
      m.nome AS medico,
      m.especialidade,
      c.data_consulta,
      c.status,
      c.valor,
      r.descricao AS relatorio
    FROM ${this.tabela} c
    JOIN paciente p ON p.id = c.paciente_id
    JOIN medico m ON m.id = c.medico_id
    LEFT JOIN receita r ON r.consulta_id = c.id
    WHERE c.paciente_id = ?
    ORDER BY c.data_consulta DESC`,
      [pacienteId],
    );
    return rows.map((row) => this.mapToModel(row));
  }
}

export class ConsultaRepository {
  constructor(db) {
    this.db = db;
    this.tabela = "consulta";
  }

  mapToDto(row) {
    return {
      id: row.id,
      data: row.data_consulta,
      valor: Number(row.valor),
      status: row.status,
      paciente: {
        id: row.paciente_id,
        nome: row.paciente,
        email: row.paciente_email,
        cpf: row.cpf,
        telefone: row.telefone,
        planoSaudeId: row.plano_saude_id,
        planoSaude: row.plano_nome
          ? {
              id: row.plano_saude_id,
              nome: row.plano_nome,
              limiteCobertura: Number(row.limite_cobertura),
              dataValidade: row.data_validade,
            }
          : null,
      },
      medico: {
        id: row.medico_id,
        nome: row.medico,
        especialidade: row.especialidade,
        crm: row.crm,
      },
      receita: row.receita_id
        ? {
            id: row.receita_id,
            descricao: row.receita_descricao,
            dosagem: row.dosagem,
            tempoTratamento: row.tempo_tratamento,
          }
        : null,
      valorPago: Number(row.valor_total_pago || 0),
      saldo: Number(row.valor) - Number(row.valor_total_pago || 0),
    };
  }

  consultaSelect() {
    return `
      SELECT
        c.id,
        c.data_consulta,
        c.valor,
        c.status,
        p.id AS paciente_id,
        p.nome AS paciente,
        p.email AS paciente_email,
        p.cpf,
        p.telefone,
        p.plano_saude_id,
        ps.nome AS plano_nome,
        ps.limite_cobertura,
        ps.data_validade,
        m.id AS medico_id,
        m.nome AS medico,
        m.especialidade,
        m.crm,
        r.id AS receita_id,
        r.descricao AS receita_descricao,
        r.dosagem,
        r.tempo_tratamento,
        COALESCE(SUM(pg.valor), 0) AS valor_total_pago
      FROM ${this.tabela} c
      JOIN paciente p ON p.id = c.paciente_id
      JOIN medico m ON m.id = c.medico_id
      LEFT JOIN plano_saude ps ON ps.id = p.plano_saude_id
      LEFT JOIN receita r ON r.consulta_id = c.id
      LEFT JOIN pagamento pg ON pg.consulta_id = c.id
    `;
  }

  consultaGroupBy() {
    return `
      GROUP BY
        c.id,
        c.data_consulta,
        c.valor,
        c.status,
        p.id,
        p.nome,
        p.email,
        p.cpf,
        p.telefone,
        p.plano_saude_id,
        ps.nome,
        ps.limite_cobertura,
        ps.data_validade,
        m.id,
        m.nome,
        m.especialidade,
        m.crm,
        r.id,
        r.descricao,
        r.dosagem,
        r.tempo_tratamento
    `;
  }

  async criar({ pacienteId, medicoId, dataConsulta, valor }) {
    const id = await this.db.inserir(this.tabela, {
      paciente_id: pacienteId,
      medico_id: medicoId,
      data_consulta: dataConsulta,
      valor,
      status: "AGENDADA",
    });

    return this.buscarPorId(id);
  }

  async buscarPorId(id) {
    const rows = await this.db.query(
      `${this.consultaSelect()}
       WHERE c.id = ?
       ${this.consultaGroupBy()}`,
      [id],
    );

    return rows[0] ? this.mapToDto(rows[0]) : null;
  }

  async buscarTodos() {
    const rows = await this.db.query(
      `${this.consultaSelect()}
       ${this.consultaGroupBy()}
       ORDER BY c.data_consulta DESC`,
    );

    return rows.map((row) => this.mapToDto(row));
  }

  async buscarPorPaciente(pacienteId) {
    const rows = await this.db.query(
      `${this.consultaSelect()}
       WHERE c.paciente_id = ?
       ${this.consultaGroupBy()}
       ORDER BY c.data_consulta DESC`,
      [pacienteId],
    );

    return rows.map((row) => this.mapToDto(row));
  }

  async buscarPorMedico(medicoId) {
    const rows = await this.db.query(
      `${this.consultaSelect()}
       WHERE c.medico_id = ?
       ${this.consultaGroupBy()}
       ORDER BY c.data_consulta DESC`,
      [medicoId],
    );

    return rows.map((row) => this.mapToDto(row));
  }

  async buscarAgendadas() {
    const rows = await this.db.query(
      `${this.consultaSelect()}
       WHERE c.status = 'AGENDADA'
       ${this.consultaGroupBy()}
       ORDER BY c.data_consulta ASC`,
    );

    return rows.map((row) => this.mapToDto(row));
  }

  async existeHorarioOcupado(medicoId, dataConsulta) {
    const rows = await this.db.query(
      `SELECT id
         FROM ${this.tabela}
        WHERE medico_id = ?
          AND data_consulta = ?
          AND status <> 'CANCELADA'
        LIMIT 1`,
      [medicoId, dataConsulta],
    );

    return rows.length > 0;
  }

  async atualizarStatus(id, status) {
    await this.db.atualizar(this.tabela, id, { status });
    return this.buscarPorId(id);
  }

  async registrarPagamento({ consultaId, valor, dataPagamento }) {
    const pagamentoId = await this.db.inserir("pagamento", {
      consulta_id: consultaId,
      valor,
      data_pagamento: dataPagamento,
    });

    return { id: pagamentoId, consultaId, valor: Number(valor), dataPagamento };
  }

  async emitirReceita({ consultaId, medicoId, descricao, dosagem, tempoTratamento }) {
    const existente = await this.db.query(
      "SELECT id FROM receita WHERE consulta_id = ? LIMIT 1",
      [consultaId],
    );

    if (existente[0]) {
      await this.db.atualizar("receita", existente[0].id, {
        descricao,
        dosagem,
        tempo_tratamento: tempoTratamento,
        medico_id: medicoId,
      });
      return existente[0].id;
    }

    return await this.db.inserir("receita", {
      consulta_id: consultaId,
      medico_id: medicoId,
      descricao,
      dosagem,
      tempo_tratamento: tempoTratamento,
    });
  }

  async gerarRelatorioFinanceiro(medicoId = null) {
    const params = [];
    const where = medicoId ? "WHERE m.id = ?" : "";
    if (medicoId) params.push(medicoId);

    const rows = await this.db.query(
      `SELECT
         c.id AS consulta_id,
         p.nome AS paciente,
         p.cpf,
         m.id AS medico_id,
         m.nome AS medico,
         m.especialidade,
         c.data_consulta,
         c.status,
         c.valor AS valor_consulta,
         COALESCE(SUM(pg.valor), 0) AS valor_total_pago
       FROM consulta c
       JOIN paciente p ON p.id = c.paciente_id
       JOIN medico m ON m.id = c.medico_id
       LEFT JOIN pagamento pg ON pg.consulta_id = c.id
       ${where}
       GROUP BY
         c.id,
         p.nome,
         p.cpf,
         m.id,
         m.nome,
         m.especialidade,
         c.data_consulta,
         c.status,
         c.valor
       ORDER BY c.data_consulta DESC`,
      params,
    );

    return {
      dataEmissao: new Date().toISOString().split("T")[0],
      valorTotalRecebido: rows.reduce(
        (total, row) => total + Number(row.valor_total_pago || 0),
        0,
      ),
      consultas: rows.map((row) => ({
        consultaId: row.consulta_id,
        paciente: row.paciente,
        cpf: row.cpf,
        medicoId: row.medico_id,
        medico: row.medico,
        especialidade: row.especialidade,
        dataConsulta: row.data_consulta,
        status: row.status,
        valorConsulta: Number(row.valor_consulta),
        valorTotalPago: Number(row.valor_total_pago || 0),
      })),
    };
  }
}

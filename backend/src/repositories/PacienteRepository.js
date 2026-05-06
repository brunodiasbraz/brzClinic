import { Paciente } from "../models/Paciente.js";

export class PacienteRepository {
  constructor(db) {
    this.db = db;
    this.tabela = "paciente";
  }

  mapToModel(row) {
    return new Paciente(
      row.id,
      row.nome,
      row.endereco,
      row.data_nascimento,
      row.telefone,
      row.email,
      row.cpf,
      row.plano_saude_id
    );
  }

  async buscarTodos() {
    const rows = await this.db.buscarTodos(this.tabela);
    return rows.map((row) => this.mapToModel(row));
  }

  async buscarPorId(id) {
    const row = await this.db.buscarPorId(this.tabela, id);
    if (!row) return null;
    return this.mapToModel(row);
  }

  async criar(paciente) {
    const id = await this.db.inserir(this.tabela, {
      nome: paciente.nome,
      endereco: paciente.endereco,
      data_nascimento: paciente.dataNascimento,
      telefone: paciente.telefone,
      email: paciente.email,
      cpf: paciente.cpf,
      plano_saude_id: paciente.planoSaudeId
    });

    return id;
  }

  async atualizar(id, paciente) {
    return await this.db.atualizar(this.tabela, id, {
      nome: paciente.nome,
      endereco: paciente.endereco,
      data_nascimento: paciente.dataNascimento,
      telefone: paciente.telefone,
      email: paciente.email,
      cpf: paciente.cpf,
    });
  }

  async deletar(id) {
    return await this.db.deletar(this.tabela, id);
  }
}

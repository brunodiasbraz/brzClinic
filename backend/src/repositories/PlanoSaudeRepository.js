import { PlanoSaude } from "../models/PlanoSaude.js";

export class PlanoSaudeRepository {
  constructor(db) {
    this.db = db;
    this.tabela = "plano_saude";
  }

  mapToModel(row) {
    return new PlanoSaude(
      row.id,
      row.nome,
      row.limite_cobertura,
      row.data_validade
    );
  }

  async buscarTodos() {
    const rows = await this.db.buscarTodos(this.tabela);
    return rows.map(row => this.mapToModel(row));
  }

  async buscarPorId(id) {
    const row = await this.db.buscarPorId(this.tabela, id);
    if (!row) return null;
    return this.mapToModel(row);
  }

  async criar(plano) {
    const id = await this.db.inserir(this.tabela, {
      nome: plano.nome,
      limite_cobertura: plano.limiteCobertura,
      data_validade: plano.dataValidade
    });

    return id;
  }

  async atualizar(id, plano) {
    return await this.db.atualizar(this.tabela, id, {
      nome: plano.nome,
      limite_cobertura: plano.limiteCobertura,
      data_validade: plano.dataValidade
    });
  }

  async deletar(id) {
    return await this.db.deletar(this.tabela, id);
  }
}
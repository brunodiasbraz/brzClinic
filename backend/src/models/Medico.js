import { Receita } from "./Receita.js";

export class Medico {
  constructor(id, nome, especialidade, crm) {
    this.id = id;
    this.nome = nome;
    this.especialidade = especialidade;
    this.crm = crm;
  }

  emitirReceita(consulta, descricao, dosagem, tempoTratamento) {
    const receita = new Receita(
      consulta.id,
      descricao,
      dosagem,
      tempoTratamento,
      this,
      consulta
    );

    receita.emitir();
    consulta.adicionarReceita(receita);
    return receita;
  }
}

export class Receita {
  constructor(id, descricao, dosagem, tempoTratamento, medico, consulta) {
    this.id = id;
    this.descricao = descricao;
    this.dosagem = dosagem;
    this.tempoTratamento = tempoTratamento;
    this.medico = medico;
    this.consulta = consulta;
    this.emitida = false;
  }

  emitir() {
    this.emitida = true;
  }
}

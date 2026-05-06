export class PlanoSaude {
  constructor(id, nome, limiteCobertura, dataValidade) {
    this.id = id;
    this.nome = nome;
    this.limiteCobertura = limiteCobertura;
    this.dataValidade = new Date(dataValidade);
  }

  validarPlano(dataConsulta) {
    return this.dataValidade >= new Date(dataConsulta);
  }

  cobreValor(valor) {
    return this.limiteCobertura >= valor;
  }
}

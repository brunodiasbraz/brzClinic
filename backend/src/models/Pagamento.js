export class Pagamento {
  constructor(id, valor, dataPagamento, consulta) {
    this.id = id;
    this.valor = valor;
    this.dataPagamento = dataPagamento;
    this.consulta = consulta;
  }

  registrar() {
    this.consulta.registrarPagamento(this);
  }
}

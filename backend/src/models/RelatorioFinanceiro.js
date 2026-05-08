export class RelatorioFinanceiro {
  constructor(id, dataGeracao, consultas) {
    this.id = id;
    this.dataGeracao = dataGeracao;
    this.consultas = consultas;
    this.valorTotal = this.calcularValorTotal();
  }

  calcularValorTotal() {
    return this.consultas.reduce((total, consulta) => total + consulta.valorPago, 0);
  }

  gerarRelatorio() {
    return {
      id: this.id,
      dataGeracao: this.dataGeracao,
      valorTotal: this.valorTotal,
      consultas: this.consultas.map((consulta) => ({
        paciente: consulta.paciente.nome,
        medico: consulta.medico.nome,
        especialidade: consulta.medico.especialidade,
        data: consulta.data,
        valorConsulta: consulta.valor,
        valorPago: consulta.valorPago,
        receita: consulta.receita
          ? `${consulta.receita.descricao} - ${consulta.receita.dosagem} por ${consulta.receita.tempoTratamento}`
          : "Sem receita"
      }))
    };
  }
}

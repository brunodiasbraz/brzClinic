export class Consulta {
   constructor(id, data, valor, status, paciente, medico, receita) {
    this.id = id;
    this.data = data;
    this.valor = Number(valor);
    this.status = status;
    this.paciente = paciente;
    this.medico = medico; 
    this.receita = receita;  
  }

  agendar() {
    if (!this.paciente.planoSaude) {
      throw new Error("Paciente sem plano de saúde vinculado.");
    }

    const planoValido = this.paciente.planoSaude.validarPlano(this.data);
    const coberturaValida = this.paciente.planoSaude.cobreValor(this.valor);

    if (!planoValido) {
      throw new Error("Plano de saúde vencido. Consulta não confirmada.");
    }

    if (!coberturaValida) {
      throw new Error("Valor da consulta excede o limite de cobertura.");
    }

    this.status = "Agendada";
    return this;
  }

  cancelar() {
    this.status = "Cancelada";
  }

  registrarPagamento(pagamento) {
    this.pagamentos.push(pagamento);
  }

  adicionarReceita(receita) {
    this.receita = receita;
  }

  get valorPago() {
    return this.pagamentos.reduce((total, pagamento) => total + pagamento.valor, 0);
  }
}

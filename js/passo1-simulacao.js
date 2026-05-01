class Paciente {
  constructor(id, nome, endereco, dataNascimento, telefone, email, cpf) {
    this.id = id;
    this.nome = nome;
    this.endereco = endereco;
    this.dataNascimento = dataNascimento;
    this.telefone = telefone;
    this.email = email;
    this.cpf = cpf;
    this.planoSaude = null;
  }

  vincularPlano(plano) {
    this.planoSaude = plano;
  }

  atualizarContato(telefone, email) {
    this.telefone = telefone;
    this.email = email;
  }
}

class PlanoSaude {
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

class Medico {
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

class Consulta {
  constructor(id, data, valor, paciente, medico) {
    this.id = id;
    this.data = data;
    this.valor = valor;
    this.paciente = paciente;
    this.medico = medico;
    this.status = "Pendente";
    this.receita = null;
    this.pagamentos = [];
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

class Receita {
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

class Pagamento {
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

class RelatorioFinanceiro {
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

class SistemaClinica {
  constructor() {
    this.pacientes = [];
    this.medicos = [];
    this.planos = [];
    this.consultas = [];
  }

  cadastrarPaciente(paciente) {
    this.pacientes.push(paciente);
  }

  cadastrarMedico(medico) {
    this.medicos.push(medico);
  }

  cadastrarPlano(plano) {
    this.planos.push(plano);
  }

  agendarConsulta(paciente, medico, data, valor) {
    const consulta = new Consulta(this.consultas.length + 1, data, valor, paciente, medico);
    consulta.agendar();
    this.consultas.push(consulta);
    return consulta;
  }

  gerarRelatorioFinanceiro() {
    const relatorio = new RelatorioFinanceiro(1, new Date().toLocaleDateString("pt-BR"), this.consultas);
    return relatorio.gerarRelatorio();
  }
}

function simularCenario() {
  const sistema = new SistemaClinica();

  const plano = new PlanoSaude(1, "Saude Total", 1000, "2026-12-31");
  const paciente = new Paciente(
    1,
    "Ana Silva",
    "Rua das Flores, 100",
    "1995-04-12",
    "(11) 99999-0000",
    "ana@email.com",
    "123.456.789-00"
  );
  const medico = new Medico(1, "Dr. Carlos Mendes", "Clínica Geral", "CRM-MG 123456");

  paciente.vincularPlano(plano);
  sistema.cadastrarPlano(plano);
  sistema.cadastrarPaciente(paciente);
  sistema.cadastrarMedico(medico);

  const consulta = sistema.agendarConsulta(paciente, medico, "2026-05-04", 250);
  const pagamento = new Pagamento(1, 250, "2026-05-04", consulta);
  pagamento.registrar();

  medico.emitirReceita(
    consulta,
    "Medicamento para controle dos sintomas",
    "1 comprimido a cada 8 horas",
    "5 dias"
  );

  return sistema.gerarRelatorioFinanceiro();
}

const relatorio = simularCenario();
console.log("Resumo das operações realizadas:");
console.table(relatorio.consultas);
console.log(`Valor total recebido: R$ ${relatorio.valorTotal.toFixed(2)}`);

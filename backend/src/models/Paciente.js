export class Paciente {
  constructor(
    id,
    nome,
    endereco,
    dataNascimento,
    telefone,
    email,
    cpf,
    planoSaudeId = null,
  ) {
    this.id = id;
    this.nome = nome;
    this.endereco = endereco;
    this.dataNascimento = dataNascimento;
    this.telefone = telefone;
    this.email = email;
    this.cpf = cpf;
    this.planoSaudeId = planoSaudeId;
  }

  vincularPlano(plano) {
    this.planoSaudeId = plano.id;
  }

  atualizarContato(telefone, email) {
    this.telefone = telefone;
    this.email = email;
  }
}

USE brz_clinic;

INSERT INTO plano_saude (id, nome, limite_cobertura, data_validade)
VALUES
  (1, 'Saude Total', 1000.00, '2026-12-31'),
  (2, 'Vida Clinica', 500.00, '2026-06-30'),
  (3, 'Plano Vencido', 800.00, '2025-12-31');

INSERT INTO paciente (id, nome, endereco, data_nascimento, telefone, email, cpf, plano_saude_id)
VALUES
  (1, 'Ana Silva', 'Rua das Flores, 100', '1995-04-12', '(11) 99999-0000', 'ana@email.com', '123.456.789-00', 1),
  (2, 'Bruno Costa', 'Av. Central, 250', '1988-08-20', '(11) 98888-1111', 'bruno@email.com', '987.654.321-00', 2),
  (3, 'Carla Oliveira', 'Rua Bahia, 45', '1979-01-30', '(11) 97777-2222', 'carla@email.com', '111.222.333-44', 3);

INSERT INTO medico (id, nome, especialidade, crm)
VALUES
  (1, 'Dr. Carlos Mendes', 'Clinica Geral', 'CRM-SP 123456'),
  (2, 'Dra. Fernanda Lima', 'Cardiologia', 'CRM-SP 654321');

INSERT INTO consulta (id, data_consulta, valor, status, paciente_id, medico_id)
VALUES
  (1, '2026-05-04 09:30:00', 250.00, 'REALIZADA', 1, 1),
  (2, '2026-05-05 14:00:00', 400.00, 'AGENDADA', 2, 2),
  (3, '2026-05-06 10:00:00', 300.00, 'CANCELADA', 3, 1);

INSERT INTO pagamento (id, valor, data_pagamento, consulta_id)
VALUES
  (1, 250.00, '2026-05-04', 1),
  (2, 200.00, '2026-05-05', 2);

INSERT INTO receita (id, descricao, dosagem, tempo_tratamento, consulta_id, medico_id)
VALUES
  (1, 'Medicamento para controle dos sintomas', '1 comprimido a cada 8 horas', '5 dias', 1, 1);

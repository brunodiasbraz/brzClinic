DROP DATABASE IF EXISTS brz_clinic;
CREATE DATABASE brz_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE brz_clinic;

CREATE TABLE plano_saude (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  limite_cobertura DECIMAL(10, 2) NOT NULL,
  data_validade DATE NOT NULL
);

CREATE TABLE paciente (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  endereco VARCHAR(180),
  data_nascimento DATE,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  plano_saude_id INT,
  CONSTRAINT fk_paciente_plano
    FOREIGN KEY (plano_saude_id) REFERENCES plano_saude(id)
);

CREATE TABLE medico (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  especialidade VARCHAR(100) NOT NULL,
  crm VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE consulta (
  id INT PRIMARY KEY AUTO_INCREMENT,
  data_consulta DATETIME NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  status ENUM('AGENDADA', 'CANCELADA', 'REALIZADA') NOT NULL DEFAULT 'AGENDADA',
  paciente_id INT NOT NULL,
  medico_id INT NOT NULL,
  CONSTRAINT fk_consulta_paciente
    FOREIGN KEY (paciente_id) REFERENCES paciente(id),
  CONSTRAINT fk_consulta_medico
    FOREIGN KEY (medico_id) REFERENCES medico(id)
);

CREATE TABLE receita (
  id INT PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(255) NOT NULL,
  dosagem VARCHAR(100) NOT NULL,
  tempo_tratamento VARCHAR(100) NOT NULL,
  consulta_id INT NOT NULL,
  medico_id INT NOT NULL,
  CONSTRAINT fk_receita_consulta
    FOREIGN KEY (consulta_id) REFERENCES consulta(id),
  CONSTRAINT fk_receita_medico
    FOREIGN KEY (medico_id) REFERENCES medico(id)
);

CREATE TABLE pagamento (
  id INT PRIMARY KEY AUTO_INCREMENT,
  valor DECIMAL(10, 2) NOT NULL,
  data_pagamento DATE NOT NULL,
  consulta_id INT NOT NULL,
  CONSTRAINT fk_pagamento_consulta
    FOREIGN KEY (consulta_id) REFERENCES consulta(id)
);

DELIMITER //

CREATE FUNCTION validar_plano_saude(plano_id INT, data_referencia DATE)
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE plano_valido BOOLEAN DEFAULT FALSE;

  SELECT COUNT(*) > 0
    INTO plano_valido
    FROM plano_saude
   WHERE id = plano_id
     AND data_validade >= data_referencia;

  RETURN plano_valido;
END //

DELIMITER ;

CREATE VIEW vw_relatorio_financeiro AS
SELECT
  c.id AS consulta_id,
  p.nome AS paciente,
  p.cpf,
  m.nome AS medico,
  m.especialidade,
  c.data_consulta,
  c.status,
  c.valor AS valor_consulta,
  COALESCE(SUM(pg.valor), 0) AS valor_total_pago
FROM consulta c
JOIN paciente p ON p.id = c.paciente_id
JOIN medico m ON m.id = c.medico_id
LEFT JOIN pagamento pg ON pg.consulta_id = c.id
GROUP BY
  c.id,
  p.nome,
  p.cpf,
  m.nome,
  m.especialidade,
  c.data_consulta,
  c.status,
  c.valor;

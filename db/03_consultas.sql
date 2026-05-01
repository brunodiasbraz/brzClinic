USE brz_clinic;

SELECT
  p.id,
  p.nome AS paciente,
  ps.nome AS plano,
  ps.data_validade,
  validar_plano_saude(ps.id, DATE('2026-05-04')) AS plano_valido_para_consulta
FROM paciente p
LEFT JOIN plano_saude ps ON ps.id = p.plano_saude_id
ORDER BY p.id;

SELECT
  c.id AS consulta_id,
  p.nome AS paciente,
  m.nome AS medico,
  m.especialidade,
  c.data_consulta,
  c.valor,
  c.status
FROM consulta c
JOIN paciente p ON p.id = c.paciente_id
JOIN medico m ON m.id = c.medico_id
ORDER BY c.data_consulta;

SELECT
  c.id AS consulta_id,
  p.nome AS paciente,
  r.descricao,
  r.dosagem,
  r.tempo_tratamento,
  m.nome AS medico_emissor
FROM receita r
JOIN consulta c ON c.id = r.consulta_id
JOIN paciente p ON p.id = c.paciente_id
JOIN medico m ON m.id = r.medico_id;

SELECT
  consulta_id,
  paciente,
  medico,
  especialidade,
  data_consulta,
  status,
  valor_consulta,
  valor_total_pago
FROM vw_relatorio_financeiro
ORDER BY consulta_id;

SELECT
  CURDATE() AS data_emissao,
  SUM(valor_total_pago) AS valor_total_recebido
FROM vw_relatorio_financeiro
WHERE status IN ('AGENDADA', 'REALIZADA');

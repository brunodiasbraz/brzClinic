import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "brz_clinic",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

app.use(cors());
app.use(express.json());

function asyncHandler(callback) {
  return async (request, response, next) => {
    try {
      await callback(request, response, next);
    } catch (error) {
      next(error);
    }
  };
}

function mapConsulta(row) {
  return {
    id: row.id,
    patient: row.paciente,
    patientId: row.paciente_id,
    doctor: row.medico,
    doctorId: row.medico_id,
    specialty: row.especialidade,
    date: row.data,
    time: row.horario,
    status: row.status,
    value: Number(row.valor),
    report: row.relatorio || null
  };
}

app.get("/api/health", asyncHandler(async (_request, response) => {
  await pool.query("SELECT 1");
  response.json({ status: "ok", database: "connected" });
}));

app.get("/api/pacientes", asyncHandler(async (_request, response) => {
  const [rows] = await pool.query(`
    SELECT
      p.id,
      p.nome,
      p.endereco,
      p.data_nascimento,
      p.telefone,
      p.email,
      p.cpf,
      ps.nome AS plano_saude
    FROM paciente p
    LEFT JOIN plano_saude ps ON ps.id = p.plano_saude_id
    ORDER BY p.nome
  `);

  response.json(rows);
}));

app.get("/api/pacientes/:id", asyncHandler(async (request, response) => {
  const [rows] = await pool.query(`
    SELECT
      p.id,
      p.nome,
      p.endereco,
      p.data_nascimento,
      p.telefone,
      p.email,
      p.cpf,
      ps.nome AS plano_saude
    FROM paciente p
    LEFT JOIN plano_saude ps ON ps.id = p.plano_saude_id
    WHERE p.id = ?
    ORDER BY p.nome
  `, [request.params.id]);

  response.json(rows);
}));


app.get("/api/medicos", asyncHandler(async (_request, response) => {
  const [rows] = await pool.query(`
    SELECT id, nome, especialidade, crm
    FROM medico
    ORDER BY nome
  `);

  response.json(rows);
}));

app.get("/api/consultas", asyncHandler(async (_request, response) => {
  const [rows] = await pool.query(`
    SELECT
      c.id,
      c.paciente_id,
      c.medico_id,
      p.nome AS paciente,
      m.nome AS medico,
      m.especialidade,
      DATE(c.data_consulta) AS data,
      TIME_FORMAT(c.data_consulta, '%H:%i') AS horario,
      c.status,
      c.valor,
      r.descricao AS relatorio
    FROM consulta c
    JOIN paciente p ON p.id = c.paciente_id
    JOIN medico m ON m.id = c.medico_id
    LEFT JOIN receita r ON r.consulta_id = c.id
    ORDER BY c.data_consulta DESC
  `);

  response.json(rows.map(mapConsulta));
}));

app.get("/api/pacientes/:id/consultas", asyncHandler(async (request, response) => {
  const [rows] = await pool.execute(`
    SELECT
      c.id,
      c.paciente_id,
      c.medico_id,
      p.nome AS paciente,
      m.nome AS medico,
      m.especialidade,
      DATE(c.data_consulta) AS data,
      TIME_FORMAT(c.data_consulta, '%H:%i') AS horario,
      c.status,
      c.valor,
      r.descricao AS relatorio
    FROM consulta c
    JOIN paciente p ON p.id = c.paciente_id
    JOIN medico m ON m.id = c.medico_id
    LEFT JOIN receita r ON r.consulta_id = c.id
    WHERE c.paciente_id = ?
    ORDER BY c.data_consulta DESC
  `, [request.params.id]);

  response.json(rows.map(mapConsulta));
}));

app.get("/api/medicos/:id/consultas", asyncHandler(async (request, response) => {
  const [rows] = await pool.execute(`
    SELECT
      c.id,
      c.paciente_id,
      c.medico_id,
      p.nome AS paciente,
      m.nome AS medico,
      m.especialidade,
      DATE(c.data_consulta) AS data,
      TIME_FORMAT(c.data_consulta, '%H:%i') AS horario,
      c.status,
      c.valor,
      r.descricao AS relatorio
    FROM consulta c
    JOIN paciente p ON p.id = c.paciente_id
    JOIN medico m ON m.id = c.medico_id
    LEFT JOIN receita r ON r.consulta_id = c.id
    WHERE c.medico_id = ?
    ORDER BY c.data_consulta ASC
  `, [request.params.id]);

  response.json(rows.map(mapConsulta));
}));

app.post("/api/pacientes", asyncHandler(async (request, response) => {
  const {
    nome, endereco, data_nascimento, telefone, email, cpf, plano_saude_id
  } = request.body;

  if (!nome || !endereco || !data_nascimento || !telefone || !email || !cpf) {
    return response.status(400).json({
      message: "Informe todos os campos obrigatórios."
    });
  }

  const [result] = await pool.execute(`
    INSERT INTO paciente (nome, endereco, data_nascimento, telefone, email, cpf, plano_saude_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [nome, endereco, data_nascimento, telefone, email, cpf, plano_saude_id]);

  response.status(201).json(result.insertId ? { id: result.insertId } : { message: "Paciente criado com sucesso." });
}));

app.post("/api/consultas", asyncHandler(async (request, response) => {
  const {
    paciente_id,
    medico_id,
    data_consulta,
    valor = 250,
    status = "AGENDADA"
  } = request.body;

  if (!paciente_id || !medico_id || !data_consulta) {
    return response.status(400).json({
      message: "Informe paciente_id, medico_id e data_consulta."
    });
  }

  const [result] = await pool.execute(`
    INSERT INTO consulta (data_consulta, valor, status, paciente_id, medico_id)
    VALUES (?, ?, ?, ?, ?)
  `, [data_consulta, valor, status, paciente_id, medico_id]);

  const [rows] = await pool.execute(`
    SELECT
      c.id,
      c.paciente_id,
      c.medico_id,
      p.nome AS paciente,
      m.nome AS medico,
      m.especialidade,
      DATE(c.data_consulta) AS data,
      TIME_FORMAT(c.data_consulta, '%H:%i') AS horario,
      c.status,
      c.valor,
      NULL AS relatorio
    FROM consulta c
    JOIN paciente p ON p.id = c.paciente_id
    JOIN medico m ON m.id = c.medico_id
    WHERE c.id = ?
  `, [result.insertId]);

  response.status(201).json(mapConsulta(rows[0]));
}));

app.get("/api/relatorios/financeiro", asyncHandler(async (_request, response) => {
  const [consultas] = await pool.query(`
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
    ORDER BY consulta_id
  `);

  const [totais] = await pool.query(`
    SELECT
      COALESCE(SUM(valor_total_pago), 0) AS valor_total_recebido
    FROM vw_relatorio_financeiro
    WHERE status IN ('AGENDADA', 'REALIZADA')
  `);

  response.json({
    valorTotalRecebido: Number(totais[0].valor_total_recebido),
    consultas: consultas.map((consulta) => ({
      ...consulta,
      valor_consulta: Number(consulta.valor_consulta),
      valor_total_pago: Number(consulta.valor_total_pago)
    }))
  });
}));

app.get("/api/planos-saude", asyncHandler(async (_request, response) => {
  const [rows] = await pool.query(`
    SELECT *
    FROM plano_saude
    ORDER BY nome
  `);

  response.json(rows);
}));

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api).*/, (_request, response) => {
    response.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use((request, response) => {
  response.status(404).json({
    message: `Rota ${request.method} ${request.originalUrl} nao encontrada.`
  });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: "Erro interno no servidor.",
    error: process.env.NODE_ENV === "production" ? undefined : error.message
  });
});

app.listen(port, () => {
  console.log(`Backend BRZ Clinic rodando em http://localhost:${port}`);
});

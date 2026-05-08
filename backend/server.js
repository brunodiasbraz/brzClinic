import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SistemaClinica } from "./src/services/SistemaClinica.js";
import { criarRotasClinica } from "./src/routes/clinica.routes.js";
import { Database } from "./src/data/Database.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3002);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

app.use(cors());
app.use(express.json());

const db = new Database({
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

const sistemaClinica = new SistemaClinica(db);

app.use("/api", criarRotasClinica(sistemaClinica));

// Servir arquivos estáticos do frontend
if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^(?!\/api).*/, (_request, response) => {
    response.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Quando nao encontrar nenhuma rota, responde com mensagem de erro e status 404
app.use((request, response) => {
  response.status(404).json({
    message: `Rota ${request.method} ${request.originalUrl} não encontrada.`
  });
});

// Tratamento de erros
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

import express from "express";
import { ClinicaController } from "../controllers/ClinicaController.js";

export function criarRotasClinica(sistemaClinica) {
  const router = express.Router();
  const controller = new ClinicaController(sistemaClinica);

  // Rotas de Pacientes
  router
    .post("/pacientes", (req, res) => controller.cadastrarPaciente(req, res))
    .get("/pacientes", (req, res) => controller.obterPacientes(req, res))
    .get("/pacientes/:id", (req, res) => controller.obterPacientePorId(req, res))
    .get("/pacientes/:id/consultas", (req, res) => controller.obterConsultasPorPaciente(req, res))

  // Rotas de Médicos
  router.post("/medicos", (req, res) => controller.cadastrarMedico(req, res));
  router.get("/medicos", (req, res) => controller.obterMedicos(req, res));

  // Rotas de Planos
  router.get("/planos", (req, res) => controller.obterPlanos(req, res));
  router.get("/planos/:id", (req, res) => controller.obterPlanoPorId(req, res));
  router.put("/planos/:id", (req, res) => controller.atualizarPlano(req, res));
  router.post("/planos/validar", (req, res) =>
    controller.validarPlano(req, res),
  );
  router.post("/planos", (req, res) => controller.cadastrarPlano(req, res));
  router.post("/vincular-plano", (req, res) =>
    controller.vincularPlano(req, res),
  );

  // Rotas de Consultas
  router.post("/consultas", (req, res) => controller.agendarConsulta(req, res));
  router.get("/consultas", (req, res) => controller.obterConsultas(req, res));
  router.get("/consultas/agendadas", (req, res) =>
    controller.obterConsultasAgendadas(req, res),
  );

  // Rotas de Pagamentos
  router.post("/pagamentos", (req, res) =>
    controller.registrarPagamento(req, res),
  );

  // Rotas de Receitas
  router.post("/receitas", (req, res) => controller.emitirReceita(req, res));

  // Rotas de Relatórios
  router.get("/relatorio-financeiro", (req, res) =>
    controller.gerarRelatorioFinanceiro(req, res),
  );

  return router;
}

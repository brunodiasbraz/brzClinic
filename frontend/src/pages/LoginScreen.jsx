import { Link } from "react-router-dom";

export default function LoginScreen({ selectedPacient, selectedDoctor }) {
  return (
    <>
      <main className="login-page">
        <section className="login-shell">
          <div className="clinic-image-panel">
            <img
              src="/assets/Imagem-clinica.png"
              alt="Recepcao da BRZ Clinic"
            />
          </div>

          <div className="login-panel d-flex flex-column align-items-center justify-content-center text-center">
            <h2>Acesse sua área</h2>
            <p className="text-secondary">
              Escolha o perfil para visualizar consultas, horarios e relatorios
              relacionados ao seu atendimento.
            </p>

            <div className="profile-actions">
              {!selectedPacient ? (
                <div className="alert alert-warning" role="alert">
                  Selecione um <strong>paciente</strong> no topo da tela para
                  continuar
                </div>
              ) : (
                <Link
                  className={`btn btn-primary btn-lg ${!selectedPacient ? "disabled opacity-50" : ""}`}
                  to={selectedPacient ? "/paciente" : "#"}
                >
                  Entrar como paciente
                </Link>
              )}
              {!selectedDoctor ? (
                <div className="alert alert-warning mt-3" role="alert">
                  Selecione um <strong>médico</strong> no topo da tela para
                  continuar
                </div>
              ) : (
                <Link
                  className={`btn btn-outline-primary btn-lg ${!selectedDoctor ? "disabled opacity-50" : ""}`}
                  to={selectedDoctor ? "/medico" : "#"}
                >
                  Entrar como médico
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

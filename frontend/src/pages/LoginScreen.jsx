import { Link } from "react-router-dom";

export default function LoginScreen() {
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
              <Link className="btn btn-primary btn-lg" to="/paciente">
                Entrar como paciente
              </Link>
              <Link className="btn btn-outline-primary btn-lg" to="/medico">
                Entrar como medico
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

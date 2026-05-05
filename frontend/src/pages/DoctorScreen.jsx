import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function DoctorScreen({ appointments }) {
  const upcoming = appointments.filter(
    (appointment) => appointment.status.toLowerCase() === "agendada",
  );

  const past = appointments.filter(
    (appointment) => appointment.status.toLowerCase() !== "agendada",
  );

  const totalRevenue = appointments.reduce(
    (total, appointment) => total + appointment.value,
    0,
  );

  return (
    <main className="dashboard-page">
      <Header
        title="Area do médico"
        subtitle="Visualize proximas consultas e relatorios de atendimento."
      />

      <section className="content-grid">
        <div className="panel panel-main">
          <div className="panel-title-row">
            <div>
              <h2>Proximas consultas</h2>
              <p>Lista consolidada dos atendimentos agendados.</p>
            </div>
          </div>
          <div className="d-flex flex-column gap-2">
            {upcoming.map((appointment) => (
              <article
                key={appointment.id}
                className="border rounded p-3 bg-light"
              >
                <div className="row align-items-center g-5">
                  <div className="col-12 col-md">
                    <strong className="d-block">{appointment.patient}</strong>
                    <span className="text-muted small">
                      {appointment.specialty}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">Valor</strong>
                    <span className="text-muted small">
                      {formatCurrency(appointment.value)}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">
                      {formatDate(appointment.date)}
                    </strong>
                    <span className="text-muted small">{appointment.time}</span>
                  </div>

                  <div className="col-12 col-md-auto text-md-end">
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel summary-panel">
          <h2>Relatorios</h2>
          <div className="metric">
            <span>Consultas no painel</span>
            <strong>{appointments.length}</strong>
          </div>
          <div className="metric">
            <span>Receita estimada</span>
            <strong>{formatCurrency(totalRevenue)}</strong>
          </div>
          <div className="report-box">
            <span>Ultimo registro</span>
            <strong>{appointments[1]?.report}</strong>
          </div>
        </aside>

        <div className="panel panel-main">
          <div className="panel-title-row">
            <div>
              <h2>Histórico de consultas</h2>
            </div>
          </div>

          <div className="d-flex flex-column gap-2">
            {past.map((appointment) => (
              <article
                key={appointment.id}
                className="border rounded p-3 bg-light mb-2"
              >
                <div className="row align-items-center g-5">
                  <div className="col-12 col-md">
                    <strong className="d-block">{appointment.patient}</strong>
                    <span className="text-muted small">
                      {appointment.specialty}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">Valor</strong>
                    <span className="text-muted small">
                      {formatCurrency(appointment.value)}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">
                      {formatDate(appointment.date)}
                    </strong>
                    <span className="text-muted small">{appointment.time}</span>
                  </div>

                  <div className="col-12 col-md-auto text-md-end">
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

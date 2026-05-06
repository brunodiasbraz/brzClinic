import AppointmentModal from "../components/AppointmentModal";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatDate, formatDateTime } from "../utils/formatters";

export default function PatientScreen({
  appointments,
  onAddAppointment,
}) {
  const scheduled = appointments.filter(
    (appointment) => appointment.status.toLowerCase() === "agendada",
  );

  const completed = appointments.filter(
    (appointment) => appointment.status.toLowerCase() === "realizada",
  );

  const past = appointments.filter((appointment) =>
    ["realizada", "cancelada"].includes(appointment.status.toLowerCase()),
  );

  return (
    <main className="dashboard-page">
      <Header
        title="Area do paciente"
        subtitle="Acompanhe suas consultas e solicite novos agendamentos."
      />

      <section className="content-grid">
        <div className="panel panel-main">
          <div className="panel-title-row">
            <div>
              <h2>Minhas consultas</h2>
              <p>Horarios futuros e status de atendimento.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#appointmentModal"
            >
              Agendar consulta
            </button>
          </div>

          <div className="d-flex flex-column gap-2">
            {scheduled.map((appointment) => (
              <article
                key={appointment.id}
                className="border rounded p-3 bg-light"
              >
                <div className="row align-items-center g-5">
                  <div className="col-12 col-md">
                    <strong className="d-block">{appointment.medico?.nome}</strong>
                    <span className="text-muted small">
                      {appointment.medico?.especialidade || "Especialidade não informada"}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">Valor</strong>
                    <span className="text-muted small">
                      {formatCurrency(appointment.valor)}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">
                      {formatDateTime(appointment.data).date}
                    </strong>
                    <span className="text-muted small">{formatDateTime(appointment.data).time}</span>
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
          <h2>Resumo</h2>
          <div className="metric">
            <span>Agendadas</span>
            <strong>{scheduled.length}</strong>
          </div>
          <div className="metric">
            <span>Realizadas</span>
            <strong>{completed.length}</strong>
          </div>
          <div className="next-card">
            <span>Proxima consulta</span>
            <strong>
              {scheduled[0]
                ? `${formatDateTime(scheduled[0].data).date} às ${formatDateTime(scheduled[0].data).time}`
                : "Sem consultas futuras"}
            </strong>
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
                className="border rounded p-3 bg-light"
              >
                <div className="row align-items-center g-5">
                  <div className="col-12 col-md">
                    <strong className="d-block">{appointment.medico?.nome}</strong>
                    <span className="text-muted small">
                      {appointment.medico?.especialidade || "Especialidade não informada"}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">Valor</strong>
                    <span className="text-muted small">
                      {formatCurrency(appointment.valor)}
                    </span>
                  </div>

                  <div className="col-12 col-md-auto text-md-center">
                    <strong className="d-block">
                      {formatDateTime(appointment.data).date}
                    </strong>
                    <span className="text-muted small">{formatDateTime(appointment.data).time}</span>
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

      <AppointmentModal
        appointments={appointments}
        onAddAppointment={onAddAppointment}
      />
    </main>
  );
}

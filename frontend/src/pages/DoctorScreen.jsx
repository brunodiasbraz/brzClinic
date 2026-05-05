import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../utils/formatters";

export default function DoctorScreen({ appointments, selectedDoctor }) {

  const doctorAppointments = appointments.filter(
    (appointment) => appointment.id === selectedDoctor
  );

  const upcoming = doctorAppointments.filter(
    (appointment) => appointment.status.toLowerCase() === "agendada"
  );

  const totalRevenue = doctorAppointments.reduce(
    (total, appointment) => total + appointment.value,
    0
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

          <div className="appointment-list">
            {upcoming.map((appointment) => (
              <article className="appointment-item" key={appointment.id}>
                <div>
                  <strong>{appointment.patient}</strong>
                  <span>{appointment.specialty}</span>
                </div>
                <div>
                  <strong>{formatDate(appointment.date)}</strong>
                  <span>{appointment.time}</span>
                </div>
                <StatusBadge status={appointment.status} />
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
      </section>
    </main>
  );
}

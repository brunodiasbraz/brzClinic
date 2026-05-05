import AppointmentModal from "../components/AppointmentModal";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/formatters";

export default function PatientScreen({ appointments, onAddAppointment, selectedPacient }) {

  const patientAppointments = appointments.filter(
    (appointment) => appointment.id === selectedPacient
  );

  const scheduled = patientAppointments.filter(
    (appointment) => appointment.status === "Agendada"
  );

  const completed = patientAppointments.filter(
    (appointment) => appointment.status === "Realizada"
  );

  const handleScheduleAppointment = (pacientId) => {

    // paciente_id,
    // medico_id,
    // data_consulta,
    // valor = 250,
    // status = "AGENDADA"
    
  }

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
              <p>Horarios futuros, historico e status de atendimento.</p>
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

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Horario</th>
                  <th>Medico</th>
                  <th>Especialidade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patientAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.specialty}</td>
                    <td>
                      <StatusBadge status={appointment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                ? `${formatDate(scheduled[0].date)} as ${scheduled[0].time}`
                : "Sem consultas futuras"}
            </strong>
          </div>
        </aside>
      </section>

      <AppointmentModal appointments={appointments} onAddAppointment={onAddAppointment} />
    </main>
  );
}

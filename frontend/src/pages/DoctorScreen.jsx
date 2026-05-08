import { useMemo, useState } from "react";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatDateTime } from "../utils/formatters";

const emptyFinishForm = {
  descricao: "",
  dosagem: "",
  tempoTratamento: "",
  valorPagamento: "",
};

export default function DoctorScreen({ appointments, onFinishAppointment }) {
  const [finishFormById, setFinishFormById] = useState({});
  const [message, setMessage] = useState(null);

  const upcoming = appointments.filter(
    (appointment) => appointment.status.toLowerCase() === "agendada",
  );

  const past = appointments.filter(
    (appointment) => appointment.status.toLowerCase() !== "agendada",
  );

  const totalReceived = appointments.reduce(
    (total, appointment) => total + Number(appointment.valorPago || 0),
    0,
  );

  const reportRows = useMemo(
    () =>
      appointments.map((appointment) => ({
        ...appointment,
        formattedDateTime: formatDateTime(appointment.data),
      })),
    [appointments],
  );

  function getFinishForm(appointment) {
    return (
      finishFormById[appointment.id] || {
        ...emptyFinishForm,
        valorPagamento: String(Math.max(appointment.saldo || appointment.valor, 0)),
      }
    );
  }

  function updateFinishForm(appointment, field, value) {
    setMessage(null);
    setFinishFormById((current) => ({
      ...current,
      [appointment.id]: {
        ...getFinishForm(appointment),
        [field]: value,
      },
    }));
  }

  async function handleFinish(event, appointment) {
    event.preventDefault();
    const form = getFinishForm(appointment);

    if (!form.valorPagamento) {
      setMessage({ type: "danger", text: "Informe o valor pago para encerrar a consulta." });
      return;
    }

    try {
      await onFinishAppointment(appointment.id, {
        valorPagamento: Number(form.valorPagamento),
        dataPagamento: new Date().toISOString().split("T")[0],
        descricao: form.descricao,
        dosagem: form.dosagem,
        tempoTratamento: form.tempoTratamento,
      });
      setFinishFormById((current) => {
        const updated = { ...current };
        delete updated[appointment.id];
        return updated;
      });
      setMessage({ type: "success", text: "Consulta encerrada com pagamento e receita registrados." });
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.message || "Não foi possível encerrar a consulta.",
      });
    }
  }

  return (
    <main className="dashboard-page">
      <Header
        title="Area do médico"
        subtitle="Visualize consultas, encerre atendimentos e acompanhe os relatorios."
      />

      <section className="content-grid">
        <div className="panel panel-main">
          <div className="panel-title-row">
            <div>
              <h2>Proximas consultas</h2>
              <p>Atendimentos agendados para este médico.</p>
            </div>
          </div>

          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          <div className="d-flex flex-column gap-3">
            {upcoming.length === 0 && (
              <div className="empty-state">Nenhuma consulta agendada.</div>
            )}

            {upcoming.map((appointment) => {
              const dateTime = formatDateTime(appointment.data);
              const form = getFinishForm(appointment);

              return (
                <article key={appointment.id} className="border rounded p-3 bg-light">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md">
                      <strong className="d-block">{appointment.paciente?.nome}</strong>
                      <span className="text-muted small">{appointment.paciente?.email}</span>
                    </div>

                    <div className="col-12 col-md-auto text-md-center">
                      <strong className="d-block">{dateTime.date}</strong>
                      <span className="text-muted small">{dateTime.time}</span>
                    </div>

                    <div className="col-12 col-md-auto text-md-center">
                      <strong className="d-block">{formatCurrency(appointment.valor)}</strong>
                      <span className="text-muted small">
                        Pago: {formatCurrency(appointment.valorPago)}
                      </span>
                    </div>

                    <div className="col-12 col-md-auto text-md-end">
                      <StatusBadge status={appointment.status} />
                    </div>
                  </div>

                  <form className="finish-form" onSubmit={(event) => handleFinish(event, appointment)}>
                    <div className="row g-3">
                      <div className="col-12 col-md-5">
                        <label className="form-label" htmlFor={`descricao-${appointment.id}`}>
                          Medicamento
                        </label>
                        <input
                          id={`descricao-${appointment.id}`}
                          className="form-control"
                          value={form.descricao}
                          onChange={(event) =>
                            updateFinishForm(appointment, "descricao", event.target.value)
                          }
                          placeholder="Ex.: Dipirona"
                        />
                      </div>

                      <div className="col-12 col-md-3">
                        <label className="form-label" htmlFor={`dosagem-${appointment.id}`}>
                          Dosagem
                        </label>
                        <input
                          id={`dosagem-${appointment.id}`}
                          className="form-control"
                          value={form.dosagem}
                          onChange={(event) =>
                            updateFinishForm(appointment, "dosagem", event.target.value)
                          }
                          placeholder="1 comprimido"
                        />
                      </div>

                      <div className="col-12 col-md-2">
                        <label className="form-label" htmlFor={`tempo-${appointment.id}`}>
                          Tratamento
                        </label>
                        <input
                          id={`tempo-${appointment.id}`}
                          className="form-control"
                          value={form.tempoTratamento}
                          onChange={(event) =>
                            updateFinishForm(appointment, "tempoTratamento", event.target.value)
                          }
                          placeholder="5 dias"
                        />
                      </div>

                      <div className="col-12 col-md-2">
                        <label className="form-label" htmlFor={`valor-${appointment.id}`}>
                          Pagamento
                        </label>
                        <input
                          id={`valor-${appointment.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          value={form.valorPagamento}
                          onChange={(event) =>
                            updateFinishForm(appointment, "valorPagamento", event.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <button type="submit" className="btn btn-primary">
                        Encerrar consulta
                      </button>
                    </div>
                  </form>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="panel summary-panel">
          <h2>Relatorios</h2>
          <div className="metric">
            <span>Consultas no painel</span>
            <strong>{appointments.length}</strong>
          </div>
          <div className="metric">
            <span>Realizadas</span>
            <strong>{past.filter((appointment) => appointment.status === "REALIZADA").length}</strong>
          </div>
          <div className="metric">
            <span>Total recebido</span>
            <strong>{formatCurrency(totalReceived)}</strong>
          </div>
        </aside>

        <div className="panel panel-main report-panel">
          <div className="panel-title-row">
            <div>
              <h2>Relatório financeiro</h2>
              <p>Todas as consultas deste médico consolidadas em tabela.</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle report-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Consulta</th>
                  <th>Pago</th>
                  <th>Receita</th>
                </tr>
              </thead>
              <tbody>
                {reportRows.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <strong>{appointment.paciente?.nome}</strong>
                      <span>{appointment.paciente?.cpf}</span>
                    </td>
                    <td>
                      {appointment.formattedDateTime.date}
                      <span>{appointment.formattedDateTime.time}</span>
                    </td>
                    <td>
                      <StatusBadge status={appointment.status} />
                    </td>
                    <td>{formatCurrency(appointment.valor)}</td>
                    <td>{formatCurrency(appointment.valorPago)}</td>
                    <td>
                      {appointment.receita
                        ? `${appointment.receita.descricao} - ${appointment.receita.dosagem}`
                        : "Sem receita"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

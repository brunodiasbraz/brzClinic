import { useEffect, useMemo, useState } from "react";
import { availableTimesByWeekday } from "../data/appointments";
import {
  formatDate,
  getTodayIso,
  getWeekdayFromDate,
} from "../utils/formatters";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const emptyForm = {
  date: "",
  time: "",
  name: "",
  phone: "",
  email: "",
};

function validateAppointment(data) {
  if (!data.date || !data.time || !data.name || !data.phone || !data.email) {
    return "Preencha todos os campos para confirmar o agendamento.";
  }

  if (!data.email.includes("@") || !data.email.includes(".")) {
    return "Informe um e-mail valido.";
  }

  return "";
}

export default function AppointmentModal({ appointments, onAddAppointment }) {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(null);
  const todayIso = getTodayIso();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorAppointment, setSelectedDoctorAppointment] =
    useState("");

  const pacientId = localStorage.getItem("pacientId");

  const handleSelectDoctor = (event) => {
    setSelectedDoctorAppointment(event.target.value);
  };

  const availableTimes = useMemo(() => {
    if (!form.date) {
      return [];
    }

    return availableTimesByWeekday[getWeekdayFromDate(form.date)] || [];
  }, [form.date]);

  function updateField(field, value) {
    setMessage(null);
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "date" ? { time: "" } : {}),
    }));
  }

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/medicos`);
      setDoctors(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPacientData = async (pacientId) => {
    try {
      const { data } = await axios.get(`${apiUrl}/pacientes/${pacientId}`);
      const pacient = data.data;
      updateField("name", pacient.nome);
      updateField("email", pacient.email);
      updateField("phone", pacient.telefone);
    } catch (err) {
      console.log("Erro ao buscar dados do paciente:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchPacientData(pacientId);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const error = validateAppointment(form);
    if (error) {
      setMessage({ type: "danger", text: error });
      return;
    }

    const appointment = {
      paciente_id: pacientId,
      medico_id: selectedDoctorAppointment
        ? Number(selectedDoctorAppointment)
        : null,
      data_consulta: `${form.date} ${form.time}`,
      valor: 250,
      status: "AGENDADA",
    };

    onAddAppointment(appointment);
    setMessage({
      type: "success",
      text: `Agendamento confirmado para ${formatDate(form.date)} as ${form.time}.`,
    });
    setForm(emptyForm);
  }

  return (
    <div
      className="modal fade"
      id="appointmentModal"
      tabIndex="-1"
      aria-labelledby="appointmentModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <p className="section-kicker mb-1">Novo agendamento</p>
              <h2 className="modal-title fs-4" id="appointmentModalLabel">
                Marcar consulta
              </h2>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fechar"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="appointment-doctor">
                    Escolha um médico
                  </label>
                  <select
                    id="appointment-doctor"
                    className="form-select"
                    value={selectedDoctorAppointment || ""}
                    onChange={handleSelectDoctor}
                  >
                    <option value="">Selecione uma opção</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="patient-name">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="patient-name"
                    placeholder="Ex.: Ana Silva"
                    value={form.name}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="appointment-date">
                    Data da consulta
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="appointment-date"
                    min={todayIso}
                    value={form.date}
                    onChange={(event) =>
                      updateField("date", event.target.value)
                    }
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="appointment-time">
                    Horario disponivel
                  </label>
                  <select
                    className="form-select"
                    id="appointment-time"
                    value={form.time}
                    onChange={(event) =>
                      updateField("time", event.target.value)
                    }
                    disabled={!form.date || availableTimes.length === 0}
                    required
                  >
                    <option value="">
                      {!form.date
                        ? "Selecione uma data primeiro"
                        : availableTimes.length === 0
                          ? "Nao ha horarios disponiveis nessa data"
                          : "Selecione um horario"}
                    </option>
                    {availableTimes.map((time) => (
                      <option value={time} key={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="patient-phone">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="patient-phone"
                    placeholder="(00) 00000-0000"
                    value={form.phone}
                    readOnly
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="patient-email">
                    E-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="patient-email"
                    placeholder="paciente@email.com"
                    value={form.email}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`alert alert-${message.type} mt-4 mb-0`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Confirmar agendamento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

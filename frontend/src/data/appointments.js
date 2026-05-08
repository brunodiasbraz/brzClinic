export const availableTimesByWeekday = {
  0: [],
  1: ["08:00", "09:30", "11:00", "14:00", "15:30"],
  2: ["08:30", "10:00", "13:30", "16:00"],
  3: ["09:00", "10:30", "14:30", "17:00"],
  4: ["08:00", "11:30", "15:00", "16:30"],
  5: ["09:30", "13:00", "14:30"],
  6: []
};

export const initialAppointments = [
  {
    id: 1,
    patient: "Ana Silva",
    doctor: "Dr. Carlos Mendes",
    specialty: "Clinica Geral",
    date: "2026-05-04",
    time: "09:30",
    status: "Agendada",
    value: 250,
    report: "Acompanhamento inicial confirmado."
  },
  {
    id: 2,
    patient: "Ana Silva",
    doctor: "Dra. Mariana Rocha",
    specialty: "Cardiologia",
    date: "2026-04-18",
    time: "14:30",
    status: "Realizada",
    value: 320,
    report: "Paciente orientada a manter exames de rotina."
  },
  {
    id: 3,
    patient: "Roberto Lima",
    doctor: "Dr. Carlos Mendes",
    specialty: "Clinica Geral",
    date: "2026-05-06",
    time: "10:30",
    status: "Agendada",
    value: 250,
    report: "Retorno para avaliacao de sintomas."
  }
];

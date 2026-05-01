const availableTimesByWeekday = {
  0: [],
  1: ["08:00", "09:30", "11:00", "14:00", "15:30"],
  2: ["08:30", "10:00", "13:30", "16:00"],
  3: ["09:00", "10:30", "14:30", "17:00"],
  4: ["08:00", "11:30", "15:00", "16:30"],
  5: ["09:30", "13:00", "14:30"],
  6: []
};

const dateInput = document.querySelector("#appointment-date");
const timeSelect = document.querySelector("#appointment-time");
const form = document.querySelector("#appointment-form");
const summary = document.querySelector("#appointment-summary");

const today = new Date();
const todayIso = today.toISOString().split("T")[0];
dateInput.min = todayIso;

function getWeekdayFromDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

function resetTimeOptions(message) {
  timeSelect.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = message;
  timeSelect.appendChild(option);
}

function fillAvailableTimes() {
  const selectedDate = dateInput.value;

  if (!selectedDate) {
    resetTimeOptions("Selecione uma data primeiro");
    timeSelect.disabled = true;
    return;
  }

  const weekday = getWeekdayFromDate(selectedDate);
  const availableTimes = availableTimesByWeekday[weekday] || [];

  if (availableTimes.length === 0) {
    resetTimeOptions("Não há horários disponíveis nessa data");
    timeSelect.disabled = true;
    return;
  }

  resetTimeOptions("Selecione um horário");
  availableTimes.forEach((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
  });
  timeSelect.disabled = false;
}

function formatDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function showMessage(message, isError = false) {
  summary.className = isError ? "summary visible error" : "summary visible";
  summary.innerHTML = message;
}

function validateForm(data) {
  if (!data.date || !data.time || !data.name || !data.phone || !data.email) {
    return "Preencha todos os campos para confirmar o agendamento.";
  }

  if (!data.email.includes("@") || !data.email.includes(".")) {
    return "Informe um e-mail válido.";
  }

  return "";
}

dateInput.addEventListener("change", fillAvailableTimes);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const appointment = {
    date: dateInput.value,
    time: timeSelect.value,
    name: document.querySelector("#patient-name").value.trim(),
    phone: document.querySelector("#patient-phone").value.trim(),
    email: document.querySelector("#patient-email").value.trim()
  };

  const error = validateForm(appointment);

  if (error) {
    alert(error);
    showMessage(error, true);
    return;
  }

  showMessage(`
    <strong>Agendamento confirmado</strong>
    Paciente: ${appointment.name}<br>
    Data: ${formatDate(appointment.date)}<br>
    Horário: ${appointment.time}<br>
    Telefone: ${appointment.phone}<br>
    E-mail: ${appointment.email}
  `);

  form.reset();
  fillAvailableTimes();
});

export function getTodayIso() {
  return new Date().toISOString().split("T")[0];
}

export function getWeekdayFromDate(dateValue) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day).getDay();
}

export function formatDate(dateValue) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatDateTime(dateTimeValue) {
  const [datePart, timePart] = dateTimeValue.split(" ");
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return {
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minute}`
  };
}
export default function StatusBadge({ status }) {
  const variant =
    status === "Realizada"
      ? "success"
      : status === "Cancelada"
        ? "danger"
        : "primary";

  return <span className={`badge text-bg-${variant}`}>{status}</span>;
}

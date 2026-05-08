export default function StatusBadge({ status }) {
  const variant =
    status.toLowerCase() === "realizada"
      ? "success"
      : status.toLowerCase() === "cancelada"
        ? "danger"
        : "primary";

  return <span className={`badge text-bg-${variant}`}>{status}</span>;
}

export default function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}

export default function Header({ title, subtitle, onLogout }) {
  return (
    <header className="app-header">
      <div>
        <p className="section-kicker">BRZ Clinic</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <button type="button" className="btn btn-light" onClick={onLogout}>
        Sair
      </button>
    </header>
  );
}

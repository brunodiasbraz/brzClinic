import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Navbar({
  selectedPacient,
  setSelectedPacient,
  selectedDoctor,
  setSelectedDoctor,
}) {
  const [pacients, setPacients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const fetchPacients = async () => {
    try {
      const res = await axios.get(`${apiUrl}/pacientes`);
      setPacients(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${apiUrl}/medicos`);
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPacients();
    fetchDoctors();
  }, []);

  const handleSelectPacient = (e) => {
    const id = Number(e.target.value);

    setSelectedPacient(id); // 🔥 atualiza o App
    localStorage.setItem("pacientId", id);
  };

  const handleSelectDoctor = (e) => {
    const id = Number(e.target.value);

    setSelectedDoctor(id);
    localStorage.setItem("doctorId", id);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarContent"
        >
          <div
            className="d-flex flex-column flex-lg-row gap-2 w-100 justify-content-center"
            style={{ maxWidth: "500px" }}
          >
            <select
              className="form-select"
              value={selectedPacient || ""}
              onChange={handleSelectPacient}
            >
              <option value="">Escolha um paciente</option>
              {pacients.map((pacient) => (
                <option key={pacient.id} value={pacient.id}>
                  {pacient.nome}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              value={selectedDoctor || ""}
              onChange={handleSelectDoctor}
            >
              <option value="">Escolha um médico</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import DoctorScreen from "./pages/DoctorScreen";
import LoginScreen from "./pages/LoginScreen";
import PatientScreen from "./pages/PatientScreen";
import Navbar from "./components/Navbar";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [appointmentsDoctor, setAppointmentsDoctor] = useState([]);
  const [selectedPacient, setSelectedPacient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const addAppointment = async (appointment) => {
    try {
      await axios.post(`${apiUrl}/consultas`, appointment);
      setAppointments((current) => [...current, appointment]);
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
    }
  };

  function goToLogin() {
    setSelectedPacient(null);
    setSelectedDoctor(null);
    localStorage.removeItem("pacientId");
    localStorage.removeItem("doctorId");
    navigate("/");
  }

  const fetchAppointments = async (pacientId) => {
    if (!pacientId) return;

    try {
      const { data } = await axios.get(
        `${apiUrl}/pacientes/${pacientId}/consultas`,
      );
      setAppointments(data.data);
    } catch (err) {
      console.log("Erro ao buscar consultas:", err);
    }
  };

  const fetchAppointmentsForDoctor = async (doctorId) => {
    if (!doctorId) return;

    try {
      const res = await axios.get(`${apiUrl}/medicos/${doctorId}/consultas`);
      setAppointmentsDoctor(res.data);
    } catch (err) {
      console.log("Erro ao buscar consultas para médico:", err);
    }
  };

  useEffect(() => {
    const storedPacient = localStorage.getItem("pacientId");
    const storedDoctor = localStorage.getItem("doctorId");

    if (storedPacient) setSelectedPacient(Number(storedPacient));
    if (storedDoctor) setSelectedDoctor(Number(storedDoctor));

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedPacient) {
      fetchAppointments(selectedPacient);
    }
  }, [selectedPacient]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchAppointmentsForDoctor(selectedDoctor);
    }
  }, [selectedDoctor]);

  if (isLoading) return <div>Carregando...</div>;

  return (
    <>
      {}
      <Navbar
        selectedPacient={selectedPacient}
        setSelectedPacient={setSelectedPacient}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        goToLogin={goToLogin}
      />

      <Routes>
        <Route
          path="/"
          element={
            <LoginScreen
              selectedDoctor={selectedDoctor}
              selectedPacient={selectedPacient}
            />
          }
        />

        <Route
          path="/paciente"
          element={
            selectedPacient ? (
              <PatientScreen
                appointments={appointments}
                onAddAppointment={addAppointment}
                onLogout={goToLogin}
                selectedPacient={selectedPacient}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/medico"
          element={
            selectedDoctor ? (
              <DoctorScreen
                appointments={appointmentsDoctor}
                onLogout={goToLogin}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

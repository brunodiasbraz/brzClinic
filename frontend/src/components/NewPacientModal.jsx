import { useEffect, useState } from "react";
import axios from "axios";
import { IMaskInput } from "react-imask";

const apiUrl = import.meta.env.VITE_API_URL;

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  cpf: "",
  address: "",
  birthDate: "",
  healthPlan: "",
};

export default function NewPacientModal() {
  const [planoSaude, setPlanoSaude] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const fetchPlanosSaude = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/planos-saude`);
      setPlanoSaude(data);
    } catch (error) {
      console.error("Erro ao buscar planos de saúde:", error);
    }
  };

  useEffect(() => {
    fetchPlanosSaude();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      nome: form.name,
      endereco: form.address,
      data_nascimento: form.birthDate,
      telefone: form.phone,
      email: form.email,
      cpf: form.cpf,
      plano_saude_id: Number(form.healthPlan),
    };
    try {
      await axios.post(`${apiUrl}/pacientes`, payload);
      setForm(emptyForm);
      alert("Paciente cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      alert("Ocorreu um erro ao cadastrar o paciente. Tente novamente.");}
  };

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "date" ? { time: "" } : {}),
    }));
  }

  return (
    <div
      className="modal fade  modal-lg"
      id="newPacientModal"
      tabIndex="-1"
      aria-labelledby="newPacientModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="newPacientModalLabel">
              Novo paciente
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="plano-saude">
                    Plano de Saúde
                  </label>
                  <select
                    id="plano-saude"
                    className="form-select"
                    value={form.healthPlan || ""}
                    onChange={(e) => updateField("healthPlan", e.target.value)}
                  >
                    <option value="">Selecione um plano</option>
                    {planoSaude.map((plano) => (
                      <option key={plano.id} value={plano.id}>
                        {plano.nome}
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
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="patient-cpf">
                    CPF
                  </label>
                  <IMaskInput
                    mask="000.000.000-00"
                    value={form.cpf}
                    onAccept={(value) =>
                      updateField("cpf", value.replace(/\D/g, ""))
                    }
                    className="form-control"
                  />
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
                    required
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="birth-date">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="birth-date"
                    value={form.birthDate}
                    onChange={(event) =>
                      updateField("birthDate", event.target.value)
                    }
                    required
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
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label" htmlFor="pacient-address">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pacient-address"
                    value={form.address}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Cadastrar paciente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

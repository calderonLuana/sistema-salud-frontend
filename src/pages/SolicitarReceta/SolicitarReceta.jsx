import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { obtenerGrupoFamiliar } from "../../services/afiliadoService";
import { listarMedicamentos } from "../../services/medicamentoService";
import { crearReceta } from "../../services/recetaService";

function SolicitarReceta() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  const [pacienteId, setPacienteId] = useState("");
  const [medicamentoTexto, setMedicamentoTexto] = useState("");
  const [presentacion, setPresentacion] = useState("");
  const [cantidadComprimidos, setCantidadComprimidos] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  async function cargarDatosIniciales() {
    try {
      setError("");

      const grupo = await obtenerGrupoFamiliar(usuario.id);
      const miembros = grupo.Afiliados || grupo.Afiliado || [];
      setGrupoFamiliar(miembros);

      const listaMedicamentos = await listarMedicamentos();
      setMedicamentos(listaMedicamentos);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los datos para solicitar la receta.");
    } finally {
      setLoading(false);
    }
  }

  // Busca el medicamento cuyo nombre coincide EXACTO con lo escrito
  const medicamentoSeleccionado = useMemo(() => {
    return medicamentos.find(
      (med) =>
        med.nombre.trim().toLowerCase() ===
        medicamentoTexto.trim().toLowerCase()
    );
  }, [medicamentos, medicamentoTexto]);

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (!pacienteId || !medicamentoTexto || !presentacion || !cantidadComprimidos || !cantidad) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    if (!medicamentoSeleccionado) {
      setError(
        "El medicamento ingresado no existe en el sistema. Elegí una opción de la lista sugerida."
      );
      return;
    }

    try {
      setEnviando(true);
      setError("");

      await crearReceta({
        pacienteId: Number(pacienteId),
        medicamentoId: medicamentoSeleccionado.id,
        presentacion,
        cantidadComprimidos: Number(cantidadComprimidos),
        cantidad: Number(cantidad),
        observaciones: observaciones || null,
      });

      navigate("/recetas");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error || "No se pudo solicitar la receta."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <main>
      <h1>Solicitar receta</h1>

      {error && <p>{error}</p>}

      <form onSubmit={manejarEnvio}>
        <label>
          Para quién es la receta
          <select
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            required
          >
            <option value="">Seleccioná un integrante</option>
            {grupoFamiliar.map((miembro) => (
              <option key={miembro.id} value={miembro.id}>
                {miembro.nombre} {miembro.apellido}
              </option>
            ))}
          </select>
        </label>

        <label>
          Medicamento
          <input
            type="text"
            list="lista-medicamentos"
            value={medicamentoTexto}
            onChange={(e) => setMedicamentoTexto(e.target.value)}
            placeholder="Ej: Ibuprofeno 600mg"
            required
          />
          <datalist id="lista-medicamentos">
            {medicamentos.map((med) => (
              <option key={med.id} value={med.nombre} />
            ))}
          </datalist>
        </label>

        <label>
          Presentación
          <input
            type="text"
            value={presentacion}
            onChange={(e) => setPresentacion(e.target.value)}
            placeholder="Ej: Comprimidos"
            required
          />
        </label>

        <label>
          Cantidad de comprimidos
          <input
            type="number"
            min="1"
            value={cantidadComprimidos}
            onChange={(e) => setCantidadComprimidos(e.target.value)}
            required
          />
        </label>

        <label>
          Cantidad
          <input
            type="number"
            min="1"
            max="2"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </label>

        <label>
          Observaciones (opcional)
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            maxLength={200}
          />
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </main>
  );
}

export default SolicitarReceta;
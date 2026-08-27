import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { obtenerGrupoFamiliar } from "../../services/afiliadoService";
import { obtenerDisponibilidadesLibres } from "../../services/disponibilidadService";
import { obtenerTurnoPorId, editarTurno } from "../../services/turnoService";

function EditarTurno() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [turno, setTurno] = useState(null);
  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);

  const [pacienteId, setPacienteId] = useState("");
  const [fecha, setFecha] = useState("");
  const [disponibilidadId, setDisponibilidadId] = useState("");

  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatosIniciales();
  }, [id]);

  async function cargarDatosIniciales() {
    try {
      setError("");

      const turnoActual = await obtenerTurnoPorId(id);
      setTurno(turnoActual);
      setPacienteId(String(turnoActual.pacienteId));

      const grupo = await obtenerGrupoFamiliar(usuario.id);
      const miembros = grupo.Afiliados || grupo.Afiliado || [];
      setGrupoFamiliar(miembros);

      const profesionalId = turnoActual.Disponibilidad.Profesional.id;
      const libres = await obtenerDisponibilidadesLibres(profesionalId);
      setDisponibilidades(libres);
    } catch (error) {
      console.error(error);

      setError("No se pudo cargar la información del turno.");
    } finally {
      setLoading(false);
    }
  }

  const fechas = useMemo(() => {
    const set = new Set();

    disponibilidades.forEach((d) => set.add(d.fecha));

    return Array.from(set);
  }, [disponibilidades]);

  const horarios = useMemo(() => {
    if (!fecha) return [];

    return disponibilidades.filter((d) => d.fecha === fecha);
  }, [disponibilidades, fecha]);

  function manejarCambioFecha(valor) {
    setFecha(valor);
    setDisponibilidadId("");
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (!pacienteId) {
      setError("Seleccioná para quién es el turno.");
      return;
    }

    const cambios = {};

    if (Number(pacienteId) !== turno.pacienteId) {
      cambios.pacienteId = Number(pacienteId);
    }

    if (disponibilidadId) {
      cambios.nuevaDisponibilidadId = Number(disponibilidadId);
    }

    if (Object.keys(cambios).length === 0) {
      setError("No hiciste ningún cambio.");
      return;
    }

    try {
      setEnviando(true);
      setError("");

      await editarTurno(id, cambios);

      navigate("/turnos");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error || "No se pudo editar el turno."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!turno) {
    return <p>{error || "Turno no encontrado."}</p>;
  }

  const { Profesional } = turno.Disponibilidad;

  return (
    <main>
      <h1>Editar turno</h1>

      <p>
        {Profesional.Especialidad.nombre} — Dr. {Profesional.nombre}{" "}
        {Profesional.apellido}
      </p>
      <p>
        (La especialidad y el profesional no se pueden modificar)
      </p>

      {error && <p>{error}</p>}

      <form onSubmit={manejarEnvio}>
        <label>
          Para quién es el turno
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
          Nueva fecha (opcional)
          <select
            value={fecha}
            onChange={(e) => manejarCambioFecha(e.target.value)}
          >
            <option value="">Mantener fecha actual</option>
            {fechas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nuevo horario
          <select
            value={disponibilidadId}
            onChange={(e) => setDisponibilidadId(e.target.value)}
            disabled={!fecha}
          >
            <option value="">Seleccioná un horario</option>
            {horarios.map((h) => (
              <option key={h.id} value={h.id}>
                {h.hora}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </main>
  );
}

export default EditarTurno;
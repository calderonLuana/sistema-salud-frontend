import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { obtenerGrupoFamiliar } from "../../services/afiliadoService";
import { obtenerDisponibilidadesLibres } from "../../services/disponibilidadService";
import { crearTurno } from "../../services/turnoService";

function SolicitarTurno() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);

  const [pacienteId, setPacienteId] = useState("");
  const [especialidadId, setEspecialidadId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");
  const [disponibilidadId, setDisponibilidadId] = useState("");

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

      const libres = await obtenerDisponibilidadesLibres();

      setDisponibilidades(libres);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los datos para solicitar el turno.");
    } finally {
      setLoading(false);
    }
  }

  const especialidades = useMemo(() => {
    const mapa = new Map();

    disponibilidades.forEach((d) => {
      const esp = d.Profesional?.Especialidad;

      if (esp) {
        mapa.set(esp.id, esp.nombre);
      }
    });

    return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }, [disponibilidades]);

  const profesionales = useMemo(() => {
    if (!especialidadId) return [];

    const mapa = new Map();

    disponibilidades
      .filter(
        (d) => d.Profesional?.Especialidad?.id === Number(especialidadId)
      )
      .forEach((d) => {
        mapa.set(
          d.Profesional.id,
          `${d.Profesional.nombre} ${d.Profesional.apellido}`
        );
      });

    return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }, [disponibilidades, especialidadId]);

  const ubicaciones = useMemo(() => {
    if (!profesionalId) return [];

    const set = new Set();

    disponibilidades
      .filter((d) => d.Profesional?.id === Number(profesionalId))
      .forEach((d) => set.add(d.lugar));

    return Array.from(set);
  }, [disponibilidades, profesionalId]);

  const fechas = useMemo(() => {
    if (!lugar) return [];

    const set = new Set();

    disponibilidades
      .filter(
        (d) => d.Profesional?.id === Number(profesionalId) && d.lugar === lugar
      )
      .forEach((d) => set.add(d.fecha));

    return Array.from(set);
  }, [disponibilidades, profesionalId, lugar]);

  const horarios = useMemo(() => {
    if (!fecha) return [];

    return disponibilidades.filter(
      (d) =>
        d.Profesional?.id === Number(profesionalId) &&
        d.lugar === lugar &&
        d.fecha === fecha
    );
  }, [disponibilidades, profesionalId, lugar, fecha]);

  function manejarCambioEspecialidad(valor) {
    setEspecialidadId(valor);
    setProfesionalId("");
    setLugar("");
    setFecha("");
    setDisponibilidadId("");
  }

  function manejarCambioProfesional(valor) {
    setProfesionalId(valor);
    setLugar("");
    setFecha("");
    setDisponibilidadId("");
  }

  function manejarCambioLugar(valor) {
    setLugar(valor);
    setFecha("");
    setDisponibilidadId("");
  }

  function manejarCambioFecha(valor) {
    setFecha(valor);
    setDisponibilidadId("");
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (!pacienteId || !disponibilidadId) {
      setError("Completá todos los campos antes de enviar.");
      return;
    }

    try {
      setEnviando(true);
      setError("");

      await crearTurno(Number(pacienteId), Number(disponibilidadId));

      navigate("/turnos");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error || "No se pudo solicitar el turno."
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
      <h1>Solicitar turno</h1>

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
          Especialidad
          <select
            value={especialidadId}
            onChange={(e) => manejarCambioEspecialidad(e.target.value)}
            required
          >
            <option value="">Seleccioná una especialidad</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Profesional
          <select
            value={profesionalId}
            onChange={(e) => manejarCambioProfesional(e.target.value)}
            disabled={!especialidadId}
            required
          >
            <option value="">Seleccioná un profesional</option>
            {profesionales.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Ubicación
          <select
            value={lugar}
            onChange={(e) => manejarCambioLugar(e.target.value)}
            disabled={!profesionalId}
            required
          >
            <option value="">Seleccioná una ubicación</option>
            {ubicaciones.map((ubi) => (
              <option key={ubi} value={ubi}>
                {ubi}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha
          <select
            value={fecha}
            onChange={(e) => manejarCambioFecha(e.target.value)}
            disabled={!lugar}
            required
          >
            <option value="">Seleccioná una fecha</option>
            {fechas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label>
          Horario
          <select
            value={disponibilidadId}
            onChange={(e) => setDisponibilidadId(e.target.value)}
            disabled={!fecha}
            required
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
          {enviando ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </main>
  );
}

export default SolicitarTurno;
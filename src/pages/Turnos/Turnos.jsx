import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { obtenerGrupoFamiliar } from "../../services/afiliadoService";
import {
  obtenerTurnosProximos,
  obtenerTurnosAnteriores,
  cancelarTurno,
} from "../../services/turnoService";

import { filtrarTurnos } from "../../utils/filtrarTurnos";
import { formatearFecha } from "../../utils/formatearFecha";
import { formatearHora } from "../../utils/formatearHora";
import {
  dentroDelPeriodo,
  estadoDeTurnoAnterior,
  fechaHoraDeTurno,
  nombreCompleto,
} from "../../utils/turnos";

import ListaTurnos from "../../components/ListaTurnos/ListaTurnos";
import FiltrosTurnos from "../../components/FiltrosTurnos/FiltrosTurnos";
import ModalConfirmacion from "../../components/ModalConfirmacion/ModalConfirmacion";
import styles from "./Turnos.module.css";

function Turnos() {
  const { usuario } = useContext(AuthContext);

  const [proximos, setProximos] = useState([]);
  const [anteriores, setAnteriores] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  const [textoFiltro, setTextoFiltro] = useState("");
  const [pacienteFiltro, setPacienteFiltro] = useState("TODOS");
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");
  const [periodoMeses, setPeriodoMeses] = useState(6);

  const [turnoACancelar, setTurnoACancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorAccion, setErrorAccion] = useState("");

  useEffect(() => {
    cargarTurnos();
  }, [usuario.id]);

  async function cargarTurnos() {
    try {
      setError("");

      const grupo = await obtenerGrupoFamiliar(usuario.id);
      const miembros = grupo.Afiliados || grupo.Afiliado || [];

      // Se piden los turnos de cada integrante. Si el backend rechaza a alguno
      // por permisos (403), simplemente no se muestra: no rompe la pantalla.
      const resultados = await Promise.allSettled(
        miembros.map(async (miembro) => {
          const [prox, ant] = await Promise.all([
            obtenerTurnosProximos(miembro.id),
            obtenerTurnosAnteriores(miembro.id),
          ]);

          return { miembro, prox, ant };
        })
      );

      const visibles = resultados
        .filter((resultado) => resultado.status === "fulfilled")
        .map((resultado) => resultado.value);

      if (visibles.length === 0) {
        throw new Error("No se pudo consultar ningún integrante");
      }

      const listaProximos = [];
      const listaAnteriores = [];

      visibles.forEach(({ miembro, prox, ant }) => {
        prox.forEach((turno) =>
          listaProximos.push({
            ...turno,
            paciente: miembro,
            estadoVisible: "RESERVADO",
          })
        );

        ant.forEach((turno) =>
          listaAnteriores.push({
            ...turno,
            paciente: miembro,
            estadoVisible: estadoDeTurnoAnterior(turno),
          })
        );
      });

      listaProximos.sort((a, b) => fechaHoraDeTurno(a) - fechaHoraDeTurno(b));
      listaAnteriores.sort((a, b) => fechaHoraDeTurno(b) - fechaHoraDeTurno(a));

      // El propio usuario va primero en el filtro de pacientes
      const listaPacientes = visibles
        .map(({ miembro }) => miembro)
        .sort(
          (a, b) =>
            (b.id === usuario.id ? 1 : 0) - (a.id === usuario.id ? 1 : 0)
        );

      setProximos(listaProximos);
      setAnteriores(listaAnteriores);
      setPacientes(listaPacientes);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los turnos.");
    } finally {
      setCargando(false);
    }
  }

  function pedirCancelacion(turno) {
    setErrorAccion("");
    setTurnoACancelar(turno);
  }

  async function confirmarCancelacion() {
    if (!turnoACancelar || cancelando) return;

    const turno = turnoACancelar;

    setCancelando(true);
    setTurnoACancelar(null);

    try {
      await cancelarTurno(turno.id);

      await cargarTurnos();
    } catch (error) {
      console.error(error);

      setErrorAccion(
        error.response?.data?.error || "No se pudo cancelar el turno."
      );
    } finally {
      setCancelando(false);
    }
  }

  const proximosFiltrados = useMemo(
    () =>
      filtrarTurnos(proximos, {
        texto: textoFiltro,
        estado: estadoFiltro,
        pacienteId: pacienteFiltro,
      }),
    [proximos, textoFiltro, estadoFiltro, pacienteFiltro]
  );

  const anterioresFiltrados = useMemo(
    () =>
      filtrarTurnos(
        anteriores.filter((turno) => dentroDelPeriodo(turno, periodoMeses)),
        {
          texto: textoFiltro,
          estado: estadoFiltro,
          pacienteId: pacienteFiltro,
        }
      ),
    [anteriores, periodoMeses, textoFiltro, estadoFiltro, pacienteFiltro]
  );

  const hayFiltros =
    textoFiltro.trim() !== "" ||
    estadoFiltro !== "TODOS" ||
    pacienteFiltro !== "TODOS";

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className={styles.contenedor}>
      {errorAccion && (
        <p className={styles.errorAccion} role="alert">
          {errorAccion}
        </p>
      )}

      <FiltrosTurnos
        texto={textoFiltro}
        onCambiarTexto={setTextoFiltro}
        paciente={pacienteFiltro}
        onCambiarPaciente={setPacienteFiltro}
        pacientes={pacientes}
        usuarioId={usuario.id}
        estado={estadoFiltro}
        onCambiarEstado={setEstadoFiltro}
      >
        <Link to="/turnos/solicitar" className={styles.botonSolicitar}>
          + Solicitar turno
        </Link>
      </FiltrosTurnos>

      <ListaTurnos
        titulo="Próximos turnos"
        icono="calendario"
        turnos={proximosFiltrados}
        usuarioId={usuario.id}
        onCancelar={pedirCancelacion}
        mensajeVacio={
          hayFiltros
            ? "No hay turnos que coincidan con los filtros."
            : "No tenés turnos próximos."
        }
      />

      <ListaTurnos
        titulo="Turnos anteriores"
        icono="reloj"
        turnos={anterioresFiltrados}
        usuarioId={usuario.id}
        onCancelar={pedirCancelacion}
        mensajeVacio={
          hayFiltros
            ? "No hay turnos que coincidan con los filtros."
            : "No hay turnos anteriores en este período."
        }
        controles={
          <select
            className={styles.selectPeriodo}
            value={periodoMeses}
            onChange={(e) => setPeriodoMeses(Number(e.target.value))}
            aria-label="Período de los turnos anteriores"
          >
            <option value={3}>Últimos 3 meses</option>
            <option value={6}>Últimos 6 meses</option>
          </select>
        }
      />

      <ModalConfirmacion
        abierto={Boolean(turnoACancelar)}
        titulo="Cancelar turno"
        mensaje={
          turnoACancelar
            ? `¿Querés cancelar el turno de ${nombreCompleto(
                turnoACancelar.paciente
              )} del ${formatearFecha(
                turnoACancelar.Disponibilidad.fecha
              )} a las ${formatearHora(turnoACancelar.Disponibilidad.hora)}?`
            : ""
        }
        textoConfirmar="Cancelar turno"
        textoCancelar="Volver"
        onConfirmar={confirmarCancelacion}
        onCancelar={() => setTurnoACancelar(null)}
      />
    </main>
  );
}

export default Turnos;
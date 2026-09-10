import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import {
  obtenerTurnosProximos,
  obtenerTurnosAnteriores,
  cancelarTurno,
} from "../../services/turnoService";

import { filtrarTurnos } from "../../utils/filtrarTurnos";

import ListaTurnos from "../../components/ListaTurnos/ListaTurnos";
import EncabezadoPagina from "../../components/EncabezadoPagina/EncabezadoPagina";
import FiltrosTurnos from "../../components/FiltrosTurnos/FiltrosTurnos";
import styles from "./Turnos.module.css";

function Turnos() {
  const { usuario } = useContext(AuthContext);

  const [proximos, setProximos] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [textoFiltro, setTextoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarTurnos();
  }, []);

  async function cargarTurnos() {
    try {
      setError("");

      const turnosProximos = await obtenerTurnosProximos(usuario.id);
      const turnosHistorial = await obtenerTurnosAnteriores(usuario.id);

      setProximos(turnosProximos);
      setHistorial(turnosHistorial);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar los turnos.");
    } finally {
      setLoading(false);
    }
  }

  async function manejarCancelacion(turnoId) {
    try {
      await cancelarTurno(turnoId);

      await cargarTurnos();
    } catch (error) {
      console.error(error);

      setError("No se pudo cancelar el turno.");
    }
  }

  const proximosFiltrados = useMemo(
    () =>
      filtrarTurnos(proximos, {
        texto: textoFiltro,
        estado: estadoFiltro,
      }),
    [proximos, textoFiltro, estadoFiltro]
  );

  const historialFiltrado = useMemo(
    () =>
      filtrarTurnos(historial, {
        texto: textoFiltro,
        estado: estadoFiltro,
      }),
    [historial, textoFiltro, estadoFiltro]
  );

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <EncabezadoPagina titulo="Turnos" />

      <main className={styles.contenedor}>
        <header className={styles.encabezado}>
          <h1>Mis Turnos</h1>
          <p>Consultá y administrá tus turnos médicos.</p>
        </header>

        <Link to="/turnos/solicitar">+ Solicitar turno</Link>

        <FiltrosTurnos
          texto={textoFiltro}
          onCambiarTexto={setTextoFiltro}
          estado={estadoFiltro}
          onCambiarEstado={setEstadoFiltro}
        />

        <section className={styles.seccion}>
          <ListaTurnos
            titulo="Próximos"
            turnos={proximosFiltrados}
            onCancelar={manejarCancelacion}
          />
        </section>

        <section className={styles.seccion}>
          <ListaTurnos
            titulo="Historial"
            turnos={historialFiltrado}
            onCancelar={manejarCancelacion}
          />
        </section>
      </main>
    </>
  );
}

export default Turnos;
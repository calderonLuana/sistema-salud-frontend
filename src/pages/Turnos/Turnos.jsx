import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import {
  obtenerTurnosProximos,
  obtenerTurnosAnteriores,
  cancelarTurno,
} from "../../services/turnoService";

import ListaTurnos from "../../components/ListaTurnos/ListaTurnos";
import EncabezadoPagina from "../../components/EncabezadoPagina/EncabezadoPagina";
import styles from "./Turnos.module.css";

function Turnos() {
  const { usuario } = useContext(AuthContext);

  const [proximos, setProximos] = useState([]);
  const [historial, setHistorial] = useState([]);

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

        <section className={styles.seccion}>
          <ListaTurnos
            titulo="Próximos"
            turnos={proximos}
            onCancelar={manejarCancelacion}
          />
        </section>

        <section className={styles.seccion}>
          <ListaTurnos
            titulo="Historial"
            turnos={historial}
            onCancelar={manejarCancelacion}
          />
        </section>
      </main>
    </>
  );
}

export default Turnos;
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import {
  obtenerTurnosProximos,
  obtenerTurnosAnteriores,
} from "../../services/turnoService";

import ListaTurnos from "../../components/ListaTurnos/ListaTurnos";

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

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1>Mis Turnos</h1>

      <ListaTurnos
        titulo="Próximos"
        turnos={proximos}
        onTurnoCancelado={cargarTurnos}
      />

      <ListaTurnos
        titulo="Historial"
        turnos={historial}
        onTurnoCancelado={cargarTurnos}
      />
    </>
  );
}

export default Turnos;
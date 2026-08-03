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
    console.log("Entró a cargarTurnos");

    try {
      console.log("Antes de próximos");

      const turnosProximos = await obtenerTurnosProximos(usuario.id);

      console.log(JSON.stringify(turnosProximos, null, 2));

      console.log("Antes de historial");

      const turnosHistorial = await obtenerTurnosAnteriores(usuario.id);

      console.log("Respuesta historial:", turnosHistorial);

      setProximos(turnosProximos);
      setHistorial(turnosHistorial);
    } catch (error) {
      console.error("ERROR:", error);

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
      />

      <ListaTurnos
        titulo="Historial"
        turnos={historial}
      />
    </>
  );
}

export default Turnos;
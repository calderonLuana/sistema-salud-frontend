import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import {
  obtenerAfiliado,
  obtenerGrupoFamiliar
} from "../../services/afiliadoService";

import InformacionAfiliado from "../../components/InformacionAfiliado/InformacionAfiliado";
import GrupoFamiliar from "../GrupoFamiliar/GrupoFamiliar";

function Inicio() {
  const { usuario } = useContext(AuthContext);

  const [afiliado, setAfiliado] = useState(null);
  const [grupoFamiliar, setGrupoFamiliar] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosAfiliado = await obtenerAfiliado(usuario.id);

        const datosGrupo = await obtenerGrupoFamiliar(usuario.id);

        setAfiliado(datosAfiliado);
        setGrupoFamiliar(datosGrupo.Afiliados);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [usuario.id]);

  if (cargando) {
    return <p>Cargando información...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1>Inicio</h1>

      <p>
        ¡Hola, {usuario.nombre}!
      </p>

      <p>
        Bienvenido a tu espacio personal de salud.
      </p>

      <InformacionAfiliado
        afiliado={afiliado}
      />

      <GrupoFamiliar
        integrantes={grupoFamiliar}
      />
    </>
  );
}

export default Inicio;
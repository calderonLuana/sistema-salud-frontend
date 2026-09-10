import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { obtenerGrupoFamiliar } from "../../services/afiliadoService";
import { obtenerRecetasAfiliado } from "../../services/recetaService";

import { filtrarRecetas } from "../../utils/filtrarRecetas";

import ListaRecetas from "../../components/ListaRecetas/ListaRecetas";
import EncabezadoPagina from "../../components/EncabezadoPagina/EncabezadoPagina";
import FiltrosRecetas from "../../components/FiltrosRecetas/FiltrosRecetas";
import styles from "./Recetas.module.css";

function Recetas() {
  const { usuario } = useContext(AuthContext);

  const [recetas, setRecetas] = useState([]);
  const [textoFiltro, setTextoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarRecetas();
  }, []);

  async function cargarRecetas() {
    try {
      setError("");

      const grupo = await obtenerGrupoFamiliar(usuario.id);
      const miembros = grupo.Afiliados || grupo.Afiliado || [];

      const resultados = await Promise.allSettled(
        miembros.map((miembro) => obtenerRecetasAfiliado(miembro.id))
      );

      const todas = [];

      resultados.forEach((resultado, index) => {
        if (resultado.status === "fulfilled") {
          const miembro = miembros[index];
          const esUnoMismo = miembro.id === usuario.id;

          resultado.value.forEach((receta) => {
            todas.push({
              ...receta,
              nombrePacienteMostrar: esUnoMismo
                ? null
                : `${miembro.nombre} ${miembro.apellido}`,
            });
          });
        }
      });

      todas.sort(
        (a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud)
      );

      setRecetas(todas);
    } catch (error) {
      console.error(error);

      setError("No se pudieron cargar las recetas.");
    } finally {
      setLoading(false);
    }
  }

  const recetasFiltradas = useMemo(
    () =>
      filtrarRecetas(recetas, {
        texto: textoFiltro,
        estado: estadoFiltro,
      }),
    [recetas, textoFiltro, estadoFiltro]
  );

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <EncabezadoPagina titulo="Recetas" />

      <main className={styles.contenedor}>
        <header className={styles.encabezado}>
          <h1>Mis Recetas</h1>
          <p>Consultá y administrá tus recetas médicas.</p>
        </header>

        <Link to="/recetas/solicitar">+ Solicitar receta</Link>

        <FiltrosRecetas
          texto={textoFiltro}
          onCambiarTexto={setTextoFiltro}
          estado={estadoFiltro}
          onCambiarEstado={setEstadoFiltro}
        />

        <section className={styles.seccion}>
          <ListaRecetas recetas={recetasFiltradas} />
        </section>
      </main>
    </>
  );
}

export default Recetas;
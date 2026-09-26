import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { obtenerTurnosProximos } from "../../services/turnoService";
import { obtenerRecetasAfiliado } from "../../services/recetaService";

import {
  obtenerAfiliado,
  obtenerGrupoFamiliar
} from "../../services/afiliadoService";

import EncabezadoInicio from "../../components/EncabezadoInicio/EncabezadoInicio";
import MenuLateral from "../../components/MenuLateral/MenuLateral";
import ModalConfirmacion from "../../components/ModalConfirmacion/ModalConfirmacion";
import PiePagina from "../../components/PiePagina/PiePagina";
import styles from "./Inicio.module.css";

const ETIQUETA_TIPO = {
  TITULAR: "Afiliado titular",
  CONYUGE: "Afiliado cónyuge",
  HIJO: "Afiliado",
};

const ETIQUETA_PARENTESCO = {
  TITULAR: "Titular",
  CONYUGE: "Cónyuge",
  HIJO: "Hijo/a",
};

function Inicio() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [afiliado, setAfiliado] = useState(null);
  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [proximoTurno, setProximoTurno] = useState(null);
  const [ultimaRecetaAprobada, setUltimaRecetaAprobada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [confirmarSalirAbierto, setConfirmarSalirAbierto] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      try {
        const datosAfiliado = await obtenerAfiliado(usuario.id);
        const datosGrupo = await obtenerGrupoFamiliar(usuario.id);
        const turnos = await obtenerTurnosProximos(usuario.id);
        const recetas = await obtenerRecetasAfiliado(usuario.id);

        setAfiliado(datosAfiliado);
        setGrupoFamiliar(datosGrupo.Afiliados);

        if (turnos.length > 0) {
          setProximoTurno(turnos[0]);
        }

        const aprobadas = recetas
          .filter((r) => r.estado === "APROBADA")
          .sort(
            (a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud)
          );

        if (aprobadas.length > 0) {
          setUltimaRecetaAprobada(aprobadas[0]);
        }
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [usuario.id]);

  function pedirConfirmacionSalir() {
    setMenuAbierto(false);
    setConfirmarSalirAbierto(true);
  }

  function confirmarSalir() {
    logout();
    navigate("/login");
  }

  if (cargando) {
    return <p>Cargando información...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <EncabezadoInicio onAbrirMenu={() => setMenuAbierto(true)} />

      <MenuLateral
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        usuario={usuario}
        afiliado={afiliado}
        onSalir={pedirConfirmacionSalir}
      />

      <ModalConfirmacion
        abierto={confirmarSalirAbierto}
        titulo="Cerrar sesión"
        mensaje="¿Estás seguro de que querés cerrar sesión?"
        textoConfirmar="Cerrar sesión"
        textoCancelar="Cancelar"
        onConfirmar={confirmarSalir}
        onCancelar={() => setConfirmarSalirAbierto(false)}
      />

      <main className={styles.contenedor}>
        <h1 className={styles.saludo}>
          Hola, <span className={styles.nombreDestacado}>{usuario.nombre}!</span>
        </h1>

        <div className={styles.tarjetaAfiliado}>
          <div className={styles.iconoGrupo}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3 20c0.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="17" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M15 20c0.5-2.3 1.9-3.6 4-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <div className={styles.infoAfiliado}>
            <p className={styles.tipoAfiliado}>
              {ETIQUETA_TIPO[afiliado?.tipoAfiliado] || "Afiliado"}
            </p>
            <p className={styles.cantidadGrupo}>
              Grupo familiar: {grupoFamiliar.length} {grupoFamiliar.length === 1 ? "persona" : "personas"}
            </p>
          </div>

          {afiliado?.estado === "ACTIVO" && (
            <div className={styles.badgeEstado}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Afiliación activa
            </div>
          )}
        </div>

        <div className={styles.gridDashboard}>
          <div className={styles.tarjetaResumen}>
            <h2 className={styles.tituloResumen}>Notificaciones y avisos</h2>

            <div className={styles.contenidoResumen}>
              <p className={styles.sinDatos}>No hay notificaciones por el momento.</p>
            </div>

            <div className={styles.separadorResumen}></div>

            <span className={styles.linkResumenInactivo}>
              Ver todas las notificaciones
            </span>
          </div>

          <div className={styles.tarjetaResumen}>
            <h2 className={styles.tituloResumen}>Mi grupo familiar</h2>

            <div className={styles.contenidoResumen}>
              <div className={styles.listaFamiliar}>
                {grupoFamiliar.map((integrante) => (
                  <div key={integrante.id} className={styles.filaFamiliar}>
                    <span className={styles.nombreFamiliar}>
                      {integrante.nombre}
                    </span>
                    <span className={styles.parentescoFamiliar}>
                      {ETIQUETA_PARENTESCO[integrante.tipoAfiliado] || integrante.tipoAfiliado}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.separadorResumen}></div>

            <span className={styles.linkResumenInactivo}>
              Ver grupo familiar
            </span>
          </div>

          <div className={styles.tarjetaResumen}>
            <h2 className={styles.tituloResumen}>Mis turnos</h2>

            <div className={styles.contenidoResumen}>
              {proximoTurno ? (
                <>
                  <p className={styles.etiquetaResumen}>Próximo turno:</p>
                  <p className={styles.valorResumen}>
                    {proximoTurno.Disponibilidad?.Profesional?.Especialidad?.nombre}
                  </p>
                  <p className={styles.valorResumenChico}>
                    {proximoTurno.Disponibilidad?.fecha} • {proximoTurno.Disponibilidad?.hora}
                  </p>
                </>
              ) : (
                <p className={styles.sinDatos}>No tenés turnos próximos.</p>
              )}
            </div>

            <div className={styles.separadorResumen}></div>

            <Link to="/turnos" className={styles.linkResumen}>
              Ver todos los turnos
            </Link>
          </div>

          <div className={styles.tarjetaResumen}>
            <h2 className={styles.tituloResumen}>Mis recetas</h2>

            <div className={styles.contenidoResumen}>
              {ultimaRecetaAprobada ? (
                <>
                  <p className={styles.etiquetaResumen}>Última receta aprobada:</p>
                  <p className={styles.valorResumen}>
                    {ultimaRecetaAprobada.medicamento?.nombre}
                  </p>
                  <p className={styles.estadoAprobada}>Aprobada</p>
                  <p className={styles.valorResumenChico}>
                    {new Date(ultimaRecetaAprobada.fechaSolicitud).toLocaleDateString("es-AR")}
                  </p>
                </>
              ) : (
                <p className={styles.sinDatos}>No tenés recetas aprobadas.</p>
              )}
            </div>

            <div className={styles.separadorResumen}></div>

            <Link to="/recetas" className={styles.linkResumen}>
              Ver todas las recetas
            </Link>
          </div>
        </div>

        <div className={styles.gridObraSocial}>
          <div className={styles.tarjetaInfo}>
            <h2 className={styles.tituloInfo}>Información importante</h2>
            <p className={styles.textoInfo}>
              Recordá que los turnos pueden cancelarse hasta 24 horas antes
              sin cargo. Mantené tus datos de contacto actualizados para
              recibir novedades del Centro LAV.
            </p>
          </div>

          <div className={styles.tarjetaInfo}>
            <h2 className={styles.tituloInfo}>Beneficios</h2>
            <p className={styles.textoInfo}>
              Como afiliado, accedés a descuentos en farmacias adheridas y
              consultas bonificadas en especialidades seleccionadas.
            </p>
          </div>
        </div>
      </main>

      <PiePagina />
    </>
  );
}

export default Inicio;
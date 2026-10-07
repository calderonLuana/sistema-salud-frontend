import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { obtenerTurnosProximos } from "../../services/turnoService";
import { obtenerRecetasAfiliado } from "../../services/recetaService";
import { obtenerAfiliado } from "../../services/afiliadoService";

import EncabezadoInicio from "../../components/EncabezadoInicio/EncabezadoInicio";
import MenuLateral from "../../components/MenuLateral/MenuLateral";
import ModalConfirmacion from "../../components/ModalConfirmacion/ModalConfirmacion";
import PiePagina from "../../components/PiePagina/PiePagina";
import styles from "./Inicio.module.css";

function IconoCampana() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9a6 6 0 0 1 12 0v4l1.5 3h-15L6 13V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconoCartilla() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 15c0.6-1.5 1.8-2 3-2s2.4 0.5 3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 8h2M15 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconoTurnos() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="6.5" y="12" width="3" height="3" fill="currentColor" />
      <rect x="10.5" y="12" width="3" height="3" fill="currentColor" />
    </svg>
  );
}

function IconoRecetas() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 20l2-2 2 2 2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoFlecha() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Inicio() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [afiliado, setAfiliado] = useState(null);
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
        const turnos = await obtenerTurnosProximos(usuario.id);
        const recetas = await obtenerRecetasAfiliado(usuario.id);

        setAfiliado(datosAfiliado);

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
        <p className={styles.saludoChico}>Hola,</p>
        <h1 className={styles.saludo}>
          {usuario.nombre} {afiliado?.apellido}
        </h1>
        <p className={styles.subtitulo}>Bienvenido a tu espacio de salud.</p>

        <div className={styles.gridDashboard}>

          <div className={styles.tarjeta}>
            <div className={styles.iconoTarjeta}>
              <IconoCampana />
            </div>

            <h2 className={styles.tituloTarjeta}>Notificaciones</h2>

            <div className={styles.contenidoTarjeta}>
              <p className={styles.sinDatos}>No hay notificaciones por el momento.</p>
            </div>

            <div className={styles.separadorTarjeta}></div>

            <span className={styles.linkInactivo}>
              Ver todas
              <IconoFlecha />
            </span>
          </div>

          <div className={styles.tarjeta}>
            <div className={styles.iconoTarjeta}>
              <IconoCartilla />
            </div>

            <h2 className={styles.tituloTarjeta}>Cartilla médica</h2>

            <div className={styles.contenidoTarjeta}>
              <p className={styles.sinDatos}>Sin médico de cabecera asignado.</p>
            </div>

            <div className={styles.separadorTarjeta}></div>

            <span className={styles.linkInactivo}>
              Ver cartilla completa
              <IconoFlecha />
            </span>
          </div>

          <div className={styles.tarjeta}>
            <div className={styles.iconoTarjeta}>
              <IconoTurnos />
            </div>

            <h2 className={styles.tituloTarjeta}>Turnos</h2>

            <div className={styles.contenidoTarjeta}>
              {proximoTurno ? (
                <>
                  <p className={styles.etiquetaChica}>Próximo turno:</p>
                  <p className={styles.valorTarjeta}>
                    {proximoTurno.Disponibilidad?.Profesional?.Especialidad?.nombre}
                  </p>
                  <p className={styles.valorChico}>
                    {proximoTurno.Disponibilidad?.fecha} • {proximoTurno.Disponibilidad?.hora}
                  </p>
                </>
              ) : (
                <p className={styles.sinDatos}>No tenés turnos próximos.</p>
              )}
            </div>

            <div className={styles.separadorTarjeta}></div>

            <Link to="/turnos" className={styles.linkActivo}>
              Ver todos los turnos
              <IconoFlecha />
            </Link>
          </div>

          <div className={styles.tarjeta}>
            <div className={styles.iconoTarjeta}>
              <IconoRecetas />
            </div>

            <h2 className={styles.tituloTarjeta}>Recetas</h2>

            <div className={styles.contenidoTarjeta}>
              {ultimaRecetaAprobada ? (
                <>
                  <p className={styles.etiquetaChica}>Última receta aprobada:</p>
                  <p className={styles.valorTarjeta}>
                    {ultimaRecetaAprobada.medicamento?.nombre}
                  </p>
                  <p className={styles.valorChico}>
                    {new Date(ultimaRecetaAprobada.fechaSolicitud).toLocaleDateString("es-AR")}
                  </p>
                </>
              ) : (
                <p className={styles.sinDatos}>No tenés recetas aprobadas.</p>
              )}
            </div>

            <div className={styles.separadorTarjeta}></div>

            <Link to="/recetas" className={styles.linkActivo}>
              Ver todas las recetas
              <IconoFlecha />
            </Link>
          </div>

        </div>
      </main>

      <PiePagina />
    </>
  );
}

export default Inicio;
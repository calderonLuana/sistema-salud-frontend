import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { obtenerAfiliado } from "../../services/afiliadoService";

import EncabezadoInicio from "../../components/EncabezadoInicio/EncabezadoInicio";
import MenuLateral from "../../components/MenuLateral/MenuLateral";
import ModalConfirmacion from "../../components/ModalConfirmacion/ModalConfirmacion";
import PiePagina from "../../components/PiePagina/PiePagina";
import styles from "./LayoutPrincipal.module.css";

// Título del header según la sección. Sin título se muestra el logo LAV (Inicio).
// Para sumar secciones (Recetas, Cartilla, Notificaciones) se agrega una línea acá.
const TITULOS = [
  { prefijo: "/turnos", titulo: "Turnos" },
];

function obtenerTitulo(pathname) {
  const seccion = TITULOS.find((s) => pathname.startsWith(s.prefijo));

  return seccion ? seccion.titulo : "";
}

function LayoutPrincipal() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [afiliado, setAfiliado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [confirmarSalirAbierto, setConfirmarSalirAbierto] = useState(false);

  useEffect(() => {
    async function cargarAfiliado() {
      try {
        const datos = await obtenerAfiliado(usuario.id);

        setAfiliado(datos);
      } catch (error) {
        // Si falla, la app sigue funcionando: el menú muestra menos datos.
        console.error(error);
      }
    }

    cargarAfiliado();
  }, [usuario.id]);

  function pedirConfirmacionSalir() {
    setMenuAbierto(false);
    setConfirmarSalirAbierto(true);
  }

  function confirmarSalir() {
    logout();
    navigate("/login");
  }

  return (
    <div className={styles.contenedor}>
      <EncabezadoInicio
        titulo={obtenerTitulo(location.pathname)}
        onAbrirMenu={() => setMenuAbierto(true)}
      />

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

      <div className={styles.contenido}>
        <Outlet context={{ afiliado }} />
      </div>

      <PiePagina />
    </div>
  );
}

export default LayoutPrincipal;
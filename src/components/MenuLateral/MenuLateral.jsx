import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./MenuLateral.module.css";

function MenuLateral({ abierto, onCerrar, usuario, afiliado, onSalir }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function manejarEscape(evento) {
      if (evento.key === "Escape") {
        onCerrar();
      }
    }

    if (abierto) {
      document.addEventListener("keydown", manejarEscape);
    }

    return () => document.removeEventListener("keydown", manejarEscape);
  }, [abierto, onCerrar]);

  function irA(ruta) {
    navigate(ruta);
    onCerrar();
  }

  const opciones = [
    {
      ruta: "/inicio",
      etiqueta: "Inicio",
      icono: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      ruta: "/turnos",
      etiqueta: "Turnos",
      icono: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 9h18M8 3v4M16 3v4M8 13h2M8 17h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      ruta: "/recetas",
      etiqueta: "Recetas",
      icono: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {abierto && (
        <div className={styles.overlay} onClick={onCerrar} aria-hidden="true" />
      )}

      <aside
        className={`${styles.drawer} ${abierto ? styles.drawerAbierto : ""}`}
        aria-hidden={!abierto}
      >
        <div className={styles.tarjetaUsuario}>
          <button
            type="button"
            className={styles.botonCerrar}
            onClick={onCerrar}
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className={styles.avatar}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <p className={styles.nombreUsuario}>
            {usuario?.nombre} {afiliado?.apellido}
          </p>

          {afiliado?.dni && (
            <p className={styles.dniUsuario}>DNI: {afiliado.dni}</p>
          )}

          {afiliado?.estado === "ACTIVO" && (
            <p className={styles.estadoUsuario}>
              Afiliación activa
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          )}
        </div>

        <nav className={styles.navegacion}>
          {opciones.map((opcion) => (
            <button
              key={opcion.ruta}
              type="button"
              className={`${styles.itemMenu} ${
                location.pathname === opcion.ruta ? styles.itemActivo : ""
              }`}
              onClick={() => irA(opcion.ruta)}
            >
              <span className={styles.iconoItem}>{opcion.icono}</span>
              {opcion.etiqueta}
            </button>
          ))}
        </nav>

        <div className={styles.separador}></div>

        <button type="button" className={styles.botonSalir} onClick={onSalir}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Salir
        </button>
      </aside>
    </>
  );
}

export default MenuLateral;
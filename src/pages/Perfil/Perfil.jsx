import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import {
  obtenerAfiliado,
  obtenerGrupoFamiliar,
} from "../../services/afiliadoService";

import EncabezadoPagina from "../../components/EncabezadoPagina/EncabezadoPagina";
import PiePagina from "../../components/PiePagina/PiePagina";
import styles from "./Perfil.module.css";

const ETIQUETA_TIPO = {
  TITULAR: "Titular",
  CONYUGE: "Cónyuge",
  HIJO: "Hijo/a",
};

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

function IconoPersona() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Perfil() {
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

        const miembros = datosGrupo.Afiliados || datosGrupo.Afiliado || [];

        setGrupoFamiliar(miembros.filter((m) => m.id !== usuario.id));
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los datos del perfil.");
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [usuario.id]);

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const edad = calcularEdad(afiliado.fechaNacimiento);
  const tipoLegible = ETIQUETA_TIPO[afiliado.tipoAfiliado] || afiliado.tipoAfiliado;

  return (
    <>
      <EncabezadoPagina titulo="Mi perfil" />

      <main className={styles.contenedor}>

        <div className={styles.tarjetaPerfil}>
          <div className={styles.avatar}>
            <IconoPersona />
          </div>

          <div className={styles.infoPerfil}>
            <p className={styles.nombrePerfil}>
              {afiliado.nombre} {afiliado.apellido}
            </p>
            <p className={styles.datoPerfil}>
              DNI {afiliado.dni} · {edad} años · {tipoLegible}
            </p>
          </div>

          {afiliado.estado === "ACTIVO" && (
            <span className={styles.badgeActivo}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Afiliación activa
            </span>
          )}
        </div>

        <div className={styles.gridDosColumnas}>

          <div className={styles.tarjetaGrupo}>
            <h2 className={styles.tituloTarjeta}>
              <span className={styles.iconoTitulo}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3 20c0.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="17" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M15 20c0.5-2.3 1.9-3.6 4-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              Grupo familiar ({grupoFamiliar.length})
            </h2>

            {grupoFamiliar.length === 0 ? (
              <p className={styles.sinDatos}>No hay otros integrantes en el grupo familiar.</p>
            ) : (
              <div className={styles.listaGrupo}>
                {grupoFamiliar.map((integrante) => (
                  <div key={integrante.id} className={styles.filaIntegrante}>
                    <div className={styles.avatarChico}>
                      <IconoPersona />
                    </div>

                    <div className={styles.infoIntegrante}>
                      <p className={styles.nombreIntegrante}>
                        {integrante.nombre} {integrante.apellido}
                      </p>
                      <p className={styles.datoIntegrante}>
                        DNI: {integrante.dni} · {ETIQUETA_TIPO[integrante.tipoAfiliado] || integrante.tipoAfiliado} · {calcularEdad(integrante.fechaNacimiento)} años
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.tarjetaObraSocial}>
            <h2 className={styles.tituloTarjeta}>
              <span className={styles.iconoTitulo}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10l9-6 9 6M5 10v9h14v-9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>
              Información de la obra social
            </h2>

            <p className={styles.nombreObraSocial}>Centro LAV</p>

            <div className={styles.listaContacto}>
              <p className={styles.itemContacto}>📞 0800 333 1234</p>
              <p className={styles.itemContacto}>✉️ info@centrolav.com.ar</p>
              <p className={styles.itemContacto}>📍 Av. Corrientes 123, CABA</p>
              <p className={styles.itemContacto}>🕐 Lunes a Viernes de 8 a 18 hs</p>
            </div>
          </div>

        </div>

        <div className={styles.banner}>
          <svg className={styles.bannerIcono} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21s-7-4.5-9.5-9C.5 8.5 2 4.5 6 4.5c2 0 3.5 1.2 4.5 2.6C11.5 5.7 13 4.5 15 4.5c4 0 5.5 4 3.5 7.5C19.5 16.5 12 21 12 21Z" fill="currentColor" opacity="0.9" />
            <path d="M9 12h2l1-2 2 4 1-2h2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className={styles.bannerTitulo}>Tu salud es nuestra prioridad</p>
            <p className={styles.bannerTexto}>
              Estamos para cuidarte. Accedé rápidamente a tus turnos, recetas
              y medicamentos.
            </p>
          </div>
        </div>

      </main>

      <PiePagina />
    </>
  );
}

export default Perfil;
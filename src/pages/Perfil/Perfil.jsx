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
  HIJO: "Hijo",
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

function IconoGrupo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20c0.8-3 3-4.5 6-4.5s5.2 1.5 6 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15 20c0.5-2.3 1.9-3.6 4-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconoObraSocial() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10l9-6 9 6M5 10v9h14v-9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
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
      <EncabezadoPagina mostrarLogo mostrarIconoPerfil={false} />

      <main className={styles.contenedor}>
        <h1 className={styles.tituloPagina}>Mi perfil</h1>

        <div className={styles.tarjetaPerfil}>
          <div className={styles.avatar}>
            <IconoPersona />
          </div>

          <div className={styles.infoPerfil}>
            <p className={styles.nombrePerfil}>
              {afiliado.nombre} {afiliado.apellido}
              <span className={styles.tipoInline}> ({tipoLegible})</span>
            </p>
            <p className={styles.datoPerfil}>DNI: {afiliado.dni}</p>
            <p className={styles.datoPerfil}>Edad: {edad}</p>

            {afiliado.estado === "ACTIVO" && (
              <p className={styles.estadoActivo}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Afiliación activa
              </p>
            )}
          </div>
        </div>

        <div className={styles.tarjetaGrupo}>
          <div className={styles.encabezadoTarjeta}>
            <span className={styles.iconoTarjeta}>
              <IconoGrupo />
            </span>
            <div>
              <h2 className={styles.tituloTarjeta}>Grupo familiar</h2>
              <p className={styles.subtituloTarjeta}>
                Cantidad de integrantes: {grupoFamiliar.length}
              </p>
            </div>
          </div>

          {grupoFamiliar.length === 0 ? (
            <p className={styles.sinDatos}>No hay otros integrantes en el grupo familiar.</p>
          ) : (
            <div className={styles.listaGrupo}>
              {grupoFamiliar.map((integrante) => (
                <div key={integrante.id} className={styles.filaIntegrante}>
                  <p className={styles.nombreIntegrante}>
                    {integrante.nombre} {integrante.apellido}
                    <span className={styles.tipoInline}>
                      {" "}({ETIQUETA_TIPO[integrante.tipoAfiliado] || integrante.tipoAfiliado})
                    </span>
                  </p>
                  <p className={styles.datoIntegrante}>DNI: {integrante.dni}</p>
                  <p className={styles.datoIntegrante}>
                    Edad: {calcularEdad(integrante.fechaNacimiento)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.tarjetaObraSocial}>
          <div className={styles.encabezadoTarjeta}>
            <span className={styles.iconoTarjeta}>
              <IconoObraSocial />
            </span>
            <h2 className={styles.tituloTarjeta}>Información de la obra social</h2>
          </div>

          <div className={styles.listaContacto}>
            <p className={styles.itemContacto}>Número de teléfono: 0800 333 1234</p>
            <p className={styles.itemContacto}>Mail: centro.lav@gmail.com</p>
            <p className={styles.itemContacto}>Dirección: Av. Corrientes 123, CABA</p>
            <p className={styles.itemContacto}>Horarios de atención: Lunes a Viernes de 8 a 18 hs</p>
          </div>
        </div>
      </main>

      <PiePagina />
    </>
  );
}

export default Perfil;
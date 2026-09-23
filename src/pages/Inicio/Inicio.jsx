import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { obtenerTurnosProximos } from "../../services/turnoService";
import ProximoTurno from "../../components/ProximoTurno/ProximoTurno";

import {
  obtenerAfiliado,
  obtenerGrupoFamiliar
} from "../../services/afiliadoService";

import InformacionAfiliado from "../../components/InformacionAfiliado/InformacionAfiliado";
import GrupoFamiliar from "../../components/GrupoFamiliar/GrupoFamiliar";
import EncabezadoInicio from "../../components/EncabezadoInicio/EncabezadoInicio";
import MenuLateral from "../../components/MenuLateral/MenuLateral";
import ModalConfirmacion from "../../components/ModalConfirmacion/ModalConfirmacion";
import PiePagina from "../../components/PiePagina/PiePagina";

function Inicio() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [afiliado, setAfiliado] = useState(null);
  const [grupoFamiliar, setGrupoFamiliar] = useState([]);
  const [proximoTurno, setProximoTurno] = useState(null);
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

        setAfiliado(datosAfiliado);
        setGrupoFamiliar(datosGrupo.Afiliados);

        if (turnos.length > 0) {
          setProximoTurno(turnos[0]);
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
        mensaje="¿Deseás finalizar la sesión?"
        textoConfirmar="Cerrar sesión"
        textoCancelar="Cancelar"
        onConfirmar={confirmarSalir}
        onCancelar={() => setConfirmarSalirAbierto(false)}
      />

      <main>
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

        <ProximoTurno
          turno={proximoTurno}
        />
      </main>

      <PiePagina />
    </>
  );
}

export default Inicio;
import { formatearFecha } from "../../utils/formatearFecha";
import { formatearHora } from "../../utils/formatearHora";
import { cancelarTurno } from "../../services/turnoService";

function TarjetaTurno({ turno, onTurnoCancelado }) {
  const { Disponibilidad, estado } = turno;

  const {
    Profesional,
    fecha,
    hora,
    lugar,
  } = Disponibilidad;

  const {
    Especialidad,
    nombre,
    apellido,
  } = Profesional;

  async function handleCancelar() {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés cancelar este turno?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await cancelarTurno(turno.id);

      onTurnoCancelado();
    } catch (error) {
      console.error(error);

      const mensaje =
        error.response?.data?.error ||
        "No se pudo cancelar el turno.";

      alert(mensaje);
    }
  }

  return (
    <div>
      <h3>{Especialidad.nombre}</h3>

      <p>
        <strong>Profesional:</strong> Dr. {nombre} {apellido}
      </p>

      <p>
        <strong>Fecha:</strong> {formatearFecha(fecha)}
      </p>

      <p>
        <strong>Hora:</strong> {formatearHora(hora)}
      </p>

      <p>
        <strong>Lugar:</strong> {lugar}
      </p>

      <p>
        <strong>Estado:</strong> {estado}
      </p>

      {estado === "RESERVADO" && (
        <button onClick={handleCancelar}>
          Cancelar turno
        </button>
      )}

      <hr />
    </div>
  );
}

export default TarjetaTurno;
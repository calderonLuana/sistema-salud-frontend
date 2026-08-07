import { formatearFecha } from "../../utils/formatearFecha";
import { formatearHora } from "../../utils/formatearHora";

function TarjetaTurno({ turno }) {
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

      <hr />
    </div>
  );
}

export default TarjetaTurno;
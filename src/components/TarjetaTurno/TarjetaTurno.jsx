function TarjetaTurno({ turno }) {

  return (
    <div>

      <p>
        <strong>Fecha:</strong>{" "}
        {turno.Disponibilidad.fecha}
      </p>

      <p>
        <strong>Hora:</strong>{" "}
        {turno.Disponibilidad.hora}
      </p>

      <p>
        <strong>Lugar:</strong>{" "}
        {turno.Disponibilidad.lugar}
      </p>

      <p>
        <strong>Estado:</strong>{" "}
        {turno.estado}
      </p>

      <hr />

    </div>
  );
}

export default TarjetaTurno;
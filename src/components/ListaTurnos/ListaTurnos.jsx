import TarjetaTurno from "../TarjetaTurno/TarjetaTurno";

function ListaTurnos({ titulo, turnos }) {
  return (
    <section>
      <h2>{titulo}</h2>

      {turnos.length === 0 ? (
        <p>No hay turnos.</p>
      ) : (
        turnos.map((turno) => (
          <TarjetaTurno
            key={turno.id}
            turno={turno}
          />
        ))
      )}
    </section>
  );
}

export default ListaTurnos;
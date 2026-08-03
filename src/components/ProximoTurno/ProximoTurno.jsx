function ProximoTurno({ turno }) {
  if (!turno) {
    return (
      <section>
        <h2>Próximo turno</h2>

        <p>No tenés turnos próximos.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Próximo turno</h2>

      <p>ID del turno: {turno.id}</p>

      <p>Estado: {turno.estado}</p>
    </section>
  );
}

export default ProximoTurno;
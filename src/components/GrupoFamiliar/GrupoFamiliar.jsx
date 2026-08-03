function GrupoFamiliar({ integrantes }) {
  return (
    <section>
      <h2>Grupo familiar</h2>

      {integrantes.map((integrante) => (
        <div key={integrante.id}>
          <p>
            {integrante.nombre} {integrante.apellido}
          </p>

          <p>
            DNI: {integrante.dni}
          </p>

          <p>
            Tipo: {integrante.tipoAfiliado}
          </p>
        </div>
      ))}
    </section>
  );
}

export default GrupoFamiliar;
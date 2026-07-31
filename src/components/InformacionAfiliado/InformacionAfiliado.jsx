function InformacionAfiliado({ afiliado }) {
  return (
    <section>
      <h2>Mi información</h2>

      <p>
        Nombre: {afiliado.nombre}
      </p>

      <p>
        Apellido: {afiliado.apellido}
      </p>

      <p>
        DNI: {afiliado.dni}
      </p>

      <p>
        Tipo de afiliado: {afiliado.tipoAfiliado}
      </p>

      <p>
        Estado: {afiliado.estado}
      </p>
    </section>
  );
}

export default InformacionAfiliado;
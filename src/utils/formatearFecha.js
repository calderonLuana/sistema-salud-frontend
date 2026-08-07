export function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${anio}`;
}
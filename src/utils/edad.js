// Edad en años cumplidos a partir de una fecha de nacimiento.
// Se toma solo la parte "AAAA-MM-DD" para evitar corrimientos por zona horaria
// (la API devuelve la fecha como "2012-05-01T00:00:00.000Z").
export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;

  const [anio, mes, dia] = String(fechaNacimiento)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!anio || !mes || !dia) return null;

  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;

  const todaviaNoCumplio =
    hoy.getMonth() + 1 < mes ||
    (hoy.getMonth() + 1 === mes && hoy.getDate() < dia);

  if (todaviaNoCumplio) {
    edad--;
  }

  return edad;
}
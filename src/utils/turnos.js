import { calcularEdad } from "./edad";

export const VINCULOS = {
  TITULAR: "Titular",
  CONYUGE: "Cónyuge",
  HIJO: "Hijo/a",
};

// Etiquetas visibles de cada estado.
// RESERVADO solo aparece en el filtro: en la tarjeta no se muestra, porque estar
// en "Próximos turnos" ya implica que está reservado.
//
// NO_ASISTIO: FUNCIONALIDAD DE PRUEBA - NO APTA PARA PRODUCCIÓN.
// Esta app es solo para afiliados y no permite registrar inasistencias; en un
// sistema real lo registraría un profesional o la administración desde otra
// aplicación.
export const ETIQUETAS_ESTADO = {
  RESERVADO: "Reservado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
  NO_ASISTIO: "No asistió",
};

export function nombreCompleto(persona) {
  return `${persona?.nombre || ""} ${persona?.apellido || ""}`.trim();
}

// Fecha y hora del turno como Date (hora local)
export function fechaHoraDeTurno(turno) {
  const { fecha, hora } = turno.Disponibilidad;

  return new Date(`${fecha}T${hora}`);
}

// Estado que se muestra en "Turnos anteriores".
// COMPLETADO es un supuesto: un turno reservado cuya fecha ya pasó y que no fue
// marcado como NO_ASISTIO se considera completado.
export function estadoDeTurnoAnterior(turno) {
  if (turno.estado === "CANCELADO") return "CANCELADO";
  if (turno.estado === "NO_ASISTIO") return "NO_ASISTIO";

  return "COMPLETADO";
}

// Texto de la franja superior de la tarjeta: "Mi turno", "Hijo/a - 12 años", etc.
export function etiquetaVinculo(paciente, usuarioId) {
  if (paciente.id === usuarioId) {
    return "Mi turno";
  }

  const vinculo = VINCULOS[paciente.tipoAfiliado] || "Familiar";
  const edad = calcularEdad(paciente.fechaNacimiento);

  if (edad === null) {
    return vinculo;
  }

  return `${vinculo} - ${edad} ${edad === 1 ? "año" : "años"}`;
}

// Indica si el turno cae dentro de los últimos N meses
export function dentroDelPeriodo(turno, meses) {
  const limite = new Date();
  limite.setMonth(limite.getMonth() - meses);

  return fechaHoraDeTurno(turno) >= limite;
}
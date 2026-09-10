import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { obtenerRecetaPorId, renovarReceta } from "../../services/recetaService";

function RenovarReceta() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [receta, setReceta] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarReceta();
  }, [id]);

  async function cargarReceta() {
    try {
      setError("");

      const datos = await obtenerRecetaPorId(id);

      setReceta(datos);
      setCantidad(String(datos.cantidad));
      setObservaciones(datos.observaciones || "");
    } catch (error) {
      console.error(error);

      setError("No se pudo cargar la receta.");
    } finally {
      setLoading(false);
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    try {
      setEnviando(true);
      setError("");

      await renovarReceta(id, {
        cantidad: Number(cantidad),
        observaciones: observaciones || null,
      });

      navigate("/recetas");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error || "No se pudo renovar la receta."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!receta) {
    return <p>{error || "Receta no encontrada."}</p>;
  }

  return (
    <main>
      <h1>Renovar receta</h1>

      <div>
        <p>Receta anterior: {receta.medicamento?.nombre}</p>
        <p>Presentación: {receta.presentacion}</p>
        <p>Cantidad de comprimidos: {receta.cantidadComprimidos}</p>
      </div>

      {error && <p>{error}</p>}

      <form onSubmit={manejarEnvio}>
        <label>
          Cantidad
          <input
            type="number"
            min="1"
            max="2"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </label>

        <label>
          Observaciones (opcional)
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            maxLength={200}
          />
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : "Confirmar renovación"}
        </button>
      </form>
    </main>
  );
}

export default RenovarReceta;
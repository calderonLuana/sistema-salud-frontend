import TarjetaReceta from "../TarjetaReceta/TarjetaReceta";
import styles from "./ListaRecetas.module.css";

function ListaRecetas({ recetas }) {
  if (recetas.length === 0) {
    return <p className={styles.vacio}>No hay recetas.</p>;
  }

  return (
    <div className={styles.grupo}>
      {recetas.map((receta) => (
        <TarjetaReceta
          key={receta.id}
          receta={receta}
          nombrePaciente={receta.nombrePacienteMostrar}
        />
      ))}
    </div>
  );
}

export default ListaRecetas;
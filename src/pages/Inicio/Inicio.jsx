import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Inicio() {
  const { usuario, token } = useContext(AuthContext);

  return (
    <>
      <h1>Inicio</h1>

      <p>Usuario: {usuario ? usuario.nombre : "No hay usuario"}</p>

      <p>Token: {token ? token : "No hay token"}</p>
    </>
  );
}

export default Inicio;
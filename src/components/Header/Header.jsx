import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Header() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate("/login");
  }

  return (
    <header>
      <h1>Sistema de Salud</h1>

      <div>
        <span>
          {usuario ? usuario.nombre : "Usuario"}
        </span>

        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
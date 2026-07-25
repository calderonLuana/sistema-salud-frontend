import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../../services/afiliadoService";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const {
    register,
    handleSubmit,
  } = useForm();

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState("");

  async function onSubmit(data) {
    setErrorLogin("");

    try {
      const respuesta = await loginService(data);

      login(
        respuesta.afiliado,
        respuesta.token
      );

      navigate("/inicio");
    } catch (error) {
      if (error.response) {
        setErrorLogin(error.response.data.error);
      } else {
        setErrorLogin("Ocurrió un error inesperado.");
      }
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>DNI</label>

          <input
            type="text"
            {...register("dni")}
          />
        </div>

        <div>
          <label>Contraseña</label>

          <input
            type="password"
            {...register("password")}
          />
        </div>

        <button type="submit">
          Ingresar
        </button>

        {errorLogin && (
          <p>{errorLogin}</p>
        )}
      </form>
    </div>
  );
}

export default Login;
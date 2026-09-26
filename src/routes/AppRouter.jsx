import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import Recuperar from "../pages/Recuperar/Recuperar";
import Inicio from "../pages/Inicio/Inicio";
import Perfil from "../pages/Perfil/Perfil";
import Turnos from "../pages/Turnos/Turnos";
import SolicitarTurno from "../pages/SolicitarTurno/SolicitarTurno";
import EditarTurno from "../pages/EditarTurno/EditarTurno";
import Recetas from "../pages/Recetas/Recetas";
import SolicitarReceta from "../pages/SolicitarReceta/SolicitarReceta";
import RenovarReceta from "../pages/RenovarReceta/RenovarReceta";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />

        {/* Rutas privadas */}
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <Inicio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turnos"
          element={
            <ProtectedRoute>
              <Turnos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turnos/solicitar"
          element={
            <ProtectedRoute>
              <SolicitarTurno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turnos/:id/editar"
          element={
            <ProtectedRoute>
              <EditarTurno />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recetas"
          element={
            <ProtectedRoute>
              <Recetas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recetas/solicitar"
          element={
            <ProtectedRoute>
              <SolicitarReceta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recetas/:id/renovar"
          element={
            <ProtectedRoute>
              <RenovarReceta />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
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
import PublicRoute from "./PublicRoute";
import LayoutPrincipal from "../layouts/LayoutPrincipal/LayoutPrincipal";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (si ya hay sesión, redirigen a /inicio) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/registro"
          element={
            <PublicRoute>
              <Registro />
            </PublicRoute>
          }
        />

        <Route
          path="/recuperar"
          element={
            <PublicRoute>
              <Recuperar />
            </PublicRoute>
          }
        />

        {/* Rutas privadas con layout compartido (header, menú lateral y footer) */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutPrincipal />
            </ProtectedRoute>
          }
        >
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/turnos" element={<Turnos />} />
        </Route>

        {/* Rutas privadas que todavía tienen su propio encabezado */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
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
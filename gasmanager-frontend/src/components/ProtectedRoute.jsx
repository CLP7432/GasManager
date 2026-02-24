import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({
                                           children,
                                           allowedRoles = [],
                                           requireAnyRole = false
                                       }) {
    const location = useLocation();
    const { isAuthenticated, auth, hasAnyRole } = useAuth();

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si se especificaron roles y el usuario no tiene ninguno
    if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const PrivateRoute = () => {
  const { session } = useAuth();
  return session ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;


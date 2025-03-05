import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, isRouteNeededAuth = true }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isRouteNeededAuth === true && isAuthenticated === false) {
      navigate("/login");
    } else if (isRouteNeededAuth === false && isAuthenticated === true) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [navigate, isRouteNeededAuth, isAuthenticated]);

  return loading ? "Loading..." : <>{children}</>;
};

export default ProtectedRoute;

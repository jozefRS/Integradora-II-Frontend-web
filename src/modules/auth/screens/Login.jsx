import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../../../assets/image.png";
import imagenLogin from "../../../assets/imagenlogin.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.clear(); // Borra todo al cerrar pestaña o actualizar
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" });
  };

  const handlePasswordChange = (e) => {
    setContrasena(e.target.value);
    setErrors({ ...errors, password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !contrasena) {
      setErrors({
        email: email ? "" : "El correo electrónico es requerido",
        password: contrasena ? "" : "La contraseña es requerida",
      });
      return;
    }

    try {
      // Usamos POST para enviar las credenciales
      const response = await axios.post("http://localhost:8080/auth/login", {
        email: email,
        contrasena: contrasena,
      });

      const { token, rol, idUsuario } = response.data;
      sessionStorage.setItem("userEmail", email); // Guarda el correo en sessionStorage
      sessionStorage.setItem("userName", email); // Guarda el nombre de usuario en sessionStorage
      // Guarda token y rol en sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("idUsuario", idUsuario); // Almacenamos el ID de usuario
      sessionStorage.setItem("rol", rol);

      console.log("Token recibido:", token); // Para depuración
      console.log("Rol recibido:", rol); // Para depuración 
    console.log("ID Trabajador recibido:", idUsuario); // Para depuración    

      // Redirige según el rol
      if (rol === "ADMIN") {
        navigate("/dashboard");
      } else if (rol === "TRABAJADOR") {
        navigate("/catalogo");
      } else {
        setErrorMessage("Rol no autorizado");
      }

    } catch (error) {
      if (error.response) {
        console.error("Error de autenticación:", error.response.data);
        setErrorMessage("Credenciales incorrectas");
      } else {
        console.error("Error de red:", error.message);
        setErrorMessage("Error de conexión con el servidor");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow">
        <div className="login-image-section">
          <img src={imagenLogin} alt="Login" className="login-background-image" />
        </div>
        <div className="login-form-section">
          <div className="form-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="divider"></div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form className="w-100" onSubmit={handleSubmit}>
              <div className="mb-3">
                <input 
                  type="email" 
                  className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Correo electrónico" 
                  value={email}
                  onChange={handleEmailChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  className={`form-control custom-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Contraseña" 
                  value={contrasena}
                  onChange={handlePasswordChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="divider mb-4"></div>
              <button type="submit" className="btn w-100 login-button">Iniciar</button>
            </form>

            <p className="mt-4 text-center forgot-password">
              ¿Olvidaste tu contraseña? <a href="#" className="text-recover">Recuperar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

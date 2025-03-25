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

  // UseEffect para borrar el token cuando el componente se desmonte o se cierre la pestaña
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("token"); // Borra el token al cerrar la pestaña o cambiar de página
    };

    window.addEventListener("beforeunload", handleUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleUnload); // Limpiar el listener al desmontar el componente
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
      // Realizar la solicitud GET con los parámetros en la URL
      const response = await axios.get(`http://localhost:8080/auth/login`, {
          params: {
              email: email,
              contrasena: contrasena
          },
      });

      // Almacenar el token en sessionStorage (se elimina automáticamente al cerrar la pestaña)
      sessionStorage.setItem("token", response.data);

      // Redirigir al usuario a la página principal
      navigate("/Products"); // Ajusta la URL de destino según tu aplicación

    } catch (error) {
      if (error.response) {
          // Si la respuesta del servidor es con error, como 401
          console.error("Error de autenticación:", error.response.data);
          setErrorMessage("Credenciales incorrectas");
      } else {
          console.error("Error de red o conexión:", error.message);
          setErrorMessage("Hubo un error en la conexión");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow">
        <div className="login-image-section">
          <img src={imagenLogin || "/placeholder.svg"} alt="Login" className="login-background-image" />
        </div>
        <div className="login-form-section">
          <div className="form-container">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="login-logo" />
            
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

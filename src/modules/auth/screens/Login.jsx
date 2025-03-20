import React, { useState } from "react";
import "./Login.css";
import logo from "../../../assets/image.png";
import imagenLogin from "../../../assets/imagenlogin.png";
import "../../../assets/bootstrap/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate();

  const validateUsername = (value) => {
    if (!value.trim()) {
      return "El nombre de usuario es requerido";
    }
    if (/\d/.test(value)) {
      return "El nombre de usuario no debe contener números";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "La contraseña es requerida";
    }
    if (value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "";
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setErrors({
      ...errors,
      username: validateUsername(value)
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors({
      ...errors,
      password: validatePassword(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    
    setErrors({
      username: usernameError,
      password: passwordError
    });

    // Solo navegar si no hay errores
    if (!usernameError && !passwordError) {
      navigate("/products");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow">
        {/* Sección de la imagen */}
        <div className="login-image-section">
          <img src={imagenLogin || "/placeholder.svg"} alt="Login" className="login-background-image" />
        </div>
        
        {/* Sección del formulario */}
        <div className="login-form-section">
          <div className="form-container">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="login-logo" />
            
            <div className="divider"></div>
            
            <form className="w-100" onSubmit={handleSubmit}>
              <div className="mb-3">
                <input 
                  type="text" 
                  className={`form-control custom-input ${errors.username ? 'is-invalid' : ''}`}
                  placeholder="Nombre de usuario" 
                  value={username}
                  onChange={handleUsernameChange}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  className={`form-control custom-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Contraseña" 
                  value={password}
                  onChange={handlePasswordChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
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
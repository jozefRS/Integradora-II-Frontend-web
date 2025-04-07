<<<<<<< HEAD
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
=======
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
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow">
<<<<<<< HEAD
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
=======
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
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
              </div>
              <div className="mb-4">
                <input 
                  type="password" 
                  className={`form-control custom-input ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Contraseña" 
<<<<<<< HEAD
                  value={contrasena}
                  onChange={handlePasswordChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="divider mb-4"></div>
              <button type="submit" className="btn w-100 login-button">Iniciar</button>
            </form>

=======
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
            
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
            <p className="mt-4 text-center forgot-password">
              ¿Olvidaste tu contraseña? <a href="#" className="text-recover">Recuperar</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51

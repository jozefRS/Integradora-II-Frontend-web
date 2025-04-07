import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import '../../../assets/bootstrap/bootstrap.min.css';
import './GestionUsuarios.css';
import Sidebar from '../../../kernel/components/Sidebar';
<<<<<<< HEAD
import axios from "axios";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/usuario', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        // Filtrar los usuarios para mostrar solo los que son "TRABAJADOR"
        const trabajadores = response.data.filter(usuario => usuario.rol === "TRABAJADOR");
        setUsuarios(trabajadores);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setUsuarios([]);
      }
    };
    fetchUsuarios();
  }, []);
=======

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Karol Jozef',
      email: 'karoljozef@gmail.com',
      rol: 'Administrador',
      activo: true
    },
    {
      id: 2,
      nombre: 'Uziel Jahred',
      email: 'uzieljahred@gmail.com',
      rol: 'Trabajador',
      activo: true
    },
    {
      id: 3,
      nombre: 'Derick Axel',
      email: 'derickaxel@gmail.com',
      rol: 'Trabajador',
      activo: false
    },
    {
      id: 4,
      nombre: '------',
      email: '------',
      rol: '------',
      activo: false
    }
  ]);
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    username: '',
<<<<<<< HEAD
    email: ''
=======
    email: '',
    password: '',
    confirmPassword: ''
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
  });

  const [errors, setErrors] = useState({
    nombreCompleto: '',
    username: '',
    email: '',
<<<<<<< HEAD
=======
    password: '',
    confirmPassword: ''
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
  });

  const [touched, setTouched] = useState({
    nombreCompleto: false,
    username: false,
    email: false,
<<<<<<< HEAD
=======
    password: false,
    confirmPassword: false
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
  });

  const [formValid, setFormValid] = useState(false);

<<<<<<< HEAD
=======
  // Validar el formulario completo cada vez que cambian los datos o errores
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
  useEffect(() => {
    const isFormValid = Object.values(errors).every(error => error === '') &&
                        Object.values(formData).every(value => value.trim() !== '');
    setFormValid(isFormValid);
  }, [formData, errors]);

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'nombreCompleto':
        if (!value.trim()) {
          errorMessage = 'El nombre completo es requerido';
        } else if (value.trim().length < 3) {
          errorMessage = 'El nombre debe tener al menos 3 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = 'El nombre solo debe contener letras';
        }
        break;
      
      case 'username':
        if (!value.trim()) {
          errorMessage = 'El nombre de usuario es requerido';
        } else if (value.trim().length < 4) {
          errorMessage = 'El nombre de usuario debe tener al menos 4 caracteres';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errorMessage = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          errorMessage = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = 'Ingrese un correo electrónico válido';
        }
        break;
<<<<<<< HEAD
=======
      
      case 'password':
        if (!value) {
          errorMessage = 'La contraseña es requerida';
        } else if (value.length < 8) {
          errorMessage = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])/.test(value)) {
          errorMessage = 'La contraseña debe contener al menos una letra minúscula';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          errorMessage = 'La contraseña debe contener al menos una letra mayúscula';
        } else if (!/(?=.*\d)/.test(value)) {
          errorMessage = 'La contraseña debe contener al menos un número';
        } else if (!/(?=.*[!@#$%^&*])/.test(value)) {
          errorMessage = 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)';
        }
        break;
      
      case 'confirmPassword':
        if (!value) {
          errorMessage = 'Confirme su contraseña';
        } else if (value !== formData.password) {
          errorMessage = 'Las contraseñas no coinciden';
        }
        break;
      
      default:
        break;
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    }

    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
<<<<<<< HEAD
=======
    // Validar el campo si ya fue tocado
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
<<<<<<< HEAD
=======
    // Marcar el campo como tocado
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    setTouched({
      ...touched,
      [name]: true
    });
    
<<<<<<< HEAD
=======
    // Validar el campo
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Marcar todos los campos como "touched" para activar la validación
=======
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    const allTouched = Object.keys(touched).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouched(allTouched);
<<<<<<< HEAD
  
    // Validar los campos antes de enviar
=======
    
    // Validar todos los campos
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      newErrors[name] = validateField(name, value);
    });
    setErrors(newErrors);
<<<<<<< HEAD
  
    const hasErrors = Object.values(newErrors).some(error => error !== '' );
  
    if (!hasErrors) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:8080/api/usuario/registrar-trabajador',
          formData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '', // Agregar autenticación si es necesario
            },
          }
        );
  
        // Actualizar la lista de usuarios después del registro
        setUsuarios([...usuarios, response.data]);
  
        // Cerrar el modal y limpiar el formulario
        setShowModal(false);
        setFormData({
          nombreCompleto: '',
          username: '',
          email: '',
        });
        setErrors({
          nombreCompleto: '',
          username: '',
          email: '',
        });
        setTouched({
          nombreCompleto: false,
          username: false,
          email: false,
        });
  
      } catch (error) {
        console.error('Error al registrar el usuario:', error);
      }
    }
  };

=======
    
    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (!hasErrors) {
      // Aquí iría la lógica para registrar el usuario
      console.log('Datos del formulario válidos:', formData);
      setShowModal(false);
      // Resetear el formulario
      setFormData({
        nombreCompleto: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({
        nombreCompleto: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setTouched({
        nombreCompleto: false,
        username: false,
        email: false,
        password: false,
        confirmPassword: false
      });
    }
  };

  // Cerrar modal y resetear formulario
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nombreCompleto: '',
      username: '',
      email: '',
<<<<<<< HEAD
=======
      password: '',
      confirmPassword: ''
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    });
    setErrors({
      nombreCompleto: '',
      username: '',
      email: '',
<<<<<<< HEAD
=======
      password: '',
      confirmPassword: ''
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    });
    setTouched({
      nombreCompleto: false,
      username: false,
      email: false,
<<<<<<< HEAD
=======
      password: false,
      confirmPassword: false
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    });
  };

  return (
    <div className="app-container d-flex w-100 min-vh-100">
<<<<<<< HEAD
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container p-4 ms-auto w-100">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión De Usuarios</h1>
=======
      <Sidebar 
        userName="Usuario" 
        userEmail="usuario@example.com" 
      />
      <div className="usuarios-container p-4 ms-auto w-100">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión de usuarios</h1>
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
          <div className="usuarios-divider"></div>
        </div>

        <div className="usuarios-actions d-flex justify-content-end mb-3">
<<<<<<< HEAD
          <button className="btn-registrar btn btn-primary" onClick={() => setShowModal(true)}>
=======
          <button 
            className="btn-registrar btn btn-primary"
            onClick={() => setShowModal(true)}
          >
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
            Registrar
          </button>
        </div>

        <div className="usuarios-table-container table-responsive">
          <table className="usuarios-table table table-hover shadow-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
<<<<<<< HEAD
                  <td>{usuario.nombreCompleto}</td>
=======
                  <td>{usuario.nombre}</td>
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <div className={`usuario-estado badge ${usuario.activo ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </div>
                  </td>
                  <td>
                    <button className="btn-editar btn btn-sm btn-light">
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <div className="modal-backdrop show"></div>
      )}
      <div className={`modal ${showModal ? 'show d-block' : ''}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-medium text-center w-100 registro-title">Registro de Usuario</h5>
<<<<<<< HEAD
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
=======
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseModal}
              ></button>
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${touched.nombreCompleto && (errors.nombreCompleto ? 'is-invalid' : 'is-valid')}`}
                    placeholder="Nombre Completo"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
<<<<<<< HEAD
=======
                    required
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                  />
                  {touched.nombreCompleto && errors.nombreCompleto && (
                    <div className="invalid-feedback">{errors.nombreCompleto}</div>
                  )}
                </div>
<<<<<<< HEAD

=======
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${touched.username && (errors.username ? 'is-invalid' : 'is-valid')}`}
<<<<<<< HEAD
                    placeholder="Nombre de usuario"
=======
                    placeholder="Username"
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
<<<<<<< HEAD
=======
                    required
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                  />
                  {touched.username && errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
<<<<<<< HEAD

=======
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control ${touched.email && (errors.email ? 'is-invalid' : 'is-valid')}`}
<<<<<<< HEAD
                    placeholder="Correo electrónico"
=======
                    placeholder="Email Address"
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
<<<<<<< HEAD
=======
                    required
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                  />
                  {touched.email && errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
<<<<<<< HEAD
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!formValid}
                >
                  Registrar
                </button>
=======
                <div className="mb-3">
                  <input
                    type="password"
                    className={`form-control ${touched.password && (errors.password ? 'is-invalid' : 'is-valid')}`}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.password && errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    className={`form-control ${touched.confirmPassword && (errors.confirmPassword ? 'is-invalid' : 'is-valid')}`}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn btn-registrar btn-primary px-4 py-2"
                    disabled={!formValid}
                  >
                    Registrar
                  </button>
                </div>
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default GestionUsuarios;
=======
export default GestionUsuarios;
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51

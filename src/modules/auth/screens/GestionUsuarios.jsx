"use client"

import { useState, useEffect } from "react"
import { Edit, Eye, RefreshCw } from "lucide-react"
import "../../../assets/bootstrap/bootstrap.min.css"
import "./GestionUsuarios.css"
import Sidebar from "../../../kernel/components/Sidebar"
import axios from "axios"
import Swal from "sweetalert2" // Importamos SweetAlert2

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  //1.- Estado de busqueda y paginacion
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const usuariosPorPagina = 10

  useEffect(() => {
    const fetchUsuarios = async () => {
      // Mostramos el loader mientras se cargan los usuarios
      Swal.fire({
        title: "Cargando usuarios",
        text: "Por favor espere...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const token = sessionStorage.getItem("token")
      try {
        const response = await axios.get("http://localhost:8080/api/usuario", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })
        // Filtrar los usuarios para mostrar solo los que son "TRABAJADOR"
        const trabajadores = response.data.filter((usuario) => usuario.rol === "TRABAJADOR")
        setUsuarios(trabajadores)

        // Cerramos el loader
        Swal.close()
      } catch (error) {
        console.error("Error al obtener los usuarios:", error)
        setUsuarios([])

        // Cerramos el loader
        Swal.close()
      }
    }
    fetchUsuarios()
  }, [])

  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    username: "",
    email: "",
  })

  const [errors, setErrors] = useState({
    nombreCompleto: "",
    username: "",
    email: "",
  })

  const [touched, setTouched] = useState({
    nombreCompleto: false,
    username: false,
    email: false,
  })

  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    const isFormValid =
      Object.values(errors).every((error) => error === "") &&
      Object.values(formData).every((value) => value.trim() !== "")
    setFormValid(isFormValid)
  }, [formData, errors])

  const validateField = (name, value) => {
    let errorMessage = ""

    switch (name) {
      case "nombreCompleto":
        if (!value.trim()) {
          errorMessage = "El nombre completo es requerido"
        } else if (value.trim().length < 3) {
          errorMessage = "El nombre debe tener al menos 3 caracteres"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El nombre solo debe contener letras"
        }
        break

      case "username":
        if (!value.trim()) {
          errorMessage = "El nombre de usuario es requerido"
        } else if (value.trim().length < 4) {
          errorMessage = "El nombre de usuario debe tener al menos 4 caracteres"
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errorMessage = "El nombre de usuario solo puede contener letras, números y guiones bajos"
        }
        break

      case "email":
        if (!value.trim()) {
          errorMessage = "El correo electrónico es requerido"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Ingrese un correo electrónico válido"
        }
        break
    }

    return errorMessage
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value),
      })
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target

    setTouched({
      ...touched,
      [name]: true,
    })

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Marcar todos los campos como "touched" para activar la validación
    const allTouched = Object.keys(touched).reduce(
      (acc, field) => ({
        ...acc,
        [field]: true,
      }),
      {},
    )
    setTouched(allTouched)

    // Validar los campos antes de enviar
    const newErrors = {}
    Object.entries(formData).forEach(([name, value]) => {
      newErrors[name] = validateField(name, value)
    })
    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((error) => error !== "")

    if (!hasErrors) {
      // Mostramos el loader mientras se registra el usuario
      Swal.fire({
        title: "Registrando usuario",
        text: "Por favor espere...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      try {
        const token = sessionStorage.getItem("token")
        const response = await axios.post("http://localhost:8080/api/usuario/registrar-trabajador", formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "", // Agregar autenticación si es necesario
          },
        })

        // Cerramos el loader
        Swal.close()

        // Actualizar la lista de usuarios después del registro
        setUsuarios([...usuarios, response.data])

        // Cerrar el modal y limpiar el formulario
        setShowModal(false)
        setFormData({
          nombreCompleto: "",
          username: "",
          email: "",
        })
        setErrors({
          nombreCompleto: "",
          username: "",
          email: "",
        })
        setTouched({
          nombreCompleto: false,
          username: false,
          email: false,
        })
      } catch (error) {
        console.error("Error al registrar el usuario:", error)

        // Cerramos el loader
        Swal.close()
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      nombreCompleto: "",
      username: "",
      email: "",
    })
    setErrors({
      nombreCompleto: "",
      username: "",
      email: "",
    })
    setTouched({
      nombreCompleto: false,
      username: false,
      email: "",
    })
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const indexOfLastUsuario = paginaActual * usuariosPorPagina
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina
  const usuariosPaginados = usuariosFiltrados.slice(indexOfFirstUsuario, indexOfLastUsuario)

  const handleChangeStatus = (usuario) => {
    const newStatus = !usuario.activo
    const statusText = newStatus ? "activar" : "desactivar"

    Swal.fire({
      title: `¿Estás seguro?`,
      text: `¿Deseas ${statusText} al usuario ${usuario.nombreCompleto}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = sessionStorage.getItem("token")

          // Mostramos el loader mientras se procesa
          Swal.fire({
            title: "Procesando",
            text: "Por favor espere...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })

          // Aquí iría la llamada a la API para cambiar el estado
          // Por ejemplo:
          // await axios.put(`http://localhost:8080/api/usuario/${usuario.id}/cambiar-estado`,
          //   { activo: newStatus },
          //   {
          //     headers: {
          //       Authorization: token ? `Bearer ${token}` : "",
          //     },
          //   }
          // );

          // Simulamos la respuesta exitosa actualizando el estado local
          const updatedUsuarios = usuarios.map((u) => (u.id === usuario.id ? { ...u, activo: newStatus } : u))
          setUsuarios(updatedUsuarios)

          Swal.fire(
            "¡Completado!",
            `El usuario ha sido ${newStatus ? "activado" : "desactivado"} correctamente.`,
            "success",
          )
        } catch (error) {
          console.error("Error al cambiar el estado del usuario:", error)
          Swal.fire("Error", "No se pudo cambiar el estado del usuario.", "error")
        }
      }
    })
  }

  return (
    <div className="app-container d-flex w-100 min-vh-100">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión De Usuarios</h1>
          <div className="usuarios-divider"></div>
        </div>

        <div className="usuarios-actions d-flex justify-content-end mb-3">
          <button className="btn-registrar btn btn-primary" onClick={() => setShowModal(true)}>
            Registrar
          </button>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setPaginaActual(1) // Reinicia a la página 1 en cada búsqueda
            }}
          />
        </div>

        <div className="usuarios-table-container table-responsive">
          <table className="usuarios-table table table-hover shadow-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombreCompleto}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <div
                      className={`usuario-estado badge ${usuario.activo ? "bg-success" : "bg-secondary"} rounded-pill`}
                    >
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="d-flex gap-2 justify-content-center">
                      <button className="btn-ver btn btn-sm btn-info" title="Ver detalles">
                        <Eye size={18} />
                      </button>
                      <button className="btn-editar btn btn-sm btn-light" title="Editar usuario">
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-status btn btn-sm btn-warning"
                        title="Cambiar estado"
                        onClick={() => handleChangeStatus(usuario)}
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mt-4 gap-3 align-items-center">
          <button
            className="btn btn-secondary"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>

          <span>Página {paginaActual}</span>

          <button
            className="btn btn-secondary"
            onClick={() => {
              const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina)
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }}
            disabled={paginaActual >= Math.ceil(usuariosFiltrados.length / usuariosPorPagina)}
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && <div className="modal-backdrop show"></div>}
      <div className={`modal ${showModal ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-medium text-center w-100 registro-title">Registro de Usuario</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${
                      touched.nombreCompleto && (errors.nombreCompleto ? "is-invalid" : "is-valid")
                    }`}
                    placeholder="Nombre Completo"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.nombreCompleto && errors.nombreCompleto && (
                    <div className="invalid-feedback">{errors.nombreCompleto}</div>
                  )}
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${touched.username && (errors.username ? "is-invalid" : "is-valid")}`}
                    placeholder="Nombre de usuario"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.username && errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control ${touched.email && (errors.email ? "is-invalid" : "is-valid")}`}
                    placeholder="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={!formValid}>
                  Registrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionUsuarios

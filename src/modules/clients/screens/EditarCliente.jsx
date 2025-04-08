"use client"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import axios from "axios"
import Swal from "sweetalert2"
import "./EditarCliente.css"

const EditarCliente = ({ cliente, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefonos: [""],
    direccion: {
      calle: "",
      numero: "",
      colonia: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
      municipio: "",
    },
  })

  // Inicializar el formulario con los datos del cliente
  useEffect(() => {
    if (cliente) {
      // Asegurarse de que telefonos sea un array
      const telefonos = Array.isArray(cliente.telefono)
        ? cliente.telefono
        : cliente.telefono
          ? [cliente.telefono]
          : [""]

      // Asegurarse de que la dirección tenga todos los campos necesarios
      const direccion = {
        calle: cliente.direccion?.calle || "",
        numero: cliente.direccion?.numero || "",
        colonia: cliente.direccion?.colonia || "",
        ciudad: cliente.direccion?.ciudad || "",
        estado: cliente.direccion?.estado || "",
        codigoPostal: cliente.direccion?.codigoPostal || "",
        municipio: cliente.direccion?.municipio || "",
      }

      setFormData({
        nombre: cliente.nombre || "",
        apellidoPaterno: cliente.apellidoPaterno || "",
        apellidoMaterno: cliente.apellidoMaterno || "",
        correo: cliente.correo || "",
        telefonos,
        direccion,
      })
    }
  }, [cliente])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTelefonoChange = (index, value) => {
    const updatedTelefonos = [...formData.telefonos]
    updatedTelefonos[index] = value
    setFormData({
      ...formData,
      telefonos: updatedTelefonos,
    })
  }

  const handleAddTelefono = () => {
    setFormData({
      ...formData,
      telefonos: [...formData.telefonos, ""],
    })
  }

  const handleRemoveTelefono = (index) => {
    if (formData.telefonos.length > 1) {
      const updatedTelefonos = formData.telefonos.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        telefonos: updatedTelefonos,
      })
    }
  }

  const handleDireccionChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      direccion: {
        ...formData.direccion,
        [name]: value,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica
    if (!formData.nombre || !formData.apellidoPaterno || !formData.correo) {
      Swal.fire({
        icon: "warning",
        title: "Campos requeridos",
        text: "Por favor complete los campos obligatorios: nombre, apellido paterno y correo",
        timer: 3000,
      })
      return
    }

    // Mostrar loader mientras se actualiza
    Swal.fire({
      title: "Actualizando cliente",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    try {
      const token = sessionStorage.getItem("token")

      // Preparar datos para la API
      const clienteActualizado = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        correo: formData.correo,
        telefono: formData.telefonos,
        direccion: formData.direccion,
      }

      // Llamada a la API para actualizar el cliente
      const response = await axios.put(`http://localhost:8080/api/cliente/${cliente.id}`, clienteActualizado, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      })

      // Cerrar el loader
      Swal.close()

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Cliente actualizado",
        text: "La información del cliente ha sido actualizada correctamente",
        timer: 2000,
        showConfirmButton: false,
      })

      // Notificar al componente padre sobre la actualización
      if (onUpdate) {
        onUpdate(response.data?.body?.data || clienteActualizado)
      }

      // Cerrar el modal
      onClose()
    } catch (error) {
      console.error("Error al actualizar el cliente:", error)

      // Cerrar el loader y mostrar mensaje de error
      Swal.close()
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudo actualizar la información del cliente",
        timer: 3000,
      })
    }
  }

  if (!cliente) return null

  return (
    <div className="editar-modal-overlay">
      <div className="editar-modal-container">
        <button className="editar-close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="editar-modal-title">Editar Cliente</h2>

        <form onSubmit={handleSubmit} className="editar-form">
          <div className="editar-form-section">
            <h3 className="editar-section-title">Información Personal</h3>

            <div className="editar-form-row">
              <div className="editar-form-group">
                <label htmlFor="nombre">Nombre*</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="editar-input"
                  required
                />
              </div>
            </div>

            <div className="editar-form-row">
              <div className="editar-form-group">
                <label htmlFor="apellidoPaterno">Apellido Paterno*</label>
                <input
                  type="text"
                  id="apellidoPaterno"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleInputChange}
                  className="editar-input"
                  required
                />
              </div>

              <div className="editar-form-group">
                <label htmlFor="apellidoMaterno">Apellido Materno</label>
                <input
                  type="text"
                  id="apellidoMaterno"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleInputChange}
                  className="editar-input"
                />
              </div>
            </div>

            <div className="editar-form-row">
              <div className="editar-form-group">
                <label htmlFor="correo">Correo Electrónico*</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className="editar-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="editar-form-section">
            <h3 className="editar-section-title">Teléfonos</h3>

            {formData.telefonos.map((telefono, index) => (
              <div key={index} className="editar-form-row telefono-row">
                <div className="editar-form-group telefono-group">
                  <label htmlFor={`telefono-${index}`}>
                    {index === 0 ? "Teléfono Principal*" : `Teléfono Adicional ${index}`}
                  </label>
                  <input
                    type="tel"
                    id={`telefono-${index}`}
                    value={telefono}
                    onChange={(e) => handleTelefonoChange(index, e.target.value)}
                    className="editar-input"
                    required={index === 0}
                  />
                </div>

                {index > 0 && (
                  <button type="button" className="btn-remove-telefono" onClick={() => handleRemoveTelefono(index)}>
                    Eliminar
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="btn-add-telefono" onClick={handleAddTelefono}>
              Agregar Teléfono
            </button>
          </div>

          <div className="editar-form-section">
            <h3 className="editar-section-title">Dirección</h3>

            <div className="editar-form-row">
              <div className="editar-form-group">
                <label htmlFor="calle">Calle</label>
                <input
                  type="text"
                  id="calle"
                  name="calle"
                  value={formData.direccion.calle}
                  onChange={handleDireccionChange}
                  className="editar-input"
                />
              </div>

              <div className="editar-form-group">
                <label htmlFor="numero">Número</label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.direccion.numero}
                  onChange={handleDireccionChange}
                  className="editar-input"
                />
              </div>
            </div>

            <div className="editar-form-row">
              <div className="editar-form-group">
                <label htmlFor="colonia">Colonia</label>
                <input
                  type="text"
                  id="colonia"
                  name="colonia"
                  value={formData.direccion.colonia}
                  onChange={handleDireccionChange}
                  className="editar-input"
                />
              </div>

              <div className="editar-form-group">
                <label htmlFor="municipio">Municipio</label>
                <input
                  type="text"
                  id="municipio"
                  name="municipio"
                  value={formData.direccion.municipio}
                  onChange={handleDireccionChange}
                  className="editar-input"
                />
              </div>
            </div>

            <div className="editar-form-row">
              <div className="editar-form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.direccion.ciudad}
                  onChange={handleDireccionChange}
                  className="editar-input"
                />
              </div>

              <div className="editar-form-group">
                <label htmlFor="estado">Estado</label>
                <input
                  type="text"
                  id="estado"
                  name="estado"
                  value={formData.direccion.estado}
                  onChange={handleDireccionChange}
                  className="editar-input"
                />
              </div>
            </div>

            <div className="editar-form-row">
              <div className="editar-form-group">
                <label htmlFor="codigoPostal">Código Postal</label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.direccion.codigoPostal}
                  onChange={handleDireccionChange}
                  className="editar-input"
                />
              </div>
            </div>
          </div>

          <div className="editar-form-actions">
            <button type="button" className="editar-btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="editar-btn-guardar">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarCliente

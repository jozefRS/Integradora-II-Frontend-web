import { useState, useEffect } from "react"
import { Edit, Eye, Trash2 } from "lucide-react"
import "../../../assets/bootstrap/bootstrap.min.css"
import "./GestionClientes.css"
import Sidebar from "../../../kernel/components/Sidebar"
import axios from "axios"
import RegistrarCliente from "../screens/RegistrarCliente"
import DetallesCliente from "./DetallesCliente"
import EditarCliente from './EditarCliente'
import Swal from "sweetalert2"

const GestionClientes = () => {
  const [clientes, setClientes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDetallesModal, setShowDetallesModal] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [showEditarModal, setShowEditarModal] = useState(false)

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    // Mostramos el loader mientras se cargan los clientes
    Swal.fire({
      title: "Cargando clientes",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const token = sessionStorage.getItem("token")
    try {
      const response = await axios.get("http://localhost:8080/api/cliente", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      setClientes(response.data?.body?.data || [])

      // Cerramos el loader
      Swal.close()
    } catch (error) {
      console.error("Error al obtener los clientes:", error)
      setClientes([])

      // Cerramos el loader y mostramos mensaje de error
      Swal.close()
      Swal.fire({
        icon: "warning",
        title: "Error al cargar",
        text: "No se pudieron cargar los clientes",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const handleVerDetalles = (cliente) => {
    // Adaptamos el cliente para el componente DetallesCliente
    const clienteAdaptado = {
      ...cliente,
      email: cliente.correo,
      telefonos: Array.isArray(cliente.telefono) ? cliente.telefono : [],
      calle: cliente.direccion?.calle || "",
      numero: cliente.direccion?.numero || "",
      colonia: cliente.direccion?.colonia || "",
      ciudad: cliente.direccion?.ciudad || "",
      estado: cliente.direccion?.estado || "",
      codigoPostal: cliente.direccion?.codigoPostal || "",
      activo: true, // Asumimos que está activo si no hay información
    }

    setClienteSeleccionado(clienteAdaptado)
    setShowDetallesModal(true)
  }

  const handleEditarCliente = (cliente) => {
    setClienteSeleccionado(cliente)
    setShowEditarModal(true)
  }

  const handleClienteActualizado = (clienteActualizado) => {
    setClientes(clientes.map(c => 
      c.id === clienteActualizado.id ? clienteActualizado : c
    ))
  }

  const handleEliminarCliente = (clienteId) => {
    eliminarCliente(clienteId)
  }

  const eliminarCliente = async (clienteId) => {
    // Mostramos el loader mientras se elimina el cliente
    Swal.fire({
      title: "Eliminando cliente",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const token = sessionStorage.getItem("token")
    try {
      await axios.delete(`http://localhost:8080/api/cliente/${clienteId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })

      // Actualizamos la lista de clientes
      setClientes(clientes.filter((cliente) => cliente.id !== clienteId))

      // Cerramos el loader
      Swal.close()
    } catch (error) {
      console.error("Error al eliminar el cliente:", error)

      // Cerramos el loader
      Swal.close()
    }
  }

  return (
    <div className="app-container d-flex w-100 min-vh-100">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container p-4 ms-auto w-100">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión De Clientes</h1>
          <div className="usuarios-divider"></div>
        </div>

        <div className="clientes-actions d-flex justify-content-end mb-3">
          <button className="btn-registrar btn btn-primary" onClick={() => setShowModal(true)}>
            Registrar
          </button>
        </div>

        <div className="clientes-table-container table-responsive">
          <table className="clientes-table table table-hover shadow-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfonos</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{`${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`}</td>
                  <td>{cliente.correo}</td>
                  <td>{Array.isArray(cliente.telefono) ? cliente.telefono.join(", ") : "Sin teléfono"}</td>
                  <td>
                    {cliente.direccion
                      ? `${cliente.direccion.calle || ""}, ${cliente.direccion.colonia || ""}, ${
                          cliente.direccion.municipio || ""
                        }`
                      : "Sin dirección"}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn-ver btn btn-sm btn-info"
                        title="Ver detalles"
                        onClick={() => handleVerDetalles(cliente)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                       className="btn-editar btn btn-sm btn-light" 
                       title="Editar cliente" 
                       onClick={() => handleEditarCliente(cliente)}>
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-eliminar btn btn-sm btn-danger"
                        title="Eliminar cliente"
                        onClick={() => handleEliminarCliente(cliente.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <RegistrarCliente
          onClose={() => setShowModal(false)}
          onSubmit={async (data) => {
            // Mostramos el loader mientras se registra el cliente
            Swal.fire({
              title: "Registrando cliente",
              text: "Por favor espere...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading()
              },
            })

            try {
              const token = sessionStorage.getItem("token")

              const clienteAdaptado = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                correo: data.email,
                telefono: data.telefonos,
                direccion: {
                  calle: data.calle,
                  numero: data.numero,
                  colonia: data.colonia,
                  ciudad: data.ciudad,
                  estado: data.estado,
                  codigoPostal: data.codigoPostal,
                },
              }

              const response = await axios.post("http://localhost:8080/api/cliente", clienteAdaptado, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token ? `Bearer ${token}` : "",
                },
              })

              const nuevoCliente = response.data?.body?.data

              if (nuevoCliente) {
                setClientes((prev) => [
                  ...prev,
                  {
                    ...nuevoCliente,
                    telefono: Array.isArray(nuevoCliente.telefono) ? nuevoCliente.telefono : [],
                    direccion: nuevoCliente.direccion || {},
                  },
                ])
              }

              // Cerramos el loader
              Swal.close()
              setShowModal(false)
            } catch (error) {
              console.error("Error al registrar el cliente:", error)

              // Cerramos el loader y mostramos mensaje de error
              Swal.close()
              Swal.fire({
                icon: "warning",
                title: "Error al registrar",
                text: "No se pudo registrar el cliente",
                timer: 2000,
                showConfirmButton: false,
              })
            }
          }}
        />
      )}

      {/* Modal de Detalles */}
      {showDetallesModal && clienteSeleccionado && (
        <DetallesCliente cliente={clienteSeleccionado} onClose={() => setShowDetallesModal(false)} />
      )}

      {showEditarModal && clienteSeleccionado && (
        <EditarCliente 
        cliente={clienteSeleccionado} 
        onClose={() => setShowEditarModal(false)}
        onUpdate={handleClienteActualizado}
        />
      )}
    </div>
  )
}

export default GestionClientes

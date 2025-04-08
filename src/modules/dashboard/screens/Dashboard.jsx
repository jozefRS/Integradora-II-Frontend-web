import { useState, useEffect } from "react"
import { Package, ShoppingBag, Clock } from "lucide-react"
import Sidebar from "../../../kernel/components/Sidebar"
import axios from "axios" // Importa axios
import "./Dashboard.css"
import Swal from "sweetalert2" // Importamos SweetAlert2

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrdenes: 0,
    totalPendientes: 0,
    totalVendidoMes: 0,
    productosPorAgotarse: [],
    ventasPorTrabajador: {},
    topProductosVendidos: [], // Cambiado a un array, como se espera
  })

  const [trabajadores, setTrabajadores] = useState([]) // Estado para trabajadores
  const [productos, setProductos] = useState([]) // Estado para productos

  useEffect(() => {
    // Mostramos el loader mientras se cargan los datos del dashboard
    Swal.fire({
      title: "Cargando dashboard",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    // Cargamos todos los datos necesarios
    Promise.all([fetchDashboardData(), fetchTrabajadores(), fetchProductos()])
      .then(() => {
        // Cerramos el loader cuando todos los datos estén cargados
        Swal.close()
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error)
        // Cerramos el loader en caso de error
        Swal.close()
      })
  }, [])

  // Función para obtener los datos del Dashboard
  const fetchDashboardData = async () => {
    const token = sessionStorage.getItem("token")
    try {
      const response = await axios.get("http://localhost:8080/dashboard", {
        params: {
          mes: 4, // Ajusta el mes que quieres consultar
          año: 2025,
        },
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      setDashboardData(response.data) // Establecer los datos obtenidos en el estado
      return response.data
    } catch (error) {
      console.error("Error al obtener los datos del dashboard:", error)
      throw error
    }
  }

  // Función para obtener los trabajadores
  const fetchTrabajadores = async () => {
    const token = sessionStorage.getItem("token")
    try {
      const response = await axios.get("http://localhost:8080/api/usuario", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      setTrabajadores(response.data || []) // Guardamos los trabajadores
      return response.data
    } catch (error) {
      console.error("Error al obtener los trabajadores: ", error)
      throw error
    }
  }

  // Función para obtener los productos
  const fetchProductos = async () => {
    const token = sessionStorage.getItem("token")
    try {
      const response = await axios.get("http://localhost:8080/api/producto", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      setProductos(response.data?.body?.data || []) // Guardamos los productos
      return response.data
    } catch (error) {
      console.error("Error al obtener los productos: ", error)
      throw error
    }
  }

  // Función para obtener el nombre del trabajador por ID
  const getTrabajadorName = (idTrabajador) => {
    const trabajador = trabajadores.find((t) => t.id === idTrabajador)
    return trabajador ? `${trabajador.nombreCompleto} ` : "Sin datos"
  }

  // Función para obtener el nombre del producto por ID
  const getProductoName = (productoId) => {
    const producto = productos.find((p) => p.id === productoId)
    return producto ? producto.nombre : "Producto no encontrado"
  }

  // Transformar los datos de los productos vendidos para el gráfico de pastel
  const getTopProductosVendidos = () => {
    // Usar los datos de 'topProductosVendidos' que ya vienen del backend
    const productosConVentas = dashboardData.topProductosVendidos.map((item, index) => {
      // En lugar de buscar el producto por ID, usamos los datos directamente del backend
      const nombre = item.nombre || "Producto no encontrado"
      const cantidad = item.cantidadVendida || 0
      const color = getColorForProduct(index) // Asignamos el color dinámicamente basado en el índice

      return {
        nombre,
        cantidad,
        color,
        label: nombre,
        value: cantidad, // El valor es la cantidad de ventas
      }
    })

    console.log("Productos con ventas:", productosConVentas)

    // Ordenar los productos por cantidad (de mayor a menor) y seleccionar los top 5
    const productosTop5 = productosConVentas.sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)

    return productosTop5
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-card-content">
                <h3>Total Ordenes</h3>
                <p className="stat-value">{dashboardData.totalOrdenes}</p>
              </div>
              <div className="stat-icon">
                <ShoppingBag size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <h3>Total Vendido por mes</h3>
                <p className="stat-value">${dashboardData.totalVendidoMes.toLocaleString()}</p>
              </div>
              <div className="stat-icon">
                <Package size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <h3>Total Pendientes</h3>
                <p className="stat-value">{dashboardData.totalPendientes}</p>
              </div>
              <div className="stat-icon">
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className="dashboard-main">
            <div className="sales-section">
              <div className="sales-table-container">
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Nombre de usuario</th>
                      <th>Total de ventas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dashboardData.ventasPorTrabajador).map(([trabajadorId, total]) => (
                      <tr key={trabajadorId}>
                        <td>
                          <div className="user-info">
                            <p className="user-name">{getTrabajadorName(trabajadorId)}</p>
                          </div>
                        </td>
                        <td className="sales-amount">${total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="chart-container">
                <PieChart data={dashboardData.topProductosVendidos} />
                <div className="chart-legend">
                  {getTopProductosVendidos().map((item, index) => (
                    <div key={index} className="legend-item">
                      <div className="color-indicator" style={{ backgroundColor: item.color }}></div>
                      <div className="legend-text">
                        <span>{item.label}</span>
                        <span className="legend-value">{item.value} ventas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="products-section">
              <h2>Inventario de Productos</h2>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock en unidades</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.productosPorAgotarse.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-info">
                          <p className="product-name">{getProductoName(product.id)}</p>
                          <p className="product-description">{product.cantidad + product.unidadMedida}</p>
                        </div>
                      </td>
                      <td>{product.stock}</td>
                      <td>
                        <span className="category-badge">{product.idCategoria}</span>
                      </td>
                      <td>
                        {/* Validación del estado según el stock */}
                        <span
                          className={`status-badge ${
                            product.stock === 0 ? "out-of-stock" : product.stock < 5 ? "low-stock" : "available"
                          }`}
                        />
                        {product.stock === 0 ? "Agotado" : product.stock < 5 ? "Por agotarse" : "Disponible"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente PieChart para renderizar el gráfico de pastel
const PieChart = ({ data }) => {
  console.log("Datos para el gráfico de pastel:", data)

  // Si no hay datos, mostrar un mensaje
  if (data.length === 0) {
    return <div>No hay suficientes datos para generar el gráfico.</div>
  }

  // Calcular el total de ventas
  const totalVentas = data.reduce((sum, item) => sum + item.cantidadVendida, 0)

  return (
    <div className="pie-chart">
      <svg viewBox="0 0 100 100">{getPieWedges(data, totalVentas)}</svg>
    </div>
  )
}

// Función para crear los segmentos del gráfico de pastel
const getPieWedges = (data, total) => {
  let startAngle = 0
  const wedges = []

  data.forEach((item, index) => {
    const percentage = item.cantidadVendida / total
    const angle = percentage * 360
    const endAngle = startAngle + angle

    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const path = `
      M 50 50
      L ${x1} ${y1}
      A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `

    // Asignar colores a cada segmento basado en el índice
    const color = getColorForProduct(index)
    wedges.push(<path key={index} d={path} fill={color} stroke="#fff" strokeWidth="0.5" />)

    startAngle = endAngle
  })

  return wedges
}

// Asignar colores cíclicamente
const getColorForProduct = (index) => {
  const colors = [
    "#FF66B2", // Rosa claro
    "#FF3385", // Rosa medio
    "#FF0066", // Rosa fuerte
    "#FF99CC", // Rosa suave
    "#FF4D94", // Rosa intenso
  ]

  return colors[index % colors.length] // Asignar un color basado en el índice
}
export default Dashboard

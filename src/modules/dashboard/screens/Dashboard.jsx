import { Package, ShoppingBag, Clock } from "lucide-react"
import Sidebar from "../../../kernel/components/Sidebar"
import "./Dashboard.css"

const Dashboard = () => {
  // Datos de ejemplo para las ventas
  const salesData = [
    { id: "1", name: "Danna Paola", lastName: "Sanchez Marinez", sales: 8000000 },
    { id: "2", name: "Astrid Valeria", lastName: "Ventura Gil", sales: 23000000 },
    { id: "3", name: "Karol Jozef", lastName: "", position: "PHP, Laravel, VueJS", sales: 34000000 },
    { id: "4", name: "Angel", lastName: "Aguilar", sales: 2600000 },
    { id: "5", name: "Angel", lastName: "Aguilar", sales: 2600000 },
  ]

  // Datos de ejemplo para los productos
  const productsData = [
    {
      id: "1",
      name: "Nombre de producto 1",
      description: "32mg",
      stock: 2,
      category: "Categoría",
      status: "Agotado",
    },
    {
      id: "2",
      name: "Nombre de producto 2",
      description: "65ml",
      stock: 5,
      category: "Categoría",
      status: "Por agotar",
    },
    {
      id: "3",
      name: "Nombre de producto 3",
      description: "Kit de 4",
      stock: 3,
      category: "Categoría",
      status: "Agotado",
    },
    {
      id: "4",
      name: "Nombre de producto 4",
      description: "Frasco de 32ml",
      stock: 4,
      category: "Categoría",
      status: "Agotado",
    },
  ]

  // Datos para el gráfico de pastel
  const pieChartData = [
    { label: "Producto 1", value: 8975, color: "#d92d88" },
    { label: "Producto 2", value: 7590, color: "#ec48a9" },
    { label: "Producto 3", value: 1234, color: "#f474c4" },
    { label: "Producto 4", value: 2500, color: "#f9a9dd" },
    { label: "Producto 5", value: 3200, color: "#fbd0ed" },
  ]

  return (
    <div className="app-container">
      <Sidebar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-card-content">
                <h3>Total Ordernes</h3>
                <p className="stat-value">10293</p>
              </div>
              <div className="stat-icon">
                <ShoppingBag size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <h3>Total Vendido por mes</h3>
                <p className="stat-value">$89,000</p>
              </div>
              <div className="stat-icon">
                <Package size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <h3>Total Pendientes</h3>
                <p className="stat-value">2040</p>
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
                    {salesData.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <p className="user-name">{`${user.name} ${user.lastName}`}</p>
                            {user.position && <p className="user-position">{user.position}</p>}
                          </div>
                        </td>
                        <td className="sales-amount">${user.sales.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="chart-container">
                <PieChart data={pieChartData} />
                <div className="chart-legend">
                  {pieChartData.map((item, index) => (
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
                  {productsData.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          <p className="product-description">{product.description}</p>
                        </div>
                      </td>
                      <td>{product.stock}</td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${product.status.toLowerCase().replace(" ", "-")}`}>
                          {product.status}
                        </span>
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

// Componente para el gráfico de pastel
const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="pie-chart">
      <svg viewBox="0 0 100 100">{getPieWedges(data, total)}</svg>
    </div>
  )
}

// Función para generar los segmentos del gráfico de pastel
const getPieWedges = (data, total) => {
  let startAngle = 0
  const wedges = []

  data.forEach((item, index) => {
    const percentage = item.value / total
    const angle = percentage * 360
    const endAngle = startAngle + angle

    // Convertir ángulos a radianes y calcular puntos
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)

    // Determinar si el arco es mayor que 180 grados
    const largeArcFlag = angle > 180 ? 1 : 0

    // Crear el path para el segmento
    const path = `
      M 50 50
      L ${x1} ${y1}
      A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `

    wedges.push(<path key={index} d={path} fill={item.color} stroke="#fff" strokeWidth="0.5" />)

    startAngle = endAngle
  })

  return wedges
}

export default Dashboard


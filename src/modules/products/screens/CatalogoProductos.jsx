import { useState, useEffect } from "react"
import Sidebar from "../../../kernel/components/Sidebar"
import axios from "axios"
import "../../../assets/bootstrap/bootstrap.min.css"
import "../screens/CatalogoProductos.css" // Asegúrate de importar después de Bootstrap para sobrescribir estilos
import Swal from "sweetalert2" // Importamos SweetAlert2

const CatalogoProductos = () => {
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [paginaActual, setPaginaActual] = useState(1)
  const [productosPorPagina] = useState(9) // Ajusta la cantidad de productos por página
  const [cargando, setCargando] = useState(true) // Estado para controlar la carga inicial

  const getToken = () => sessionStorage.getItem("token")

  // Obtener categorías
  useEffect(() => {
    // Mostramos el loader mientras se cargan los datos iniciales
    Swal.fire({
      title: "Cargando datos",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const fetchCategorias = async () => {
      const token = getToken()
      try {
        const response = await axios.get("http://localhost:8080/api/categoria", {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
        setCategorias(response.data?.body?.data || [])
        await fetchProductos() // Cargamos los productos después de las categorías

        // Cerramos el loader
        Swal.close()
        setCargando(false)
      } catch (error) {
        console.error("Error al obtener categorías:", error)
        await fetchProductos() // Intentamos cargar los productos de todos modos

        // Cerramos el loader
        Swal.close()
        setCargando(false)
      }
    }

    fetchCategorias()
  }, [])

  // Obtener todos los productos al cargar
  const fetchProductos = async () => {
    const token = getToken()
    try {
      const response = await axios.get("http://localhost:8080/api/producto", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      setProductos(response.data?.body?.data || [])
      setProductosFiltrados(response.data?.body?.data || []) // Inicializamos los productos filtrados
      return response.data
    } catch (error) {
      console.error("Error al obtener los productos:", error)
      throw error
    }
  }

  // Obtener las subcategorías cuando se selecciona una categoría
  useEffect(() => {
    if (categoriaSeleccionada) {
      // Mostramos el loader mientras se cargan las subcategorías
      Swal.fire({
        title: "Cargando subcategorías",
        text: "Por favor espere...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const token = getToken()
      axios
        .get(`http://localhost:8080/api/categoria/${categoriaSeleccionada}/subcategorias`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
        .then((response) => {
          setSubcategorias(response.data || [])
          // Cerramos el loader
          Swal.close()
        })
        .catch((error) => {
          console.error("Error al obtener las subcategorías:", error)
          // Cerramos el loader
          Swal.close()
        })
    } else {
      setSubcategorias([]) // Limpiar subcategorías si no hay categoría seleccionada
    }
  }, [categoriaSeleccionada])

  // Filtrar productos cada vez que cambia la búsqueda, categoría, subcategoría o la página
  useEffect(() => {
    const productosFiltrados = productos.filter((producto) => {
      // Validar que la categoría seleccionada coincida con el producto
      const categoriaCoincide = categoriaSeleccionada
        ? producto.idCategoria && producto.idCategoria === categoriaSeleccionada
        : true

      // Validar que la subcategoría seleccionada coincida con el producto
      const subcategoriaCoincide = subcategoriaSeleccionada
        ? producto.idSubcategoria && producto.idSubcategoria === subcategoriaSeleccionada
        : true

      // Validar que el nombre del producto coincida con la búsqueda
      const nombreCoincide = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())

      return nombreCoincide && categoriaCoincide && subcategoriaCoincide
    })

    setProductosFiltrados(productosFiltrados)
  }, [busqueda, categoriaSeleccionada, subcategoriaSeleccionada, productos])

  // Manejar el cambio de la categoría seleccionada
  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value
    setCategoriaSeleccionada(categoriaId)
    setSubcategoriaSeleccionada("") // Resetear la subcategoría seleccionada
  }

  // Manejar el cambio de la subcategoría seleccionada
  const handleSubcategoriaChange = (e) => {
    setSubcategoriaSeleccionada(e.target.value)
  }

  // Manejar la búsqueda por nombre
  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value)
  }

  // Manejar el cambio de página
  const handlePageChange = (newPage) => {
    setPaginaActual(newPage)
  }

  return (
    <div className="app-wrapper">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="content-wrapper">
        <div className="container-fluid py-4 px-4">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="text-center text-zaziderma">Catálogo de productos</h1>
              <hr className="border-zaziderma" />
            </div>
          </div>
  
          {/* Filtros por categoría, subcategoría y búsqueda */}
          <div className="row mb-4">
            <div className="col-4">
              <select className="form-select" value={categoriaSeleccionada} onChange={handleCategoriaChange}>
                <option value="">Seleccionar categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="col-4">
              <select
                className="form-select"
                value={subcategoriaSeleccionada}
                onChange={handleSubcategoriaChange}
                disabled={!categoriaSeleccionada}
              >
                <option value="">Seleccionar subcategoría</option>
                {subcategorias.map((subcategoria) => (
                  <option key={subcategoria.id} value={subcategoria.id}>
                    {subcategoria.nombre}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={handleBusquedaChange}
              />
            </div>
          </div>
  
          {/* Mostrar los productos filtrados */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {cargando ? (
              <div className="col-12 text-center">
                <p>Cargando productos...</p>
              </div>
            ) : productosFiltrados.length > 0 ? (
              productosFiltrados
                .slice((paginaActual - 1) * productosPorPagina, paginaActual * productosPorPagina)
                .map((producto) => (
                  <div className="col" key={producto.id}>
                    <div className="card h-100 shadow-sm transition-hover">
                      <div
                        className="bg-light d-flex justify-content-center align-items-center"
                        style={{ height: "200px" }}
                      >
                        <img
                          src={producto.imagen ? `http://localhost:8080/images${producto.imagen}` : "/placeholder.svg"}
                          alt={producto.nombre}
                          className="card-img-top p-3"
                          style={{ maxHeight: "100%", objectFit: "contain" }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold">{producto.nombre}</h5>
                        <p className="card-text text-muted small">{producto.descripcion}</p>
                        <p className="card-text fw-bold fs-5">
                          ${producto.precio ? producto.precio.toFixed(2) : "Sin precio"}
                        </p>
                        <div className="mb-3">
                          <span
                            className={`badge ${producto.estado ? "bg-zaziderma" : "bg-secondary"}`}
                            style={{
                              borderRadius: "20px",
                              padding: "5px 15px",
                            }}
                          >
                            {producto.estado ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                        <button className="btn btn-zaziderma mt-auto w-100">Ver detalles</button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-12 text-center">
                <p>No hay productos disponibles</p>
              </div>
            )}
          </div>
  
          {/* Paginación */}
          <div className="d-flex justify-content-center mt-4 gap-3 align-items-center">
            <button
              className="btn btn-secondary mx-2"
              onClick={() => handlePageChange(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              Anterior
            </button>
            <span> Página {paginaActual} </span>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => handlePageChange(paginaActual + 1)}
              disabled={productosFiltrados.length <= paginaActual * productosPorPagina}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default CatalogoProductos

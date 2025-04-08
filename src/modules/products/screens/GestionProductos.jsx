import { useState, useEffect } from "react"
import { Edit } from "lucide-react"
import axios from "axios"
import imageCompression from "browser-image-compression"
import "../../../assets/bootstrap/bootstrap.min.css"
import "./GestionProductos.css"
import Sidebar from "../../../kernel/components/Sidebar"
import Swal from "sweetalert2" // Importamos SweetAlert2

const GestionProductos = () => {
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [selectedCategoria, setSelectedCategoria] = useState("")
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    unidadMedida: "",
    stock: "",
    idCategoria: "",
    idSubcategoria: "",
  })
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState("")

  // Variables para la búsqueda y paginado
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const getToken = () => sessionStorage.getItem("token")

  useEffect(() => {
    // Mostramos el loader mientras se cargan las categorías
    Swal.fire({
      title: "Cargando datos",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const token = getToken()
    axios
      .get("http://localhost:8080/api/categoria", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      .then((response) => {
        setCategorias(response.data?.body?.data)
        fetchProductos() // Cargamos los productos después de las categorías
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error)
        fetchProductos() // Intentamos cargar los productos de todos modos
      })
  }, [])

  const fetchProductos = async () => {
    const token = getToken()
    try {
      const response = await axios.get("http://localhost:8080/api/producto", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      setProductos(response.data?.body?.data || [])

      // Cerramos el loader una vez que se han cargado todos los datos
      Swal.close()
    } catch (error) {
      console.error("Error al obtener los productos:", error)

      // Cerramos el loader
      Swal.close()
    }
  }

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value
    setSelectedCategoria(categoriaId)
    setFormData({ ...formData, idCategoria: categoriaId, idSubcategoria: "" })

    if (!categoriaId) return

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
      .get(`http://localhost:8080/api/categoria/${categoriaId}/subcategorias`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })
      .then((response) => {
        setSubcategorias(response.data || [])
        Swal.close() // Cerramos el loader
      })
      .catch((error) => {
        console.error("Error al obtener subcategorías:", error)
        Swal.close() // Cerramos el loader
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const handleImageUpload = async () => {
    if (!image) {
      // Reemplazamos el alert por SweetAlert2
      Swal.fire({
        icon: "warning",
        title: "Imagen requerida",
        text: "Por favor selecciona una imagen",
      })
      return
    }

    // Mostramos el loader mientras se sube la imagen
    Swal.fire({
      title: "Subiendo imagen",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    }

    try {
      const compressedFile = await imageCompression(image, options)
      const imageName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`
      const formData = new FormData()
      formData.append("image", compressedFile, imageName)

      const token = sessionStorage.getItem("token")
      const response = await axios.post("http://localhost:8080/api/upload", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      })

      const imageUrl = response.data.imageUrl
      Swal.close() // Cerramos el loader
      return imageUrl
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      Swal.close() // Cerramos el loader
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const imageUrl = await handleImageUpload()

    if (!imageUrl) {
      return // Ya se mostró un mensaje en handleImageUpload
    }

    // Mostramos el loader mientras se registra el producto
    Swal.fire({
      title: "Registrando producto",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const productData = {
      ...formData,
      imagen: imageUrl,
    }

    const token = sessionStorage.getItem("token")
    try {
      await axios.post("http://localhost:8080/api/producto", productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      })

      Swal.close() // Cerramos el loader

      setShowModal(false)
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        cantidad: "",
        unidadMedida: "",
        stock: "",
        idCategoria: "",
        idSubcategoria: "",
      })
      fetchProductos()
    } catch (error) {
      console.error("Error al registrar producto:", error.response?.data || error.message)
      Swal.close() // Cerramos el loader
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault() // evitar recarga

    if (!newCategoryName) {
      // Reemplazamos el alert por SweetAlert2
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Por favor ingresa un nombre para la categoría",
      })
      return
    }

    // Mostramos el loader mientras se crea la categoría
    Swal.fire({
      title: "Creando categoría",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const token = getToken()
    try {
      const response = await axios.post(
        "http://localhost:8080/api/categoria",
        { nombre: newCategoryName },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } },
      )

      const nuevaCategoria = response.data.body.data
      setCategorias([...categorias, nuevaCategoria])
      setSelectedCategoria(nuevaCategoria.id) // seleccionar la nueva
      setNewCategoryName("")

      Swal.close() // Cerramos el loader
    } catch (error) {
      console.error("Error al agregar categoría:", error)
      Swal.close() // Cerramos el loader
    }
  }

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault()

    if (!selectedCategoria || !newSubcategoryName) {
      // Reemplazamos el alert por SweetAlert2
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Selecciona una categoría y proporciona un nombre para la subcategoría",
      })
      return
    }

    // Mostramos el loader mientras se crea la subcategoría
    Swal.fire({
      title: "Creando subcategoría",
      text: "Por favor espere...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    const token = getToken()
    try {
      const response = await axios.put(
        `http://localhost:8080/api/categoria/${selectedCategoria}/subcategoria`,
        { nombre: newSubcategoryName },
        { headers: { Authorization: token ? `Bearer ${token}` : "" } },
      )

      // Actualizar las subcategorías de la categoría seleccionada
      const subResponse = await axios.get(`http://localhost:8080/api/categoria/${selectedCategoria}/subcategorias`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      })

      setSubcategorias(subResponse.data || []) // Actualiza la lista de subcategorías
      setNewSubcategoryName("") // Limpia el campo de nombre de subcategoría

      Swal.close() // Cerramos el loader
    } catch (error) {
      console.error("Error al agregar subcategoría:", error)
      Swal.close() // Cerramos el loader
    }
  }

  // Filtrar productos por nombre
  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Paginación
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProductos = filteredProductos.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="app-container d-flex w-100 min-vh-100">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container p-4 ms-auto w-100">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión De Productos</h1>
          <div className="usuarios-divider"></div>
        </div>

        {/* Campo de búsqueda */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto por nombre"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="usuarios-actions d-flex justify-content-end mb-3">
          <button className="btn-registrar btn btn-primary" onClick={() => setShowModal(true)}>
            Registrar producto
          </button>
          <button className="btn-registrar btn btn-secondary" onClick={() => setShowCategoryModal(true)}>
            Crear categoría/subcategoría
          </button>
        </div>

        <table className="table table-hover shadow-sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentProductos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.unidadMedida}</td>
                <td>{producto.stock}</td>
                <td>
                  <span className={`badge ${producto.estado ? "bg-success" : "bg-secondary"}`}>
                    {producto.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-light">
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-secondary mx-2"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span> Página {currentPage} </span>
          <button
            className="btn btn-secondary mx-2"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredProductos.length / itemsPerPage)}
          >
            Siguiente
          </button>
        </div>

        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4">
                <h2 className="fw-medium text-center w-100">Registro de Producto</h2>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="descripcion"
                      placeholder="Descripción"
                      className="form-control"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      name="precio"
                      placeholder="Precio"
                      className="form-control"
                      value={formData.precio}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      name="cantidad"
                      placeholder="Cantidad"
                      className="form-control"
                      value={formData.cantidad}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      name="unidadMedida"
                      className="form-control"
                      value={formData.unidadMedida}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione unidad</option>
                      <option value="mg">miligramo (mg)</option>
                      <option value="g">Gramo (g)</option>
                      <option value="ml">militros (ml)</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      name="stock"
                      placeholder="Stock"
                      className="form-control"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      name="idCategoria"
                      className="form-control"
                      value={formData.idCategoria}
                      onChange={handleCategoriaChange}
                      required
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <select
                      name="idSubcategoria"
                      className="form-control"
                      value={formData.idSubcategoria}
                      onChange={handleInputChange}
                      required
                      disabled={!selectedCategoria}
                    >
                      <option value="">Seleccione una subcategoría</option>
                      {subcategorias.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                      Imagen del producto
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Registrar
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowModal(false)}>
                      Cerrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal para crear categoría/subcategoría */}
        {showCategoryModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4">
                <h2 className="fw-medium text-center w-100">Gestionar Categorías</h2>
                <button type="button" className="btn-close" onClick={() => setShowCategoryModal(false)}></button>
                <form>
                  {/* Crear nueva categoría */}
                  <div className="mb-4">
                    <h5>Crear nueva categoría</h5>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre de nueva categoría"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <button className="btn btn-primary mt-2" onClick={handleCategorySubmit}>
                      Crear Categoría
                    </button>
                  </div>

                  <hr />

                  {/* Agregar subcategoría a categoría existente */}
                  <div className="mb-3">
                    <h5>Selecciona una categoría para agregar subcategorías</h5>
                    <select
                      className="form-select"
                      value={selectedCategoria}
                      onChange={(e) => {
                        setSelectedCategoria(e.target.value)
                        // Cargar subcategorías al seleccionar una categoría
                        if (e.target.value) {
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
                            .get(`http://localhost:8080/api/categoria/${e.target.value}/subcategorias`, {
                              headers: { Authorization: token ? `Bearer ${token}` : "" },
                            })
                            .then((res) => {
                              setSubcategorias(res.data || [])
                              Swal.close() // Cerramos el loader
                            })
                            .catch((err) => {
                              console.error(err)
                              Swal.close() // Cerramos el loader
                            })
                        } else {
                          setSubcategorias([])
                        }
                      }}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedCategoria && (
                    <>
                      {/* Mostrar subcategorías actuales */}
                      <div className="mb-3">
                        <h6 className="fw-bold">Subcategorías actuales:</h6>
                        <ul>
                          {subcategorias.length > 0 ? (
                            subcategorias.map((sub) => <li key={sub.id}>{sub.nombre}</li>)
                          ) : (
                            <li>No hay subcategorías</li>
                          )}
                        </ul>
                      </div>

                      {/* Agregar nueva subcategoría */}
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nombre nueva subcategoría"
                          value={newSubcategoryName}
                          onChange={(e) => setNewSubcategoryName(e.target.value)}
                        />
                        <button className="btn btn-primary mt-2" onClick={handleSubcategorySubmit}>
                          Agregar Subcategoría
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GestionProductos

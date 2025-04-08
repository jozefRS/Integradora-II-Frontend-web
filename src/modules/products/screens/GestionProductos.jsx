import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import '../../../assets/bootstrap/bootstrap.min.css';
import './GestionProductos.css';
import Sidebar from '../../../kernel/components/Sidebar';
import { productoSchema, categoriaSchema, subcategoriaSchema } from '../../../utils/validationForm';


const GestionProductos = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    unidadMedida: '',
    stock: '',
    idCategoria: '',
    idSubcategoria: '',
  });
  const [errores, setErrores] = useState({});
  const [categoryErrors, setCategoryErrors] = useState({});
  const [subcategoryErrors, setSubcategoryErrors] = useState({});

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Variables para la búsqueda y paginado
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const getToken = () => sessionStorage.getItem('token');

  useEffect(() => {
    const token = getToken();
    axios.get('http://localhost:8080/api/categoria', {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
      .then(response => setCategorias(response.data?.body?.data))
      .catch(error => console.error('Error al obtener categorías:', error));
  }, []);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const token = getToken();
    try {
      const response = await axios.get('http://localhost:8080/api/producto', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      setProductos(response.data?.body?.data || []);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleCategoriaChange = (e) => {
    const categoriaId = e.target.value;
    setSelectedCategoria(categoriaId);
    setFormData({ ...formData, idCategoria: categoriaId, idSubcategoria: '' });

    if (!categoriaId) return;

    const token = getToken();
    axios.get(`http://localhost:8080/api/categoria/${categoriaId}/subcategorias`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
      .then(response => {
        setSubcategorias(response.data || []);
      })
      .catch(error => console.error('Error al obtener subcategorías:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!image) {
      alert("Por favor selecciona una imagen.");
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(image, options);
      const imageName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.jpg`;
      const formData = new FormData();
      formData.append('image', compressedFile, imageName);

      const token = sessionStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.imageUrl;
      return imageUrl;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await productoSchema.validate(formData, { abortEarly: false });
      setErrores({}); // limpiar errores si pasa la validación

      const imageUrl = await handleImageUpload();
      if (!imageUrl) {
        alert("Por favor sube una imagen.");
        return;
      }

      const productData = {
        ...formData,
        imagen: imageUrl,
      };

      const token = sessionStorage.getItem('token');
      await axios.post('http://localhost:8080/api/producto', productData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      alert('Producto registrado con éxito');
      setShowModal(false);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        unidadMedida: '',
        stock: '',
        idCategoria: '',
        idSubcategoria: '',
      });
      fetchProductos();
    } catch (error) {
      if (error.inner) {
        const nuevosErrores = {};
        error.inner.forEach(e => {
          nuevosErrores[e.path] = e.message;
        });
        setErrores(nuevosErrores);
      } else {
        alert(error.message);
      }
    }
  };

  const validateField = async (fieldName, value) => {
    try {
      await productoSchema.validateAt(fieldName, { ...formData, [fieldName]: value });
      setErrores((prev) => ({ ...prev, [fieldName]: undefined }));
    } catch (error) {
      setErrores((prev) => ({ ...prev, [fieldName]: error.message }));
    }
  };



  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      await categoriaSchema.validate({ newCategoryName }, { abortEarly: false });
      setCategoryErrors({}); // limpio errores

      const token = getToken();
      const response = await axios.post(
        'http://localhost:8080/api/categoria',
        { nombre: newCategoryName },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );

      const nuevaCategoria = response.data.body.data;
      setCategorias([...categorias, nuevaCategoria]);
      setSelectedCategoria(nuevaCategoria.id);
      setNewCategoryName('');
    } catch (error) {
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
      setCategoryErrors(errors);
    }
  };


  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();

    try {
      await subcategoriaSchema.validate({ selectedCategoria, newSubcategoryName }, { abortEarly: false });
      setSubcategoryErrors({});

      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/categoria/${selectedCategoria}/subcategoria`,
        { nombre: newSubcategoryName },
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );

      const subResponse = await axios.get(
        `http://localhost:8080/api/categoria/${selectedCategoria}/subcategorias`,
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );

      setSubcategorias(subResponse.data || []);
      setNewSubcategoryName('');
      alert("Subcategoría agregada correctamente!");
    } catch (error) {
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
      setSubcategoryErrors(errors);
    }
  };



  // Filtrar productos por nombre
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginación
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProductos = filteredProductos.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            {currentProductos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.unidadMedida}</td>
                <td>{producto.stock}</td>
                <td>
                  <span className={`badge ${producto.estado ? 'bg-success' : 'bg-secondary'}`}>
                    {producto.estado ? 'Activo' : 'Inactivo'}
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
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4">
                <h2 className="fw-medium text-center w-100">Registro de Producto</h2>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                <form onSubmit={handleSubmit} noValidate>
                  {[
                    { name: "nombre", placeholder: "Nombre", type: "text" },
                    { name: "descripcion", placeholder: "Descripción", type: "textarea" },
                    { name: "precio", placeholder: "Precio", type: "number" },
                    { name: "cantidad", placeholder: "Cantidad", type: "number" },
                    { name: "stock", placeholder: "Stock", type: "number" },
                  ].map(({ name, placeholder, type }) => (
                    <div className="mb-3" key={name}>
                      {type === "textarea" ? (
                        <textarea
                          name={name}
                          placeholder={placeholder}
                          className={`form-control ${errores[name] ? "is-invalid" : ""}`}
                          value={formData[name]}
                          onChange={(e) => {
                            handleInputChange(e);
                            validateField(name, e.target.value);
                          }}
                          onBlur={(e) => validateField(name, e.target.value)}
                        />
                      ) : (
                        <input
                          type={type}
                          name={name}
                          placeholder={placeholder}
                          className={`form-control ${errores[name] ? "is-invalid" : ""}`}
                          value={formData[name]}
                          onChange={(e) => {
                            handleInputChange(e);
                            validateField(name, e.target.value);
                          }}
                          onBlur={(e) => validateField(name, e.target.value)}
                        />
                      )}
                      {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
                    </div>
                  ))}

                  {/* Unidad de medida */}
                  <div className="mb-3">
                    <select
                      name="unidadMedida"
                      className={`form-control ${errores.unidadMedida ? "is-invalid" : ""}`}
                      value={formData.unidadMedida}
                      onChange={(e) => {
                        handleInputChange(e);
                        validateField("unidadMedida", e.target.value);
                      }}
                      onBlur={(e) => validateField("unidadMedida", e.target.value)}
                    >
                      <option value="">Seleccione unidad</option>
                      <option value="mg">miligramo (mg)</option>
                      <option value="g">Gramo (g)</option>
                      <option value="ml">mililitros (ml)</option>
                    </select>
                    {errores.unidadMedida && <div className="invalid-feedback">{errores.unidadMedida}</div>}
                  </div>

                  {/* Categoría */}
                  <div className="mb-3">
                    <select
                      name="idCategoria"
                      className={`form-control ${errores.idCategoria ? "is-invalid" : ""}`}
                      value={formData.idCategoria}
                      onChange={(e) => {
                        handleCategoriaChange(e);
                        validateField("idCategoria", e.target.value);
                      }}
                      onBlur={(e) => validateField("idCategoria", e.target.value)}
                    >
                      <option value="">Seleccione una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    {errores.idCategoria && <div className="invalid-feedback">{errores.idCategoria}</div>}
                  </div>

                  {/* Subcategoría */}
                  <div className="mb-3">
                    <select
                      name="idSubcategoria"
                      className={`form-control ${errores.idSubcategoria ? "is-invalid" : ""}`}
                      value={formData.idSubcategoria}
                      onChange={(e) => {
                        handleInputChange(e);
                        validateField("idSubcategoria", e.target.value);
                      }}
                      onBlur={(e) => validateField("idSubcategoria", e.target.value)}
                      disabled={!selectedCategoria}
                    >
                      <option value="">Seleccione una subcategoría</option>
                      {subcategorias.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.nombre}
                        </option>
                      ))}
                    </select>
                    {errores.idSubcategoria && (
                      <div className="invalid-feedback">{errores.idSubcategoria}</div>
                    )}
                  </div>

                  {/* Imagen */}
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
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => setShowModal(false)}
                    >
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
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                      className={`form-control ${categoryErrors.newCategoryName ? 'is-invalid' : ''}`}
                      placeholder="Nombre de nueva categoría"
                      value={newCategoryName}
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        setCategoryErrors({}); // limpiar en tiempo real
                      }}
                    />
                    {categoryErrors.newCategoryName && (
                      <div className="invalid-feedback">{categoryErrors.newCategoryName}</div>
                    )}

                    <button className="btn btn-primary mt-2" onClick={handleCategorySubmit}>
                      Crear Categoría
                    </button>
                  </div>

                  <hr />

                  {/* Agregar subcategoría a categoría existente */}
                  <div className="mb-3">
                    <h5>Selecciona una categoría para agregar subcategorías</h5>
                    <select
                      className={`form-select ${subcategoryErrors.selectedCategoria ? 'is-invalid' : ''}`}
                      value={selectedCategoria}
                      onChange={(e) => {
                        setSelectedCategoria(e.target.value);
                        setSubcategoryErrors({ ...subcategoryErrors, selectedCategoria: '' });
                        // Cargar subcategorías al seleccionar una categoría
                        const token = getToken();
                        axios
                          .get(`http://localhost:8080/api/categoria/${e.target.value}/subcategorias`, {
                            headers: { Authorization: token ? `Bearer ${token}` : '' },
                          })
                          .then((res) => setSubcategorias(res.data || []))
                          .catch((err) => console.error(err));
                      }}
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    {subcategoryErrors.selectedCategoria && (
                      <div className="invalid-feedback">{subcategoryErrors.selectedCategoria}</div>
                    )}
                  </div>

                  {selectedCategoria && (
                    <>
                      {/* Mostrar subcategorías actuales */}
                      <div className="mb-3">
                        <h6 className="fw-bold">Subcategorías actuales:</h6>
                        <ul>
                          {subcategorias.length > 0 ? (
                            subcategorias.map((sub) => (
                              <li key={sub.id}>{sub.nombre}</li>
                            ))
                          ) : (
                            <li>No hay subcategorías</li>
                          )}
                        </ul>
                      </div>

                      {/* Agregar nueva subcategoría */}
                      <div className="mb-3">
                        {/* Input subcategoría */}
                        <input
                          type="text"
                          className={`form-control ${subcategoryErrors.newSubcategoryName ? 'is-invalid' : ''}`}
                          placeholder="Nombre nueva subcategoría"
                          value={newSubcategoryName}
                          onChange={(e) => {
                            setNewSubcategoryName(e.target.value);
                            setSubcategoryErrors({ ...subcategoryErrors, newSubcategoryName: '' });
                          }}
                        />
                        {subcategoryErrors.newSubcategoryName && (
                          <div className="invalid-feedback">{subcategoryErrors.newSubcategoryName}</div>
                        )}

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
  );
};

export default GestionProductos;

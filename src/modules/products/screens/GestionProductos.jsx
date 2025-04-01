import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import '../../../assets/bootstrap/bootstrap.min.css';
import './GestionProductos.css';
import Sidebar from '../../../kernel/components/Sidebar';
import axios from 'axios';

const GestionProductos = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    unidadMedida: '',
    stock: '',
    idCategoria: '', // Asegúrate de que sea una cadena, no un arreglo
    idSubcategoria: '', // Lo mismo aquí
  });

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
    fetchProductos();
  }, []);

  // Este es el handle que se activa al seleccionar una categoría
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
        console.log('Respuesta de subcategorías:', response.data);
        setSubcategorias(response.data || []);
      })
      .catch(error => console.error('Error al obtener subcategorías:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Construcción del objeto con solo los IDs de categoría y subcategoría
    const formattedFormData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: formData.precio,
      cantidad: formData.cantidad,
      unidadMedida: formData.unidadMedida,
      stock: formData.stock,
      idCategoria: formData.idCategoria,  // Solo el ID
      idSubcategoria: formData.idSubcategoria // Solo el ID
    };
  
    const token = getToken();
  
    try {
      const response = await axios.post('http://localhost:8080/api/producto', formattedFormData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
      });
  
      alert('Producto registrado con éxito');
  
      // Resetear el formulario
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
  
      setShowModal(false);
  
      // Recargar lista de productos
      const productosResponse = await axios.get('http://localhost:8080/api/producto', {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
  
      setProductos(productosResponse.data?.body?.data || []);
  
    } catch (error) {
      console.error('Error al registrar producto:', error.response?.data || error.message);
      alert(error.response?.data?.mensaje || 'Error al registrar el producto.');
    }
  };
  


  return (
    <div className="app-container d-flex w-100 min-vh-100">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container p-4 ms-auto w-100">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión De Productos</h1>
          <div className="usuarios-divider"></div>
        </div>

        <div className="usuarios-actions d-flex justify-content-end mb-3">
          <button className="btn-registrar btn btn-primary" onClick={() => setShowModal(true)}>
            Registrar producto
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
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.unidadMedida}</td>
                <td>{producto.stock}</td>
                <td>
                  <span className={`badge ${producto.estado ? 'bg-success' : 'bg-secondary'}`}>{producto.estado ? 'Activo' : 'Inactivo'}</span>
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

        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4">
                <h2 className="fw-medium text-center w-100">Registro de Producto</h2>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                <form onSubmit={handleSubmit} noValidate>
                  {/* Campos del formulario */}
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
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
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
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
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
                      {subcategorias.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                   
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
      </div>
    </div>
  );
};

export default GestionProductos;

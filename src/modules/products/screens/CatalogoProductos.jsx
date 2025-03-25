import React, { useState } from 'react';
import Sidebar from '../../../kernel/components/Sidebar';
import DetallesProducto from './DetallesProducto';
import RegistrarProducto from './RegistrarProducto';
import '../../../assets/bootstrap/bootstrap.min.css';
import '../screens/CatalogoProductos.css';

const CatalogoProductos = () => {
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: 'Product 1',
      descripcion: 'Short Description of the item and its use',
      contenido: '500 ml',
      categoria: 'Cuidado de la piel',
      tipoContenedor: 'Botella',
      precio: 19.99,
      stock: 10,
      activo: true,
      imagen: 'https://placehold.co/200x200'
    },
    {
      // Producto sin stock
      id: 2,
      nombre: 'Product 2',
      descripcion: 'Short Description of the item and its use',
      contenido: '250 ml',
      categoria: 'Cabello',
      tipoContenedor: 'Tubo',
      precio: 15.99,
      stock: 0,
      activo: false,
      imagen: 'https://placehold.co/200x200'
    }
  ]);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalRegistrar, setModalRegistrar] = useState(false);

  const verDetalles = (producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarDetalles = () => {
    setProductoSeleccionado(null);
  };

  const abrirRegistro = () => {
    setModalRegistrar(true);
  };

  const cerrarRegistro = () => {
    setModalRegistrar(false);
  };

  return (
    <div className="app-wrapper d-flex">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="content-wrapper">
        <div className="container-fluid py-4 px-4">
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <h1 className="text-zaziderma">Catálogo de productos</h1>
              <button className="btn btn-zaziderma" onClick={abrirRegistro}>Registrar Producto</button>
            </div>
            <hr className="border-zaziderma" />
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {productos.map((producto) => (
              <div className="col" key={producto.id}>
                <div className="card h-100 shadow-sm transition-hover">
                  <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <img src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} className="card-img-top p-3" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{producto.nombre}</h5>
                    <p className="card-text text-muted small">{producto.descripcion}</p>
                    <p className="card-text fw-bold fs-5">${producto.precio.toFixed(2)}</p>
                    
                    <div className="mb-3">
                      <span className={`badge ${producto.activo && producto.stock > 0 ? 'bg-zaziderma' : 'bg-secondary'}`} style={{ borderRadius: '20px', padding: '5px 15px' }}>
                        {producto.activo && producto.stock > 0 ? 'Disponible' : 'Agotado'}
                      </span>
                    </div>

                    <button className="btn btn-zaziderma mt-auto w-100" onClick={() => verDetalles(producto)}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {productoSeleccionado && (
        <DetallesProducto producto={productoSeleccionado} onClose={cerrarDetalles} />
      )}
      
      {modalRegistrar && (
        <RegistrarProducto onClose={cerrarRegistro} onSubmit={(data) => console.log('Nuevo producto:', data)} />
      )}
    </div>
  );
};

export default CatalogoProductos;
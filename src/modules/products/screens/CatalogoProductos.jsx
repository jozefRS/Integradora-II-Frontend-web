import React, { useState, useEffect } from 'react';
import Sidebar from '../../../kernel/components/Sidebar';
// Importamos primero Bootstrap y luego nuestro CSS personalizado
import '../../../assets/bootstrap/bootstrap.min.css';
import '../screens/CatalogoProductos.css'; // Asegúrate de importar después de Bootstrap para sobrescribir estilos

const CatalogoProductos = () => {
  const [productos, setProductos] = useState([
    {
      id: 1,
      nombre: 'Product 1',
      descripcion: 'Short Description of the item and its use',
      precio: 19.99,
      activo: false,
      imagen: '/placeholder.svg?height=200&width=200'
    },
    {
      id: 2,
      nombre: 'Product 2',
      descripcion: 'Short Description of the item and its use',
      precio: 19.99,
      activo: true,
      imagen: '/placeholder.svg?height=200&width=200'
    },
    {
      id: 3,
      nombre: 'Product 3',
      descripcion: 'Short Description of the item and its use',
      precio: 19.99,
      activo: false,
      imagen: '/placeholder.svg?height=200&width=200'
    },
    {
      id: 4,
      nombre: 'Product 4',
      descripcion: 'Short Description of the item and its use',
      precio: 19.99,
      activo: false,
      imagen: '/placeholder.svg?height=200&width=200'
    },
    {
      id: 5,
      nombre: 'Product 5',
      descripcion: 'Short Description of the item and its use',
      precio: 19.99,
      activo: true,
      imagen: '/placeholder.svg?height=200&width=200'
    },
    {
      id: 6,
      nombre: 'Product 6',
      descripcion: 'Short Description of the item and its use',
      precio: 19.99,
      activo: true,
      imagen: '/placeholder.svg?height=200&width=200'
    }
  ]);

  useEffect(() => {
    // Importamos el JS de Bootstrap dinámicamente
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = '../../../assets/bootstrap/bootstrap.bundle.min.js';
    bootstrapScript.async = true;
    document.body.appendChild(bootstrapScript);

    // Limpieza al desmontar el componente
    return () => {
      if (document.body.contains(bootstrapScript)) {
        document.body.removeChild(bootstrapScript);
      }
    };
  }, []);

  return (
    <div className="app-wrapper d-flex">
      <Sidebar 
        userName="Usuario" 
        userEmail="usuario@example.com" 
      />
      {/* Contenedor principal con scroll */}
      <div className="content-wrapper">
        <div className="container-fluid py-4 px-4">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="text-center text-zaziderma">Catálogo de productos</h1>
              <hr className="border-zaziderma" />
            </div>
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
                      <span className={`badge ${producto.activo ? 'bg-zaziderma' : 'bg-secondary'}`} style={{ 
                        borderRadius: '20px',
                        padding: '5px 15px'
                      }}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <button className="btn btn-zaziderma mt-auto w-100">Ver detalles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogoProductos;
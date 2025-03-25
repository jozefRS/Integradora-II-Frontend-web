import React, { useState, useEffect } from 'react';
import Sidebar from '../../../kernel/components/Sidebar';
import axios from 'axios';
import '../../../assets/bootstrap/bootstrap.min.css';
import '../screens/CatalogoProductos.css'; // Asegúrate de importar después de Bootstrap para sobrescribir estilos

const CatalogoProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Función para obtener los productos desde el backend
    const fetchProductos = async () => {
      const token = sessionStorage.getItem('token'); // Obtener el token de sessionStorage

      try {
        const response = await axios.get('http://localhost:8080/api/producto', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '', // Añadir el token si está disponible
          }
        });

        console.log("Datos recibidos:", response.data); // Para depuración

        // Extraer el array de productos correctamente
        const productosData = response.data?.body?.data || []; // Asegúrate de acceder a la propiedad correcta
        setProductos(productosData); // Actualiza el estado con los productos
      } catch (error) {
        console.error('Error al obtener los productos', error);
        setProductos([]); // Si ocurre un error, asigna un array vacío
      }
    };

    fetchProductos(); // Llama a la función para obtener los productos

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
  }, []); // El array vacío asegura que la solicitud se haga solo una vez al montar el componente

  return (
    <div className="app-wrapper d-flex">
      <Sidebar 
        userName="Usuario" 
        userEmail="usuario@example.com" 
      />
      <div className="content-wrapper">
        <div className="container-fluid py-4 px-4">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="text-center text-zaziderma">Catálogo de productos</h1>
              <hr className="border-zaziderma" />
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <div className="col" key={producto.id}>
                  <div className="card h-100 shadow-sm transition-hover">
                    <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                      <img 
                        src={producto.imagen || "/placeholder.svg"} 
                        alt={producto.nombre} 
                        className="card-img-top p-3" 
                        style={{ maxHeight: '100%', objectFit: 'contain' }} 
                      />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{producto.nombre}</h5>
                      <p className="card-text text-muted small">{producto.descripcion}</p>
                      <p className="card-text fw-bold fs-5">${producto.precio.toFixed(2)}</p>
                      <div className="mb-3">
                        <span className={`badge ${producto.estado ? 'bg-zaziderma' : 'bg-secondary'}`} style={{ 
                          borderRadius: '20px',
                          padding: '5px 15px'
                        }}>
                          {producto.estado ? 'Activo' : 'Inactivo'}
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
        </div>
      </div>
    </div>
  );
};

export default CatalogoProductos;

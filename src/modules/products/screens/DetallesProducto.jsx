import React from 'react';
import './DetallesProducto.css';

const DetallesProducto = ({ producto, onClose }) => {
  if (!producto) return null;

  return (
    <div className="detalle-producto-container">
      <div className="detalle-producto-card">
        <button className="detalle-cerrar" onClick={onClose}>&times;</button>
        <div className="detalle-imagen-container">
          <img src={producto.imagen || '/placeholder.svg'} alt={producto.nombre} className="detalle-imagen" />
        </div>
        <div className="detalle-info">
          <h2 className="detalle-nombre">{producto.nombre}</h2>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          <hr />
          <p><strong>Contenido:</strong> {producto.contenido}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Tipo de contenedor:</strong> {producto.tipoContenedor}</p>
          <hr />
          <p className="detalle-precio">${producto.precio.toFixed(2)}</p>
          <span className="detalle-stock">{producto.stock} unidades disponibles</span>
        </div>
      </div>
    </div>
  );
};

export default DetallesProducto;

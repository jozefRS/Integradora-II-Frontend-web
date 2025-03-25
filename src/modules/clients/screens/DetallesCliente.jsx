import React from 'react';
import './DetallesCliente.css';

const DetallesCliente = ({ cliente, onClose }) => {
  if (!cliente) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Detalles del Cliente</h2>
        <div className="cliente-info">
          <h3 className="cliente-nombre">{cliente.nombre}</h3>
          <p className="cliente-subtitulo">Detalles de contacto y dirección del cliente</p>
          <hr />
          <p><strong>Correo:</strong> {cliente.email}</p>
          <p><strong>Teléfono principal:</strong> {cliente.telefonos[0] || 'No disponible'}</p>
          {cliente.telefonos.slice(1).map((telefono, index) => (
            <p key={index}><strong>Teléfono adicional {index + 1}:</strong> {telefono || 'No disponible'}</p>
          ))}
          <hr />
          <h4 className="seccion-titulo">Dirección</h4>
          <p><strong>Calle:</strong> {cliente.calle}</p>
          <p><strong>Número:</strong> {cliente.numero}</p>
          <p><strong>Colonia:</strong> {cliente.colonia}</p>
          <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
          <p><strong>Estado:</strong> {cliente.estado}</p>
          <p><strong>Código Postal:</strong> {cliente.codigoPostal}</p>
          <hr />
          <button className={`status-button ${cliente.activo ? 'activo' : 'inactivo'}`}>
            {cliente.activo ? 'Cliente Activo' : 'Cliente Inactivo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetallesCliente;

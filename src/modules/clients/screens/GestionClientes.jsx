import React, { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import '../../../assets/bootstrap/bootstrap.min.css';
import './GestionClientes.css';
import Sidebar from '../../../kernel/components/Sidebar';
import RegistrarCliente from './RegistrarCliente';
import DetallesCliente from './DetallesCliente';

const GestionClientes = () => {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Karol Jozef',
      email: 'karoljozef@gmail.com',
      telefonos: ['+52 55 1234 5678', '+52 55 8765 4321', '+52 55 2468 1357'],
      calle: 'Calle Falsa',
      numero: '123',
      colonia: 'Centro',
      ciudad: 'Ciudad de México',
      estado: 'CDMX',
      codigoPostal: '12345',
      activo: true,
      fechaAlineacion: '23/08/2023'
    },
    
  ]);

  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [modalVermas, setModalVermas] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const abrirRegistro = () => setModalRegistrar(true);
  const cerrarRegistro = () => setModalRegistrar(false);

  const abrirVermas = (cliente) => {
    setClienteSeleccionado(cliente);
    setModalVermas(true);
  };

  const cerrarVermas = () => setModalVermas(false);

  return (
    <div className="app-container d-flex">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container p-4 ms-auto">
        <div className="usuarios-header mb-4 d-flex justify-content-between align-items-center">
          <h1 className="usuarios-title fw-medium fs-1 mb-2">Gestión de clientes</h1>
          <button 
            className="btn btn-primary btn-registrar" 
            onClick={abrirRegistro}
          >
            Registrar
          </button>
        </div>
        <div className="usuarios-divider"></div>

        <div className="usuarios-table-container table-responsive">
          <table className="usuarios-table table table-hover shadow-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Contacto</th>
                <th>Fecha de alineación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefonos[0]}</td>
                  <td>{usuario.fechaAlineacion}</td>
                  <td>
                    <button className="btn btn-sm btn-light me-2">
                      <Edit size={18} />
                    </button>
                    <button className="btn btn-sm btn-light me-2" onClick={() => abrirVermas(usuario)}>
                      <Eye size={18} />
                    </button>
                    <button className="btn btn-sm btn-light">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Registro */}
        {modalRegistrar && (
          <RegistrarCliente 
            onClose={cerrarRegistro} 
            onSubmit={(data) => console.log('Nuevo cliente:', data)} 
          />
        )}

        {/* Modal de Ver detalles */}
        {modalVermas && (
          <DetallesCliente 
            cliente={clienteSeleccionado} 
            onClose={cerrarVermas} 
          />
        )}
      </div>
    </div>
  );
};

export default GestionClientes;

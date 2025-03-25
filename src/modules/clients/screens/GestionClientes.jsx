import React, { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import '../../../assets/bootstrap/bootstrap.min.css';
import './GestionClientes.css';
import Sidebar from '../../../kernel/components/Sidebar';
import RegistrarCliente from './RegistrarCliente';

const GestionClientes = () => {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Karol Jozef',
      email: 'karoljozef@gmail.com',
      contacto: '+52 55 1234 5678',
      fechaAlineacion: '23/08/2023'
    },
    {
      id: 2,
      nombre: 'Uziel Jahred',
      email: 'uzieljahred@gmail.com',
      contacto: '+52 33 9876 5432',
      fechaAlineacion: '17/11/2023'
    },
    {
      id: 3,
      nombre: 'Derick Axel',
      email: 'derickaxel@gmail.com',
      contacto: '+52 81 2345 6789',
      fechaAlineacion: '06/01/2025'
    }
  ]);

  // Estado para manejar el modal de registro
  const [modalRegistrar, setModalRegistrar] = useState(false);

  const abrirRegistro = () => {
    setModalRegistrar(true);
  };

  const cerrarRegistro = () => {
    setModalRegistrar(false);
  };

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
                  <td>{usuario.contacto}</td>
                  <td>{usuario.fechaAlineacion}</td>
                  <td>
                    <button className="btn btn-sm btn-light me-2">
                      <Edit size={18} />
                    </button>
                    <button className="btn btn-sm btn-light me-2">
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
          <RegistrarCliente onClose={cerrarRegistro} onSubmit={(data) => console.log('Nuevo cliente:', data)} />
        )}
      </div>
    </div>
  );
};

export default GestionClientes;

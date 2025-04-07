<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import '../../../assets/bootstrap/bootstrap.min.css';
import './GestionClientes.css';
import Sidebar from '../../../kernel/components/Sidebar';
import axios from 'axios';
import RegistrarCliente from '../screens/RegistrarCliente';

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/cliente', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        setClientes(response.data?.body?.data || []);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        setClientes([]);
      }
    };
    fetchClientes();
  }, []);

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app-container d-flex w-100 min-vh-100">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container p-4 ms-auto w-100">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión De Clientes</h1>
          <div className="usuarios-divider"></div>
        </div>

        <div className="clientes-actions d-flex justify-content-end mb-3">
          <button className="btn-registrar btn btn-primary" onClick={() => setShowModal(true)}>
            Registrar
          </button>
        </div>

        <div className="clientes-table-container table-responsive">
          <table className="clientes-table table table-hover shadow-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfonos</th>
                <th>Dirección</th>
=======
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
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{`${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`}</td>
                  <td>{cliente.correo}</td>
                  <td>{Array.isArray(cliente.telefono) ? cliente.telefono.join(', ') : 'Sin teléfono'}</td>
                  <td>
                    {cliente.direccion
                      ? `${cliente.direccion.calle || ''}, ${cliente.direccion.colonia || ''}, ${cliente.direccion.municipio || ''}`
                      : 'Sin dirección'}
                  </td>
                  <td>
                    <button className="btn-editar btn btn-sm btn-light">
                      <Edit size={18} />
                    </button>
=======
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
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
      </div>

      {/* Modal de Registro */}
      {showModal && (
        <RegistrarCliente
        onClose={() => setShowModal(false)}
        onSubmit={async (data) => {
          try {
            const token = sessionStorage.getItem('token');
      
            const clienteAdaptado = {
              nombre: data.nombre,
              apellidoPaterno: data.apellidoPaterno,
              apellidoMaterno: data.apellidoMaterno,
              correo: data.email,
              telefono: data.telefonos,
              direccion: {
                calle: data.calle,
                numero: data.numero,
                colonia: data.colonia,
                ciudad: data.ciudad,
                estado: data.estado,
                codigoPostal: data.codigoPostal
              }
            };
      
            const response = await axios.post(
              'http://localhost:8080/api/cliente',
              clienteAdaptado,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: token ? `Bearer ${token}` : '',
                },
              }
            );
      
            const nuevoCliente = response.data?.body?.data;
      
            if (nuevoCliente) {
              setClientes(prev => [
                ...prev,
                {
                  ...nuevoCliente,
                  telefono: Array.isArray(nuevoCliente.telefono) ? nuevoCliente.telefono : [],
                  direccion: nuevoCliente.direccion || {}
                }
              ]);
            }
      
            setShowModal(false);
          } catch (error) {
            console.error('Error al registrar el cliente:', error);
          }
        }}
      />
      )}
=======

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
>>>>>>> b2303450489b61abe661d58b7de950b24129fa51
    </div>
  );
};

export default GestionClientes;

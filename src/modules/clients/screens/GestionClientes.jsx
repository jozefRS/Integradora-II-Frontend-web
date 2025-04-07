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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
};

export default GestionClientes;

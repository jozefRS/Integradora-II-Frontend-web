import React, { useState } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import '../../../assets/bootstrap/bootstrap.min.css';
import './GestionProductos.css';
import Sidebar from '../../../kernel/components/Sidebar';

const GestionUsuarios = () => {
  const [usuarios] = useState([
    {
      id: "67d74d6b8225e66c51eb7dce",
      nombre: "Crema corporal",
      precio: 250.00,
      cantidad: 100.0,
      unidadMedida: "ml",
      stock: 35,
      descripcion: "Crema facial hidratante para todo tipo de piel",
      imagen: "url_de_imagen",
      estado: true,
      idCategoria: [
          "Belleza"
      ],
      idSubcategoria: [
          "Skincare"
      ]
    },
  ]);

  return (
    <div className="app-container d-flex w-100 min-vh-100">
      <Sidebar userName="Usuario" userEmail="usuario@example.com" />
      <div className="usuarios-container p-4 ms-auto w-100">
        <div className="usuarios-header mb-4">
          <h1 className="usuarios-title text-center fw-medium fs-1 mb-2">Gestión de Productos</h1>
          <div className="usuarios-divider"></div>
        </div>

        <div className="usuarios-table-container table-responsive">
          <table className="usuarios-table table table-hover shadow-sm">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.idCategoria}</td>
                  <td>
                    <div className={`usuario-estado badge ${usuario.stock ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                      {usuario.stock}
                    </div>
                  </td>
                  <td>
                    <div className={`usuario-estado badge ${usuario.activo ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                      {usuario.activo ? 'Disponible' : 'Agotado'}
                    </div>
                  </td>
                  <td>
                    <button className="btn-editar btn btn-sm btn-light">
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
      </div>
    </div>
  );
};

export default GestionUsuarios;

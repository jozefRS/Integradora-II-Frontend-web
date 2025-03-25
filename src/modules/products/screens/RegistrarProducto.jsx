import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './RegistrarProducto.css';

const schema = yup.object().shape({
  nombre: yup.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'El nombre no puede superar los 50 caracteres').required('El nombre es obligatorio'),
  descripcion: yup.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(200, 'La descripción no puede superar los 200 caracteres').required('La descripción es obligatoria'),
  categoria: yup.string().required('La categoría es obligatoria'),
  presentacion: yup.string().min(3, 'La presentación debe tener al menos 3 caracteres').max(100, 'La presentación no puede superar los 100 caracteres').required('La presentación es obligatoria'),
  contenido: yup.string().required('El contenido es obligatorio'),
  cantidad: yup.number().min(1, 'Debe haber al menos 1 unidad').max(999, 'No puede superar 999 unidades').required('La cantidad es obligatoria'),
  precio: yup.number().positive('El precio debe ser mayor a 0').required('El precio es obligatorio'),
  imagen: yup.mixed().test('fileSize', 'El archivo debe ser menor a 2 MB', value => !value || (value && value.size <= 2 * 1024 * 1024))
});

const RegistrarProducto = ({ onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handleSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Registro de producto</h2>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="modal-form">
          <div className="form-columns">
            {/* Columna izquierda */}
            <div className="form-left">
              <div className="form-group">
                <label>Nombre</label>
                <input {...register("nombre")} placeholder="Nombre del producto" />
                <p className="error-message">{errors.nombre?.message}</p>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input {...register("descripcion")} placeholder="Breve descripción del producto" />
                <p className="error-message">{errors.descripcion?.message}</p>
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select {...register("categoria")}>
                  <option value="">Seleccione una categoría</option>
                  <option value="cuidado">Cuidado de la piel</option>
                  <option value="cabello">Cabello</option>
                </select>
                <p className="error-message">{errors.categoria?.message}</p>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="form-right">
              <div className="form-group">
                <label>Presentación</label>
                <input {...register("presentacion")} placeholder="Presentación del producto" />
                <p className="error-message">{errors.presentacion?.message}</p>
              </div>
              <div className="form-group">
                <label>Contenido</label>
                <input {...register("contenido")} placeholder="Cantidad por unidad" />
                <p className="error-message">{errors.contenido?.message}</p>
              </div>
              <div className="form-group">
                <label>Imagen</label>
                <input type="file" {...register("imagen")} accept="image/*" />
                <p className="error-message">{errors.imagen?.message}</p>
              </div>
              <div className="form-group">
                <label>Cantidad</label>
                <input type="number" {...register("cantidad")} placeholder="Cantidad" />
                <p className="error-message">{errors.cantidad?.message}</p>
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" {...register("precio")} placeholder="$ 0.0" step="0.01" />
                <p className="error-message">{errors.precio?.message}</p>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Registrar</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarProducto;

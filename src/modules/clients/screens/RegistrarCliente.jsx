import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import './RegistrarCliente.css';

import {
  nombreValidation,
  apellidoPaternoValidation,
  apellidoMaternoValidation,
  emailValidation,
  calleValidation,
  numeroDireccionValidation,
  coloniaValidation,
  ciudadValidation,
  estadoValidation,
  codigoPostalValidation,
  telefonosArrayValidation,
} from '../../../utils/validationForm';


const schema = Yup.object().shape({
  nombre: nombreValidation,
  apellidoPaterno: apellidoPaternoValidation,
  apellidoMaterno: apellidoMaternoValidation,
  email: emailValidation,
  telefonos: telefonosArrayValidation,
  calle: calleValidation,
  numero: numeroDireccionValidation,
  colonia: coloniaValidation,
  ciudad: ciudadValidation,
  estado: estadoValidation,
  codigoPostal: codigoPostalValidation,
});

const RegistrarCliente = ({ onClose, onSubmit }) => {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      telefonos: ['']
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'telefonos'
  });

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Registro de Cliente</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">

          {/* Nombres */}
          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Nombre" {...register('nombre')} />
              <p className="error-message">{errors.nombre?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Apellido Paterno" {...register('apellidoPaterno')} />
              <p className="error-message">{errors.apellidoPaterno?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Apellido Materno" {...register('apellidoMaterno')} />
              <p className="error-message">{errors.apellidoMaterno?.message}</p>
            </div>
          </div>

          {/* Email */}
          <div className="form-row">
            <div className="form-group">
              <input type="email" placeholder="Correo electrónico" {...register('email')} />
              <p className="error-message">{errors.email?.message}</p>
            </div>
          </div>

          {/* Teléfonos */}
          <div className="form-row">
            {fields.map((item, index) => {
              const error = errors.telefonos?.[index]?.message;
              const value = watch(`telefonos.${index}`);

              return (
                <div className="form-group" key={item.id}>
                  <input
                    type="text"
                    placeholder={`Teléfono ${index + 1}`}
                    {...register(`telefonos.${index}`)}
                    className={error ? 'input-error' : ''}
                  />
                  <p className="error-message">{error}</p>

                  {fields.length > 1 && (
                    <button type="button" className="btn-remove" onClick={() => remove(index)}>
                      Eliminar
                    </button>
                  )}
                </div>
              );
            })}

            {/* Mostrar errores del array */}
            {errors.telefonos && (
              <p className="error-message">
                {errors.telefonos.message || errors.telefonos.root?.message}
              </p>
            )}

            <button type="button" className="btn btn-secondary" onClick={() => append('')}>
              Agregar Teléfono
            </button>
          </div>


          {/* Dirección */}
          <h6 className="mt-4">Dirección</h6>
          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Calle" {...register('calle')} />
              <p className="error-message">{errors.calle?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Número" {...register('numero')} />
              <p className="error-message">{errors.numero?.message}</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Colonia" {...register('colonia')} />
              <p className="error-message">{errors.colonia?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Ciudad" {...register('ciudad')} />
              <p className="error-message">{errors.ciudad?.message}</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Estado" {...register('estado')} />
              <p className="error-message">{errors.estado?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Código Postal" {...register('codigoPostal')} />
              <p className="error-message">{errors.codigoPostal?.message}</p>
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

export default RegistrarCliente;

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './RegistrarCliente.css';

const schema = yup.object().shape({
  nombreCompleto: yup.string().required('El nombre es obligatorio'),
  calle: yup.string().required('La calle es obligatoria'),
  email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
  numeroDomicilio: yup.string().required('El número de domicilio es obligatorio'),
  telefonos: yup.array()
    .of(yup.string().matches(/^\+?[0-9 ]+$/, 'Número inválido').required('El teléfono es obligatorio'))
    .min(1, 'Debe haber al menos un número de teléfono'),
  ciudad: yup.string().required('La ciudad es obligatoria'),
  estado: yup.string().required('El estado es obligatorio'),
  codigoPostal: yup.string().matches(/^\d{5}$/, 'Código postal inválido').required('El código postal es obligatorio')
});

const RegistrarCliente = ({ onClose, onSubmit }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
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
          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Nombre Completo" {...register('nombreCompleto')} />
              <p className="error-message">{errors.nombreCompleto?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Calle" {...register('calle')} />
              <p className="error-message">{errors.calle?.message}</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input type="email" placeholder="Email" {...register('email')} />
              <p className="error-message">{errors.email?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Número de domicilio" {...register('numeroDomicilio')} />
              <p className="error-message">{errors.numeroDomicilio?.message}</p>
            </div>
          </div>

          {/* Sección de Teléfonos */}
          <div className="form-row">
            {fields.map((item, index) => (
              <div className="form-group" key={item.id}>
                <input type="text" placeholder={`Teléfono ${index + 1}`} {...register(`telefonos.${index}`)} />
                <p className="error-message">{errors.telefonos?.[index]?.message}</p>
                {fields.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => remove(index)}>Eliminar</button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={() => append('')}>Agregar Teléfono</button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Ciudad" {...register('ciudad')} />
              <p className="error-message">{errors.ciudad?.message}</p>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Estado" {...register('estado')} />
              <p className="error-message">{errors.estado?.message}</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Código postal" {...register('codigoPostal')} />
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

import * as Yup from 'yup';

//
// 🟢 VALIDACIONES GENÉRICAS REUTILIZABLES
//

// Campo de texto genérico
export const nombreValidation = Yup.string()
  .required('Este campo es obligatorio')
  .min(2, 'Debe tener al menos 2 caracteres');

// Email
export const emailValidation = Yup.string()
  .email('Correo inválido')
  .required('El correo es obligatorio');

// Contraseña
export const passwordValidation = Yup.string()
  .required('La contraseña es obligatoria')
  .min(6, 'Debe tener al menos 6 caracteres');

// Confirmar contraseña (requiere campo a comparar)
export const confirmPasswordValidation = (refField = 'password') =>
  Yup.string()
    .oneOf([Yup.ref(refField)], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña');

// Dirección genérica (puede personalizarse con `.label` si no hay mensaje propio)
export const direccionValidation = Yup.string().required('Este campo es obligatorio');

// Código postal (5 dígitos)
export const codigoPostalValidation = Yup.string()
  .matches(/^\d{5}$/, 'Código postal inválido')
  .required('El código postal es obligatorio');

// Teléfono individual (si no usas array)
// export const telefonoValidation = Yup.string()
//   .matches(/^\+?[0-9 ]+$/, 'Número inválido')
//   .required('El teléfono es obligatorio');

// Validación de un solo teléfono
const telefonoValidation = Yup.string()
  .transform(value => value?.replace(/\D/g, '')) // Limpiar antes de validar
  .required('El teléfono es obligatorio')
  .length(10, 'Debe tener exactamente 10 dígitos')
  .matches(/^[0-9]+$/, 'Solo se permiten números');

// Validación del arreglo completo
export const telefonosArrayValidation = Yup.array()
  .of(telefonoValidation)
  .min(1, 'Debe haber al menos un número de teléfono')
  .test(
    'no-telefonos-repetidos',
    'No se permiten números de teléfono repetidos',
    function (telefonos) {
      if (!telefonos) return true;

      const normalizados = telefonos.map(t => t?.replace(/\D/g, '')?.trim() || '');
      const set = new Set(normalizados);

      return set.size === normalizados.length || this.createError({
        message: 'No se permiten números de teléfono repetidos',
        path: 'telefonos' // 🔑 Path raíz del array
      });
    }
  );

// Checkbox (ej. aceptar términos)
export const checkboxRequired = Yup.boolean()
  .oneOf([true], 'Debes aceptar los términos');

// Select (evitar 'Seleccionar' o '')
export const selectRequired = Yup.string()
  .required('Este campo es obligatorio')
  .notOneOf(['', 'Seleccionar'], 'Selecciona una opción válida');

// Fecha mínima (no permitir fechas pasadas)
export const fechaMinima = (minDate = new Date()) =>
  Yup.date()
    .min(minDate, 'La fecha no puede ser anterior a hoy')
    .required('La fecha es obligatoria');

// Números
export const numeroEnteroPositivo = Yup.number()
  .typeError('Debe ser un número')
  .integer('Debe ser entero')
  .positive('Debe ser mayor que cero')
  .required('Este campo es obligatorio');

export const numeroDecimalPositivo = Yup.number()
  .typeError('Debe ser un número')
  .positive('Debe ser mayor que cero')
  .required('Este campo es obligatorio');


//
// 🟡 VALIDACIONES PERSONALIZADAS POR CAMPO (formulario cliente)
//

export const apellidoPaternoValidation = Yup.string()
  .required('El apellido paterno es obligatorio')
  .min(2, 'Debe tener al menos 2 caracteres');

export const apellidoMaternoValidation = Yup.string()
  .required('El apellido materno es obligatorio')
  .min(2, 'Debe tener al menos 2 caracteres');

export const calleValidation = Yup.string()
  .required('La calle es obligatoria');

export const numeroDireccionValidation = Yup.string()
  .required('El número es obligatorio');

export const coloniaValidation = Yup.string()
  .required('La colonia es obligatoria');

export const ciudadValidation = Yup.string()
  .required('La ciudad es obligatoria');

export const estadoValidation = Yup.string()
  .required('El estado es obligatorio');


// ✅ Validación para una venta (usando validaciones genéricas)
// validationForm.js
export const ventaSchema = Yup.object().shape({
  cliente: Yup.string().required('Seleccione un cliente'),
  tipoPago: Yup.string().required('Seleccione tipo de pago'),
  tipoEntrega: Yup.string().required('Seleccione tipo de entrega'),
  productos: Yup.array()
    .min(1, 'Debe agregar al menos un producto')
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        cantidad: Yup.number().min(1, 'Cantidad mínima: 1')
      })
    )
});

export const productoSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  descripcion: Yup.string().required('La descripción es obligatoria'),
  precio: Yup.number().typeError('Debe ser un número').positive('Debe ser mayor que cero').required('El precio es obligatorio'),
  cantidad: Yup.number().typeError('Debe ser un número').positive('Debe ser mayor que cero').required('La cantidad es obligatoria'),
  unidadMedida: Yup.string().required('La unidad de medida es obligatoria'),
  stock: Yup.number().typeError('Debe ser un número').min(0, 'Debe ser cero o mayor').required('El stock es obligatorio'),
  idCategoria: Yup.string().required('Selecciona una categoría'),
  idSubcategoria: Yup.string().required('Selecciona una subcategoría'),
});

export const categoriaSchema = Yup.object().shape({
  newCategoryName: Yup.string()
    .trim()
    .required('El nombre de la categoría es obligatorio')
    .min(3, 'Debe tener al menos 3 caracteres'),
});

export const subcategoriaSchema = Yup.object().shape({
  selectedCategoria: Yup.string()
    .required('Selecciona una categoría'),
  newSubcategoryName: Yup.string()
    .trim()
    .required('El nombre de la subcategoría es obligatorio')
    .min(3, 'Debe tener al menos 3 caracteres'),
});
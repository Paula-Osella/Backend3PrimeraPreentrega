// src/errors/errorDictionary.js
export const ERRORES = {
    USUARIO_EMAIL_INVALIDO: {
      code: 1001,
      name: 'UsuarioEmailInvalido',
      message: 'El email proporcionado no es válido.'
    },
    USUARIO_DUPLICADO: {
      code: 1002,
      name: 'UsuarioDuplicado',
      message: 'Ya existe un usuario con este correo.'
    },
    MASCOTA_SIN_NOMBRE: {
      code: 2001,
      name: 'MascotaSinNombre',
      message: 'La mascota debe tener un nombre.'
    },
    MASCOTA_EXISTENTE: {
      code: 2002,
      name: 'MascotaYaExiste',
      message: 'Ya existe una mascota con ese nombre.'
    }
  };
  
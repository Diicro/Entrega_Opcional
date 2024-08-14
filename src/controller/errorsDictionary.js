export const errorDicctionary={
    UNHANDLED_ERROR: { code: 0, status: 500, message: 'Error no identificado' },
    ROUTING_ERROR: { code: 1, status: 404, message: 'No se encuentra el endpoint solicitado' },
    FEW_PARAMETERS: { code: 2, status: 400, message: 'Faltan parámetros obligatorios o se enviaron vacíos' },
    ID_NOT_FOUND: { code: 3, status: 400, message: 'No existe registro con ese ID' },
    DATABASE_ERROR: { code: 4, status: 500, message: 'No se puede conectar a la base de datos' },
    RECORD_CREATION_ERROR: { code: 5, status: 500, message: 'Error al intentar crear el registro' },
    CODE_EXIST: { code: 6, status: 400, message: 'El codigo ya existe' },
    EMAIL_EXIST:{code:7, status:400,message:'El correo ya existe'},
    LOG_OUT:{code:8, status:401,message:'Debe iniciar sesion'},
    TOKEN_ERROR:{code:9,status:401,message:'Token expirado'},
    PASSWORD_SAME:{code:10,status:400,message:'La nueva contraseña no puede ser igual que la anterior'},
    AUTHENTICATION:{code:11,status:403,message:'No tiene autorización'},
}
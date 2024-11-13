export interface User {
    id: number;
    usuario: string;
    correo: string;
    nombre: string;
    apell_paterno: string;
    apell_materno: string;
    contrasena: string;
    tipo_usuario: TipoUsuario;
    created_at: Date;
    updated_at: Date;
}


export enum TipoUsuario {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface UsersResponse {
    users: User[];
    totalUsers: number;
}

export interface UserUpdate {
    usuario: string;
    nombre: string;
    apell_paterno: string;
    apell_materno: string;
    correo: string;
}

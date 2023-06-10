import { RolUsuario, Usuario } from './usuario';

export interface UsuarioRepository {
    obtenerTodo(): Promise<Usuario[] | []>;

    obtenerPorId(idUsuario: number): Promise<Usuario>;

    crear(
        idUsuario: number | null,
        nombreUsuario: string,
        emailUsuario: string,
        passwordUsuario: string,
        rolUsuario: RolUsuario
    ): Promise<Usuario>;

    actualizar(
        idUsuario: number,
        nombreUsuario: string,
        emailUsuario: string,
        passwordUsuario: string,
        rolUsuario: RolUsuario
    ): Promise<Usuario>;

    eliminar(idUsuario: number): Promise<Usuario>;

    login(
        emailUsuario: string,
        passwordUsuario: string
    ): Promise<{
        nombre: string;
        email: string;
        rol: RolUsuario;
        token: string;
    }>;

    logout(): Promise<string>;
}

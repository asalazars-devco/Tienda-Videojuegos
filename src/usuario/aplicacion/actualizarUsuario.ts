import { RolUsuario } from '../dominio/usuario';
import { UsuarioRepository } from '../dominio/usuarioRepository';

export class ActualizarUsuario {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar(
        idUsuario: number,
        nombreUsuario: string,
        emailUsuario: string,
        passwordUsuario: string,
        rolUsuario: RolUsuario
    ) {
        const usuarioActualizado = await this.usuarioRepository.actualizar(
            idUsuario,
            nombreUsuario,
            emailUsuario,
            passwordUsuario,
            rolUsuario
        );

        return usuarioActualizado;
    }
}

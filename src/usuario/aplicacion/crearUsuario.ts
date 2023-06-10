import { RolUsuario } from '../dominio/usuario';
import { UsuarioRepository } from '../dominio/usuarioRepository';

export class CrearUsuario {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar(
        idUsuario: number | null,
        nombreUsuario: string,
        emailUsuario: string,
        passwordUsuario: string,
        rolUsuario: RolUsuario
    ) {
        const usuarioCreado = await this.usuarioRepository.crear(
            idUsuario,
            nombreUsuario,
            emailUsuario,
            passwordUsuario,
            rolUsuario
        );
        console.log('usuario creado');
        return usuarioCreado;
    }
}

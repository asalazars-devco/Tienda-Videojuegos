import { UsuarioRepository } from '../dominio/usuarioRepository';

export class LoginUsuario {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar(emailUsuario: string, passwordUsuario: string) {
        const usuarioAutenticado = await this.usuarioRepository.login(
            emailUsuario,
            passwordUsuario
        );

        return usuarioAutenticado;
    }
}

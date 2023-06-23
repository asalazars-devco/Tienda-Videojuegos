import { UsuarioRepository } from '../dominio/usuarioRepository';

export class LogoutUsuario {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar() {
        const cerrarSesion = await this.usuarioRepository.logout();

        return cerrarSesion;
    }
}

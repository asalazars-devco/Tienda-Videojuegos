import { UsuarioRepository } from '../dominio/usuarioRepository';

export class LogoutUsuario {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar() {
        const cerrarSesion = await this.usuarioRepository.logout();

        console.log('usuario ha cerrado la sesion');
        return cerrarSesion;
    }
}

import { UsuarioRepository } from '../dominio/usuarioRepository';

export class ObtenerUsuarioPorId {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar(idUsuario: number) {
        const usuario = await this.usuarioRepository.obtenerPorId(idUsuario);

        return usuario;
    }
}

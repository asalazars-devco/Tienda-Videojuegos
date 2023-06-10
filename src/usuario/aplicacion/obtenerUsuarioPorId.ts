import { UsuarioRepository } from '../dominio/usuarioRepository';

export class ObtenerUsuarioPorId {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar(idUsuario: number) {
        const usuario = await this.usuarioRepository.obtenerPorId(idUsuario);

        console.log('Usuario obtenido:', usuario.nombre);
        return usuario;
    }
}

import { UsuarioRepository } from '../dominio/usuarioRepository';

export class EliminarUsuario {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar(idUsuario: number) {
        const usuario = await this.usuarioRepository.eliminar(idUsuario);

        console.log('usuario eliminado');
        return usuario;
    }
}

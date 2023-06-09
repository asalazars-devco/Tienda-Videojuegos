import { UsuarioRepository } from '../dominio/usuarioRepository';

export class ObtenerTodosUsuarios {
    constructor(private readonly usuarioRepository: UsuarioRepository) {}

    async ejecutar() {
        const usuariosTodos = await this.usuarioRepository.obtenerTodo();

        return usuariosTodos;
    }
}

import validarEmail from '../../helpers/validarEmail';
import validarPassword from '../../helpers/validarPassword';
import encriptarPassword from '../../helpers/encriptarPassword';

export type RolUsuario = 'admin' | 'cliente';

export class Usuario {
    private id!: number;
    private password!: string;

    constructor(
        readonly nombre: string,
        readonly email: string,
        readonly rol: RolUsuario
    ) {
        if (typeof nombre !== 'string' || nombre.length === 0) {
            throw new Error(
                'Nombre tiene que ser de tipo string y no puede ser vacio'
            );
        }

        if (!validarEmail(email)) {
            throw new Error('Email invalido');
        }

        if (rol !== 'admin') {
            if (rol !== 'cliente') {
                throw new Error(
                    'Rol de usuario solo puede ser uno de estos tipos: admin o cliente'
                );
            }
        }
    }

    colocarId(id: number): void {
        if (id <= 0) {
            throw new Error('ID debe ser mayor de 0');
        }
        this.id = id;
    }

    async colocarPassword(password: string): Promise<void> {
        if (validarPassword(password)) {
            const passwordEncriptado = await encriptarPassword(password);
            this.password = passwordEncriptado;
        } else {
            throw new Error('Password debe contener minimo 6 caracteres');
        }
    }

    obtenerPassword(): string {
        return this.password;
    }
}

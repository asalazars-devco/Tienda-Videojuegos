import * as bcrypt from 'bcryptjs';

const verificarPasswordLogin = async (
    passwordIngresado: string,
    passwordAlmacenado: string
) => {
    const esPasswordCorrecto = await bcrypt.compare(
        passwordIngresado,
        passwordAlmacenado
    );

    return esPasswordCorrecto;
};

export default verificarPasswordLogin;

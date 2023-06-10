import * as bcrypt from 'bcryptjs';

const encriptarPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const passwordEncriptado = await bcrypt.hash(password, saltRounds);

    return passwordEncriptado;
};

export default encriptarPassword;

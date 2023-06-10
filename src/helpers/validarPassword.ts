const validarPassword = (password: string): boolean => {
    return password.length >= 6 ? true : false;
};

export default validarPassword;

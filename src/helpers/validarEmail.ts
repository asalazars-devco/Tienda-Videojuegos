const validarEmail = (email: string): boolean => {
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patronEmail.test(email);
};

export default validarEmail;

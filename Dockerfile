# Utiliza una imagen de Node.js como base
FROM node:18.16-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --ignore-scripts

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Compila el código TypeScript
RUN npm run tsc

# Expone el puerto en el que la API estará escuchando
EXPOSE 3000

# Ejecuta el comando para iniciar la API
USER node
CMD ["npm", "start"]

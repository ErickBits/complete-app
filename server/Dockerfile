# 1. Usamos una imagen ligera de Node.js (Alpine Linux)
FROM node:20-alpine

# 2. Creamos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos solo los archivos de dependencias primero.
# Esto es un truco de optimización: si no cambias tus dependencias, 
# Docker usará la caché y no reinstalará todo cada vez que cambies el código.
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm install --production
#--production se usa para no instalar las devdependencies y hacer mas ligero y seguro el contenedor.

# 5. Copiamos el resto del código de la aplicación con sus respectivos permisos a el usuario node.
COPY --chown=node:node . .

# 6. Exponemos el puerto en el que corre tu API 
EXPOSE 5100

# 7. Definimos el usuario por defecto de la imagen Node para mayor seguridad.
# Por defecto Docker corre como root, lo cual es un riesgo.
USER node

# 8. Comando para arrancar la aplicación
CMD ["node", "app.js"]
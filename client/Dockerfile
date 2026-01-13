# 1. ESTA LÍNEA ES OBLIGATORIA
FROM node:20-alpine

# 2. Directorio de trabajo
WORKDIR /usr/src/app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./

# 4. Instalamos dependencias (Sin --production para React)
RUN npm install

# 5. Copiamos el código con el dueño correcto
COPY --chown=node:node . .

# 6. Puerto de React
EXPOSE 3000

# 7. Usuario de seguridad
USER node

# 8. Comando de arranque
CMD ["npm", "start"]
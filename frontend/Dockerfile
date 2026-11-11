# Etapa 1: Construcción (Build)
FROM node:20-alpine AS build

WORKDIR /app

# Copia e instala dependencias
COPY package*.json ./
RUN npm ci

# Variable de entorno en tiempo de compilación para Vite
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Copia el código y genera la carpeta dist/
COPY . .
RUN npm run build

# Etapa 2: Producción (Nginx)
FROM nginx:alpine

# Copia los archivos compilados desde la Etapa 1 hacia Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
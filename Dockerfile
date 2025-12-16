# Usar imagen oficial de Node.js 18 con Alpine
FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="calculadora-xl"
LABEL version="1.0.0"

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    postgresql-client \
    curl \
    bash \
    openssl

# Crear grupo y usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm ci && npm cache clean --force

# Copiar el código fuente
COPY --chown=nodejs:nodejs . .

# Generar cliente de Prisma
RUN npx prisma generate

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["node", "app.js"]
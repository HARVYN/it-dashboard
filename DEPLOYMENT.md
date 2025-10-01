# Guía de Despliegue - Dashboard IT

Esta guía detalla los pasos para desplegar el Dashboard IT en diferentes entornos de producción.

## 🚀 Opciones de Despliegue

### 1. Vercel (Recomendado)
### 2. Docker
### 3. Servidor VPS/Cloud
### 4. Netlify

---

## 🌐 Despliegue en Vercel

Vercel es la opción más sencilla para desplegar aplicaciones Next.js.

### Prerrequisitos
- Cuenta en [Vercel](https://vercel.com)
- Repositorio Git (GitHub, GitLab, Bitbucket)

### Pasos de Despliegue

1. **Preparar el Repositorio**
   ```bash
   git add .
   git commit -m "Preparar para despliegue"
   git push origin main
   ```

2. **Conectar con Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Hacer clic en "New Project"
   - Importar repositorio desde Git
   - Seleccionar el proyecto `it-dashboard`

3. **Configurar Variables de Entorno**
   En el dashboard de Vercel, ir a Settings → Environment Variables:
   ```env
   DATABASE_URL=file:./prod.db
   JWT_SECRET=tu-clave-secreta-super-segura-para-produccion
   NEXTAUTH_SECRET=otra-clave-secreta-para-nextauth-produccion
   NODE_ENV=production
   ```

4. **Configurar Build Settings**
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Desplegar**
   - Hacer clic en "Deploy"
   - Esperar a que termine el build
   - Acceder a la URL proporcionada

### Configuración de Base de Datos en Vercel

Para producción, se recomienda usar una base de datos externa:

```env
# Opción 1: PostgreSQL (Recomendado)
DATABASE_URL="postgresql://usuario:password@host:5432/database"

# Opción 2: MySQL
DATABASE_URL="mysql://usuario:password@host:3306/database"

# Opción 3: SQLite (Solo para pruebas)
DATABASE_URL="file:./prod.db"
```

---

## 🐳 Despliegue con Docker

### Crear Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependencias basadas en el gestor de paquetes preferido
COPY package.json package-lock.json* ./
RUN npm ci

# Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Construir aplicación
RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Configurar permisos correctos para archivos precompilados
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar archivos de build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Crear .dockerignore

```dockerignore
# .dockerignore
Dockerfile
.dockerignore
node_modules
npm-debug.log
README.md
.env
.git
.gitignore
.next
.vercel
```

### Comandos de Docker

```bash
# Construir imagen
docker build -t it-dashboard .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prod.db" \
  -e JWT_SECRET="tu-clave-secreta" \
  -e NODE_ENV="production" \
  it-dashboard

# Con docker-compose
docker-compose up -d
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/itdashboard
      - JWT_SECRET=tu-clave-secreta-super-segura
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./data:/app/data

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=itdashboard
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

## 🖥️ Despliegue en Servidor VPS

### Prerrequisitos
- Servidor Ubuntu/CentOS con acceso SSH
- Node.js 18+ instalado
- Nginx instalado
- PM2 para gestión de procesos

### Pasos de Instalación

1. **Conectar al Servidor**
   ```bash
   ssh usuario@tu-servidor.com
   ```

2. **Instalar Node.js**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

3. **Instalar PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clonar Repositorio**
   ```bash
   cd /var/www
   sudo git clone <tu-repositorio> it-dashboard
   cd it-dashboard
   sudo chown -R $USER:$USER .
   ```

5. **Instalar Dependencias**
   ```bash
   npm install
   ```

6. **Configurar Variables de Entorno**
   ```bash
   sudo nano .env.production
   ```
   ```env
   DATABASE_URL="file:./prod.db"
   JWT_SECRET="tu-clave-secreta-super-segura"
   NODE_ENV="production"
   PORT=3000
   ```

7. **Configurar Base de Datos**
   ```bash
   npx prisma generate
   npx prisma db push
   npx tsx scripts/seed.ts
   ```

8. **Construir Aplicación**
   ```bash
   npm run build
   ```

9. **Configurar PM2**
   ```bash
   # Crear archivo ecosystem
   nano ecosystem.config.js
   ```
   ```javascript
   module.exports = {
     apps: [{
       name: 'it-dashboard',
       script: 'npm',
       args: 'start',
       cwd: '/var/www/it-dashboard',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       instances: 'max',
       exec_mode: 'cluster',
       watch: false,
       max_memory_restart: '1G',
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time: true
     }]
   }
   ```

10. **Iniciar con PM2**
    ```bash
    mkdir logs
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    ```

### Configurar Nginx

1. **Crear configuración de Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/it-dashboard
   ```
   ```nginx
   server {
       listen 80;
       server_name tu-dominio.com www.tu-dominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Habilitar sitio**
   ```bash
   sudo ln -s /etc/nginx/sites-available/it-dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **Configurar SSL con Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
   ```

---

## 🔧 Configuración de Producción

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@host:5432/database"

# Autenticación
JWT_SECRET="clave-super-secreta-de-al-menos-32-caracteres"
NEXTAUTH_SECRET="otra-clave-secreta-para-nextauth"

# Configuración
NODE_ENV="production"
PORT=3000

# Opcional: Configuración de email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-password-de-app"
```

### Optimizaciones de Producción

1. **Configurar next.config.js**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone',
     experimental: {
       serverComponentsExternalPackages: ['@prisma/client']
     },
     images: {
       domains: ['localhost'],
       unoptimized: true
     }
   }

   module.exports = nextConfig
   ```

2. **Configurar package.json scripts**
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start",
       "start:prod": "NODE_ENV=production next start -p 3000"
     }
   }
   ```

---

## 🔍 Monitoreo y Logs

### PM2 Monitoring
```bash
# Ver estado de procesos
pm2 status

# Ver logs en tiempo real
pm2 logs

# Reiniciar aplicación
pm2 restart it-dashboard

# Ver métricas
pm2 monit
```

### Logs de Nginx
```bash
# Logs de acceso
sudo tail -f /var/log/nginx/access.log

# Logs de errores
sudo tail -f /var/log/nginx/error.log
```

### Backup de Base de Datos
```bash
# Backup automático diario
crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * /usr/bin/pg_dump -h localhost -U usuario itdashboard > /backups/itdashboard_$(date +\%Y\%m\%d).sql
```

---

## 🚨 Solución de Problemas

### Problemas Comunes

1. **Error de permisos**
   ```bash
   sudo chown -R $USER:$USER /var/www/it-dashboard
   chmod -R 755 /var/www/it-dashboard
   ```

2. **Error de base de datos**
   ```bash
   npx prisma db push --force-reset
   npx tsx scripts/seed.ts
   ```

3. **Error de memoria**
   ```bash
   # Aumentar memoria en PM2
   pm2 restart it-dashboard --max-memory-restart 2G
   ```

4. **Error de puerto ocupado**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

### Verificación de Salud

```bash
# Verificar que la aplicación responde
curl http://localhost:3000/api/health

# Verificar logs de aplicación
pm2 logs it-dashboard --lines 50

# Verificar uso de recursos
pm2 monit
```

---

## 📋 Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Base de datos configurada y migrada
- [ ] Datos de ejemplo cargados (opcional)
- [ ] Aplicación construida (`npm run build`)
- [ ] PM2 configurado y ejecutándose
- [ ] Nginx configurado como proxy reverso
- [ ] SSL configurado (Let's Encrypt)
- [ ] Firewall configurado (puertos 80, 443, 22)
- [ ] Backup automático configurado
- [ ] Monitoreo configurado
- [ ] DNS apuntando al servidor
- [ ] Pruebas de funcionalidad completadas

---

**¡Tu Dashboard IT está listo para producción! 🚀**


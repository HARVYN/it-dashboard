# Dashboard IT - Gestión de Tecnología

Un dashboard web profesional para la gestión integral de métricas de IT, con capacidad de análisis mensual e histórico, base de datos persistente y panel de administración completo.

## 🚀 Características Principales

### 📊 Dashboard de Indicadores
- **Mesa de Ayuda**: Gestión de casos, satisfacción de usuarios y rendimiento de técnicos
- **Protección de Endpoints**: Estado de computadores y dispositivos móviles
- **Seguridad de Servidores**: Cumplimiento de controles de seguridad
- **Ciberseguridad**: Análisis de ataques y efectividad de bloqueo
- **Incidentes de Tecnología**: Seguimiento de SLA y proyección anual

### 🔧 Funcionalidades Avanzadas
- **Base de datos persistente** con SQLite
- **Panel de administración** para gestión de técnicos, servidores y controles
- **Carga de datos** manual mediante formularios o importación Excel
- **Filtros temporales** por año, trimestre y mes
- **Gráficos interactivos** con múltiples tipos de visualización
- **Exportación PDF/CSV** de reportes
- **Análisis histórico** y tendencias mensuales
- **Autenticación** con sistema de login

### 🎨 Interfaz de Usuario
- **Diseño responsive** compatible con desktop y móvil
- **Componentes reutilizables** con Tailwind CSS
- **Iconos descriptivos** con Lucide React
- **Gráficos profesionales** con Recharts
- **Navegación intuitiva** con sidebar y breadcrumbs

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Recharts** - Librería de gráficos
- **Lucide React** - Iconos
- **jsPDF & html2canvas** - Exportación PDF

### Backend
- **Next.js API Routes** - API REST
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos embebida
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **TypeScript** - Verificación de tipos

## 📋 Requisitos del Sistema

- **Node.js** 18.0 o superior
- **npm** 9.0 o superior
- **Sistema operativo**: Windows, macOS, Linux

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd it-dashboard
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Autenticación
JWT_SECRET="tu-clave-secreta-muy-segura"
NEXTAUTH_SECRET="otra-clave-secreta-para-nextauth"

# Configuración de desarrollo
NODE_ENV="development"
```

### 4. Configurar Base de Datos
```bash
# Generar cliente de Prisma
npx prisma generate

# Crear y migrar base de datos
npx prisma db push

# Cargar datos de ejemplo (opcional)
npx tsx scripts/seed.ts
```

### 5. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 👤 Credenciales de Acceso

### Usuario Administrador por Defecto
- **Email**: `admin@itdashboard.com`
- **Contraseña**: `admin123`

## 📖 Guía de Uso

### 1. Primer Acceso
1. Acceder a `http://localhost:3000`
2. Iniciar sesión con las credenciales de administrador
3. Explorar el dashboard con datos de ejemplo

### 2. Configuración Inicial
1. Ir a **Administración** → **Técnicos**
2. Agregar o modificar técnicos de mesa de ayuda
3. Ir a **Administración** → **Servidores**
4. Configurar servidores de la infraestructura
5. Ir a **Administración** → **Controles**
6. Definir controles de seguridad a monitorear

### 3. Carga de Datos Mensuales
1. Navegar a cualquier sección del dashboard
2. Hacer clic en **"Cargar Datos"**
3. Seleccionar año y mes
4. Completar formulario con métricas del período
5. Guardar datos

### 4. Análisis y Reportes
1. Usar filtros de fecha para análisis histórico
2. Comparar tendencias mensuales
3. Exportar reportes en PDF
4. Analizar métricas por técnico/servidor/control

## 📊 Estructura de Datos

### Mesa de Ayuda
- Total de casos por mes
- Casos por técnico
- Satisfacción promedio
- Distribución de tiempos de atención

### Protección de Endpoints
- Total de dispositivos
- Estado de computadores (OK/Advertencia/Crítico)
- Dispositivos móviles protegidos
- Tendencia de protección

### Seguridad de Servidores
- Cumplimiento por servidor
- Estado de controles de seguridad
- Tendencia mensual de cumplimiento

### Ciberseguridad
- Ataques por vector de seguridad
- Tipos de ataques detectados
- Efectividad de bloqueo
- Tendencia mensual

### Incidentes de Tecnología
- Horas de indisponibilidad
- Cumplimiento de SLA
- Proyección anual
- Análisis por tipo de incidente

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Ejecutar en modo desarrollo
npm run dev

# Verificar tipos TypeScript
npm run type-check

# Linting de código
npm run lint

# Formatear código
npm run format
```

### Base de Datos
```bash
# Ver base de datos en navegador
npx prisma studio

# Resetear base de datos
npx prisma db push --force-reset

# Generar migración
npx prisma migrate dev --name nombre-migracion
```

### Producción
```bash
# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 📁 Estructura del Proyecto

```
it-dashboard/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── dev.db                 # Base de datos SQLite
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/              # API Routes
│   │   ├── admin/            # Páginas de administración
│   │   ├── dashboard/        # Páginas del dashboard
│   │   └── login/            # Página de login
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes base
│   │   ├── dashboard/       # Componentes del dashboard
│   │   ├── admin/           # Componentes de administración
│   │   ├── auth/            # Componentes de autenticación
│   │   └── layout/          # Componentes de layout
│   ├── contexts/            # Contextos de React
│   ├── lib/                 # Utilidades y configuración
│   ├── types/               # Tipos TypeScript
│   └── utils/               # Funciones utilitarias
├── scripts/                 # Scripts de utilidad
├── public/                  # Archivos estáticos
└── docs/                    # Documentación adicional
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Docker
```bash
# Construir imagen
docker build -t it-dashboard .

# Ejecutar contenedor
docker run -p 3000:3000 it-dashboard
```

### Servidor VPS
1. Clonar repositorio en servidor
2. Instalar dependencias
3. Configurar variables de entorno
4. Construir aplicación
5. Usar PM2 o similar para proceso

## 🔒 Seguridad

- **Autenticación JWT** con tokens seguros
- **Contraseñas encriptadas** con bcrypt
- **Validación de entrada** en APIs
- **Variables de entorno** para configuración sensible
- **CORS configurado** para acceso controlado

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Email**: soporte@itdashboard.com
- **Documentación**: [Wiki del proyecto]
- **Issues**: [GitHub Issues]

## 🔄 Changelog

### v1.0.0 (2025-08-26)
- ✅ Dashboard completo con 5 secciones
- ✅ Panel de administración
- ✅ Sistema de autenticación
- ✅ Base de datos persistente
- ✅ Exportación PDF/CSV
- ✅ Gráficos interactivos
- ✅ Filtros temporales
- ✅ Diseño responsive

---

**Desarrollado con ❤️ para la gestión eficiente de IT**

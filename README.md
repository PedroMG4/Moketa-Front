# MOKETA - Frontend

Sitio web de MOKETA con diseño original restaurado y integración con Sanity CMS.

## 🚀 Deploy en Vercel

### 1. Variables de Entorno

Configura estas variables en Vercel:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id_de_sanity
NEXT_PUBLIC_SANITY_DATASET=production
```

### 2. Deploy

1. Conecta tu repositorio a Vercel
2. Selecciona el directorio `frontend` como root
3. Vercel detectará automáticamente que es un proyecto Next.js
4. Agrega las variables de entorno en la configuración
5. Deploy!

### 3. Sanity Studio

Para gestionar el contenido:

1. Ve a tu proyecto de Sanity
2. Agrega productos y promociones
3. Los cambios se reflejarán automáticamente en el sitio

## 🎨 Diseño

- **Colores corporativos**: Violeta (#6A0DAD) y Amarillo (#D8B63A)
- **Glassmorphism**: Efectos de transparencia y blur
- **Gradientes**: Botones con efectos corporativos
- **Responsive**: Adaptado para móviles y desktop

## 📱 Funcionalidades

- ✅ Carrito de compras con localStorage
- ✅ Productos desde Sanity CMS
- ✅ Promociones dinámicas
- ✅ Diseño original del FrontendViejo
- ✅ Efectos hover y transiciones
- ✅ Modal de confirmación

## 🛠️ Desarrollo Local

```bash
npm install
npm run dev
```

El sitio estará disponible en `http://localhost:3000`
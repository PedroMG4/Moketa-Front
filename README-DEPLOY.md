# Deploy Instructions

## Variables de Entorno para Vercel

Cuando hagas el deploy en Vercel, configura estas variables de entorno:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=p4ifa5jg
NEXT_PUBLIC_SANITY_DATASET=production
```

## Sanity Studio

- **URL**: https://moketa.sanity.studio/
- **Project ID**: p4ifa5jg
- **Dataset**: production

## Funcionalidades

- ✅ Frontend con Next.js
- ✅ Integración con Sanity CMS
- ✅ Carrito de compras
- ✅ Página de pago con MercadoPago
- ✅ Modales que se cierran al hacer clic fuera
- ✅ Promociones con precios correctos
- ✅ Agrupación de promociones en la página de pago

## Estructura

- `/` - Página principal con menú
- `/carrito` - Carrito de compras
- `/pago` - Página de pago
- `/checkout` - Checkout
- `/confirmacion` - Confirmación de pedido

## Sanity CMS

El frontend está configurado para usar Sanity CMS para:
- Productos dinámicos
- Promociones
- Imágenes
- Contenido editable

Los datos se cargan desde Sanity Studio y se muestran en el frontend.


# Guía de Performance y Lighthouse CI

## Introducción

En TimeKast, la performance no es una "feature", es un requisito fundamental. Para garantizar que no introducimos regresiones (regressions) con nuevos cambios, utilizamos **Lighthouse CI**.

Esta herramienta nos permite establecer **Performance Budgets** (presupuestos de rendimiento) y fallar el build si no se cumplen.

## Configuración Actual

Utilizamos `@lhci/cli` para ejecutar auditorías locales contra el servidor de desarrollo/producción.

### Budgets Definidos

El archivo de configuración `lighthouserc.js` define los siguientes umbrales:

| Categoría          | Score Mínimo | Notas                                    |
| ------------------ | ------------ | ---------------------------------------- |
| **Performance**    | 90+          | Métricas Core Web Vitals (LCP, CLS, TBT) |
| **Accessibility**  | 90+          | Crítico para usabilidad                  |
| **Best Practices** | 90+          | Seguridad y estándares web               |
| **SEO**            | 90+          | Meta tags y estructura semántica         |
| **PWA**            | 80+          | Service Workers y Manifest               |

## Cómo Ejecutar una Auditoría

Para correr los tests en tu máquina local:

1. **Construir el proyecto** (para probar la versión optimizada):

   ```bash
   pnpm build
   ```

2. **Iniciar el servidor**:

   ```bash
   pnpm start
   ```

3. **Ejecutar Lighthouse** (en otra terminal):
   ```bash
   pnpm lighthouse
   ```

Esto ejecutará:

- **lhci autorun**: Corre automáticamente 3 veces para obtener una media.
- **lhci collect**: Navega a las URLs definidas (`/`, `/login`).
- **lhci assert**: Verifica que se cumplan los budgets.

## Reportes

Los reportes detallados se generan en la carpeta `.lighthouseci/` (que está en `.gitignore`).
Puedes abrir el archivo HTML generado para ver qué falló y cómo solucionarlo.

## Troubleshooting Común

### Score de Performance bajo en local

Es normal que en modo `dev` (`pnpm dev`) los scores sean bajos. **Siempre** ejecuta Lighthouse contra el build de producción (`pnpm start`).

### Flakiness (Resultados variables)

Lighthouse puede variar según la carga de tu CPU. Corremos 3 runs (`numberOfRuns: 3`) para minimizar esto, pero si tu máquina está muy cargada, los scores pueden bajar falsamente.

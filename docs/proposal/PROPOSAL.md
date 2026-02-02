# Propuesta: Adi Capital Admin

> **Cliente:** Abraham Cohen
> **Fecha:** 2026-02-02
> **Versión:** 1.0

---

## 1. Resumen Ejecutivo

### Problema a Resolver

- La gestión actual de los fondos Adi Capital y Kentucky se realiza mediante hojas de cálculo, lo que genera fragilidad, errores manuales y dificultad para escalar
- No existe una base de datos relacional que permita mantener la integridad de la información
- Los cálculos de interés preferencial (Pref) y distribuciones se realizan manualmente, con riesgo de inconsistencias
- La sincronización con la aplicación móvil de inversionistas depende de funciones que se ejecutan en la nube sin visibilidad clara

### Resultado Esperado

- Un panel de administración centralizado donde gestionar toda la operación de ambos fondos
- Automatización del cálculo de intereses preferenciales y distribuciones de capital
- Gestión documental integrada, eliminando la necesidad de manejar archivos manualmente
- Sincronización automática con la aplicación móvil existente de inversionistas

### Por qué Esta Solución

- Elimina dependencia de hojas de cálculo y reduce errores humanos
- Automatiza cálculos financieros complejos (Pref, cascada, Success Fee)
- Centraliza la información en un solo sistema confiable
- Mantiene compatibilidad total con la aplicación móvil actual sin interrupciones

---

## 2. Objetivos del Proyecto

1. **Centralizar la gestión de fondos:** Un único sistema para administrar Adi Capital y Kentucky, con aislamiento de datos entre fondos
2. **Automatizar cálculos financieros:** El sistema calculará automáticamente intereses preferenciales, distribuciones y comisiones según las reglas configuradas
3. **Digitalizar la gestión documental:** Integración con el almacenamiento en la nube del cliente para organizar y visualizar documentos por proyecto e inversionista
4. **Garantizar continuidad del servicio:** La aplicación móvil de inversionistas seguirá funcionando sin cambios, con datos sincronizados automáticamente

---

## 3. Solución Propuesta

### ¿Qué hará la aplicación?

- Gestionar fondos, proyectos, inversionistas e inversiones desde una interfaz web
- Registrar movimientos financieros con 18 conceptos diferentes (aportaciones, repartos, gastos, etc.)
- Calcular automáticamente el interés preferencial acumulado diariamente
- Distribuir capital y utilidades mediante un asistente guiado (wizard de reparto)
- Organizar documentos por proyecto e inversionista con niveles de visibilidad
- Publicar noticias para los inversionistas
- Sincronizar toda la información con la aplicación móvil

### Procesos que Simplificará

- Registro y seguimiento de aportaciones de capital
- Cálculo manual de intereses preferenciales (ahora automático)
- Distribución de utilidades con método de cascada configurable
- Organización de documentos por proyecto e inversionista
- Publicación de actualizaciones para inversionistas
- Control de permisos por rol y por fondo

### Decisiones que Facilitará

- Visualizar el estado de cada inversión y proyecto en tiempo real
- Identificar compromisos pendientes de cobro (cuentas por cobrar)
- Consultar la posición financiera de cada proyecto (inversión, gastos, retornos, utilidad)
- Revisar historial de movimientos con filtros avanzados
- Controlar gastos asociados a proyectos específicos

### Automatizaciones Incluidas

- Cálculo diario del interés preferencial sobre capital aportado
- Generación automática de movimientos relacionados (inversión directa, fees)
- Cálculo de comisión de administración (Admin Fee) según configuración por inversión
- Aplicación del método de cascada al distribuir (Pref primero o Capital primero)
- Creación automática de carpetas de documentos al crear proyectos o inversionistas
- Sincronización de datos a la aplicación móvil

---

## 4. Usuarios y Roles

| Rol | Descripción | Acciones Principales |
|-----|-------------|---------------------|
| **Super Administrador** | Abraham, Olga — Gestión completa | Ver todos los fondos, crear/editar entidades, confirmar movimientos, gestionar usuarios, acceso total a documentos |
| **Administrador de Fondo** | Operadores asignados a un fondo | Gestionar solo su fondo asignado, registrar movimientos, ver documentos del fondo |
| **Agente de Ventas** | Referidores de inversionistas (futuro) | Ver solo las inversiones que gestionan, sin edición |
| **Inversionista** | Participantes de los fondos | Solo lectura de sus propios datos en la aplicación móvil (sin cambios) |

---

## 5. Flujos Principales

### Flujo Principal: Registro y Confirmación de Movimiento

1. El administrador selecciona el tipo de movimiento (ej: Aportación de Capital)
2. Completa los datos requeridos (inversionista, proyecto, monto, moneda)
3. El sistema valida los datos según las reglas del concepto
4. El movimiento se crea en estado **Borrador**
5. El administrador revisa y confirma el movimiento
6. El estado cambia a **Confirmado** y afecta los saldos calculados
7. El sistema sincroniza automáticamente con la aplicación móvil

### Flujos Secundarios

#### Distribución con Wizard de Reparto
- Seleccionar proyecto con capital a distribuir
- Ingresar monto total a repartir
- El sistema calcula la cascada según configuración (Pref primero o Capital primero)
- Previsualizar desglose por inversionista
- Confirmar y generar movimientos de reparto y comisiones automáticamente

#### Gestión de Documentos
- Navegar carpetas por proyecto o inversionista
- Subir nuevos documentos a la carpeta correspondiente
- Visualizar documentos según nivel de visibilidad
- El sistema crea carpetas automáticamente al crear nuevos proyectos

#### Publicación de Noticias
- Crear noticia con título, contenido e imagen
- Seleccionar si aplica a un fondo específico o es general
- Publicar y sincronizar con la aplicación móvil

---

## 6. Alcance de Primera Versión

### ✅ Incluido (MVP — 28 de febrero)

- Gestión completa de Fondos, Proyectos, Inversionistas e Inversiones
- Calendario de pagos por inversión (compromisos como cuenta por cobrar)
- 18 tipos de movimientos con validaciones específicas
- Estados de movimientos: Borrador, Confirmado, Cancelado
- Cálculo automático del interés preferencial (Pref)
- Comisión de administración (Admin Fee) configurable por inversión
- Dos métodos de cascada: Pref Primero (Adi) y Capital Primero (Kentucky)
- Wizard guiado para distribuciones de capital
- Tracking de gastos asociados a proyectos
- Reporte de posición financiera por proyecto (inversión, gastos, retornos, utilidad)
- Gestión de cuentas bancarias y beneficiarios
- Gestión documental integrada con 4 niveles de visibilidad
- Publicación de noticias
- Soporte multi-moneda (MXN, USD, EUR, ILS) con tipo de cambio manual
- Roles: Super Admin y Admin de Fondo
- Panel instalable como aplicación (PWA)
- Sincronización automática a la aplicación móvil existente

### ⏳ No Incluido (Fases Posteriores)

- Reportes avanzados con gráficos (TIR, IRR)
- Rol de Agente de Ventas con acceso limitado
- Comisiones por referido
- Notificaciones push
- Interfaz en múltiples idiomas
- Importación masiva desde hojas de cálculo

> Esta lista define claramente qué se entrega en la primera versión.

---

## 7. Supuestos y Decisiones

### Supuestos (por falta de información)

- El cliente tiene acceso completo a las plataformas necesarias (almacenamiento en la nube, base de datos móvil)
- La estructura de datos de la aplicación móvil actual está documentada y es estable
- Los usuarios finales (administradores) tienen conocimiento básico de operaciones en el navegador

### Decisiones Funcionales Tomadas

- **Método de cascada configurable:** Se define a nivel de fondo y puede sobrescribirse por proyecto
- **Estados de movimientos:** Todo movimiento inicia en Borrador para permitir revisión antes de afectar saldos
- **Cálculo de Pref:** Acumulación diaria basada en capital aportado y tasa anual configurada
- **Aislamiento de fondos:** Los inversionistas de un fondo no pueden ver información del otro

### Riesgos Identificados

| Riesgo | Mitigación |
|--------|------------|
| Línea de tiempo ajustada (4 semanas) | Priorización estricta del alcance MVP, backlog granular |
| La sincronización afecte la aplicación móvil | Ambiente de pruebas separado antes de producción |
| Cálculos financieros incorrectos | Pruebas exhaustivas, validación con el cliente contra sistema actual |

---

## 8. Criterios de Éxito

### ¿Cómo sabremos que funciona?

| Criterio | Métrica/Señal |
|----------|---------------|
| Sin hojas de cálculo | El equipo opera 100% desde el nuevo panel |
| Cálculos correctos | Los montos de Pref y distribución coinciden con el sistema anterior |
| Sincronización funcional | Los inversionistas ven datos actualizados en la app sin errores |
| Documentos accesibles | Los archivos se visualizan correctamente según el nivel de permisos |
| Adopción del equipo | Los administradores usan el sistema sin requerir soporte constante |

---

## 9. Próximos Pasos

1. **Revisión de esta propuesta** — Validar alcance y prioridades con el cliente
2. **Ajustes según feedback** — Incorporar comentarios o aclaraciones
3. **Aprobación formal** — Confirmar para iniciar desarrollo
4. **Documentación técnica** — Especificación detallada de flujos y estructura de datos
5. **Desarrollo iterativo** — Entregas incrementales con validación continua

---

## 10. Preguntas de Validación

1. ¿Qué subdominio se usará para acceder al panel de administración?
2. ¿Se cuenta con los colores corporativos y logotipo de Adi Capital para aplicar en el panel?
3. ¿El cálculo del interés preferencial debe realizarse automáticamente cada noche, o se prefiere ejecutarlo manualmente cuando se requiera?

---

_Propuesta generada con TimeKast Factory_

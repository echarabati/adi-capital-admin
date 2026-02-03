# Propuesta: Adi Capital Admin

> **Cliente:** Abraham Cohen
> **Fecha:** 2026-02-03
> **Versión:** 1.0
> **Deadline objetivo:** 28 de febrero 2026

---

## 1. Resumen Ejecutivo

### Problema a Resolver

- La operación actual de Adi Capital y Kentucky se gestiona con hojas de cálculo, lo cual es frágil, lento y propenso a errores
- No existe una base de datos estructurada que relacione inversionistas, proyectos e inversiones
- Los cálculos financieros (interés preferencial, comisiones, distribuciones) se hacen manualmente
- El control de acceso es limitado: no hay forma de restringir qué ve cada usuario
- La sincronización con la app de inversionistas depende de procesos manuales y scripts frágiles

### Resultado Esperado

- Un panel de administración centralizado que reemplace completamente las hojas de cálculo
- Gestión integral de fondos, proyectos, inversionistas e inversiones desde una sola plataforma
- Cálculos automáticos de interés preferencial (Pref), comisiones y distribuciones
- Sincronización automática con la app móvil de inversionistas
- Control de acceso granular por rol y por fondo

### Por qué Esta Solución

- **Elimina errores manuales:** Los cálculos financieros se realizan automáticamente con reglas predefinidas
- **Ahorra tiempo:** Operaciones que hoy toman horas (como preparar una distribución) se reducen a minutos
- **Escalable:** Permite crecer sin límites de rendimiento o complejidad
- **Seguro:** Cada usuario ve solo la información que le corresponde
- **Integrado:** La app de inversionistas se actualiza automáticamente, sin intervención manual

---

## 2. Objetivos del Proyecto

1. **Centralizar la operación:** Consolidar toda la gestión financiera de ambos fondos en una única plataforma, eliminando las hojas de cálculo

2. **Automatizar cálculos críticos:** Que el sistema calcule automáticamente el Pref acumulado, las distribuciones de capital y utilidades, y las comisiones de éxito

3. **Mantener la app actualizada:** Sincronizar automáticamente los datos con la app de inversionistas, sin depend de procesos manuales

4. **Organizar documentos:** Integrar la gestión documental con el almacenamiento existente, con visibilidad controlada por tipo de documento

5. **Facilitar operaciones complejas:** Implementar asistentes guiados para operaciones como distribución de utilidades, respetando las reglas de cascada de cada fondo

---

## 3. Solución Propuesta

### ¿Qué hará la aplicación?

- Administrar los dos fondos de inversión (Adi Capital y Kentucky) de forma independiente pero desde la misma plataforma
- Gestionar el catálogo de proyectos con su configuración financiera (tasas, comisiones, método de cascada)
- Mantener el registro de inversionistas con sus datos de contacto, documentos y participaciones
- Registrar inversiones que vinculan inversionistas con proyectos, incluyendo compromisos y calendarios de pago
- Procesar movimientos financieros de 18 tipos diferentes (aportaciones, distribuciones, gastos, traspasos, etc.)
- Navegar y gestionar documentos organizados por proyecto e inversionista

### Procesos que Simplificará

- **Registro de aportaciones:** El inversionista aporta capital → el sistema actualiza saldos automáticamente
- **Cálculo de Pref:** El interés preferencial se acumula diariamente sin intervención
- **Distribución de utilidades:** Un asistente guiado calcula qué le corresponde a cada inversionista según las reglas del fondo
- **Seguimiento de compromisos:** Visibilidad inmediata de cuánto ha aportado cada inversionista vs. su compromiso
- **Control multi-moneda:** Manejo de operaciones en MXN, USD, EUR e ILS con tipos de cambio
- **Comunicaciones:** Publicar noticias que aparecen en la app de inversionistas

### Decisiones que Facilitará

- ¿Cuánto Pref ha acumulado cada inversionista a la fecha?
- ¿Cuánto capital tiene pendiente de aportar cada inversionista?
- ¿Cómo se debe distribuir un retorno de inversión entre participantes?
- ¿Qué movimientos están pendientes de confirmar?
- ¿Cuál es la posición financiera de cada proyecto?

### Automatizaciones Incluidas

- Acumulación diaria del interés preferencial (Pref) sobre el capital aportado
- Generación automática de movimientos relacionados (ej: aportación directa genera inversión a proyecto)
- Cálculo de distribución según método de cascada configurado (Pref primero o Capital primero)
- Sincronización de datos con la app móvil al confirmar movimientos
- Creación automática de carpetas de documentos al registrar proyectos/inversionistas

---

## 4. Usuarios y Roles

| Rol | Descripción | Acciones Principales |
|-----|-------------|---------------------|
| **Super Admin** | Administradores con acceso total a la operación | • Gestionar ambos fondos (Adi Capital y Kentucky)<br>• Crear y administrar proyectos, inversionistas e inversiones<br>• Registrar y confirmar todo tipo de movimientos<br>• Ejecutar distribuciones de capital y utilidades<br>• Gestionar usuarios del sistema |
| **Admin de Fondo** | Administrador limitado a uno o más fondos específicos | • Gestionar solo los fondos asignados<br>• Crear proyectos e inversionistas dentro de su fondo<br>• Registrar movimientos de su fondo<br>• Ver reportes y posición de su fondo |
| **Inversionista** | Participante que invierte capital en los proyectos | • Ver sus inversiones y saldos (solo lectura)<br>• Consultar sus documentos personales<br>• Ver noticias del fondo<br>• *Acceso exclusivo desde la app móvil existente* |

> **Nota:** Los Agentes de Ventas (acceso restringido a sus inversionistas) se contemplan para una fase posterior.

---

## 5. Flujos Principales

### Flujo Principal: Distribución de Utilidades

1. El administrador selecciona un proyecto con capital disponible para distribuir
2. Ingresa el monto total a distribuir
3. El sistema calcula automáticamente la distribución por inversionista según:
   - El método de cascada del fondo (Pref primero o Capital primero)
   - El Pref acumulado de cada participante
   - El capital aportado de cada participante
   - La comisión de éxito (Success Fee) sobre utilidades
4. El sistema muestra un desglose detallado antes de confirmar
5. El administrador revisa y confirma la distribución
6. Se generan automáticamente los movimientos individuales por inversionista
7. Los datos se sincronizan a la app de inversionistas

### Flujos Secundarios

#### Registro de Aportación de Capital
- El administrador registra la aportación del inversionista
- El sistema actualiza el capital aportado y el saldo del compromiso
- Si es aportación directa a proyecto, genera inversión automáticamente
- El movimiento queda en borrador hasta confirmar
- Al confirmar, se sincroniza a la app

#### Gestión de Documentos
- El administrador navega por la estructura de carpetas (por proyecto o inversionista)
- Puede subir nuevos documentos a la carpeta correspondiente
- Los documentos tienen visibilidad según su ubicación:
  - Oportunidad/Portafolio: visibles para todos los del fondo
  - Privados: solo participantes del proyecto
  - Por inversionista: solo ese inversionista

#### Publicación de Noticias
- El administrador crea una noticia con título, contenido e imagen
- Selecciona si es para todos los fondos o uno específico
- Al publicar, aparece en la app de inversionistas

---

## 6. Alcance de Primera Versión

### ✅ Incluido (MVP — Febrero 28)

**Gestión de Catálogos:**
- Fondos (Adi Capital, Kentucky) con configuración de cascada
- Proyectos con tasas, comisiones y documentos
- Inversionistas con datos de contacto y participaciones
- Inversiones con compromisos y calendarios de pago
- Cuentas bancarias y beneficiarios

**Movimientos Financieros (18 tipos):**
- Aportaciones (APO, APO-D)
- Distribuciones (DIS, DEV, FEE)
- Inversiones a proyecto (INV, INV-D, RET)
- Gastos (GAS, GASP)
- Operaciones de socios (APS, RPS, PRS, DPRS)
- Operaciones administrativas (TRA, CAM, ERR, TSI)

**Automatizaciones:**
- Cálculo diario de Pref
- Asistente de distribución con cascada
- Estados de movimientos (Borrador → Confirmado → Cancelado)

**Integraciones:**
- Sincronización con app móvil
- Gestión documental con almacenamiento en la nube
- Multi-moneda (MXN, USD, EUR, ILS)

**Acceso:**
- Super Admin y Admin de Fondo
- Control de acceso por fondo
- Panel instalable como aplicación (PWA)

**Comunicaciones:**
- Noticias para la app de inversionistas

### ⏳ No Incluido (Fases Posteriores)

- Reportes avanzados (TIR/IRR, gráficos de rendimiento)
- Agentes de Ventas (rol con acceso limitado)
- Comisionistas (comisión por referido)
- Notificaciones push desde el panel
- Multi-idioma
- Importación masiva de datos desde hojas de cálculo existentes

> Esta lista define claramente qué se entrega en la primera versión.

---

## 7. Supuestos y Decisiones

### Supuestos (por confirmar)

1. **Acceso a sistemas actuales:** El equipo tendrá acceso de lectura a las hojas de cálculo y los sistemas existentes para validar reglas de negocio y realizar la migración de datos

2. **Estructura de la app móvil:** La estructura de datos de la app de inversionistas está documentada y puede replicarse para la sincronización

3. **Almacenamiento en la nube:** Existe una cuenta configurada para el almacenamiento de documentos y se proporcionará acceso

4. **Usuarios iniciales:** Abraham Cohen y Olga serán los primeros Super Admins

5. **Migración de datos:** La migración de datos históricos se realizará como actividad separada después del lanzamiento del sistema

### Decisiones Funcionales Tomadas

1. **Método de cascada por fondo:** Adi Capital usa "Pref primero", Kentucky usa "Capital primero", con posibilidad de override por proyecto

2. **Estados de movimientos:** Tres estados claros (Borrador, Confirmado, Cancelado) donde solo los confirmados afectan cálculos

3. **Aislamiento de fondos:** Cada fondo es completamente independiente; un inversionista puede participar en ambos pero con inversiones separadas

4. **Documentos con visibilidad:** Cuatro niveles de visibilidad (Oportunidad, Portafolio, Privado, Por Inversionista)

### Riesgos Identificados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Reglas de cálculo difieren de lo esperado | Alto | Validar fórmulas contra casos reales antes de producción |
| Migración de datos incompleta | Medio | Ejecutar migración en ambiente de prueba primero |
| Usuarios no adoptan el sistema | Medio | Capacitación y acompañamiento en puesta en marcha |

---

## 8. Criterios de Éxito

### ¿Cómo sabremos que funciona?

| Criterio | Métrica/Señal |
|----------|---------------|
| Los administradores usan el sistema diariamente | Las hojas de cálculo dejan de actualizarse |
| Los cálculos de Pref son correctos | Los valores coinciden con cálculos manuales de verificación |
| Las distribuciones se ejecutan en el sistema | Se generan movimientos de distribución sin recurrir a hojas |
| La app de inversionistas muestra datos actualizados | Los inversionistas ven sus saldos sin intervención manual |
| Los documentos están organizados y accesibles | Los administradores localizan archivos sin buscar en múltiples lugares |

---

## 9. Próximos Pasos

1. **Revisión de esta propuesta** — Validar que el alcance y los flujos descritos corresponden a las expectativas

2. **Aclaración de dudas** — Resolver las preguntas de validación listadas abajo

3. **Aprobación formal** — Confirmar el alcance para iniciar desarrollo

4. **Documentación técnica** — Elaborar especificaciones detalladas de cada módulo

5. **Desarrollo e implementación** — Construir el sistema según el plan acordado

---

## 10. Preguntas de Validación

1. **¿Está correcto el entendimiento del método de cascada?** — Adi Capital paga Pref primero, Kentucky reduce Capital primero. ¿Es así?

2. **¿Cómo se maneja el Admin Fee actualmente?** — ¿Se cobra como cargo separado o se descuenta de los retornos?

3. **¿Qué información debe sincronizarse a la app de inversionistas?** — ¿Solo saldos y movimientos, o también documentos y noticias?

4. **¿Existe un proceso para la migración de datos históricos?** — ¿O se inicia el sistema con datos limpios desde cero?

---

_Documento generado con TimeKast Starter Kit_

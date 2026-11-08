# Guía de línea gráfica y especificaciones de interfaz — Tu Coperacha (Web)

**Versión:** 2.0 (reemplaza a la v1.0: nueva paleta, logo animable e ilustración)  
**Fecha:** 8 de noviembre de 2026  
**Documentos base:** `guia_producto_diseno_web_gestion_tandas.md` (producto) y `guia_tecnica_poc_cobro_tandas_pey.md` (PoC de cobro CoDi QR vía Pey)  
**Audiencia:** diseñador UI/UX y agente de código / desarrollador frontend.  
**Alcance:** plataforma web de administración de tandas (escritorio primero; tablet y móvil adaptados). No cubre app móvil nativa.

> **Etiquetas.** **[Decisión de marca]** = viene de la referencia visual aprobada por el equipo. **[Propuesta]** = derivado o recomendado, ajustable en revisión. **[Por confirmar]** = depende de una decisión de negocio abierta (sección 15).
>
> **Archivos de apoyo** (carpeta `brand/`): logos SVG, ilustraciones SVG y maquetas PNG referidas a lo largo del documento. La sección 14 los lista.

---

## 1. Concepto visual

**Idea:** una interfaz **luminosa, amable y confiable**, con ilustración plana de personajes cercanos sobre cielo azul claro, acentos naranja y oro que recuerdan una moneda, y azul marino profundo para dar seriedad a la información financiera. Tandas = confianza entre personas; la interfaz debe sentirse humana sin perder precisión.

| Principio | Qué significa en la interfaz |
|---|---|
| **Confianza** | Texto en azul marino, mucho aire, jerarquía estable, montos siempre legibles y alineados. Sin efectos decorativos cerca de cifras. |
| **Calidez** | Cielo azul claro, naranja/oro, esquinas redondeadas, personajes sonrientes, microcopy cercano en español. |
| **Claridad financiera** | Cada concepto tiene su tratamiento: *obligación ≠ solicitud de cobro ≠ transacción ≠ pago confirmado*. |
| **Transparencia** | Toda cifra va con fecha, participante, tanda y referencia accesibles. |
| **Control** | Estados explícitos, confirmación en acciones sensibles, historial a un clic. |

**Regla de oro (heredada del producto):** nunca representar una solicitud de cobro, un QR generado o un link abierto con el color o icono de “pagado”. **Verde + check = solo confirmaciones verificables.**

**Dónde vive la “alegría” y dónde no:** la ilustración, el cielo azul y el oro aparecen en login, estados vacíos, éxito, onboarding y cabeceras. Las **zonas de datos** (tablas, montos, conciliación) son sobrias: fondo blanco, azul marino, sin ilustración.

**Evitar:** azules corporativos fríos, ilustraciones infantiles junto a montos, gradientes sobre datos, gráficos 3D, sombras pesadas, emojis como iconografía de estado.

---

## 2. Identidad de marca

### 2.1 Logo (rediseñado) **[Decisión de marca]**
Se rehízo el logo original (canasta con moneda, rayos, hojas y corazón) como **vector plano por capas** con la nueva paleta. Cada pieza es un grupo SVG con `id` propio para poder animarla.

| Capa (id) | Descripción | Color |
|---|---|---|
| `badge-ring` | Aro circular (trazo con `pathLength=100`, se “dibuja”) | Azul marino `#1E323D` |
| `badge-fill`, `badge-glow` | Fondo del medallón y halo interior | Cielo `#90DCF4` / `#DDF4FC` |
| `rays` (`.ray` ×9) | Rayos sobre la moneda | Oro `#FBCE07` |
| `handle` | Asa trenzada | Ámbar `#F3960C` + marrón |
| `coin` / `coin-spin` / `coin-dollar` | Moneda con signo `$` | Oro/ámbar + marino |
| `basket`, `basket-rim` | Canasta tejida | Naranja `#EB6C01`, borde ámbar |
| `sparkles` (`.spark`) | Destellos | Oro y blanco |
| `leaves` (`.leaf` ×10) | Ramas laterales | Azul `#0F8AD4` y marino |
| `heart` | Corazón (cercanía / comunidad) | Rosa `#F2849A` |
| `wordmark` (`.letter` ×11) | “Tu Coperacha” en Poppins Bold convertida a trazos, **una ruta por letra** | “Tu” marino · “Coperacha” naranja oscuro `#C85A00` |

**Variantes entregadas:** vertical, horizontal, isotipo, versión para **fondo oscuro** (aro blanco, “Tu” blanco, “Coperacha” ámbar) y una versión **animada** de cada una.

**Uso:**
- Sidebar expandida: horizontal (fondo oscuro), alto 32 px. Sidebar contraída / favicon / app icon: isotipo.
- Login y pantallas de bienvenida: horizontal 48–64 px o vertical.
- Zona de respeto: ½ del diámetro de la moneda alrededor. Tamaño mínimo digital: isotipo 24 px, horizontal 20 px de alto.
- Prohibido: recolorear fuera de las variantes, estirar, añadir sombras, rotar, colocar sobre fondos de bajo contraste.
- Para tamaños < 32 px usar el isotipo **sin** hojas ni rayos (versión simplificada) **[Por producir]**.

### 2.2 Tono de voz
Tuteo, frases cortas, verbos claros, cero tecnicismos bancarios. Ejemplos en la sección 13.

---

## 3. Color

### 3.1 Paleta base **[Decisión de marca]** (extraída de la ilustración de referencia)

| Token | Nombre | HEX | Rol |
|---|---|---|---|
| `sky-300` | Cielo | `#90DCF4` | Color de ambiente: fondos de ilustración, avatares, acentos suaves |
| `navy-900` | Azul marino | `#1E323D` | **Color de texto, sidebar, títulos y botones oscuros** |
| `orange-500` | Naranja | `#EB6C01` | Acento de marca: canasta, ilustración, iconos grandes |
| `amber-500` | Ámbar | `#F3960C` | **Color de la acción primaria** (botón principal) |
| `gold-500` | Oro | `#FBCE07` | Moneda, destellos, indicador activo, resaltados |
| `ice-200` | Gris azulado claro | `#DBE5EE` | Superficies hundidas, cabellos de ilustración |
| `blue-500` | Azul vivo | `#0F8AD4` | Acento gráfico (detalles de ilustración, hojas del logo) |
| `pink-300` | Rosa | `#F2B3BE` | Detalles de ilustración (mejillas, boca) |
| `brown-600` | Marrón | `#B95603` | Sombras de piel en ilustración, tejido de canasta |

### 3.2 Colores de interfaz **[Propuesta]** (derivados, con contraste verificado)

**Superficies y texto**

| Token | HEX | Uso |
|---|---|---|
| `page` | `#F1FAFE` | Fondo de página (cielo muy tenue) |
| `card` | `#FFFFFF` | Tarjetas, tablas, formularios, modales |
| `sunken` | `#EAF6FB` | Cabeceras de tabla, áreas hundidas |
| `sky-100` | `#DDF4FC` | Halo de ilustraciones, selección suave |
| `border` | `#D3E3EB` | Bordes de tarjetas y divisores |
| `border-input` | `#6F8794` | Borde de campos (3.8 : 1 sobre blanco) |
| `ink-900` | `#1E323D` | Texto principal |
| `ink-600` | `#4F6470` | Texto secundario / metadatos |
| `ink-on-dark` | `#C9D8E0` | Texto secundario sobre sidebar marino |

**Acento y acción**

| Token | HEX | Uso |
|---|---|---|
| `action` | `#F3960C` | Fondo del botón primario (texto `ink-900`) |
| `action-hover` | `#FFA526` | Hover del botón primario |
| `action-active` | `#E68405` | Presionado |
| `action-shadow` | `#C97800` | Sombra inferior de 2 px “táctil” del botón |
| `accent-text` | `#B94F00` | Texto/enlace en naranja (títulos de énfasis) |
| `link` | `#0A66A3` | Enlaces y texto interactivo azul |
| `selected` | `rgba(144,220,244,.18)` sobre marino | Ítem activo del sidebar (+ barra izquierda `gold-500` 3 px) |

### 3.3 Colores semánticos de estado **[Propuesta]**
Cada estado: **fondo tintado + texto oscuro + icono + etiqueta textual**. El color nunca es el único indicador.

| Semántica | Texto/Icono | Fondo | Uso |
|---|---|---|---|
| **Éxito / Confirmado** | `#0B6E4D` | `#E2F5EC` | Pago confirmado, turno entregado, tanda finalizada |
| **Atención / Pendiente** | `#7A5200` | `#FFF3C2` | Pendiente, por vencer, expirada |
| **Error / Crítico** | `#B3203A` | `#FCE6EA` | Vencida, rechazada, duplicada |
| **Información / En proceso** | `#0A66A3` | `#E3F5FC` | Solicitud generada, en proceso, informativo |
| **Revisión** | `#9A4300` | `#FDE6D2` | En revisión, no identificada, por revisar |
| **Neutral** | `#4F6470` | `#E8EEF3` | Borrador, cancelada, sin iniciar |

> **Por qué el verde de éxito no es de la paleta de marca:** la marca no tiene un verde propio y el éxito necesita distinguirse del naranja/oro. Se usa un verde profundo **solo** en etiquetas, iconos de check y la barra “Confirmado”. **El botón primario nunca es verde**, así “verde = verificado” se mantiene exclusivo.
>
> **Naranja ≠ error:** el rojo `#B3203A` se reserva para errores críticos; el naranja de marca no se usa para estados negativos. “Requiere revisión” usa el tono naranja oscuro tintado con icono de lupa.

### 3.4 Colores de gráficas **[Propuesta]**
Orden de series (máx. 5; más → “Otros” gris): 1 marino `#1E323D` · 2 azul `#0A66A3` · 3 naranja `#EB6C01` · 4 oro `#FBCE07` · 5 gris `#8A9AA5`.  
Para **estado de cobranza** usar siempre: Confirmado = verde `#0B6E4D`; Pendiente = oro `#FBCE07`; Vencido = rojo `#B3203A`; En proceso = azul `#0A66A3`. Añadir etiqueta directa o patrón para no depender del color. Cuadrícula `#D3E3EB`. Sin 3D ni gradientes.

### 3.5 Contrastes verificados (WCAG 2.1)

| Combinación | Ratio | Resultado |
|---|---|---|
| `ink-900` sobre blanco / `page` | 13.3 / 12.6 : 1 | AAA |
| Blanco sobre `navy-900` (botón oscuro, sidebar) | 13.3 : 1 | AAA |
| `ink-on-dark` sobre `navy-900` | 9.1 : 1 | AAA |
| `ink-900` sobre `action` `#F3960C` (botón primario) | 5.8 : 1 | AA |
| `ink-900` sobre `action-hover` / `action-active` | 6.8 / 4.9 : 1 | AA |
| `ink-900` sobre `sky-300` | 8.7 : 1 | AAA |
| `ink-900` sobre `gold-500` | 8.8 : 1 | AAA |
| `ink-600` sobre blanco / `page` | 6.2 / 5.9 : 1 | AA |
| `accent-text` `#B94F00` sobre blanco / `page` | 5.0 / 4.8 : 1 | AA |
| `link` `#0A66A3` sobre blanco / `page` | 6.1 / 5.8 : 1 | AA |
| Textos de estado sobre su fondo tintado | 4.9 – 6.2 : 1 | AA |
| `border-input` sobre blanco (componente UI) | 3.8 : 1 | AA (≥ 3) |
| `orange-500` `#EB6C01` con texto blanco | 3.1 : 1 | **No usar** para texto/botón |
| `amber-500` / `gold-500` / `sky-300` sobre blanco | 2.3 / 1.5 / 1.5 : 1 | **No usar como texto** |

**Reglas:** texto ≥ 4.5 : 1; iconos y bordes interactivos ≥ 3 : 1. **Los naranjas y el oro de marca son fondos o elementos gráficos, nunca texto sobre claro.** Texto sobre `action` siempre en azul marino, no blanco.

---

## 4. Tipografía **[Propuesta]**
Gratuitas (Google Fonts), compatibles con español.

| Rol | Familia | Uso |
|---|---|---|
| **Títulos y momentos de marca** | **Poppins** (SemiBold 600 / Bold 700) | H1–H3, cifras destacadas, login. Es la misma familia del logotipo → coherencia. |
| **Interfaz y datos** | **Inter** (400, 500, 600) | Navegación, tablas, formularios, botones, texto corrido. |
| **Cifras** | Inter con `font-variant-numeric: tabular-nums` | Montos, fechas, referencias; derecha en tablas. |
| **IDs y referencias** | `JetBrains Mono` 13 px (opcional) | ID de transacción, referencia Pey, folios. |

| Token | Tamaño / interlineado | Fuente y peso | Uso |
|---|---|---|---|
| `display` | 40 / 48 | Poppins 700 | Login, bienvenida |
| `h1` | 30 / 38 | Poppins 700 | Título de página |
| `h2` | 20 / 28 | Poppins 600 | Título de tarjeta/sección |
| `h3` | 17 / 24 | Poppins 600 | Subsecciones, modales |
| `body-lg` | 16 / 24 | Inter 400 | Texto principal |
| `body` | 14 / 22 | Inter 400 | **Base de la interfaz y tablas** |
| `label` | 13 / 18 | Inter 500–600 | Etiquetas de campo, encabezados de tabla |
| `caption` | 12 / 16 | Inter 500 | Metadatos, ayudas, badges |
| `amount-xl` | 32 / 44 | Poppins 700 tabular | Monto principal en KPI |
| `amount` | 14 / 22 | Inter 500 tabular | Montos en tablas |

Poppins no se usa en tablas ni formularios (solo cifras KPI y títulos). Texto informativo mínimo 12 px.

**Formatos (es-MX):** moneda `$1,250.00 MXN` (siempre 2 decimales; PoC: `$0.01 MXN`) · fecha `8 nov 2026`, con hora `8 nov 2026, 09:39` (America/Mexico_City) · porcentaje `57 %`.

---

## 5. Retícula, espaciado y forma

| Elemento | Valor |
|---|---|
| Unidad base | 4 px; escala 4, 8, 12, 16, 24, 32, 48, 64 |
| Sidebar | 248 px expandida / 72 px contraída |
| Header | 64 px |
| Contenido | fluido, máx. 1280 px; padding lateral 32 (desktop) / 24 (tablet) / 16 (móvil) |
| Retícula | 12 columnas, gutter 20–24 px (desktop) / 16 px (resto) |
| Radios | `sm` 8 (etiquetas) · `md` 12 (botones, inputs) · `lg` 18 (tarjetas) · `xl` 28 (ilustraciones, modales grandes) · `full` (píldoras, avatares) |
| Elevación | `e0` solo borde; `e1` `0 1px 2px rgba(30,50,61,.06)` tarjetas; `e2` `0 10px 28px rgba(30,50,61,.14)` modales/drawers |
| Botón “táctil” | sombra inferior sólida 2 px (`action-shadow`) |

**Breakpoints:** móvil < 640 · tablet 640–1023 · desktop 1024–1439 · amplio ≥ 1440.

Las esquinas más redondeadas (12–18 px) vienen del lenguaje de la ilustración y del logo; mantener en todo el sistema.

---

## 6. Iconografía e ilustración

### 6.1 Iconos
**Lucide** outline, trazo 1.75–2 px, extremos redondeados; 20 px en UI, 16 en badges, 24 en navegación. Siempre con texto, salvo botones de icono con `aria-label` y tooltip.

| Navegación | Icono | Estado | Icono |
|---|---|---|---|
| Inicio | `layout-dashboard` | Confirmado/Pagada | `check-circle-2` |
| Tandas | `users-round` | Pendiente | `clock` |
| Participantes | `contact` | Solicitud generada | `qr-code` / `link` / `smartphone` |
| Aportaciones y cobros | `wallet` | En proceso | `loader` |
| Turnos y entregas | `calendar-days` | Vencida | `alert-circle` |
| Reportes | `bar-chart-3` | Rechazada | `x-circle` |
| Notificaciones | `bell` | En revisión | `search-check` |
| Actividad | `history` | No identificada | `help-circle` |
| Configuración | `settings` | Expirada / Cancelada | `timer-off` / `ban` |

### 6.2 Estilo de ilustración **[Decisión de marca]** (a partir de la referencia)
**Rasgos obligatorios** para cualquier ilustración nueva (propia o de un ilustrador):

1. **Plano, sin degradados ni texturas**, sin contornos; la forma la da el color.
2. **Fondo cielo `#90DCF4`** con círculo/halo más claro (`#DDF4FC`, 60–70 % opacidad); esquinas del lienzo 28 px.
3. **Personajes** de torso o medio cuerpo, proporción amable, rostro mínimo (ojos en arco o cerrados, mejillas rosas, sonrisa). **Piel en naranja** (`#EB6C01`, sombras `#B95603`), cabello en gris azulado `#DBE5EE` o marino `#2B4452`, ropa en marino `#1E323D` con delantal/chaleco en ámbar `#F3960C`. Adornos en oro (argollas, monedas).
4. **Inclusión:** variar edad, cabello, vello facial y accesorios entre personajes; nunca el mismo personaje en todas las pantallas.
5. **Props de marca:** moneda dorada con brillo, **rayos** de 3–5 trazos, **destellos de 4 puntas** (✦) en oro y blanco, celular con QR, calendario, canasta, ramas de hojas azules.
6. **Paleta cerrada:** solo los tokens de 3.1 más blanco. El **verde de éxito** únicamente en la ilustración de confirmación (check).
7. **Trazo de línea** (rayos, bigotes, detalles) de 4–5 px, extremos redondeados.
8. **Prohibido:** ilustración dentro de tablas o junto a montos, personajes con identidad de personas reales, fotografías mezcladas, otros estilos (3D, isométrico, línea fina).

### 6.3 Biblioteca entregada (SVG, carpeta `brand/ilustraciones/`)

| Archivo | Uso |
|---|---|
| `hero-qr.svg` | Panel derecho del login y onboarding (participante muestra QR) |
| `estado-vacio-tandas.svg` | “Aún no tienes tandas” (calendario + canasta) |
| `exito-aportacion.svg` | Modal/pantalla “Aportación confirmada” (única con verde) |

**Por producir** (mismo estilo): estado vacío de participantes · sin resultados de búsqueda · sin permiso · error de carga · sesión expirada · solicitud expirada · tanda finalizada · transacción por revisar · entrega registrada · bienvenida de organizador.

Cada ilustración se construye con grupos con `id` (personaje, moneda, destellos, rayos) para poder animarla igual que el logo.

### 6.4 Patrón de fondo
Círculos concéntricos tenues en `#DDF4FC` y monedas pequeñas dispersas (opacidad ≤ 70 %). Solo en login, cabeceras de estado vacío y onboarding.

---

## 7. Componentes
Todos con estados *default, hover, focus, active, disabled* y, si aplica, *error* y *loading*.

### 7.1 Botones
| Variante | Fondo / texto | Uso |
|---|---|---|
| **Primario** | `action` `#F3960C` / `ink-900`; sombra inferior 2 px; hover `#FFA526`; active `#E68405` y sombra 0 | **Una** acción principal por vista (Crear tanda, Generar QR CoDi) |
| **Secundario** | Blanco, borde 1.5 px `ink-900` / `ink-900`; hover `sky-100` | Acciones alternas |
| **Oscuro** | `navy-900` / blanco | Acciones confirmatorias en modales |
| **Terciario** | Sin fondo / `link`; subrayado en hover | Baja jerarquía |
| **Peligroso** | `#B3203A` / blanco | Anular, cancelar tanda |
| **Icono** | 36×36, radio 12 | Acciones de fila, con tooltip |

Alturas: `lg` 48, `md` 40 (defecto), `sm` 32. Texto Inter 600 14 px. *Loading*: spinner + texto (“Generando…”). **Acciones financieras irreversibles siempre pasan por modal de confirmación.**

### 7.2 Campos
Altura 48 (formularios) / 40 (filtros), borde `border-input` 1.5 px, radio 12, fondo blanco. Etiqueta arriba (`label`), ayuda `caption` ink-600. Foco: borde `link` + anillo (ver 10). Error: borde `#B3203A`, icono + mensaje descriptivo. **Importe:** prefijo `$`, sufijo `MXN`, tabular, derecha; en PoC es **bloqueado** con candado. Selectores con búsqueda; la cuenta asociada muestra **alias + referencia enmascarada**, nunca datos bancarios completos.

### 7.3 Etiqueta de estado (badge)
Píldora de 24 px, radio `full`, padding 0/10, icono 14 + texto `caption` 600, colores de 3.3. Siempre con texto. Si una fila necesita dos estados, usar **dos etiquetas rotuladas** (“Solicitud: Disponible · Pago: Pendiente”).

### 7.4 Tarjeta KPI
Blanco, borde `border`, radio 18, padding 20. `label` ink-600 → `amount-xl` Poppins → comparativo `caption`. Clic navega al listado filtrado. Máx. 4 por fila.

### 7.5 Tablas
Encabezado sticky en `sunken` (esquinas redondeadas), `label` ink-600. Filas 52–56 px (compacto 44). Hover `#F1FAFE`; seleccionada `sky-100` con borde izquierdo oro 3 px. Montos a la derecha, tabulares. Acciones al final. Barra superior: búsqueda, filtros como chips, “Limpiar filtros”, densidad, exportar (con permiso). Paginación 10/25/50 y conteo. Móvil → tarjetas.

### 7.6 Tarjetas de tanda y de participante
- **Tanda:** nombre (h3), badge, organizador, barra de progreso (“8 de 12 aportaciones confirmadas”), próximo turno, monto.
- **Participante:** avatar con iniciales (fondo `sky-300`, texto `ink-900`), nombre, turno (“Turno 3”), badge de cumplimiento.

### 7.7 Barra de progreso
Alto 10, radio `full`, pista `#E8EEF3`; relleno oro `#FBCE07` en curso y verde `#0B6E4D` al 100 %. Siempre con número adyacente. La barra de cobranza usa los colores de 3.4.

### 7.8 Timeline / historial
Línea 2 px `border`, nodos 12 px. Cada evento: icono, descripción clara, usuario o “Sistema”/“Pey”, fecha-hora, valor anterior → nuevo si aplica.

### 7.9 Modales y drawers
Modal 480 (confirmación) / 640 (formulario), radio 28, `e2`, overlay `rgba(30,50,61,.5)`. Estructura: título (verbo explícito) → consecuencias → campos (motivo obligatorio cuando aplique) → botones (cancelar izquierda, acción derecha). Drawer derecho 480 px. Foco atrapado, `Esc` cierra, retorno de foco.

### 7.10 Alertas y toasts
Bloque con icono, título, descripción, acción. Semántica de 3.3. Toast abajo-derecha, 5 s (errores persisten). `role="status"` / `role="alert"`.

### 7.11 Componentes de cobro
- **Visualizador de QR:** tarjeta blanca, borde 2 px marino, radio 18, QR **negro sobre blanco** (nunca recolorear) con margen de 16 px, 240–280 px. Debajo: monto, badge **“Solicitud creada · Pago pendiente de confirmación”** (azul), expiración con cuenta regresiva, botón “Consultar estado”.
- **Caja de link:** campo de solo lectura + “Copiar” (“Copiado”).
- **Stepper Obligación → Solicitud → Transacción:** 3 nodos conectados con estado y referencia propios; el último permanece gris (“Sin transacción”) hasta confirmación verificable, y solo entonces pasa a verde.
- **Ficha de transacción:** dos bloques, “Estado reportado por Pey” y “Estado en la plataforma”; referencias en mono con copiar.
- **Alerta de solicitud expirada:** tono atención con acción “Generar nueva solicitud”.

### 7.12 Calendario de turnos
Vista mensual con chips por día (color por estado de entrega) y vista lista. Día actual con anillo marino. Leyenda visible. Chip: número de turno + nombre abreviado.

### 7.13 Estados transversales
Cargando (skeletons con la forma del contenido, tono `#E8EEF3`) · sin registros (ilustración + acción) · sin resultados (“Limpiar filtros”) · error (reintentar) · sin permisos (qué falta y a quién pedirlo) · éxito/fallo (toast) · sesión expirada (modal) · **datos desactualizados** (franja tono atención “Última sincronización con Pey: hace 12 min · Actualizar”).

---

## 8. Estados de negocio → tratamiento visual
Los estados reales de Pey se mapean después; **no se traducen ni inventan** antes de ver el catálogo oficial.

| Entidad | Estado → semántica / icono |
|---|---|
| **Tanda** | Borrador → neutral `file-pen` · Próxima → info `calendar-clock` · Activa → éxito `play-circle` · Pausada → atención `pause-circle` · Finalizada → neutral `flag` · Cancelada → neutral `ban` |
| **Obligación** | Pendiente → atención `clock` · Solicitud generada → info `qr-code` · En proceso → info `loader` · **Pagada → éxito `check-circle-2`** · Parcial → atención `pie-chart` · Vencida → error `alert-circle` · En revisión → revisión `search-check` · Cancelada → neutral `ban` |
| **Solicitud de cobro** | Creada, Disponible, Actualizada → info · Pendiente, Expirada → atención · Rechazada → error · Cerrada/cancelada → neutral. **Ningún estado de solicitud usa verde.** |
| **Transacción** | *Estado Pey* (valor oficial, etiqueta con borde; desconocido → gris “Estado no reconocido”) + *Estado interno*: Conciliada → éxito · Relacionada → info · En revisión / No identificada → revisión · Duplicada → error |
| **Turno / entrega** | Programado → neutral · Próximo → info · En curso, Reprogramado → atención · Entregado → éxito · Cancelado → neutral |

---

## 9. Movimiento y animación **[Propuesta]**

La marca está pensada para moverse: logo y personajes se construyen en capas. Principios: **breve, con propósito, nunca sobre datos financieros críticos**.

### 9.1 Logo (entregado en `*-animado.svg`)
**Secuencia de entrada (~2.6 s, una sola vez):** el aro se dibuja (1 s) → aparece la canasta con rebote → la **moneda cae** dentro → salen los **rayos** escalonados → crecen las **hojas** → el **corazón** aparece → las **letras suben** una por una (50 ms de desfase).
**Bucle ambiente (suave):** la moneda gira de canto cada 4 s · los rayos pulsan · los destellos titilan · el corazón late. Los bucles se pausan fuera de pantalla.
**Dónde:** pantalla de carga inicial, login y splash; **estático** en sidebar y header.
Ya incluye `prefers-reduced-motion` (todo queda estático).

### 9.2 Micro-interacciones de interfaz
| Momento | Animación | Duración / curva |
|---|---|---|
| Hover/pulsación de botón primario | Sube 1 px y la sombra se reduce al presionar | 120 ms ease-out |
| Aparición de modal / drawer | Fade + desplazamiento 12 px | 200 ms ease-out |
| Cambio de pestaña | Subrayado desliza | 200 ms |
| Badge cambia de estado | Cross-fade de color y icono | 200 ms |
| Barra de progreso | Llena de izquierda a derecha al cargar | 600 ms ease-out |
| Listas / KPIs al cargar | Entrada escalonada (máx. 8 elementos, 40 ms de desfase) | 250 ms |
| Skeletons | Brillo diagonal lento | 1.4 s lineal en bucle |
| **QR generado** | Fade-in; moneda/destello del halo (solo decorativo) | 300 ms |
| **Pago confirmado** | Check dibujándose + destellos y monedas de la ilustración `exito-aportacion` | 900 ms, **una vez** |
| Toast | Entra desde abajo-derecha | 200 ms |

### 9.3 Reglas
- Duraciones: micro 120–200 ms; transición de contenido 200–300 ms; celebración ≤ 1 s. Curvas `ease-out` y rebote leve solo en elementos de marca.
- **Nunca animar** cifras de monto (sin contadores que “suben”) ni cambios de estado financiero de forma que parezca un pago antes de confirmarse.
- La animación de celebración (monedas/destellos) **solo se dispara con pago confirmado verificable**.
- Respetar `prefers-reduced-motion`: sustituir por cambios instantáneos o fades de 0–100 ms.
- Preferir animar `transform` y `opacity`. Para animaciones complejas de ilustración usar CSS/SVG o Lottie exportado desde los mismos grupos (`id`) del SVG.

---

## 10. Accesibilidad e interacción
- **WCAG 2.1 AA** mínimo. Contrastes en 3.5.
- **Foco visible:** anillo 3 px `#0A66A3` con `outline-offset: 2px` (y halo blanco sobre fondos oscuros). Nunca quitar `outline` sin sustituto.
- Objetivos de clic ≥ 40×40 px (24×24 absoluto en controles densos de tabla).
- Navegación completa por teclado, orden lógico, *skip link* “Saltar al contenido”.
- `aria-label` en botones de icono; `<th scope>` en tablas; `aria-live="polite"` en actualizaciones de estado.
- No depender solo del color; ilustraciones informativas con texto alternativo, decorativas `alt=""`.
- Idioma `lang="es-MX"`.
- Modo oscuro: fuera de alcance v1 **[Por confirmar]**; el sidebar ya usa `navy-900` y puede servir de base.

---

## 11. Especificación por pantalla

**Estructura global (autenticadas):**
- **Sidebar** `navy-900`, texto `ink-on-dark`, 248 px. Logo horizontal de fondo oscuro arriba. Ítem activo: fondo `rgba(144,220,244,.18)`, texto blanco 600, barra izquierda `gold-500` 3 px. Pie con perfil y cierre de sesión.
- **Header** 64 px, blanco, borde inferior `border`: breadcrumb · selector de tanda/organización · estado Pey (badge) · notificaciones (punto naranja con contador) · ayuda · perfil (avatar `sky-300`).
- **Cabecera de página:** `h1` (Poppins) + descripción `ink-600` + acción primaria (ámbar) a la derecha → KPIs → filtros → contenido.
- **Fondo de página** `#F1FAFE`; contenido en tarjetas blancas.

### 11.0 Responsive
Desktop: sidebar fija, tablas completas, 3–4 columnas. Tablet: sidebar contraída (72 px, isotipo) con *overlay*, KPIs en 2 columnas, columnas secundarias en “Ver más”. Móvil: barra inferior de 4–5 destinos + “Más”; tablas → **tarjetas** (monto, estado y participante visibles); acción primaria fija abajo; modales a pantalla completa; ilustraciones reducidas al 60 %.

### 11.1 Iniciar sesión / Recuperar acceso *(ver `maqueta-login.png`)*
- Pantalla dividida: izquierda blanca con formulario (logo horizontal 230 px, `display` “Tus tandas, **claras y en orden**” con la segunda línea en `accent-text`, campos, botón primario ancho completo de 48 px); derecha **cielo `#90DCF4`** con halo claro e **ilustración `hero-qr.svg` anclada al borde inferior**. Móvil: solo formulario, con ilustración reducida arriba.
- Estados: vacío, validación, credenciales inválidas (alerta roja sobre el formulario), enviando, sesión expirada (aviso azul), recuperación enviada (ilustración + confirmación).
- El logo animado se reproduce una vez al cargar.

### 11.2 Dashboard *(ver `maqueta-dashboard.png`)*
1. **Saludo** (`h1`) + subtítulo “Esto es lo que necesita tu atención hoy.” + **Crear tanda** (primario).
2. **4 KPIs:** tandas activas, participantes, pendientes, confirmadas.
3. **Cobranza del periodo** (tarjeta ancha): *Esperado · Registrado como pagado · Pendiente* + barra apilada (verde / oro / rojo) con leyenda y selector de periodo.
4. **Requiere atención** (tarjeta con borde izquierdo naranja 5 px): incidencias con badge propio.
5. **Próximos vencimientos** (tabla), *próximos turnos*, *pagos recientes*, *actividad reciente*.
Alertas accionables primero; sin gráficas decorativas en el primer viewport. Sin ilustración en esta pantalla (zona de datos).

### 11.3 Listado de tandas
Cabecera con **Crear tanda**. Alternar tabla / tarjetas. Columnas: tanda, organizador, participantes, aportación, frecuencia, inicio–cierre, progreso, próximo turno, estado, acciones. Filtros: estado, organizador, fechas, búsqueda, cumplimiento. Vacío: `estado-vacio-tandas.svg` + “Aún no tienes tandas” + **Crear tanda**.

### 11.4 Crear / editar tanda (5 pasos)
Contenedor 720–880 px; **stepper** arriba (1 Información · 2 Condiciones · 3 Calendario y turnos · 4 Cobro · 5 Revisión): activo `navy-900` con anillo oro, completados con check verde, pendientes gris; móvil “Paso 2 de 5”. Cada campo explica por qué se pide. Pie fijo: Atrás · Guardar borrador · Siguiente (primario). Paso 3: tabla editable de periodos y orden de turnos (arrastrar + alternativa por teclado). Paso 4: **cuenta asociada** (alias + referencia enmascarada, solo lectura) y tarjetas seleccionables de medios de cobro (QR, Push, Link). Paso 5: resumen editable, advertencias en tono atención, **Activar tanda** deshabilitado hasta estar completo + modal de confirmación.

### 11.5 Detalle de tanda
Cabecera: nombre (h1), id en mono, badge, organizador, inicio, acciones. Resumen: participantes · esperadas · confirmadas · pendientes/vencidas · próximo vencimiento · próximo turno + barra de progreso. **Pestañas** con subrayado oro: Resumen · Participantes · Aportaciones · Cobros y transacciones · Calendario y turnos · Actividad · Configuración (según rol). En Aportaciones, matriz participante × periodo con icono+estado compacto como vista alterna; clic abre drawer de la obligación.

### 11.6 Directorio y perfil de participante
Directorio: avatar + nombre, id, contacto autorizado, tandas activas, estado, pendientes, registro. Perfil: cabecera con avatar y estado; **datos generales** (izquierda) separados de **participación por tanda** (derecha, una tarjeta por tanda); pestañas Obligaciones · Solicitudes · Transacciones · Incidencias · Actividad. Sin datos bancarios sensibles.

### 11.7 Obligaciones
Listado: referencia, tanda, participante, periodo, fecha límite, monto esperado, monto registrado, saldo (si hay parciales), estado, solicitud relacionada. Detalle (drawer/página): bloque de importe, timeline y **stepper Obligación → Solicitud → Transacción**, con recuadro que explica **por qué** está pendiente/en revisión. Acciones: generar solicitud, ver transacciones, registrar incidencia/ajuste (modal con motivo obligatorio).

### 11.8 Solicitudes de cobro
Listado: id interno, referencia Pey (mono), tipo (icono), tanda y participante, obligación, monto, creación, expiración, **estado de solicitud** y **estado del pago** (dos badges rotulados). Detalle: obligación, tipo/referencia, **visor de QR o caja de link** (solo vigente), vigencia, eventos (timeline), transacciones vinculadas, último resultado. Texto fijo bajo el QR: “La solicitud de cobro está lista. El pago todavía no ha sido confirmado.”

### 11.9 Transacciones
Listado: id Pey (mono), referencia interna, fecha-hora, importe, cuenta (alias), origen, referencia QR/link, participante/tanda (o “Sin identificar”), **estado Pey** y **estado de conciliación**. Detalle en drawer con dos bloques (“Reportado por Pey” / “En la plataforma”), obligación y solicitud relacionadas, historial y acciones por permiso. Franja de “última sincronización” si los datos pueden estar desactualizados.

### 11.10 Incidencias y conciliación
Contadores por tipo arriba (sin identificar · diferencia de importe · duplicadas · sin resultado final · estado local ≠ Pey). Tablero/lista por prioridad (crítica rojo, media atención, baja neutral). Detalle con comparación **lado a lado** (esperado vs. recibido) resaltando diferencias con borde naranja, acciones previas, comentarios, responsable, cierre con **motivo obligatorio**. **Prohibido** un botón genérico “Marcar como pagado”: los ajustes manuales exigen permiso, evidencia y motivo, con aviso rojo de impacto.

### 11.11 Turnos y entregas
Calendario mensual / lista / detalle. Detalle del turno: número, receptor, fecha, estado de aportaciones (barra), entrega, notas. **Registrar entrega** (modal): tanda, turno, receptor, monto esperado, fecha, comprobante opcional, observaciones. Aviso informativo: “Aquí se registra la entrega; la plataforma no transfiere el dinero.” **[Por confirmar]**. Al registrar: toast + ilustración de éxito opcional.

### 11.12 Reportes
Rejilla de tarjetas (9 reportes) con descripción. Al abrir: filtros comunes, tarjetas resumen, gráfica (barras por periodo / línea de evolución) y tabla exportable. Cada gráfica con periodo, unidad, leyenda y fuente; colores de 3.4.

### 11.13 Notificaciones
Bandeja en dos paneles o lista: icono por categoría, título, resumen, fecha, tanda, prioridad, lectura (punto `sky`/azul; no leída en 600). Filtros por categoría y “No leídas”; “Marcar todas como leídas”.

### 11.14 Actividad / Auditoría
Tabla/timeline filtrable por usuario, acción, elemento y fecha. Cada evento: usuario o “Sistema”/“Pey”, acción, elemento (enlace), fecha-hora, descripción legible; anterior → nuevo en expandible. Solo lectura.

### 11.15 Configuración
Navegación secundaria vertical: Organización · Usuarios y roles · Parámetros · Preferencias de notificación · Cuentas asociadas · Integración. Usuarios y roles: tabla + matriz de permisos legible. **Cuentas asociadas (solo consulta):** alias, referencia enmascarada, estado, tandas que la usan; aviso azul fijo “Las cuentas se configuran en Pey. Aquí solo puedes consultarlas.” **Integración:** estado de conexión sin secretos. **Ninguna pantalla muestra la API Key.**

---

## 12. Pantalla de la PoC (QR CoDi por $0.01 MXN) *(ver `maqueta-poc-qr.png`)*

Pantalla única; header con logo horizontal y badge de estado de Pey; contenedor centrado de 720 px sobre `#F1FAFE`.

1. **Título** (`h1`): “Prueba de cobro de tanda”.
2. **Tarjeta de aportación:** tanda de demostración · participante · **importe bloqueado `$0.01 MXN`** (Poppins 700, etiqueta “Importe fijo (bloqueado)”) · badge de obligación *Pendiente*.
3. **Botón primario “Generar QR CoDi”** (loading mientras `CREATING`).
4. **Panel del QR:** badge azul **“Solicitud creada · Pago pendiente de confirmación”**, visor de QR (7.11), instrucciones (“Escanea el QR desde una aplicación bancaria compatible y autoriza el pago”), expiración si existe, referencias no sensibles, botón secundario **“Consultar estado”**.
5. **Stepper** Obligación → Solicitud → Transacción.
6. **Historial** (timeline): obligación creada, solicitud creada, evento Pey / consulta, transacción registrada, obligación pagada.

| Estado interno | Mensaje | Semántica / icono | Acción |
|---|---|---|---|
| Sin solicitud | “Aportación pendiente” | atención / `clock` | Generar QR CoDi |
| `CREATING` | “Generando solicitud de cobro…” | info / `loader` | Botón deshabilitado |
| `PENDING` | “QR disponible. Esperando pago.” | info / `qr-code` | Consultar estado |
| `CONFIRMED` | “Aportación confirmada” | **éxito** / `check-circle-2` + ilustración `exito-aportacion` | Ver transacción |
| Rechazado | “El proveedor reportó un rechazo” | error / `x-circle` | Ver detalle |
| Expirado | “La solicitud expiró” | atención / `timer-off` | Generar nueva (con validación) |
| `UNKNOWN` | “No fue posible confirmar el resultado” | atención / `help-circle` | Consultar estado (no crea otro QR) |
| En revisión | “Se requiere revisar la operación” + motivo y referencia | revisión / `search-check` | — |

**Reglas visuales críticas:** el QR y la solicitud creada **nunca** se muestran en verde ni con check; no hay campo editable de monto ni de cuenta; ninguna credencial, token ni CLABE completa en pantalla; sin polling visual automático (actualiza el botón o al recargar); doble clic en “Generar QR” no produce dos cobros (el botón pasa a *loading* de inmediato). La animación de celebración solo ocurre con `CONFIRMED` verificado.

---

## 13. Microcopy

Español de México, tuteo, frases cortas, una idea por frase.

| Usar | Evitar |
|---|---|
| Tanda | grupo, caja |
| Participante | cliente |
| Aportación (esperada / recibida, aclarar) | cuota, “pago” ambiguo |
| Obligación pendiente | pago fallido |
| Solicitud de cobro | “pago” si solo se creó QR/link |
| Transacción | (reservar para lo que reporta Pey) |
| Pago confirmado | pago exitoso sin confirmación |
| Entrega del turno | cobro |
| Cuenta asociada (“configurada en Pey”) | cuenta del participante |

**Mensajes modelo:** Solicitud creada: “La solicitud de cobro está lista. El pago todavía no ha sido confirmado.” · Confirmado: “La aportación se confirmó y quedó registrada en esta tanda.” · Pendiente: “Estamos esperando la actualización del proveedor. Consulta de nuevo más tarde.” · No identificada: “Recibimos una transacción que todavía no se relaciona con una aportación.” · Expirada: “Esta solicitud ya no está disponible. Genera una nueva para continuar.” · Diferencia: “El importe recibido no coincide con el esperado. La aportación requiere revisión.” · Sin resultados: “No encontramos registros con los filtros seleccionados.” · Sin permiso: “No tienes permiso para esta acción. Pide acceso a tu administrador.” · Confirmación peligrosa: “¿Anular esta aportación?” + “Quedará registrado quién la anuló y por qué.”

Los textos definitivos se revisan con operación y soporte.

---

## 14. Entregables y criterios de aceptación

### 14.1 Archivos entregados (`brand/`)
| Archivo | Contenido |
|---|---|
| `logo-tu-coperacha.svg` / `-animado.svg` / `-fondo-oscuro.svg` | Logo vertical (estático, animado, versión para fondo oscuro) |
| `logo-horizontal.svg` / `-animado.svg` / `-fondo-oscuro.svg` | Logo horizontal |
| `isotipo.svg` / `isotipo-animado.svg` | Medallón sin texto (favicon, sidebar contraída) |
| `animacion-logo.html` | Vista previa con botón “Repetir animación” |
| `ilustraciones/hero-qr.svg`, `estado-vacio-tandas.svg`, `exito-aportacion.svg` | Biblioteca inicial de ilustración |
| `maqueta-login.png`, `maqueta-dashboard.png`, `maqueta-poc-qr.png` | Maquetas de referencia del concepto |

### 14.2 Entregables de diseño pendientes
**Prioridad 1 – Sistema (Figma):** tokens como variables (color, tipografía, espaciado, radios, sombras); biblioteca de componentes de 7 y 8 con todas sus variantes; página de estados transversales; versión simplificada del isotipo (< 32 px) y favicon/app icon.
**Prioridad 2 – Prototipos de alta fidelidad (desktop):** Dashboard · Crear tanda (5 pasos) · Detalle de tanda · Gestión de aportaciones · Generar solicitud de cobro · Consultar transacción · Resolver incidencia · Calendario de turnos · **Pantalla PoC**.
**Prioridad 3:** las 25 pantallas del inventario del documento de producto, adaptaciones tablet y móvil, y el resto de ilustraciones de 6.3.
**Para el desarrollador/agente:** exportar los tokens del Apéndice A como variables CSS o `tailwind.config` con los mismos nombres.

### 14.3 Criterios de aceptación visual
- [ ] Obligación, solicitud, transacción y pago confirmado son visualmente distinguibles en cualquier pantalla.
- [ ] Verde y check aparecen **solo** en estados verificados (pago, entrega, tanda finalizada) y en la ilustración de éxito.
- [ ] El botón primario es ámbar con texto marino; nunca verde ni naranja con texto blanco.
- [ ] Todos los textos informativos ≥ 4.5 : 1; ningún estado depende solo del color; bordes de campos ≥ 3 : 1.
- [ ] Naranjas, oro y cielo se usan como fondo/gráfico, nunca como texto sobre claro.
- [ ] Montos tabulares, alineados a la derecha, con formato `$0.00 MXN`.
- [ ] Cada listado/detalle tiene diseño de carga, vacío, sin resultados, error, sin permiso y datos desactualizados.
- [ ] Ilustración solo en login, estados vacíos, éxito y onboarding; nunca junto a tablas de montos.
- [ ] Animaciones respetan `prefers-reduced-motion`; la celebración solo tras confirmación verificable.
- [ ] La PoC no expone credenciales, CLABE completa ni campos editables de monto/cuenta.
- [ ] Desktop, tablet y móvil definidos para las pantallas principales.

---

## 15. Pendientes que afectan el diseño

| Pendiente | Impacto visual |
|---|---|
| Aprobación final del logo rediseñado y de la paleta v2.0 | Todo el sistema |
| Versión simplificada del isotipo (< 32 px) | Favicon, sidebar contraída |
| Modelo (organizador independiente vs. empresa) | Selector de organización, navegación por rol |
| Pagos parciales / anticipados | Estado “Parcial”, columna de saldo, barra por obligación |
| Catálogo oficial de estados de Pey y payload del webhook | Textos y colores finales de estados |
| Vigencia de QR/links y cancelación | Cuenta regresiva, “Expirada”, botón cancelar |
| Entrega del turno (¿dispersión integrada?) | Copy del modal y estados de turno |
| Acceso web para participantes | Vista participante |
| Modo oscuro | Duplicación de tokens |
| Canales externos de aviso | Pantalla de preferencias de notificación |

---

## Apéndice A — Tokens listos para implementar (CSS)

```css
:root {
  /* Marca (de la ilustración de referencia) */
  --sky-300:#90DCF4; --navy-900:#1E323D; --orange-500:#EB6C01; --amber-500:#F3960C;
  --gold-500:#FBCE07; --ice-200:#DBE5EE; --blue-500:#0F8AD4; --pink-300:#F2B3BE; --brown-600:#B95603;

  /* Superficies y texto */
  --page:#F1FAFE; --card:#FFFFFF; --sunken:#EAF6FB; --sky-100:#DDF4FC;
  --border:#D3E3EB; --border-input:#6F8794;
  --ink-900:#1E323D; --ink-600:#4F6470; --ink-on-dark:#C9D8E0;

  /* Acción y texto de acento */
  --action:#F3960C; --action-hover:#FFA526; --action-active:#E68405; --action-shadow:#C97800;
  --accent-text:#B94F00; --link:#0A66A3;

  /* Estados: texto / fondo */
  --success-fg:#0B6E4D; --success-bg:#E2F5EC;
  --warning-fg:#7A5200; --warning-bg:#FFF3C2;
  --danger-fg:#B3203A;  --danger-bg:#FCE6EA;
  --info-fg:#0A66A3;    --info-bg:#E3F5FC;
  --review-fg:#9A4300;  --review-bg:#FDE6D2;
  --neutral-fg:#4F6470; --neutral-bg:#E8EEF3;

  /* Tipografía */
  --font-display:"Poppins",system-ui,sans-serif;
  --font-ui:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;
  --font-mono:"JetBrains Mono",ui-monospace,monospace;

  /* Espaciado (base 4) */
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px;
  --space-6:24px; --space-8:32px; --space-12:48px; --space-16:64px;

  /* Forma y elevación */
  --radius-sm:8px; --radius-md:12px; --radius-lg:18px; --radius-xl:28px; --radius-full:999px;
  --shadow-1:0 1px 2px rgba(30,50,61,.06);
  --shadow-2:0 10px 28px rgba(30,50,61,.14);

  /* Layout */
  --sidebar-w:248px; --sidebar-w-collapsed:72px; --header-h:64px;
}
body{background:var(--page);color:var(--ink-900);font-family:var(--font-ui)}
h1,h2,h3,.display{font-family:var(--font-display)}
.tnum{font-variant-numeric:tabular-nums}
.btn-primary{background:var(--action);color:var(--ink-900);border-radius:var(--radius-md);box-shadow:0 2px 0 var(--action-shadow)}
.btn-primary:hover{background:var(--action-hover)}
.btn-primary:active{background:var(--action-active);box-shadow:none;transform:translateY(2px)}
:focus-visible{outline:3px solid var(--link);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
```

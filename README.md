# Hypelab Blocks

Biblioteca de secciones HTML autocontenidas para pegar en widgets **HTML de Elementor** en sitios WordPress de clientes Hypelab.

Desarrolladas y mantenidas por el equipo de **Hypelab**.

## Convención

Una sección = **un fichero `.html` autocontenido** con HTML + `<style>` + `<script>` dentro. Cero dependencias externas salvo las que ya carga el sitio del cliente (jQuery si aplica, Elementor Pro, etc.).

```
hypelab-blocks/
├── _shared/              # Secciones reutilizables entre clientes
│   └── ejemplo.html
├── <cliente-slug>/       # Una carpeta por cliente (slug kebab-case)
│   └── <nombre-seccion>.html
└── README.md
```

### Naming de ficheros

- Usar `kebab-case`: `hero-producto-v1.html`, `cta-contacto-newsletter.html`.
- Si hay variantes, sufijo `-v1`, `-v2`. No sobrescribir versiones anteriores — crear nueva versión.

### Estructura interna de cada `.html`

```html
<!-- nombre: hero-producto-v1 -->
<!-- cliente: doe -->
<!-- creado: 2026-04-13 -->
<!-- uso: pegar dentro de un widget HTML de Elementor -->

<div class="hl-hero-producto-v1">
  <!-- markup -->
</div>

<style>
  /* Prefijo único de clase (hl-<nombre>-vN) para evitar colisiones con el tema del cliente. */
  .hl-hero-producto-v1 { /* ... */ }
</style>

<script>
  // JS idempotente: si el widget se re-renderiza (Elementor edit), no debe duplicar listeners.
  (function () {
    const root = document.querySelector('.hl-hero-producto-v1');
    if (!root || root.dataset.hlInit) return;
    root.dataset.hlInit = '1';
    // ...
  })();
</script>
```

### Reglas duras

- **Prefijo único de clase** (`hl-<nombre>-vN`) en todas las reglas CSS. Nunca selectores globales (`body`, `h1`, etc.).
- **JS idempotente** con guarda `data-hl-init` — Elementor puede re-renderizar el widget varias veces en modo edición.
- **Sin peticiones externas** (CDNs, fonts) salvo aprobación explícita en la spec.
- **Responsive mobile-first**, probado mentalmente en 360px, 768px, 1200px.
- **Accesible**: `alt` en imágenes, contrastes AA, orden lógico del DOM.

## Flujo de trabajo

1. Se crea el bloque `.html` y se sube en una rama feature.
2. Se valida visualmente en la preview de Vercel.
3. Se hace merge a `main` — URL permanente disponible en `hypelab-blocks.vercel.app`.
4. El contenido se pega en el widget HTML de Elementor del sitio del cliente y se publica.

## Licencia

Privado. Uso exclusivo Hypelab - Digital.

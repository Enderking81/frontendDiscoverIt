# DiscoverIt · Frontend

SPA de DiscoverIt, una plataforma para descubrir y recomendar lugares de Rosario.

**Stack:** Angular 17 (componentes standalone) · Tailwind CSS · Leaflet · Karma/Jasmine · Playwright

## Requisitos

- Node.js 20 o superior y [pnpm](https://pnpm.io/installation)
- El [backend](https://github.com/Enderking81/backendDiscoverIt) corriendo en `http://localhost:3000`

## Instalación y uso

```bash
pnpm install
pnpm start       # http://localhost:4200
pnpm build       # build de producción en dist/
```

La URL de la API se configura por ambiente en `src/environments/`. `environment.development.ts` se usa con `pnpm start` y `environment.ts` con el build de producción.

## Tests

```bash
pnpm test                          # 32 tests unitarios (Karma + Chrome headless)
pnpm e2e                           # 51 tests end-to-end en escritorio y celular (Playwright, usa el Chrome instalado)
pnpm exec playwright show-report   # reporte HTML del último e2e
```

**Unitarios:** sesión y vencimiento del token, guards de rutas, interceptores (token y manejo de errores), filtros del listado con debounce, formulario de registro y la card de lugar.

**End-to-end** (contra el backend real):
- **Invitado:** explora, filtra, busca y abre un detalle. Las rutas protegidas lo mandan al login.
- **Usuario:** se registra, recomienda un lugar, edita y borra su recomendación, maneja favoritos, edita el perfil y se da de baja.
- **Administrador:** crea una categoría y un lugar (que aparece en el listado público), lo edita, no puede borrar una categoría en uso y después borra todo.
- **Calidad:** accesibilidad WCAG 2.1 AA con axe-core (incluido el modo oscuro y las pantallas protegidas), sin desbordes horizontales ni errores de consola, recarga de páginas internas, mapa, modo oscuro y menú lateral.

Los e2e levantan el backend y el frontend si no están corriendo, así que necesitan MySQL con las migraciones y los seeders aplicados. Cada recorrido usa datos únicos y los borra al terminar, así que no ensucian la base.

## Estructura

```
src/app/
  core/
    models/         interfaces y tipos de los datos de la API
    services/       un service por recurso (place, category, recommendation, favorite, user, auth, admin)
    interceptors/   agrega el token JWT y muestra los errores de la API como notificaciones
    guards/         authGuard (usuario logueado) y adminGuard (administrador)
  components/       componentes reutilizables (card, mapa, header, sidebar, toasts)
  pages/            una carpeta por pantalla: home, detalle, perfil, favoritos, admin
  auth/             login y registro
```

## Pantallas y niveles de acceso

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Listado con filtros por categoría, búsqueda y mapa | Público |
| `/places/:id` | Detalle del lugar y sus recomendaciones | Público (recomendar requiere sesión) |
| `/login`, `/register` | Inicio de sesión y registro | Público |
| `/profile` | Perfil, edición y baja de la cuenta | Usuario |
| `/favorites` | Mis favoritos | Usuario |
| `/admin` | Gestión de lugares y categorías, estadísticas | Administrador |

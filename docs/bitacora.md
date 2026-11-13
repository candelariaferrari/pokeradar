# Bitácora de decisiones y aprendizajes

Durante el desarrollo llevé una bitácora con cada decisión técnica o de diseño importante. Esta es una selección de las 20 más relevantes. Las notas las fui redactando con Claude mientras trabajábamos; las elegí, las revisé y las resumí yo.

Cada entrada cuenta **qué pasó**, **qué decidimos** y **qué aprendí**.

---

## Arquitectura Next.js

### 1. Servidor por defecto, cliente solo donde hace falta
**Situación:** era mi primera vez con el App Router. **Decisión:** las páginas y los Route Handlers son de servidor. La ficha `/pokemon/[id]` llega con los datos en el HTML y solo tiene dos "islas" de cliente (favoritos y descubrimiento). El mapa es cliente y se carga con `dynamic(..., { ssr: false })`, porque MapLibre necesita `window`. **Aprendizaje:** cuanto menos `"use client"`, menos JavaScript viaja al navegador.

### 2. Route Handlers como intermediarios
**Situación:** la ficha y el clima dependen de APIs externas. **Decisión:** el navegador le pide a nuestro servidor (`/api/pokemon/[id]`, `/api/weather/[region]`) y el servidor valida, traduce al español, recorta la respuesta y la cachea con `"use cache"` + `cacheLife`. **Aprendizaje:** si mañana cambia el proveedor del clima, se toca un solo archivo.

### 3. Cache Components y lo que no puede pasar en el render
**Situación:** el primer escaneo usaba `Math.random()` y rompía el prerender de Next 16. **Decisión:** el primer escaneo ocurre cuando el mapa termina de cargar, no durante el render. **Aprendizaje:** leer el stack trace hasta el origen (`[app-ssr]`) dice exactamente dónde está el problema.

### 4. Una sola fuente de verdad para el estado
**Situación:** al detectar mi ubicación, la cámara se movía pero el sidebar seguía marcando otra región. **Decisión:** la ubicación ya no mueve la cámara por su cuenta: pasa por el mismo camino que tocar una región. Los componentes avisan (`onUserLocated`) y el `Explorer`, que es el dueño del estado, decide. **Aprendizaje:** si dos partes de la app "cuentan historias distintas", falta un único dueño del estado.

### 5. Cada dato vive donde corresponde
**Situación:** detectados, descubiertos y equipo parecían lo mismo. **Decisión:** los detectados son efímeros (`useState`). Descubiertos y equipo son la colección del usuario: un store sobre `localStorage` con `useSyncExternalStore`, sin errores de hidratación y sincronizado entre pestañas. **Aprendizaje:** elegir dónde vive cada dato es parte del diseño.

---

## Mapa y datos

### 6. La IA asumió una versión vieja de MapLibre *(error de la IA)*
**Situación:** el código propuesto era para la v5 (`import maplibregl from`), pero se instaló la v6: sin default export y con otra forma de cargar el worker. El mapa quedaba en blanco y el worker fallaba con "MIME type text/html". **Decisión:** `import * as maplibregl`, worker servido desde `/public` y un script `postinstall` para que no se desactualice. **Aprendizaje:** antes de seguir un tutorial (o a una IA), mirar la versión real en `node_modules/<lib>/package.json`.

### 7. El mapa invisible sin ningún error
**Situación:** el mapa no se veía y la consola estaba limpia. **Decisión:** en DevTools vimos la clase `absolute` tachada: `maplibre-gl.css` está fuera de las cascade layers de Tailwind v4 y le gana. Envolvimos el mapa en un contenedor propio. **Aprendizaje:** no pelear con una librería sobre el mismo elemento.

### 8. React dentro de MapLibre
**Situación:** MapLibre necesita un elemento HTML por marcador; React necesita controlar lo que se dibuja. **Decisión:** MapLibre posiciona un `<div>` y React dibuja el `RadarMarker` adentro con `createPortal`. **Aprendizaje:** el marcador sigue siendo un componente normal, con props y eventos.

### 9. Validar la regla con datos antes de programarla
**Situación:** había que decidir dónde vive cada uno de los 151 Pokémon. **Decisión:** tipo principal +2, secundario +1, gana la región con más puntos y los empates se resuelven por familia evolutiva. Se simuló antes de programarla y aparecieron dos problemas (un Pokémon sin región y familias partidas). El resultado se precalcula en un JSON. **Aprendizaje:** lo que no cambia se calcula una vez (build-time); lo pesado o cambiante se pide cuando hace falta.

### 10. Los filtros salen de los datos, no de la configuración
**Situación:** la Costa Atlántica no mostraba ningún filtro de tipo. **Decisión:** los filtros se calculan con los Pokémon que realmente viven en cada región, incluidos los tipos secundarios, con un mínimo de 2 por tipo. **Aprendizaje:** si una UI depende de datos, derivarla de los datos evita que configuración y realidad se desincronicen.

### 11. El mapa como navegación
**Situación:** al alejar el zoom no se sabía dónde estaban las otras regiones. **Decisión:** una sola capa dibuja todas las regiones, cada una con su color (`["get", "color"]`). La opacidad depende del zoom (`interpolate`) y tocar una región viaja hacia ella. **Aprendizaje:** los estilos data-driven de MapLibre resuelven en el mapa lo que en React necesitaría estado y listeners.

---

## UX / UI

### 12. Una animación tiene que contar algo
**Situación:** la IA propuso un barrido verde tipo "relámpago" al escanear, y al probarlo no comunicaba nada. **Decisión:** lo reemplazamos por la salida de los Pokémon viejos y la entrada escalonada de los nuevos. **Aprendizaje:** antes de animar, preguntarse qué le explica eso al usuario.

### 13. Una regla de juego tiene que sentirse y verse
**Situación:** cambiaba de región y el radar siempre decía lo mismo sobre el clima. **Decisión:** la regla suma temperatura y viento con prioridades explícitas, y se muestra en pantalla ("Lluvia · más Agua y Bicho"). **Aprendizaje:** una mecánica que el usuario no ve no existe para él; y si muchos casos dan el mismo resultado, se siente que "no cambia nada".

### 14. Color con significado
**Situación:** la interfaz se veía "todo verde". **Decisión:** el color de tipo **identifica** (marcadores, contornos de región, equipo) y el lima marca **estado** (selección, foco, radar activo). Los colores salen de un único lugar (`globals.css`), y el mapa los lee con `getComputedStyle`. **Aprendizaje:** más color no rompe la coherencia si cada color tiene un significado.

### 15. Mobile no es desktop achicado
**Situación:** en el celular el mapa quedaba tapado y el buscador escondido. **Decisión:** el buscador queda siempre visible, los controles van en la zona del pulgar (sin + y −: el zoom con dos dedos es universal) y abajo hay un único panel con prioridad: Pokémon elegido > equipo > región. **Aprendizaje:** en mobile, el espacio del mapa es lo más valioso.

### 16. Cada estado tiene diseño
**Situación:** "0 descubiertos" aparecía un instante antes del número real. **Decisión:** skeletons mientras el navegador hidrata, pantalla de carga "Iniciando radar…" y errores con "Reintentar". **Aprendizaje:** un "0" que cambia parece un error; un skeleton dice "estoy cargando".

### 17. Dos públicos, dos experiencias
**Situación:** para compartir el equipo hacía falta una página, pero como dueña no quería salir del mapa para verlo. **Decisión:** el dueño lo ve en un modal (`<dialog>` nativo) y quien recibe el link entra a `/team/[ids]`, con imagen de vista previa generada con `opengraph-image.tsx`. Los dos usan el mismo componente de tarjetas. **Aprendizaje:** el mismo contenido puede necesitar contenedores distintos según quién lo mira.

---

## Calidad y proceso

### 18. Medir producción y explicar el techo
**Situación:** Lighthouse mobile daba entre 34 y 46 según la corrida. **Decisión:** medir sobre `npm run build` + `npm start`, varias veces, y tomar la mediana. Optimizamos lo que dependía de nosotros (estilo de mapa aligerado, espacio reservado, precarga en tiempo libre) y documentamos el resto. **Aprendizaje:** un mapa WebGL tiene un techo en mobile; lo valioso es medir, optimizar lo posible y saber explicar el trade-off.

### 19. Bien escrito, pero no conectado *(error de la IA)*
**Situación:** el sonido de escanear y el de cambiar de región nunca sonaban. Las funciones estaban bien escritas, pero los botones seguían llamando a las versiones sin sonido, y TypeScript no avisa porque las firmas son iguales. **Decisión:** buscamos dónde se usaba cada función y conectamos los props correctos. **Aprendizaje:** cuando algo "no anda", verificar primero que esté conectado, antes de sospechar de la lógica.

### 20. Auditar a la IA contra la consigna *(error de la IA)*
**Situación:** antes de releer el PDF del desafío, la IA propuso tests y CI como lo más urgente. **Decisión:** contrasté esa propuesta con la ponderación real (35% visual, 15% IA y README) y reordenamos: deploy y README primero; tests a "Próximos pasos". **Aprendizaje:** las sugerencias de la IA se validan contra los requisitos reales, no contra "lo que suele pedirse".

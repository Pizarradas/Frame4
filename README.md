# FRAME IV — Moving Matter

Cuarta exploración conceptual de FRAME. Una experiencia que transforma composición, escala y color durante un único recorrido de scroll.

## Abrir

Abre `dist/index.html` o usa `python -m http.server 8000 --directory dist`. Todos los recursos son locales, incluidos GSAP, ScrollTrigger, MotionPathPlugin, fuentes y vídeos. Para recompilar: `npm ci` y `npm run build`.

## Experiencia

En escritorio ≥64em y altura ≥720px, una escena de 100svh se fija mientras cinco capítulos se transforman. Una F sigue una ruta curva real con MotionPath; las otras letras se reúnen para formar FRAME. El vídeo inicial cambia de escala; el manifiesto desplaza su jerarquía; Color in Motion pasa de 2:1 a 5:1; la señal despliega un túnel radial y mueve los dos renglones del título en direcciones distintas; el vídeo de proceso crece de un recorte lateral al fondo completo. Flechas y enlace de salto permiten recorrerlo sin depender únicamente del gesto de scroll.

Móvil y ventanas bajas: cinco escenas en flujo vertical, con parallax moderado. Movimiento reducido: sin pin ni animación GSAP, contenido completo. Las escenas ocultas son inert y aria-hidden; el índice se anuncia solo al cambiar de capítulo. Los fondos tienen pausa manual y se detienen fuera de vista, al abrir el visor y en pestaña oculta.

El laboratorio de señal es funcional: un range controla amplitud y un botón pausa o reproduce el canvas. No hay sonido. El visor de vídeos usa dialog y controles nativos.

## Arquitectura

SYX aporta el tema desde su plantilla, primitivas/semánticos/componentes, fuentes, botones y disclosures; tokens de composición medidos en `src/theme/_grid-tokens.scss`. El consumidor escribe sus piezas bajo `wow4-` en syx.app, con mixins de movimiento y posicionamiento. Grid System calcula seis pistas útiles en móvil, doce desde 48em y proporciones de escritorio; no se redefine layout-grid. La coreografía usa GSAP 3.15.0 + ScrollTrigger + MotionPathPlugin, scroll nativo y contextos reversibles.

`src/wow4.scss`: estilos de experiencia. `src/theme`: tema SYX propio. `src/syx.scss`: bundle. `dist/assets/wow4.js`: coreografía, capítulos, visor y laboratorio. `vendor/syx`: sistema original y validadores. `docs`: derivación y resultados.

## Validación

Compilación, sintaxis JavaScript, recursos locales, escáner (0 hallazgos), contraste de tema (436 mediciones, 0 fallos) y elección de modo comprobados. No se dispone de navegador de QA en este entorno: el resultado visual, las transiciones en dispositivos reales, el foco y el rendimiento siguen pendientes de medición. No se afirma una auditoría integral ni una calificación Awwwards.

Agencia y proyectos conceptuales; vídeos aportados por el usuario, optimizados sin alterar originales. Créditos y licencias: SYX https://github.com/Pizarradas/syx; GRID https://github.com/Pizarradas/skill--grid-system; GSAP https://gsap.com/standard-license. Avisos originales GSAP conservados en sus archivos.

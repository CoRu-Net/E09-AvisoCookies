# Aviso de cookies y preferencias

## Cómo ejecutarlo

Abre esta carpeta en VS Code, reabre su Dev Container y visita `http://localhost:3409`. En terminal ejecuta `npm test`, `npm run lint` y `npm run format:check`; no hay `npm start` porque la página se sirve en el puerto indicado.

## Qué se guarda y dónde

| Dato | Mecanismo | Clave o nombre | Duración | Por qué ese mecanismo |
|---|---|---|---|---|
| Consentimiento | `localStorage` JSON versionado | `consentimiento` | 12 meses | Persiste categorías y fecha para aplicar y renovar la decisión |
| Consentimiento resumido | Cookie | `consentimiento` | 1 año | Demuestra persistencia web con atributos `SameSite=Lax` y `Secure` en HTTPS |
| Tema elegido | `localStorage` JSON | `preferencias` (`{tema}`) | Hasta cambiar/borrar | Preferencia técnica para personalizar la interfaz |
| Aplazamiento | `sessionStorage` | `consentimiento-aplazado` | Esta pestaña | No vuelve a mostrar el aviso durante la sesión actual |

## Privacidad

El tema es una preferencia técnica solicitada por el usuario. Analítica y personalización no se activan sin decisión explícita. La única analítica de la práctica es un mensaje simulado de consola y solo se registra si el consentimiento vigente incluye analítica. La decisión queda fechada y caduca a los 12 meses: al caducar se vuelve a preguntar. Rechazar y aceptar aparecen como acciones directas del mismo diálogo; aplazar no registra consentimiento.

La práctica ilustra principios de consentimiento informado y granularidad; no constituye asesoría jurídica. En una web real hay que revisar RGPD, LSSI y la guía de cookies de la AEPD.

## Interacción

«Aceptar todas» marca las dos categorías opcionales; «Rechazar» guarda solo las técnicas; «Guardar selección» conserva las casillas elegidas. «Decidir más tarde» y `Esc` aplazan en `sessionStorage` y no guardan un consentimiento. «Configurar cookies» permite reabrir el diálogo. Se usa `<dialog>` modal, controles etiquetados y un resumen insertado con `textContent`.

## Pruebas

`npm test`: 3 ficheros, 8 tests pasados.

Los tests de Vitest cubren creación/lectura de cookies y consentimiento, resumen con `Intl`, fechas válidas y caducadas, versión/JSON erróneos, almacenamiento lleno, preferencias válidas y corruptas. `AlmacenFalso` implementa un almacenamiento en memoria. `vi.useFakeTimers()` y `vi.setSystemTime()` controlan el instante de caducidad; los temporizadores se restauran en `afterEach`.

Las pruebas se ejecutaron con las dependencias instaladas localmente sin generar lockfile. Las interacciones del aviso en navegador no se probaron.

## Depuración

La sesión manual del panel Aplicación no se realizó. Al verificar, comprueba `localStorage` (`consentimiento`, `preferencias`), `sessionStorage` y cookies tras aceptar, rechazar y aplazar. Una fecha antigua o JSON corrupto invalida la decisión y al recargar debe volver a mostrarse el diálogo; una preferencia corrupta debe caer al tema del sistema.

## Herramientas

`npm run lint` y `npm run format:check` finalizaron sin errores.

## Integración continua (opcional)

No implementada. No se creó workflow ni se publicó nada en GitHub.

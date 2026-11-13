/**
 * Crear y leer cookies como texto. Las funciones no escriben en `document.cookie`:
 * devuelven o reciben el texto, para poder probarlas fuera del navegador.
 * @module cookies
 */

/**
 * Texto de una cookie listo para asignar a `document.cookie`.
 *
 * @param {string} nombre
 * @param {string} valor Se codifica con encodeURIComponent.
 * @param {object} [opciones]
 * @param {number} [opciones.maxAge] Segundos hasta que caduca. Sin él, es una cookie de sesión.
 * @param {string} [opciones.path='/']
 * @param {'Strict'|'Lax'|'None'} [opciones.sameSite='Lax']
 * @param {boolean} [opciones.secure=false]
 * @returns {string}
 * @example
 * crearCookie('idioma', 'es', { maxAge: 3600 }); // 'idioma=es; max-age=3600; path=/; SameSite=Lax'
 */
export function crearCookie(
  nombre,
  valor,
  { maxAge, path = '/', sameSite = 'Lax', secure = false } = {},
) {
  const partes = [`${nombre}=${encodeURIComponent(valor)}`];
  if (maxAge !== undefined) partes.push(`max-age=${maxAge}`);
  partes.push(`path=${path}`, `SameSite=${sameSite}`);
  if (secure) partes.push('Secure');
  return partes.join('; ');
}

/**
 * Valor de una cookie, o null si no existe.
 *
 * @param {string} nombre
 * @param {string} [texto] Texto de las cookies; por defecto, `document.cookie`.
 * @returns {string|null}
 */
export function leerCookie(nombre, texto = globalThis.document?.cookie ?? '') {
  const prefijo = `${nombre}=`;
  const parte = texto
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefijo));
  if (!parte) return null;
  try {
    return decodeURIComponent(parte.slice(prefijo.length));
  } catch {
    return null;
  }
}

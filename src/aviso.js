/**
 * Aviso de cookies con <dialog>. Es la única parte que toca el DOM y `document.cookie`.
 * @module aviso
 */

import { crearConsentimiento, guardarConsentimiento } from './consentimiento.js';
import { crearCookie } from './cookies.js';
const dialogo = document.querySelector('#aviso-cookies');
const aplazado = 'consentimiento-aplazado';
/** @param {object|null} anterior @param {(registro: object|null) => void} alDecidir */
export function mostrarAviso(anterior, alDecidir) {
  const formulario = dialogo.querySelector('form');
  formulario.elements.analitica.checked = anterior?.analitica === true;
  formulario.elements.personalizacion.checked = anterior?.personalizacion === true;
  dialogo.returnValue = '';
  dialogo.addEventListener(
    'close',
    () => {
      const decision = dialogo.returnValue;
      if (decision === 'despues' || !decision) {
        try {
          sessionStorage.setItem(aplazado, 'si');
        } catch {
          /* sesion privada bloqueada */
        }
        alDecidir(null);
        return;
      }
      const registro = crearConsentimiento({
        analitica:
          decision === 'aceptar' ||
          (decision === 'guardar' && formulario.elements.analitica.checked),
        personalizacion:
          decision === 'aceptar' ||
          (decision === 'guardar' && formulario.elements.personalizacion.checked),
      });
      guardarConsentimiento(registro);
      const valor = registro.analitica ? 'analitica' : 'tecnicas';
      document.cookie = crearCookie('consentimiento', valor, {
        maxAge: 31_536_000,
        sameSite: 'Lax',
        secure: location.protocol === 'https:',
      });
      try {
        sessionStorage.removeItem(aplazado);
      } catch {
        /* no disponible */
      }
      alDecidir(registro);
    },
    { once: true },
  );
  dialogo.showModal();
}
/** @returns {boolean} */
export function avisoAplazado() {
  try {
    return sessionStorage.getItem(aplazado) === 'si';
  } catch {
    return false;
  }
}

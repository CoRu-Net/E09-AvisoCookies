// E09 · Librería La Hoja: tema, aviso de cookies y analítica según el consentimiento
import { consentimientoVigente, leerConsentimiento, textoResumen } from './consentimiento.js';
import { leerTema, guardarTema, temaAplicable } from './preferencias.js';
import { mostrarAviso, avisoAplazado } from './aviso.js';
const resumen = document.querySelector('#resumen-cookies');
let consentimiento = leerConsentimiento();
let analiticaYaActivada = false;
function activarAnalitica(registro) {
  if (!analiticaYaActivada && consentimientoVigente(registro) && registro.analitica) {
    analiticaYaActivada = true;
    console.info('📊 Analítica activada (simulada)');
  }
}
function mostrarResumen(registro) {
  consentimiento = registro;
  resumen.textContent = textoResumen(registro);
  activarAnalitica(registro);
}
const consultaTema = matchMedia('(prefers-color-scheme: dark)');
const botonTema = document.querySelector('#cambiar-tema');
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  botonTema.textContent = tema === 'oscuro' ? '☀️ Claro' : '🌙 Oscuro';
}
aplicarTema(temaAplicable(leerTema(), consultaTema.matches));
botonTema.addEventListener('click', () => {
  const tema = document.documentElement.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
  aplicarTema(tema);
  guardarTema(tema);
});
document
  .querySelector('#configurar-cookies')
  .addEventListener('click', () => mostrarAviso(consentimiento, mostrarResumen));
if (consentimientoVigente(consentimiento)) mostrarResumen(consentimiento);
else {
  resumen.textContent = textoResumen(null);
  if (!avisoAplazado()) mostrarAviso(consentimiento, mostrarResumen);
}

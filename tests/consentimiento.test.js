import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CADUCIDAD_MESES,
  VERSION,
  consentimientoVigente,
  crearConsentimiento,
  guardarConsentimiento,
  leerConsentimiento,
  textoResumen,
} from '../src/consentimiento.js';
import { AlmacenFalso } from './AlmacenFalso.js';

describe('consentimiento', () => {
  afterEach(() => vi.useRealTimers());

  it('crea y resume la decisión del usuario', () => {
    const ahora = new Date('2025-01-15T10:00:00Z');
    const registro = crearConsentimiento({ analitica: true }, ahora);
    expect(registro).toEqual({
      version: VERSION,
      analitica: true,
      personalizacion: false,
      fecha: ahora.toISOString(),
    });
    expect(textoResumen(registro)).toContain('Cookies aceptadas: técnicas y analítica');
  });

  it('valida hasta el último instante previo a la caducidad', () => {
    vi.useFakeTimers();
    const origen = new Date('2025-01-15T10:00:00Z');
    vi.setSystemTime(origen);
    const registro = crearConsentimiento({}, new Date());
    const fin = new Date(origen);
    fin.setMonth(fin.getMonth() + CADUCIDAD_MESES);
    expect(consentimientoVigente(registro, new Date(fin.getTime() - 1))).toBe(true);
    expect(consentimientoVigente(registro, fin)).toBe(false);
  });

  it('tolera JSON corrupto, versión incorrecta y errores de escritura', () => {
    const almacen = new AlmacenFalso();
    almacen.setItem('consentimiento', '{');
    expect(leerConsentimiento(almacen)).toBeNull();
    expect(consentimientoVigente({ version: VERSION + 1, fecha: new Date().toISOString() })).toBe(
      false,
    );
    expect(
      guardarConsentimiento(
        {},
        {
          setItem() {
            throw new Error('lleno');
          },
        },
      ),
    ).toBe(false);
    const registro = crearConsentimiento({});
    expect(guardarConsentimiento(registro, almacen)).toBe(true);
    expect(leerConsentimiento(almacen)).toEqual(registro);
    const setItem = vi.fn();
    expect(guardarConsentimiento(registro, { setItem })).toBe(true);
    expect(setItem).toHaveBeenCalledOnce();
  });

  it('rechaza un registro con fecha no válida y resume null', () => {
    expect(
      consentimientoVigente({
        version: VERSION,
        fecha: 'no-es-fecha',
        analitica: false,
        personalizacion: false,
      }),
    ).toBe(false);
    expect(textoResumen(null)).toBe('Aún no has decidido sobre las cookies.');
  });
});

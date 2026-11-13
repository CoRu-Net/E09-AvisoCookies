import { describe, expect, it } from 'vitest';
import { leerTema, guardarTema, temaAplicable } from '../src/preferencias.js';
import { AlmacenFalso } from './AlmacenFalso.js';

describe('preferencias', () => {
  it('guarda y carga temas válidos, pero tolera datos corruptos', () => {
    const almacen = new AlmacenFalso();
    guardarTema('oscuro', almacen);
    expect(leerTema(almacen)).toBe('oscuro');
    almacen.setItem('preferencias', '{');
    expect(leerTema(almacen)).toBeNull();
    expect(temaAplicable(null, true)).toBe('oscuro');
    expect(temaAplicable('claro', true)).toBe('claro');
  });
});

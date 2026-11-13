import { describe, it, expect } from 'vitest';
import { crearCookie, leerCookie } from '../src/cookies.js';

describe('crearCookie', () => {
  it('crea una cookie de sesión con los valores por defecto', () => {
    expect(crearCookie('idioma', 'es')).toBe('idioma=es; path=/; SameSite=Lax');
  });

  it('codifica valores y añade atributos opcionales', () => {
    expect(
      crearCookie('consentimiento', 'sí', { maxAge: 60, sameSite: 'Strict', secure: true }),
    ).toBe('consentimiento=s%C3%AD; max-age=60; path=/; SameSite=Strict; Secure');
  });
  it('lee el nombre exacto y decodifica el valor', () => {
    const cookies = 'idioma=es; nombre=Ana%20Garc%C3%ADa';
    expect(leerCookie('nombre', cookies)).toBe('Ana García');
    expect(leerCookie('idi', cookies)).toBeNull();
  });
});

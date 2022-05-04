/**
 * Recibe una cadena y la devuelve normalizada para que no distinga
 * caracteres diacriticos (tildes) ni vocales con ligadura
 * @param {*} string
 * @returns string normalizado
 */
export const normalizeString = (string) => {
  string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // convierte la cadena a minusculas
  string = string.toLowerCase();

  // se reemplazan las vocales con ligadura
  string = string.replace(/œ/g, "oe").replace(/æ/g, "ae").replace(/[']/g, " ");

  return string;
};

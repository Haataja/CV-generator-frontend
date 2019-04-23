export const GLOBAL_LANGUAGE = 'GLOBAL_LANGUAGE';
export const GLOBAL_DATA = 'GLOBAL_DATA';

/*
 * Updates language value.
 */
export function setLanguage(value) {
  return {
    type: GLOBAL_LANGUAGE,
    payload: value
  };
}

/*
 * Updates save data.
 */
export function saveData(data) {
  return {
    type: GLOBAL_DATA,
    payload: data
  };
}

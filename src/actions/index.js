export const GLOBAL_LANGUAGE = 'GLOBAL_LANGUAGE';
export const GLOBAL_DATA = 'GLOBAL_DATA';

export function setLanguage(value) {
  return {
    type: GLOBAL_LANGUAGE,
    payload: value
  };
}

export function saveData(data) {
  return {
    type: GLOBAL_DATA,
    payload: data
  };
}

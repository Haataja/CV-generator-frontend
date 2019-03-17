export function updateDialog(type) {
  return {
    type: 'EDITOR_DIALOG',
    payload: type
  };
}

export function saveData(data) {
  return {
    type: 'SAVED_DATA',
    payload: data
  };
}

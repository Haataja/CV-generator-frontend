export function updateDialog(type) {
  return {
    type: 'EDITOR_DIALOG',
    payload: type
  };
}

export function toggleSidebar(value) {
  return {
    type: 'EDITOR_SIDEBAR',
    payload: value
  };
}

export function saveData(data) {
  return {
    type: 'EDITOR_DATA',
    payload: data
  };
}

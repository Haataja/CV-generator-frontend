export const EDITOR_DIALOG = 'EDITOR_DIALOG';
export const EDITOR_SIDEBAR = 'EDITOR_SIDEBAR';

export function updateDialog(type) {
  return {
    type: EDITOR_DIALOG,
    payload: type
  };
}

export function toggleSidebar(value) {
  return {
    type: EDITOR_SIDEBAR,
    payload: value
  };
}

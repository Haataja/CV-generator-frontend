export const EDITOR_DIALOG = 'EDITOR_DIALOG';
export const EDITOR_DIALOG_MODE = 'EDITOR_DIALOG_MODE';

export function updateDialog(type) {
  return {
    type: EDITOR_DIALOG,
    payload: type
  };
}

export function setDialogEditMode(mode) {
  return {
    type: EDITOR_DIALOG_MODE,
    payload: mode
  }
}

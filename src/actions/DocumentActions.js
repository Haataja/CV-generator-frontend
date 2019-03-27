import * as global from './';

export const EDITOR_DIALOG = 'EDITOR_DIALOG';
export const EDITOR_DIALOG_MODE = 'EDITOR_DIALOG_MODE';

export function updateDialog(type) {
  return {
    type: EDITOR_DIALOG,
    payload: type
  };
}

export {global};

import * as global from './';

export const EDITOR_DIALOG = 'EDITOR_DIALOG';

export function updateDialog(dialogType, tabName = '', index = null) {
  if (dialogType) {
    return {
      type: EDITOR_DIALOG,
      payload: {
        type: dialogType,
        tab: tabName,
        item: index
      }
    };
  }

  return {
    type: EDITOR_DIALOG,
    payload: null
  };
}

export {global};

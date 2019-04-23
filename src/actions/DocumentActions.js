import * as global from './';

export const EDITOR_DIALOG = 'EDITOR_DIALOG';
export const EDITOR_ALERT = 'EDITOR_ALERT';

/*
 * Updates dialog information.
 */
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

/*
 * Updates alert information.
 */
export function updateAlert(alert) {
  return {
    type: EDITOR_ALERT,
    payload: alert
  }
}

export {global};

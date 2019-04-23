import * as global from './';

export const SHOW_WORK = 'SHOW_WORK';
export const SHOW_PROJECTS = 'SHOW_PROJECTS';
export const SHOW_EDUCATION = 'SHOW_EDUCATION';

/*
 * Updates experience state.
 */
export function showWork(value) {
  return {
    type: SHOW_WORK,
    payload: value
  };
}

/*
 * Updates project state.
 */
export function showProjects(value) {
  return {
    type: SHOW_PROJECTS,
    payload: value
  };
}

/*
 * Updates education state.
 */
export function showEducation(value) {
  return {
    type: SHOW_EDUCATION,
    payload: value
  };
}

export {global};

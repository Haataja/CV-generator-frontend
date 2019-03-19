export const SHOW_WORK = 'SHOW_WORK';
export const SHOW_PROJECTS = 'SHOW_PROJECTS';
export const SHOW_EDUCATION = 'SHOW_EDUCATION';

export function showWork(value) {
  return {
    type: SHOW_WORK,
    payload: value
  };
}

export function showProjects(value) {
  return {
    type: SHOW_PROJECTS,
    payload: value
  };
}

export function showEducation(value) {
  return {
    type: SHOW_EDUCATION,
    payload: value
  };
}

const DEFAULT_STATE = {
  SHOW_WORK: true
};

export default function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case 'SHOW_WORK': {
      state = {...state, SHOW_WORK: action.payload};
      break;
    }
    case 'SHOW_PROJECTS': {
      state = {...state, SHOW_PROJECTS: action.payload};
      break;
    }
    case 'SHOW_EDUCATION':
      state = {...state, SHOW_EDUCATION: action.payload};
      break;
  }
  return state;
}
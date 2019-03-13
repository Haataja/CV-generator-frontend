const DEFAULT_STATE = {
  SHOW_WORK: true
};

export default function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case 'SHOW_WORK':
      state = {...state, SHOW_WORK: action.payload};
      break;
  }
  return state;
}
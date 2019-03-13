const DEFAULT_STATE = {
  LANGUAGE: 'english'
};

export default function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case 'LANGUAGE': {
      state = {...state, LANGUAGE: action.payload};
      break;
    }
  }
  return state;
}
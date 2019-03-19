const DEFAULT_STATE = {
  LANGUAGE: 'en'
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'LANGUAGE': {
      return {...state, LANGUAGE: action.payload};
    }
  }
  return state;
}

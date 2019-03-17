const DEFAULT_STATE = {
  EDITOR_SIDEBAR: null
};

export default (state = DEFAULT_STATE, action) => {
  // No switch case necessary
  return {...state, [action.type]: action.payload};
}

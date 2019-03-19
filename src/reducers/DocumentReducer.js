const DEFAULT_STATE = {
  // Default component state
};

export default (state = DEFAULT_STATE, action) => {
  // No switch case necessary
  return {...state, [action.type]: action.payload};
}

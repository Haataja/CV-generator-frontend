const DEFAULT_STATE = {
  SHOW_WORK: true,
  SHOW_EDUCATION: true,
  SHOW_PROJECTS: true
};

export default (state = DEFAULT_STATE, action) => {
  // No switch case necessary
  return {...state, [action.type]: action.payload};
}

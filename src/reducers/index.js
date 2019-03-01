import { combineReducers } from 'redux';

import Ribbon from './RibbonReducer';
import Document from './DocumentReducer';
import Timeline from './TimelineReducer';

export default combineReducers(
  {Ribbon, Document, Timeline}
);
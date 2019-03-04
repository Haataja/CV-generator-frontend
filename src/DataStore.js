import { applyMiddleware, createStore } from 'redux';

import Reducers from './reducers';
import Thunk from 'redux-thunk';

export default createStore(Reducers, applyMiddleware(Thunk));
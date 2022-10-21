import { createStore, applyMiddleware } from 'redux';
import { SuperheroReducer } from './SuperheroReducer';

import thunk from 'redux-thunk';

export const ConfigureStore = () => {
  const store = createStore(
    SuperheroReducer,
    applyMiddleware(thunk)
  );

  return store;
}

import * as ActionTypes from './ActionTypes';

const initialState = { 
  isLoading: false, 
  errMess: null, 
  superheroFull: {}, 
  superherosList: [], 
  pages: {1: []},
  page: 1,
};

export const SuperheroReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_SUPERHERO_FULL:
      return {...state, isLoading: false, errMess: null, superheroFull: action.payload};
    
    case ActionTypes.ADD_SUPERHEROS:
      return {...state, isLoading: false, errMess: null, superherosList: [...state.superherosList, action.payload]};

    case ActionTypes.ADD_PAGE:
      return {...state, isLoading: false, errMess: null, pages: { 
        ...state.pages, 
        ...action.payload
      }};

    case ActionTypes.SET_PAGE:
      return {...state, page: action.payload};

    case ActionTypes.LOADING:
      return {...state, isLoading: true, errMess: null};

    case ActionTypes.FAILED:
      return {...state, isLoading: false, errMess: action.payload};

    default:
      return state;
  }
};

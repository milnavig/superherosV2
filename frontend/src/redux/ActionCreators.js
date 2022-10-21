import * as ActionTypes from './ActionTypes';

export const addSuperheros = (superheros) => ({
  type: ActionTypes.ADD_SUPERHEROS,
  payload: superheros
});

export const setPage = (pageId) => ({
  type: ActionTypes.SET_PAGE,
  payload: pageId
});

export const addSuperhero = (superhero) => ({
  type: ActionTypes.ADD_SUPERHERO_FULL,
  payload: superhero
});

// export const editSuperhero = (superhero) => ({
//   type: ActionTypes.EDIT_SUPERHERO,
//   payload: superhero
// });

export const removeSuperhero = (superhero) => ({
  type: ActionTypes.REMOVE_SUPERHERO,
  payload: superhero
});

export const addPage = (page) => ({
  type: ActionTypes.ADD_PAGE,
  payload: page
});

export const loading = () => ({
  type: ActionTypes.LOADING
});

export const failed = (errmess) => ({
  type: ActionTypes.FAILED,
  payload: errmess
});

export const fetchSuperheros = () => (dispatch) => {
  dispatch(loading(true));

  return fetch(`${process.env.API_URL}superhero/`)
    .then(result => result.json())
    .then(result => dispatch(addSuperheros([...result.data.getNewsList].reverse())))
    .catch(error => dispatch(failed(error.message)));
}

export const fetchSingleSuperhero = (id) => (dispatch) => {
  dispatch(loading(true));

  return fetch(`${process.env.REACT_APP_API_URL}superhero/${id}`)
    .then(result => result.json())
    .then(result => dispatch(addSuperhero(result)))
    .catch(error => dispatch(failed(error.message)));
}

// export const createSuperhero = (data) => (dispatch) => {
//   dispatch(loading(true));
  
//   return fetch(`${process.env.REACT_APP_API_URL}superhero/`, {
//     method: 'POST',
//     body: data
//   })
//     .then(result => result.json())
//     .then(result => dispatch(addSuperheros(result.data.getNews)))
//     .catch(error => dispatch(failed(error.message)));
// }

// export const editSuperhero = (id) => (dispatch) => {
//   dispatch(loading(true));

//   return fetch(`${process.env.API_URL}superhero/${id}`, {
//     method: 'PUT',
//     //mode: 'cors',
//     headers: {
//       //'Content-Type': 'application/json'
//       'Content-Type': 'multipart/form-data',
//     },
//     body: data
//   })
//     .then(result => dispatch(addSuperhero(result.data.getNews)))
//     .catch(error => dispatch(newsFailed(error.message)));
// }

// export const deleteSuperhero = (id) => (dispatch) => {
//   dispatch(loading(true));

//   return fetch(`${process.env.API_URL}superhero/${id}`, {
//     method: 'DELETE',
//   })
//     .then(result => result.json())
//     .then(result => dispatch(addSuperhero(result.data.getNews)))
//     .catch(error => dispatch(failed(error.message)));
// }

export const fetchSuperheroSet = (page, limit) => (dispatch) => {
  dispatch(loading(true));

  return fetch(`${process.env.REACT_APP_API_URL}superhero/chunk?${new URLSearchParams({
    page, limit
  })}`)
    .then(result => result.json())
    .then(result => dispatch(addPage({[page]: result.rows, total: result.count})))
    .catch(error => dispatch(failed(error.message)));
}

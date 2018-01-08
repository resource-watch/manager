import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// Actions
export const setDashboard = createAction('DASHBOARD_PREVIEW_GET_DASHBOARD');
export const setLoading = createAction('DASHBOARD_PREVIEW_LOADING');
export const setError = createAction('DASHBOARD_PREVIEW_ERROR');

// Async actions
export const fetchDashboard = createThunkAction('DASHBOARD_PREVIEW_FETCH_DATA', (payload = {}) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));

  return fetch(new Request(`${process.env.API_URL}/dashboards/${payload.id}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then((data) => {
      dispatch(setLoading(false));
      dispatch(setError(null));
      dispatch(setDashboard(data));
    })
    .catch((err) => {
      dispatch(setLoading(false));
      dispatch(setError(err));
    });
});

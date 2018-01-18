import { toastr } from 'react-redux-toastr';
import { createAction, createThunkAction } from 'redux-tools';

// services
import FavouritesService from 'services/favourites-service';
import CollectionsService from 'services/collections-service';

/**
 * CONSTANTS
*/
const SET_USER = 'user/SET_USER';
// favourites
const SET_USER_FAVOURITES = 'user/setUserFavourites';
const SET_USER_FAVOURITES_LOADING = 'user/setUserFavouritesLoading';
const SET_USER_FAVOURITES_ERROR = 'user/setUserFavouritesError';
// collections
const SET_USER_COLLECTIONS = 'user/setUserCollections';
const SET_USER_COLLECTIONS_LOADING = 'user/setUserCollectionsLoading';
const SET_USER_COLLECTIONS_ERROR = 'user/setUserCollectionsError';


/**
 * REDUCER
*/
const initialState = {
  favourites: {
    items: [],
    loading: false,
    error: null
  },
  collections: {
    items: [],
    loading: false,
    error: null
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      return { ...state, ...action.payload };
    }

    case SET_USER_FAVOURITES: {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          items: action.payload
        }
      };
    }

    case SET_USER_FAVOURITES_LOADING: {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          loading: action.payload
        }
      };
    }

    case SET_USER_FAVOURITES_ERROR: {
      return {
        ...state,
        favourites: {
          ...state.favourites,
          error: action.payload
        }
      };
    }

    case SET_USER_COLLECTIONS: {
      return {
        ...state,
        collections: {
          ...state.collections,
          items: action.payload
        }
      };
    }

    case SET_USER_COLLECTIONS_LOADING: {
      return {
        ...state,
        collections: {
          ...state.collections,
          loading: action.payload
        }
      };
    }

    case SET_USER_COLLECTIONS_ERROR: {
      return {
        ...state,
        collections: {
          ...state.collections,
          error: action.payload
        }
      };
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 * - setUser
 * - setFavourites
 * - toggleFavourite
*/
export function setUser(user) {
  return (dispatch) => {
    if (!user || !user.token) {
      // If the user isn't logged in, we set the user variable as an empty object
      return;
    }

    const userObj = { ...user };
    if (userObj.token) {
      userObj.token = userObj.token.includes('Bearer') ? userObj.token : `Bearer ${userObj.token}`;
    }

    dispatch({ type: SET_USER, payload: userObj });
  };
}


// FAVOURITES
export function setFavouriteLoading(payload) {
  return { type: SET_USER_FAVOURITES_LOADING, payload };
}

export function setFavouriteError(payload) {
  return { type: SET_USER_FAVOURITES_ERROR, payload };
}

export function getUserFavourites() {
  return (dispatch, getState) => {
    const { user = {} } = getState();

    dispatch(setFavouriteLoading(true));

    return FavouritesService.getFavourites(user.token)
      .then(({ data }) => {
        dispatch(setFavouriteLoading(false));
        dispatch({ type: SET_USER_FAVOURITES, payload: data });
      })
      .catch((error) => {
        dispatch(setFavouriteLoading(false));
        dispatch(setFavouriteError(error));
        dispatch({ type: SET_USER_FAVOURITES, payload: [] });
      });
  };
}


export function toggleFavourite(favourite, resource) {
  return (dispatch, getState) => {
    const { token } = getState().user;

    dispatch(setFavouriteLoading(true));

    if (favourite.id) {
      const { id } = favourite;
      FavouritesService.deleteFavourite(token, id)
        .then(() => {
          dispatch(setFavouriteLoading(false));
          // asks for the new updated list of favourites
          dispatch(getUserFavourites());
        })
        .catch((error) => {
          dispatch(setFavouriteLoading(false));
          dispatch(setFavouriteError(error));
        });

      return;
    }

    FavouritesService.createFavourite(token, resource)
      .then(() => {
        dispatch(setFavouriteLoading(false));
        // asks for the new updated list of favourites
        dispatch(getUserFavourites());
      })
      .catch(({ errors }) => {
        dispatch(setFavouriteLoading(false));
        dispatch(setFavouriteError(errors));
      });
  };
}

// COLLECTIONS
export const setUserCollections = createAction(SET_USER_COLLECTIONS);
export const setCollectionsErrros = createAction(SET_USER_COLLECTIONS_ERROR);

export const getUserCollections = createThunkAction('user/getUserCollections', () =>
  (dispatch, getState) => {
    const { token } = getState().user;

    return CollectionsService.getAllCollections(token)
      .then(({ data }) => {
        dispatch(setUserCollections(data));
      })
      .catch(({ errors }) => {
        dispatch(setCollectionsErrros(errors));
      });
  });


export const addCollection = createThunkAction('user/addCollection', (payload = {}) =>
  (dispatch, getState) => {
    const { token } = getState().user;
    const { collectionName } = payload;

    CollectionsService.createCollection(token, collectionName)
      .then(() => {
        // we ask for the updated list of collections
        dispatch(getUserCollections());
      })
      .catch(({ errors }) => {
        dispatch(setCollectionsErrros(errors));
        const { status } = errors;

        // we shouldn't assume 400 is duplicated collection,
        // but there's no another way to find it out at this moment
        if (status === 400) {
          toastr.error('Collection duplicated', `The collection "${collectionName}" already exists.`);
        } else {
          toastr.error('Ops, something went wrong.');
        }
      });
  });

export const addResourceToCollection = createThunkAction('user/addResourceToCollection',
  (payload = {}) =>
    (dispatch, getState) => {
      const { token } = getState().user;
      const { collectionId, resource } = payload;

      CollectionsService.addResourceToCollection(token, collectionId, resource)
        .then(() => {
          // we ask for the updated list of collections
          dispatch(getUserCollections());
        })
        .catch(({ errors }) => {
          dispatch(setCollectionsErrros(errors));
        });
    });

export const removeResourceFromCollection = createThunkAction('user/removeResourceFromCollection',
  (payload = {}) =>
    (dispatch, getState) => {
      const { token } = getState().user;
      const { collectionId, resource } = payload;

      CollectionsService.removeResourceFromCollection(token, collectionId, resource)
        .then(() => {
          // we ask for the updated list of collections
          dispatch(getUserCollections());
        })
        .catch(({ errors }) => {
          dispatch(setCollectionsErrros(errors));
        });
    });

export const toggleCollection = createThunkAction('user/toggleCollection',
  (payload = {}) =>
    (dispatch) => {
      const { isAdded, collectionId, resource } = payload;

      if (isAdded) dispatch(addResourceToCollection({ collectionId, resource }));
      if (!isAdded) dispatch(removeResourceFromCollection({ collectionId, resource }));
    });

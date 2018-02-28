import {
  ADD_ACTIVE_LOC, GP_LOCATION, CHANGE_GAMEPLAY_VIEW, SET_ACTIVE_LOCATION,
  DROP_ASSET,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  locations: [],
  activeLocationIndex: null,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_ACTIVE_LOC:
      return {
        ...state,
        locations: [...state.locations, action.card],
        activeLocationIndex: state.locations.length,
      };

    case SET_ACTIVE_LOCATION:
      return { ...state, activeLocationIndex: payload };

    case CHANGE_GAMEPLAY_VIEW:
      return { ...state, activeLocationIndex: payload === GP_LOCATION ? state.activeLocationIndex : null };

    case DROP_ASSET: {
      return { ...state, locations: action.locations };
    }

    default:
      return state;
  }
};

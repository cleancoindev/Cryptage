import {
  BOOSTERS_REQUEST, BOOSTERS_SUCCESS, BOOSTERS_ERROR, BUY_BOOSTER_REQUEST, BUY_BOOSTER_SUCCESS, BUY_BOOSTER_ERROR,
  REVEAL_SUCCESS, REVEAL_REQUEST, REVEAL_ERROR,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  isFetching: false,
  isBuying: false,
  isRevealing: false,
  boosters: [],
  cards: [],
  error: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BOOSTERS_REQUEST:
      return {
        ...state,
        isFetching: action.isFetching,
      };
    case BOOSTERS_SUCCESS:
      return {
        ...state,
        isFetching: action.isFetching,
        boosters: action.boosters,
      };
    case BOOSTERS_ERROR:
      return {
        ...state,
        isFetching: action.isFetching,
        error: action.error,
      };
    case BUY_BOOSTER_REQUEST:
      return {
        ...state,
        isBuying: action.isBuying,
      };
    case BUY_BOOSTER_SUCCESS:
      return {
        ...state,
        isBuying: action.isBuying,
      };
    case BUY_BOOSTER_ERROR:
      return {
        ...state,
        isBuying: action.isBuying,
      };
    case REVEAL_REQUEST:
      return {
        ...state,
        isRevealing: action.isRevealing,
      };
    case REVEAL_SUCCESS:
      return {
        ...state,
        isRevealing: action.isRevealing,
        cards: action.cards,
      };
    case REVEAL_ERROR:
      return {
        ...state,
        isRevealing: action.isRevealing,
        error: action.error,
      };
    default:
      return state;
  }
};
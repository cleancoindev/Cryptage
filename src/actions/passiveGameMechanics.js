import { UPDATE_GLOBAL_VALUES, CHANGE_PROJECT_STATE, ADD_EXPERIENCE } from '../actions/actionTypes';
import { saveGameplayState } from '../services/utils';
import { getLevelValuesForCard, calculateLevelData } from '../services/gameMechanicsService';

/**
 * Updates gameplay stats for each played location card that has
 * that defined
 *
 * @param cards
 */
export const handlePlayedLocationCardsPassive = cards => (dispatched) => {
  // nothing yet
};

// ////////////////// ASSETS //////////////////////// //

/**
 * Updates global funds based on played mining rig card power in the gameplay state
 *
 * @param _cards
 */
const addFundsForDroppedMiningRigs = _cards => (dispatch, getState) => {
  const { gameplay } = getState();
  const locations = [...gameplay.locations];
  const globalStats = { ...gameplay.globalStats };

  const containerCards = _cards.filter(_card => _card.stats.type === 'Container');

  // add 1 funds for each card in container asset drop slot
  containerCards.forEach(({ locationIndex, slotIndex }) => {
    const containerSlots = locations[locationIndex].lastDroppedItem.dropSlots[slotIndex].lastDroppedItem.dropSlots;
    const minerCards = containerSlots
      .filter(containerSlot => containerSlot.lastDroppedItem)
      .map(container => container.lastDroppedItem.cards[0]);

    minerCards.forEach((minerCard) => { globalStats.funds += minerCard.stats.bonus.funds; });
  });

  dispatch({ type: UPDATE_GLOBAL_VALUES, payload: globalStats });
  saveGameplayState(getState);
};

/**
 * Updates gameplay stats for each played asset card that has
 * that defined
 *
 * @param cards
 */
export const handlePlayedAssetCardsPassive = cards => (dispatch) => {
  console.log('Played asset cards passive', cards);
  dispatch(addFundsForDroppedMiningRigs(cards));
};

/**
 * Checks to see if any projects have been finished
 */
export const checkProjectsExpiry = () => (dispatch, getState) => {
  const { blockNumber } = getState().app;
  const { projects } = getState().gameplay;
  const { experience, development } = getState().gameplay.globalStats;
  const _projects = [...projects];
  let acquiredXp = 0;
  let releasedDev = 0;

  for (let i = 0; i < _projects.length; i += 1) {
    if (_projects[i].lastDroppedItem != null && _projects[i].lastDroppedItem.expiryTime != null) {
      if (_projects[i].lastDroppedItem.expiryTime - blockNumber <= 0) {
        _projects[i].lastDroppedItem.expiryTime = null;
        _projects[i].lastDroppedItem.isActive = false;
        _projects[i].lastDroppedItem.isFinished = true;
        acquiredXp += _projects[i].lastDroppedItem.cards[0].stats.bonus.xp;
        releasedDev += _projects[i].lastDroppedItem.level > 1 ? getLevelValuesForCard(
          parseInt(_projects[i].lastDroppedItem.cards[0].metadata.id, 10),
          _projects[i].lastDroppedItem.level,
        ) : _projects[i].lastDroppedItem.cards[0].stats.cost.dev;
      }
    }
  }

  if (acquiredXp > 0) {
    dispatch({
      type: CHANGE_PROJECT_STATE,
      projects: _projects,
    });
    dispatch({
      type: ADD_EXPERIENCE,
      experience: experience + acquiredXp,
      levelData: calculateLevelData(experience + acquiredXp),
    });
    dispatch({
      type: UPDATE_GLOBAL_VALUES,
      payload: {
        ...getState().gameplay.globalStats,
        development: development + releasedDev,
      },
    });
    saveGameplayState(getState);
  }
};
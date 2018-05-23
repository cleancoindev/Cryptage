import config from '../constants/config.json';
import levels from '../constants/levels.json';

export default class Gameplay {

  constructor(blockNumber) {
    this.allCards = [];
    this.playedCards = [];
    this.handCards = [];
    this.blockNumber = blockNumber;
    this.previousBockNumber = blockNumber;
    this.stats = {
      level: config.globalStats.level,
      experience: config.globalStats.experience,
      earnedXp: 0,
      requiredXp: levels[1].change,
      funds: config.globalStats.funds,
      development: config.globalStats.development,
    };
    this.locationSlots = [];
  }

  getCardsOfType(type) {
    return this.playedCards.filter((card) => card instanceof type);
  }

  updateBlockNumber(state, blockNumber) {

    const blockCount = blockNumber - state.previousBockNumber;

    if (blockCount < 1) {
      return state;
    }

    for (const card of this.playedCards) {
      state = card.block(state, blockCount);
    }

    return {
      ...state,
      funds: state.funds + state.fundsPerBlock * blockCount,
      blockNumber,
      previousBockNumber: blockNumber,
    };
  }

  levelUp(card, slot) {
    // Replace old card with new onw ith a higher level
  }

  canDrop(card, slot) {
    return card.canDrop(slot);
  }

  dropCard(state, card, slot) {

  }
}

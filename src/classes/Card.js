import serialise from 'serialijse';
import Mechanic from './Mechanic';
import { fetchCardStats } from '../services/cardService';
import { mergeErrorMessages } from '../services/utils';
import { isLocationCard } from './matchers';
import { registerCardTypeConstructor, getCardTypeConstructor, setDefaultCardType } from './Registry';
import Subscriber from './Subscriber';
import ethereumService from '../services/ethereumService';

export default class Card extends Subscriber {

  static async getInstance(state, id, level = 1, _metadataId = null) {
    let metadataId = null;

    if (_metadataId) metadataId = _metadataId;
    else {
      const cardMeta = await ethereumService.getCardMetadata(id);
      metadataId = cardMeta.id;
    }

    const stats = fetchCardStats(metadataId, level);

    return new (Card.getTypeConstructor(stats.type))({
      id,
      metadataId,
      level,
      ...stats,
    }, state);
  }

  static getLeveledInstance(state, id, card, level = undefined) {
    if (!level) {
      level = card.level + 1;
    }
    const stats = fetchCardStats(card.metadataId, level);
    return new (Card.getTypeConstructor(stats.type))({
      id,
      metadataId: card.metadataId,
      level,
      ...stats,
    }, state);
  }

  constructor(data) {
    super();
    Object.assign(this, data);

    this.dropSlots = [];
    this.stackedCards = [this];
    this.slotted = false;
    this.isNew = false;
    this.active = false;
    this.parent = null;
    this.additionalData = {};

    this.additionalBonuses = {
      funds: { absolute: 0, relative: 0 },
      development: { absolute: 0, relative: 0 },
      experience: { absolute: 0, relative: 0 },
      fundsPerBlock: { absolute: 0, relative: 0 },
      power: { absolute: 0, relative: 0 },
    };

    if (!Array.isArray(this.mechanics)) {
      this.mechanics = [];
    }

    this.mechanics = this.mechanics.map(({ name, params }) => {
      return Mechanic.getInstance(name, this, params);
    }).concat([
      Mechanic.getInstance('cost', this, ['level']),
      Mechanic.getInstance('core', this, ['funds', true]),
      Mechanic.getInstance('core', this, ['development']),
      Mechanic.getInstance('bonus', this, ['funds', true]),
      Mechanic.getInstance('bonus', this, ['development']),
      Mechanic.getInstance('bonus', this, ['experience']),
      Mechanic.getInstance('bonus', this, ['fundsPerBlock']),
    ]);
  }

  changeBonuses(state, bonusesObject) {
    state = this._on('onBeforeChangeBonuses', state);

    for (const stat of Object.keys(bonusesObject)) {
      this.additionalBonuses[stat].absolute += bonusesObject[stat].absolute;
      this.additionalBonuses[stat].relative += bonusesObject[stat].relative;

      if (this.additionalBonuses[stat].relative > 100) {
        this.additionalBonuses[stat].relative = 100;
      }
    }

    return this._on('onAfterChangeBonuses', state);
  }

  getBonusStatValue(stat) {
    const baseBonus = this.bonus && this.bonus[stat] ? this.bonus[stat] : 0;
    const absBonus = this.additionalBonuses[stat].absolute;
    const relativeBonus = this.additionalBonuses[stat].relative;

    return Math.floor(((baseBonus + absBonus) * (100 + relativeBonus)) / 100);
  }

  findParent(matcher = isLocationCard) {
    let card = this;
    while (card && (!matcher(card) && card.parent)) {
      card = card.parent;
    }
    return card;
  }

  _on(action, state, ...params) {
    for (const mechanic of this.mechanics) {
      state = mechanic[action] ? mechanic[action](state, ...params) : state;
    }
    return state.publish(state, action, this);
  }

  _can(method, ...params) {
    const errorMessages = this.mechanics
      .map(mechanic => {
        if (!mechanic) return null;

        return mechanic[method] ? mechanic[method](...params) : null;
      })
      .filter(errorMessage => errorMessage !== null);

    return mergeErrorMessages(...errorMessages);
  }

  canPlay(state, dropSlot) {
    const result = {};

    if (dropSlot.owner) {
      Object.assign(result, dropSlot.owner.canPlayChild(state, this));
    }

    Object.assign(result, this._can('canPlay', state, dropSlot));

    return mergeErrorMessages(result);
  }

  onPlay(state, dropSlot, reSlotted) {
    this.active = true;
    this.stackedCards[0].slotted = true;

    return this._on('onPlay', state, dropSlot, reSlotted);
  }

  canWithdraw(state) {
    return mergeErrorMessages(
      this._can('canWithdraw', state),
      this.parent ? this.parent.canWithdrawChild(state, this) : {},
      ...this.dropSlots.filter(slot => !slot.isEmpty()).map(({ card }) => card.canWithdraw(state))
    );
  }

  onWithdraw(state, isLevelUp = false) {
    this.withdrawing = true;
    let newState = this._on('onWithdraw', state);

    this.additionalBonuses = {
      funds: { absolute: 0, relative: 0 },
      development: { absolute: 0, relative: 0 },
      experience: { absolute: 0, relative: 0 },
      fundsPerBlock: { absolute: 0, relative: 0 },
      power: { absolute: 0, relative: 0 },
    };
    this.additionalData = {};

    this.dropSlots.forEach((slot) => {
      newState = slot.removeCard(newState, isLevelUp);
    });

    if (this.removeDropSlots && !isLevelUp) this.removeDropSlots();

    while (this.stackedCards.length) {
      const popped = this.stackedCards.pop();
      popped.active = false;
      popped.slotted = false;
    }

    this.unsubscribeAll();

    this.stackedCards = [this];

    this.withdrawing = false;
    return newState;
  }

  canPlayChild(state, child) {
    return this._can('canPlayChild', state, child);
  }

  onPlayChild(state, child) {
    return this._on('onPlayChild', state, child);
  }

  canWithdrawChild(state, child) {
    return this._can('canWithdrawChild', state, child);
  }

  onWithdrawChild(state, child) {
    return this._on('onWithdrawChild', state, child);
  }

  block(state, blockCount) {
    return this._on('block', state, blockCount);
  }

  canLevelUp(state, draggedCard) {
    const result = {
      allowed: draggedCard.metadataId === this.metadataId && this.level < 5,
    };

    if (!result.allowed) return result;

    const instance = Card.getLeveledInstance(state, this.id, draggedCard);
    if (!instance.cost) return { allowed: false, noNextLevel: false };

    result.allowed = state.stats.funds >= instance.cost.funds;

    if (!result.allowed) return result;

    return Object.assign(result, this._can('canLevelUp', state, draggedCard));
  }

  levelUp(state, dropSlot) {
    // this === dragged card
    const droppedCard = dropSlot.card;

    const leveledUp = Card.getLeveledInstance(state, this.id, droppedCard);
    leveledUp.dropSlots = droppedCard.dropSlots;
    leveledUp.timesFinished = droppedCard.timesFinished;
    leveledUp.additionalData = droppedCard.additionalData;
    leveledUp.additionalBonuses = droppedCard.additionalBonuses;
    leveledUp.stackedCards = droppedCard.stackedCards.concat(this);

    for (const cardSlot of leveledUp.dropSlots) {
      cardSlot.owner = leveledUp;
      if (!cardSlot.isEmpty()) {
        cardSlot.card.parent = leveledUp;
      }
    }

    // optional add on level up || add on child level up

    return leveledUp;
  }
}

Card.registerTypeConstructor = registerCardTypeConstructor;
Card.getTypeConstructor = getCardTypeConstructor;

setDefaultCardType(Card);

serialise.declarePersistable(Card);

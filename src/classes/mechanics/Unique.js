import Mechanic from '../Mechanic';

export default class Unique extends Mechanic {
  canPlay(state, destination) {
    const { title } = this.card;

    const unique = destination.owner.dropSlots.reduce((acc, dropSlot) => {
      if (dropSlot.card && dropSlot.card.title === title) acc = false;
      return acc;
    }, true);

    return { unique };
  }
}

Mechanic.registerMechanic('unique', Unique);

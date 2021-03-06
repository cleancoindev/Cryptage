import PowerBonusMechanic from '../PowerBonusMechanic';
import Card from '../../Card';
import LocationCard from '../../cardTypes/Location';
import Gameplay from '../../Gameplay';
import Mechanic from '../../Mechanic';

describe('PowerBonusMechanic', () => {
  it ('Always has power stat in mechanic', async () => {
    let gameplay = new Gameplay(0);

    const assetCard = new Card({
      cost: { development: 1, funds: 1, time: 100, level: 1 },
      bonus: { funds: 10, xp: 10 },
      tags: ['asset'],
      metadataId: 42,
    });

    const mechInstance = Mechanic.getInstance('powerBonusMechanic', assetCard);
    assetCard.mechanics.push(mechInstance);

    const locationCard = new LocationCard({
      values: { space: 10, power: 10 },
      cost: { funds: 50, development: 50 },
      acceptedTags: ['asset'],
    });

    gameplay.cards = [assetCard, locationCard];

    gameplay = gameplay.locationSlots[0].dropCard(gameplay, locationCard);
    gameplay = gameplay.locationSlots[0].card.dropSlots[0].dropCard(gameplay, assetCard);

    expect(mechInstance.stat).toBe('power');
  });
});

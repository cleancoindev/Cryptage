import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GameplayItem from '../../GameplayItem/GameplayItem';
import DropSlotsWrapper from '../../DropSlotsWrapper/DropSlotsWrapper';
import { handleAssetDrop } from '../../../actions/gameplayActions';
import { guid } from '../../../services/utils';

import './ActiveLocation.scss';

const ActiveLocation = ({ locations, activeLocationIndex, handleAssetDrop }) => {
  const location = locations[activeLocationIndex];
  return (
    <div className="active-location-wrapper">
      <div className="active-location-header">
        <div className="location-stats-label">{ location.lastDroppedItem.cards[0].stats.title }</div>
        <div className="location-stats-wrapper">
          {/* <span>Ids: { location.lastDroppedItem.cards.map(_card => _card.id).toString() }</span> */}

          {
            Object.keys(location.lastDroppedItem.values).map(value => (
              <span key={guid()}>{ value }: { location.lastDroppedItem.values[value] }</span>
            ))
          }
        </div>
      </div>

      <div className="active-location-field">
        <DropSlotsWrapper
          dropSlots={location.lastDroppedItem.dropSlots}
          onItemDrop={handleAssetDrop}
          element={<GameplayItem />}
          emptyStateElem={() => (
            <div className="active-location-empty-slot">
              <div className="inner-empty-slot">Drop<b>Card</b>here</div>
            </div>
          )}
          mainClass="active-location-slot-wrapper"
        />
      </div>
    </div>
  );
};

ActiveLocation.propTypes = {
  locations: PropTypes.array.isRequired,
  activeLocationIndex: PropTypes.number.isRequired,
  handleAssetDrop: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  handleAssetDrop,
};

const mapStateToProps = ({ gameplay }) => ({
  locations: gameplay.locations,
  activeLocationIndex: gameplay.activeLocationIndex,
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveLocation);

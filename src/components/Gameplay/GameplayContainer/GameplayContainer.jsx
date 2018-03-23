import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { handleMinerDropInContainer } from '../../../actions/gameplayActions';
import DropSlotsWrapper from '../../DropSlotsWrapper/DropSlotsWrapper';
import ContainerItem from '../../ContainerItem/ContainerItem';
import EmptyCardSlot from '../EmptyCardSlot/EmptyCardSlot';

import './GameplayContainer.scss';

const GameplayContainer = ({
  locations, activeLocationIndex, activeContainerIndex, handleMinerDropInContainer
}) => {
  const activeLocation = locations[activeLocationIndex].lastDroppedItem;
  const card = activeLocation.dropSlots[activeContainerIndex].lastDroppedItem.cards[0];
  const containerSlots = activeLocation.dropSlots[activeContainerIndex].lastDroppedItem.dropSlots;
  return (
    <div className="active-container-wrapper">
      <div className="active-container-card-wrapper">
        Active container card goes here (missing card component)
      </div>

      <div className="container-bottom-wrapper">
        <div className="container-card-header">{ card.stats.title }</div>

        <div className="container-slots">
          <DropSlotsWrapper
            dropSlots={containerSlots}
            onItemDrop={(minerIndex, item) => {
              handleMinerDropInContainer(activeLocationIndex, activeContainerIndex, minerIndex, item);
            }}
            element={<ContainerItem
              locationIndex={activeLocationIndex}
              containerIndex={activeContainerIndex}
            />}
            emptyStateElem={() => (<EmptyCardSlot />)}
            mainClass="active-location-slot-wrapper"
          />
        </div>
      </div>
    </div>
  );
};

GameplayContainer.propTypes = {
  locations: PropTypes.array.isRequired,
  activeLocationIndex: PropTypes.number.isRequired,
  activeContainerIndex: PropTypes.number.isRequired,
  handleMinerDropInContainer: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  handleMinerDropInContainer,
};

const mapStateToProps = ({ gameplay }) => ({
  locations: gameplay.locations,
  activeLocationIndex: gameplay.activeLocationIndex,
  activeContainerIndex: gameplay.activeContainerIndex,
});

export default connect(mapStateToProps, mapDispatchToProps)(GameplayContainer);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';
import { connect } from 'react-redux';
import HandCard from '../Cards/HandCard/HandCard';
import { calcDataForNextLevel } from '../../services/utils';
import { levelUpAsset, switchInGameplayView, handleCardCancel } from '../../actions/gameplayActions';
import { containerIds, GP_LOCATION_CONTAINER } from '../../actions/actionTypes';

import './GameplayItem.scss';

class GameplayItem extends Component {
  constructor() {
    super();
    this.state = { show: false };

    this.toggleFundsStat = this.toggleFundsStat.bind(this);
    this.goToContainer = this.goToContainer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!containerIds.includes(this.props.cards[0].metadata.id)) return;
    if (nextProps.blockNumber === this.props.blockNumber) return;

    this.toggleFundsStat();
    setTimeout(this.toggleFundsStat, 2000);
  }

  /**
   * Shows or hides funds stats per block
   */
  toggleFundsStat() {
    this.setState({ show: !this.state.show });
  }

  /**
   * When clicking on a container card
   * goes to third level view
   *
   * @param isContainer
   */
  goToContainer(isContainer) {
    if (!isContainer) return;
    this.props.switchInGameplayView(this.props.index, GP_LOCATION_CONTAINER);
  }

  render() {
    const {
      cards, isOver, index, activeLocationIndex, level, canLevelUp, levelUpAsset, dropSlots, slot, handleCardCancel,
    } = this.props;

    const { percent, remainingCardsToDropForNextLevel } = calcDataForNextLevel(cards.length, level);
    const isContainer = containerIds.includes(cards[0].metadata.id);
    let remainingSlots = null;
    let fpb = 0;

    if (isContainer) {
      remainingSlots = dropSlots.filter(({ lastDroppedItem }) => lastDroppedItem === null).length;

      fpb = slot.lastDroppedItem.dropSlots.reduce((acc, currVal) => {
        if (currVal.lastDroppedItem) {
          acc += currVal.lastDroppedItem.cards[0].stats.bonus.funds;
        }

        return acc;
      }, 0);
      console.log('fpb', fpb);
    }

    return (
      <div
        className={`
        gameplay-item-wrapper
        ${isOver && 'hovering'}
        ${isContainer && 'container'}
      `}
      >
        {!isContainer &&
        <HandCard
          showCount={false}
          card={cards[0]}
          slot={slot}
          handleCardCancel={handleCardCancel}
          locationIndex={activeLocationIndex}
          containerIndex={index}
          played
        />
        }
        {
          isContainer &&
          <div className="container-card-wrapper">
            {
              this.state.show &&
              (fpb > 0) &&
              <div className="fpb">+ { fpb }</div>
            }

            <HandCard
              goToContainer={() => { this.goToContainer(isContainer); }}
              showCount={false}
              card={cards[0]}
              remainingSlots={remainingSlots}
              handleCardCancel={handleCardCancel}
              locationIndex={activeLocationIndex}
              containerIndex={index}
              slot={slot}
              played
            />
          </div>
        }
        <div className="level-up">
          {!canLevelUp && <div>Cards to drop for next level: {remainingCardsToDropForNextLevel}</div>}
          {
            canLevelUp &&
            <button
              onClick={() => { levelUpAsset(activeLocationIndex, index); }}
            >
              Upgrade to next level
            </button>
          }
        </div>
      </div>
    );
  }
}

GameplayItem.defaultProps = {
  cards: [],
  isOver: false,
  dropSlots: null,
};

GameplayItem.propTypes = {
  cards: PropTypes.array,
  isOver: PropTypes.bool,
  level: PropTypes.number.isRequired,
  canLevelUp: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  activeLocationIndex: PropTypes.number.isRequired,
  levelUpAsset: PropTypes.func.isRequired,
  switchInGameplayView: PropTypes.func.isRequired,
  dropSlots: PropTypes.array,
  slot: PropTypes.object.isRequired,
  handleCardCancel: PropTypes.func.isRequired,
  blockNumber: PropTypes.number.isRequired,
};

const mapStateToProps = ({ gameplay, app }) => ({
  activeLocationIndex: gameplay.activeLocationIndex,
  blockNumber: app.blockNumber,
});

const mapDispatchToProps = {
  levelUpAsset, switchInGameplayView, handleCardCancel,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameplayItem);

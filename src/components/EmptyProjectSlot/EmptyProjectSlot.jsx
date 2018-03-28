import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { checkIfCanPlayCard } from '../../services/gameMechanicsService';

import './EmptyProjectSlot.scss';

const EmptyProjectSlot = ({ card, globalStats }) => {
  let canDrop = false;
  let goodCardType = false;

  if (card) {
    goodCardType = card.stats.type === 'Project';
    if (goodCardType) canDrop = checkIfCanPlayCard(card.stats, globalStats, null, false);
  }

  return (
    <div
      className={`
        empty-project-slot-wrapper
        ${(card && goodCardType && canDrop) && 'can-drop'}
        ${(card && goodCardType && !canDrop) && 'no-drop'}
      `}
    >
      <div className="empty-project-slot">
        {
          (!card || (card && !goodCardType)) &&
          <div className="no-project-text">
            Drop Project here
          </div>
        }
        {
          card && goodCardType &&
          <div className="drop-content">
            You
            <span>{ canDrop ? 'Can' : 'Can\'t' }</span>
            Drop
          </div>
        }
      </div>
    </div>
  );
};

EmptyProjectSlot.defaultProps = {
  card: null,
};

EmptyProjectSlot.propTypes = {
  card: PropTypes.object,
  globalStats: PropTypes.object.isRequired,
};

const mapStateToProps = ({ gameplay }) => ({
  globalStats: gameplay.globalStats,
});

export default connect(mapStateToProps)(EmptyProjectSlot);
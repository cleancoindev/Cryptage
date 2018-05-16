import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { playTurn } from '../../actions/gameplayActions';
import { toggleCardDrag } from '../../actions/appActions';
import { checkIfCanPlayCard } from '../../services/gameMechanicsService';
import './DropSlotWrapper.scss';
import { fetchCardStats } from '../../services/cardService';

const dropTarget = {
  drop(props, monitor, component) {
    let dropItem = monitor.getItem();

    // TODO REFACTOR THIS
    if (props.lastDroppedItem) {
      const { mainCard } = props.lastDroppedItem;
      const { id } = mainCard.metadata;
      const level = parseInt(mainCard.stats.level, 10);
      const cardId = monitor.getItem().card.id;

      dropItem = { card: { ...mainCard, id: cardId, stats: fetchCardStats(id, level + 1) } };
    }

    props.onDrop(dropItem);
    component.props.toggleCardDrag();
    if (checkIfCanPlayCard(dropItem.card.stats, props.globalStats)) {
      // component.props.playTurn(dropItem, props.slotType, props.index, true);
    }
  },
};

@DropTarget(props => props.accepts, dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  dragItem: monitor.getItem(),
}))
class DropSlotWrapper extends Component {
  render() {
    const {
      dragItem,
      isOver,
      canDrop,
      connectDropTarget,
      lastDroppedItem,
      children,
      activeClass,
      finishedClass,
      itemHoverClass,
      droppedItemClass,
      mainClass,
      index,
      emptyStateElem,
      slot,
    } = this.props;
    const isFinished = lastDroppedItem !== null ? lastDroppedItem.isFinished : false;
    const isActive = isOver && canDrop;
    const itemHover = !isActive && canDrop;

    const className = `
      drop-slot-component
      ${mainClass}
      ${isActive && activeClass}
      ${isFinished && finishedClass}
      ${itemHover && itemHoverClass}
      ${lastDroppedItem && droppedItemClass}
    `;

    return connectDropTarget(
      <div className={className}>
        {lastDroppedItem && React.cloneElement(children, { ...lastDroppedItem, isOver, dragItem, index, slot })}
        {!lastDroppedItem && React.cloneElement(emptyStateElem, { ...dragItem, index })}
      </div>,
    );
  }
}

DropSlotWrapper.defaultProps = {
  mainClass: 'drop-slot-wrapper',
  activeClass: 'drop-slot-active',
  finishedClass: 'drop-slot-finished',
  itemHoverClass: 'drop-slot-item-hover',
  droppedItemClass: 'drop-slot-filled',
  lastDroppedItem: null,
  index: null,
  emptyStateElem: <div>Empty slot</div>,
};

DropSlotWrapper.propTypes = {
  mainClass: PropTypes.string,
  activeClass: PropTypes.string,
  finishedClass: PropTypes.string,
  itemHoverClass: PropTypes.string,
  droppedItemClass: PropTypes.string,
  lastDroppedItem: PropTypes.object,
  index: PropTypes.number,
  children: PropTypes.node.isRequired,
  emptyStateElem: PropTypes.node,
  slot: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  globalStats: state.gameplay.globalStats,
});

const mapDispatchToProp = {
  playTurn, toggleCardDrag,
};

export default connect(mapStateToProps, mapDispatchToProp)(DropSlotWrapper);

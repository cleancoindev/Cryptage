import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HoverInfo from '../HoverInfo/HoverInfo';
import { setActiveLocation } from '../../actions/gameplayActions';
import { openConfirmRemoveModal } from '../../actions/modalActions';
import { GP_LOCATION } from '../../actions/actionTypes';
import { classForRarity } from '../../services/utils';
import PortalWrapper from '../PortalWrapper/PortalWrapper';
import SidebarItemNotActive from './SidebarItemNotActive';

import './LocationSidebarItem.scss';
import InfoCardIcon from '../Decorative/InfoCardIcon';
import DropCardIcon from '../Decorative/DropCardIcon';
import SidebarItemActive from './SidebarItemActive';

class LocationSidebarItem extends Component {
  constructor() {
    super();

    this.state = { showPortal: false };

    this.togglePortal = this.togglePortal.bind(this);
  }

  togglePortal(showOrHide) { this.setState({ showPortal: showOrHide }); }

  render() {
    const { togglePortal } = this;
    const { showPortal } = this.state;
    const {
      card, slot, setActiveLocation, index, activeLocationIndex, gameplayView, openConfirmRemoveModal,
      gameplay, dragItem, draggingCard,
    } = this.props;

    const draggingDuplicate = dragItem && (dragItem.card.metadataId === card.metadataId);
    const canLevelUp = draggingDuplicate && slot.canDrop(gameplay, dragItem.card).allowed;
    const active = (activeLocationIndex === index) && gameplayView === GP_LOCATION;

    return (
      <div
        className={`
        location-sidebar-item-wrapper
        ${canLevelUp ? 'level-up-success' : 'level-up-fail'}
        ${draggingDuplicate ? 'dragging-success' : 'dragging-fail'}
        ${active && 'active'}
      `}
        onClick={() => { setActiveLocation(index); }}
      >
        {
          !draggingCard &&
          showPortal &&
          <PortalWrapper>
            <HoverInfo card={card} center backdrop />
          </PortalWrapper>
        }

        {/*{*/}
          {/*(activeLocationIndex !== index) &&*/}
          {/*(fpb > 0) &&*/}
          {/*this.state.show &&*/}
          {/*<div className="fpb">+ {fpb} {fpb === 1 ? 'FUND' : 'FUNDS'}</div>*/}
        {/*}*/}

        {
          !active &&
          <div
            className={`
            location-sidebar-small
            rarity-border
            ${classForRarity(card.rarityScore)}`}
          >
            <SidebarItemNotActive id={card.id} image={`cardImages/${card.image}`} />

            <div className="actions" onClick={e => e.stopPropagation()}>
              <div
                className="hover-info-wrapper"
                onMouseEnter={() => { togglePortal(true); }}
                onMouseLeave={() => { togglePortal(false); }}
              >
                <InfoCardIcon />
              </div>
              <div className="remove-card-wrapper" onClick={() => { openConfirmRemoveModal(slot, index); }}>
                <DropCardIcon />
              </div>
            </div>
          </div>
        }

        {
          active &&
          <div className={`
            location-sidebar-big
            rarity-border
            ${classForRarity(card.rarityScore)}`}
          >
            <SidebarItemActive id={card.id} image={`cardImages/${card.image}`} />

            <div className="location-data">
              <div className="loc-lvl">Level {card.level}</div>
              <div className="loc-name">{card.title}</div>
            </div>

            <div className="actions" onClick={e => e.stopPropagation()}>
              <div
                className="hover-info-wrapper"
                onMouseEnter={() => { togglePortal(true); }}
                onMouseLeave={() => { togglePortal(false); }}
              >
                <InfoCardIcon />
              </div>
              <div className="remove-card-wrapper" onClick={() => { openConfirmRemoveModal(slot, index); }}>
                <DropCardIcon />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

LocationSidebarItem.defaultProps = {
  card: null,
  dragItem: null,
  draggingCard: false,
};

LocationSidebarItem.propTypes = {
  gameplay: PropTypes.object.isRequired,
  card: PropTypes.object,
  setActiveLocation: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  activeLocationIndex: PropTypes.number.isRequired,
  gameplayView: PropTypes.string.isRequired,
  openConfirmRemoveModal: PropTypes.func.isRequired,
  slot: PropTypes.object.isRequired,
  blockNumber: PropTypes.number.isRequired,
  dragItem: PropTypes.object,
  draggingCard: PropTypes.bool,
};

const mapStateToProps = ({ gameplay, app }) => ({
  gameplay,
  activeLocationIndex: gameplay.activeLocationIndex,
  gameplayView: gameplay.gameplayView,
  blockNumber: gameplay.blockNumber,
  draggingCard: app.draggingCard,
});

const mapDispatchToProp = {
  setActiveLocation, openConfirmRemoveModal,
};

export default connect(mapStateToProps, mapDispatchToProp)(LocationSidebarItem);

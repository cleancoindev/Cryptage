import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-dnd';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import Locations from '../Locations/Locations';
import Gameplay from '../Gameplay/Gameplay';
import Projects from '../Projects/Projects';
import NoMetaMask from './NoMetaMask/NoMetaMask';
import ReportABug from './ReportABug/ReportABug';
import CustomDragLayer from '../CustomDragLayer/CustomDragLayer';
import {
  loadGameplayState,
  updateFundsBlockDifference,
  checkProjectsBonus,
} from '../../actions/gameplayActions';
import {
  checkAccount,
  loadingEnded,
  listenForNewBlocks,
  updateCurrentBlockNumber,
} from '../../actions/appActions';

import './App.scss';
import Tutorial from '../Tutorial/Tutorial';
import Feedback from './Feedback/Feedback';
import CircleSpinner from '../Decorative/CircleSpinner/CircleSpinner';

@DragDropContext(HTML5Backend)
class App extends Component {
  async componentWillMount() {
    await this.props.checkAccount();
    await this.props.loadGameplayState();
    if (!this.props.nickname) return this.props.loadingEnded();
    await this.props.updateFundsBlockDifference();
    this.props.listenForNewBlocks();
    this.props.updateCurrentBlockNumber();
    this.props.loadingEnded();
    this.props.checkProjectsBonus();
  }

  render() {
    const { loadingApp, accountError, tutorialOpen, nickname } = this.props;

    if (loadingApp) {
      return (
        <div className="loading-wrapper">
          <CircleSpinner />
          <p className="show-delayed">
            If this is taking too long, check your MetaMask connection
          </p>
        </div>
      );
    }

    if (!nickname && !accountError) {
      return (<Redirect to="/newuser" />);
    }

    return (
      <div className={`app-wrapper ${accountError ? 'no-acc' : 'has-acc'}`}>

        <div className="app-top-section-wrapper">

          {accountError && <NoMetaMask accountError={accountError} />}

          {
            !accountError && [
              <Locations key="A" />,
              <Gameplay key="B" />,
              <Projects key="C" />,
            ]
          }
        </div>

        <Feedback />
        <ReportABug />
        <CustomDragLayer />

        {
          tutorialOpen && <Tutorial />
        }
      </div>
    );
  }
}

App.propTypes = {
  checkAccount: PropTypes.func.isRequired,
  loadGameplayState: PropTypes.func.isRequired,
  loadingEnded: PropTypes.func.isRequired,
  loadingApp: PropTypes.bool.isRequired,
  listenForNewBlocks: PropTypes.func.isRequired,
  updateCurrentBlockNumber: PropTypes.func.isRequired,
  accountError: PropTypes.string.isRequired,
  updateFundsBlockDifference: PropTypes.func.isRequired,
  tutorialOpen: PropTypes.bool.isRequired,
  checkProjectsBonus: PropTypes.func.isRequired,
  nickname: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  checkAccount,
  loadGameplayState,
  loadingEnded,
  listenForNewBlocks,
  updateCurrentBlockNumber,
  updateFundsBlockDifference,
  checkProjectsBonus,
};

const mapStateToProps = ({ app, gameplay }) => ({
  loadingApp: app.loadingApp,
  accountError: app.accountError,
  tutorialOpen: app.tutorialOpen,
  nickname: gameplay.nickname,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

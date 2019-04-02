import React from 'react';
import Spinner from '../Spinner';
import axios from 'axios';
import Chessboard from 'chessboardjsx';
import './GameEnd.scss';
import { auth } from '../Firebase';
import server from '../Server';

class GameEnd extends React.Component {
  state = {
      game: null,
      user: null,
      rematch: null,
      showResults: false,
      black: null,
      white: null
  };


  componentDidMount() {
      this.initAuthListener();

      var id = this.props.location.pathname.split('/')[2];
      this.loadGame(id);
  }

  initAuthListener(){
      auth.onAuthStateChanged(function (user) {
          if (user) {
              this.setState({user: user.uid});
          } else {
              this.setState({user: 'none'});
          }
      }.bind(this));
  }

  loadGame = (id) => {
    server.get(`/getgame/${id}`)
      .then(function (response) {
        this.setState({game: response.data});
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
  }

  rematch = () => {
      var formData = new FormData();

      formData.set('creator_id', this.state.user);
      formData.set('player1_id', this.state.game.players.b);
      formData.set('player2_id',this.state.game.players.w);
      formData.set('board_id', 'kevin');
      formData.set('time_per_player', this.state.game.time_controls);

      server.post('/creategame', formData)
          .then(function (response) {
              this.setState({rematch: response.data.id})
              this.props.history.push('/play/' + response.data.id);
          }.bind(this))
          .catch(function (error) {
              console.log(error);
          })

  }

  toggleResults = () => {
    var results = document.getElementById('results');

    if (this.state.showResults) {
      // Table displayed, hide it
      results.classList.remove('displayed');
      this.setState({showResults: false});
    } else {
      // Table not displayed, display it
      results.classList.add('displayed');
      this.setState({showResults: true});
      this.getResult();
    }
  }

  resizeBoard = screenWidth => {
    var width = 300;

    if (screenWidth < 600) {
      width = (screenWidth < 500) ? 300 : 0.6*screenWidth;
    } else {
      width = (screenWidth < 1000) ? 0.4*screenWidth : 400;
    }

    return width;
  }

  getResult = () => {
    if (this.state.game == '1-0') {
      this.setState({black: 'Win'});
      this.setState({white: 'Lose'});
    } else if (this.state.game == '0-1') {
      this.setState({black: 'Lose'});
      this.setState({white: 'Win'});
    } else if (this.state.game == '1/2-1/2') {
      this.setState({black: 'Draw'});
      this.setState({white: 'Draw'});
    } else {
      this.setState({black: 'In progress'})
      this.setState({white: 'In progress'})
    }
  }


  render() {
      const { errors } = this.state;

      return (
              <div>
                {
                  this.state.game ?
                  <div className="btn-group-links" id="my_centered_buttons">
                    <button onClick={this.rematch} className="button large large-font home-link">Rematch</button>
                    <button onClick={this.toggleResults} className="button large large-font home-link">Show results</button>
                    <table id="results">
                      <tr>
                          <th>Player ID</th>
                          <th>Playing as</th>
                          <th>Result</th>
                      </tr>
                      <tr>
                        <td>{this.state.game.players.b}</td>
                        <td>Black</td>
                        <td>{this.state.black}</td>
                      </tr>
                      <tr>
                        <td>{this.state.game.players.w}</td>
                        <td>White</td>
                        <td>{this.state.white}</td>
                      </tr>
                    </table>

                    <Chessboard id="board" position={this.state.game.fen} calcWidth={({screenWidth, screenHeight}) => this.resizeBoard(screenWidth)}/>
                    <table>
                      <tr>You could move the pieces on the board to analyse</tr>
                    </table>
                  </div>
                  :
                  <Spinner/>
                }
              </div>
      );
  }
}


export default GameEnd;
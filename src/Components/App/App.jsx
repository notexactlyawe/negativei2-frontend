import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Home';
import Header from '../Header';
import Profile from '../Profile';
import Login from '../Login';
import Logout from '../Logout';
import Create from '../Create';
import Play from '../Play';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/profile/:ID/:page?" component={Profile} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/play" component={Play} />
          <Route component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;

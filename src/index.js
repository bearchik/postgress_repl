import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import 'babel-polyfill';
import 'whatwg-fetch';

import List from './Components/List';
import Standard from './Components/Standard';

class App extends Component {
  render() {
    return <div className="container-fluid">
      <h1>Standard editor</h1>
      <hr/>
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRoute component={List}/>
          <Route path="standard/:standardId" component={Standard}/>
        </Route>
      </Router>
    </div>
  }
}


ReactDOM.render(<App />, document.getElementById('root'));

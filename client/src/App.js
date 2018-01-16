import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Main from './components/Main'
import MyApp from './components/MyApp';
import NewAppForm from './components/NewAppForm';
import QRCodeDisplay from './components/QRDisplay';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <h1>DroneCast Platform</h1>
          <main>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/newapp" component={NewAppForm} />
              <Route exact path="/myapp/:id?" component={MyApp} />
              <Route exact path="/qr/:id?" component={QRCodeDisplay} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

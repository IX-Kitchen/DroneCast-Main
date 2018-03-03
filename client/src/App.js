import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Main from './components/Main'
import MyAppHTML from './components/MyAppHTML'
import MyApp from './components/MyApp';
import NewAppForm from './components/NewAppForm';
import NewDroneForm from './components/NewDroneForm';
import QRCodeDisplay from './components/QRDisplay';

// Style
const mainStyle = {
  height: "100%"
}

const App = () =>
  <BrowserRouter>
    <div>
      <h1>DroneCast Platform</h1>
      <main style={mainStyle}>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/newapp" component={NewAppForm} />
          <Route exact path="/newdrone" component={NewDroneForm} />
          <Route exact path="/myapp/:id?" component={MyAppHTML} />
          <Route exact path="/myapp/:id?/edit" component={MyApp} />
          <Route exact path="/qr/:id?" component={QRCodeDisplay} />
        </Switch>
      </main>
    </div>
  </BrowserRouter>

export default App;

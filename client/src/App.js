import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Button, Icon, Divider } from 'semantic-ui-react'
import Main from './components/Main'
import MyApp from './components/MyApp';
import NewAppForm from './components/NewAppForm';
import NewDisplayForm from './components/NewDisplayForm';
import QRCodeDisplay from './components/QRDisplay';
import FolderForm from './components/FolderForm'

const style = {
  height: "100%"
}

const App = () =>
  <BrowserRouter>
    <div>
      <h1>DroneCast Platform</h1>
      <Divider hidden />
      <Link to="/">
        <Button icon labelPosition='left'>
          <Icon name='reply' />
          Home
        </Button>
      </Link>
      <main style={style}>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/newapp" component={NewAppForm} />
          <Route exact path="/newdrone/:id?" component={NewDisplayForm} />
          <Route exact path="/myapp/:id/edit" component={MyApp} />
          <Route exact path="/myapp/:id/newfolder" component={FolderForm} />
          <Route exact path="/qr/:id?" component={QRCodeDisplay} />
        </Switch>
      </main>
    </div>
  </BrowserRouter>

export default App;

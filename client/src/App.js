import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import Main from './components/Main'
import MyApp from './components/MyApp';

const style = {
  height: "100%"
}

export default class AppList extends React.Component {

  componentDidMount() {
    document.title = "DisplayCast"
  }

  render() {
    return (<BrowserRouter>
      <div>
        <Divider hidden />
        <main style={style}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/myapp/:id/edit" component={MyApp} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
    )
  }
}

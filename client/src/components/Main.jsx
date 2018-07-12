import React from 'react'
import AppList from './AppList'
import DisplayList from './DisplayList'
import NewAppForm from './NewAppForm'
import NewDisplayForm from './NewDisplayForm'
import { Button, Menu, Segment, Portal } from 'semantic-ui-react'
import { API_ROOT } from '../api-config';

const portalStyle = { left: '40%', position: 'fixed', top: '30%', zIndex: 1000 }

const PortalNew = ({ render, open }) => {
  return (
    <Portal
      open={open}
      children={
        <Segment style={portalStyle}
          children={render()} />}
    />)
}
export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      activeItem: 'home', apps: [], displays: [],
      ready: false, appsPortal: false, displaysPortal: false,
      editDisplay: undefined
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.deleteApp = this.deleteApp.bind(this);
    this.deleteDisplay = this.deleteDisplay.bind(this);
    this.updateApps = this.updateApps.bind(this);
    this.updateDisplays = this.updateDisplays.bind(this);
    this.openAppsPortal = this.openAppsPortal.bind(this);
    this.openDisplaysPortal = this.openDisplaysPortal.bind(this);
    this.closePortals = this.closePortals.bind(this);
    this.handleEditDisplay = this.handleEditDisplay.bind(this);
  }

  componentDidMount() {
    this.updateApps()
    this.updateDisplays()
  }

  deleteApp(appid) {
    this.setState({ ready: false })
    const opts = { method: 'delete' }
    fetch(API_ROOT + 'apps/delete/' + appid, opts)
      .then((response) => this.updateApps())
      .catch((error) => {
        console.log(error)
        return [error]
      })
  }

  deleteDisplay(proxy, { id }) {
    this.setState({ ready: false })
    const opts = { method: 'delete' }
    fetch(API_ROOT + 'displays/delete/' + id, opts)
      .then((response) => this.updateDisplays())
      .catch((error) => {
        console.log(error)
        return [error]
      })
  }

  updateApps() {
    this.setState({ appsPortal: false })
    fetch(API_ROOT + 'apps/list')
      .then(resp => resp.json())
      .then(body => this.setState({ apps: body, ready: true }))
      .catch(err => console.log(err))
  }
  updateDisplays() {
    this.setState({ displaysPortal: false })
    fetch(API_ROOT + 'displays/list')
      .then(resp => resp.json())
      .then(body => this.setState({ displays: body, ready: true, editDisplay: undefined }))
      .catch(err => console.log(err))
  }

  handleItemClick(event, data) {
    const { name } = data
    this.setState({ activeItem: name })
  }
  openAppsPortal() {
    this.setState({ appsPortal: true })
  }
  openDisplaysPortal() {
    this.setState({ displaysPortal: true })
  }
  closePortals() {
    this.setState({ displaysPortal: false, appsPortal: false })
  }
  handleEditDisplay(proxy, { id }) {
    this.setState({ editDisplay: id, displaysPortal: true })
  }

  render() {
    const { activeItem, apps, displays, ready, appsPortal, displaysPortal, editDisplay } = this.state
    let addButton, list
    //console.log(this.state)
    switch (activeItem) {
      case "home":
        addButton = <React.Fragment>
          <Button color='green' onClick={this.openAppsPortal}> Create New App </Button>
          <PortalNew open={appsPortal} render={() => (
            <NewAppForm updateApps={this.updateApps}
              availableDisplays={displays}
              closePortal={this.closePortals} />
          )} />
        </React.Fragment>
        list = <AppList apps={apps} ready={ready} updateApps={this.updateApps} deleteApp={this.deleteApp} />
        break
      case 'displays':
        addButton = <React.Fragment>
          <Button color='green' onClick={this.openDisplaysPortal}> Create New Display </Button>
          <PortalNew open={displaysPortal} render={() => (
            <NewDisplayForm updateDisplays={this.updateDisplays} editDisplay={editDisplay}
              closePortal={this.closePortals} />
          )} />
        </React.Fragment>
        list = <DisplayList displays={displays} ready={ready}
          updateDisplays={this.updateDisplays} deleteDisplay={this.deleteDisplay}
          handleEditDisplay={this.handleEditDisplay} />
        break
      default:
    }
    return (
      <React.Fragment>
        <Menu pointing secondary>
          <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
          <Menu.Item name='displays' active={activeItem === 'displays'} onClick={this.handleItemClick} />
        </Menu>
        <Segment color='blue'>
          {addButton}
          {list}
        </Segment>
      </React.Fragment>
    );
  }
}
import React from 'react'
import { Link } from "react-router-dom";
import Navigator from "./Navigator"
import FolderForm from "./FolderForm"
import Explorer from './Explorer'
import ContentList from './ContentList'
import { Menu, Segment, Button, Portal } from 'semantic-ui-react'
import request from 'superagent'
import { API_ROOT, BACK_ROOT } from '../api-config'
import CodeFolders from './CodeFolders'
import ModalDrop from './ModalDrop'
import ContentDrop from './ContentDrop'
import DisplaysEditing from './DisplaysEditing'
import shortid from 'shortid'

const portalStyle = { left: '40%', position: 'fixed', top: '30%', zIndex: 1000 }

// Phase: ContentList/Explorer/NewFolder/codefolders
export default class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { name: "", folders: [] },
      displays: [],
      portalOpen: false,
      currentIndex: undefined,
      currentFolderName: '',
      currentFolderId: '',
      ready: false,
      phase: 'explorer',
      tab: 'app'
    }
    this.handleBackClick = this.handleBackClick.bind(this);
    this.getData = this.getData.bind(this);
    this.handleAddFolder = this.handleAddFolder.bind(this)
    this.handleSubmitFolder = this.handleSubmitFolder.bind(this)
    this.handleRemoveFolder = this.handleRemoveFolder.bind(this)
    this.handleFolderClick = this.handleFolderClick.bind(this)
    this.handleNavClick = this.handleNavClick.bind(this)
    this.handleChangeFolderName = this.handleChangeFolderName.bind(this)
    this.handleDeleteContent = this.handleDeleteContent.bind(this)
    this.downloadClick = this.downloadClick.bind(this)
    this.Display = this.Display.bind(this)
    this.handleTabClick = this.handleTabClick.bind(this)
    this.handleUpdateDisplays = this.handleUpdateDisplays.bind(this)
    this.handleRemoveDisplay = this.handleRemoveDisplay.bind(this)
    this.openPortal = this.openPortal.bind(this)
    this.closePortal = this.closePortal.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    request
      .get(API_ROOT + 'apps/find/' + this.props.match.params.id)
      .then((response) => {
        const data =
        {
          name: response.body.name,
          folders: response.body.appdata.folders
        }
        this.setState({ data: data, ready: true, displays: response.body.displays });
      })
      .catch((error) => {
        console.log(error)
        return [error]
      })
  }

  handleSubmitFolder(name, type) {
    let newFolder
    switch (type) {
      case 'code':
        newFolder = {
          "name": name,
          'type': type,
          'id': shortid.generate(),
          "content": {
            "Phone": [],
            "Display": []
          }
        };
        break
      default:
        newFolder = {
          "name": name,
          'type': type,
          'id': shortid.generate(),
          "content": []
        };
        break
    }
    const folders = [...this.state.data.folders, newFolder]
    const newJson = {
      ...this.state.data,
      folders: folders
    }
    this.setState({ data: newJson, phase: 'explorer' }, this.updateData)
  }

  handleChangeFolderName(oldName, newName) {
    const { folders } = this.state.data
    folders.forEach((folder) => {
      folder.name = folder.name === oldName ? newName : folder.name
    })
    const newJson = {
      ...this.state.data,
      folders: folders
    }
    this.setState({ data: newJson, phase: 'explorer' }, this.updateData)
  }

  handleAddFolder() {
    this.setState({ phase: 'newfolder' })
  }

  handleRemoveFolder(name) {
    const { folders } = this.state.data
    const newFolders = folders.filter(folder => folder.name !== name)
    const newJson = {
      ...this.state.data,
      folders: newFolders
    }
    this.setState({ data: newJson }, this.updateData)
  }

  handleFolderClick(event, { value }) {
    // Click on code folder (it is represented by a string, not an index)
    const { currentFolderId } = this.state
    if (typeof value === 'string') {
      const url = `${BACK_ROOT}/${this.props.match.params.id}/${currentFolderId}/${value}`;
      window.open(url, '_blank');
      return
    }
    //Click on a folder represented by an index
    const folder = this.state.data.folders[value]
    let phase = folder.type === 'code' ? 'codefolders' : 'contentlist'
    this.setState({
      phase: phase,
      currentIndex: value,
      currentFolderName: folder.name,
      currentFolderId: folder.id
    })
  }

  handleNavClick(event, { value }) {
    //this.updateData()
    if (value === 'app') {
      this.setState({
        phase: 'explorer',
        currentIndex: undefined,
        currentFolderName: ''
      })
    } else {
      this.setState({
        phase: 'codefolders'
      })
    }
  }

  updateData() {
    const { folders } = this.state.data
    request
      .put(API_ROOT + 'apps/updatedata/' + this.props.match.params.id)
      .send({ folders: folders })
      .then((response) => {
      })
      .catch((error) => {
        console.log(error)
        return [error]
      })
  }

  handleUpdateDisplays(displays) {
    request
      .put(API_ROOT + 'apps/updatedisplays/' + this.props.match.params.id)
      .send(displays)
      .then((response) => {
        this.setState({ displays: displays })
      })
      .catch((error) => {
        console.log(error)
        return [error]
      })
  }

  handleRemoveDisplay(event, { id }) {
    const { displays } = this.state
    const newDisplays = displays.filter(disp => disp !== id)
    this.handleUpdateDisplays(newDisplays)
  }

  handleBackClick() {
    this.updateData()
  }

  handleDeleteContent(event, { value }) {
    this.setState({ ready: false })
    const { currentIndex } = this.state

    request
      .put(`${API_ROOT}apps/${this.props.match.params.id}/remove/${value}`)
      .send({ index: currentIndex })
      .then((response) => {
        this.getData()
      })
      .catch((error) => {
        console.log(error)
        return [error]
      })
  }
  downloadClick(event, { value }) {
    const { currentFolderId } = this.state
    window.open(`${API_ROOT}apps/${this.props.match.params.id}/download/${currentFolderId}/${value}`, '_blank');
  }
  handleTabClick(event, { id }) {
    this.setState({ tab: id })
  }
  closePortal(){
    this.setState({portalOpen:false})
  }
  openPortal(){
    this.setState({portalOpen: true})
  }

  // Switch display
  Display(props) {
    const { folders } = this.state.data
    const { currentIndex, phase, currentFolderId, tab, displays } = this.state
    // CurrentIndex can also be 0
    const currentFolder = currentIndex !== undefined ? folders[currentIndex] : undefined
    const { id } = this.props.match.params
    if (tab === 'app') {
      switch (phase) {
        case 'contentlist':
          return <ContentList content={currentFolder.content}
            onClick={this.handleDeleteContent}
            folder={currentFolderId}
            appid={id} />
        // Explorer
        case 'codefolders':
          return <CodeFolders
            handleClick={this.handleFolderClick}
            downloadClick={this.downloadClick}
            appid={id}
            folderId={currentFolderId}
            currentIndex={currentIndex} />
        default:
          return <Explorer
            addCallback={this.handleAddFolder}
            removeCallback={this.handleRemoveFolder}
            folders={folders}
            appid={id}
            changeCallback={this.handleChangeFolderName}
            handleClick={this.handleFolderClick} />
      }
    } else {
      return <DisplaysEditing displays={displays}
        handleRemoveDisplay={this.handleRemoveDisplay}
        handleUpdateDisplays={this.handleUpdateDisplays} />
    }
  }

  render() {
    //console.log(this.state)
    const { name } = this.state.data
    const { ready, currentIndex, currentFolderName, currentFolderId, phase, tab, portalOpen } = this.state
    const { id } = this.props.match.params
    return (
      <React.Fragment>
        <Menu secondary pointing >
          <Link to="/">
            <Menu.Item name='home' active={false} />
          </Link>
          <Menu.Item name='app' id='app' active={tab === 'app'} onClick={this.handleTabClick} />
          <Menu.Item name='bound displays' id='displays' active={tab === 'displays'} onClick={this.handleTabClick} />
        </Menu>
        <Segment color='blue' loading={!ready}>
          {(tab === 'app') &&
            <React.Fragment>
              {phase === 'explorer' &&
                <React.Fragment>
                  <Button positive children="New Folder" onClick={this.openPortal} />
                  <Portal open={portalOpen} children={
                    <Segment style={portalStyle}
                      children={
                        <FolderForm addCallback={this.handleSubmitFolder}
                          closePortal={this.closePortal} />
                    } />}
                  />
                </React.Fragment>
              }
              <Menu borderless secondary>
                {phase !== 'newfolder' &&
                  <Menu.Item position='left' >
                    <Navigator
                      id={name}
                      folder={currentFolderName}
                      handleClick={this.handleNavClick} />
                  </Menu.Item>
                }
                {phase === 'contentlist' &&
                  <Menu.Item position='right'>
                    <ModalDrop render={(header = "Upload content") => (<ContentDrop
                      index={currentIndex}
                      appid={id}
                      folderId={currentFolderId}
                      getData={this.getData} />
                    )} />
                  </Menu.Item>
                }
              </Menu>
            </React.Fragment>
          }
          <this.Display />
        </Segment>
      </React.Fragment>
    );
  }
}
import React from 'react'
import Navigator from "./Navigator"
import FolderForm from "./FolderForm"
import { Link } from 'react-router-dom'
import Explorer from './Explorer'
import ContentList from './ContentList'
import { Button, Icon, Menu, Divider, Segment } from 'semantic-ui-react'
import request from 'superagent'
import { API_ROOT, BACK_ROOT } from '../api-config';
import CodeFolders from './CodeFolders';
import ModalDrop from './ModalDrop'
import ContentDrop from './ContentDrop';

// Phase: ContentList/Explorer/NewFolder/codefolders
export default class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: { name: "", folders: [] },
            currentIndex: undefined,
            currentFolderName: '',
            codeFolder: '',
            ready: false,
            phase: 'explorer'
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
                this.setState({ data: data, ready: true });
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

    handleRemoveFolder(event, { value }) {
        const { folders } = this.state.data
        const newFolders = folders.filter(folder => folder.name !== value)
        const newJson = {
            ...this.state.data,
            folders: newFolders
        }
        this.setState({ data: newJson }, this.updateData)
    }

    handleFolderClick(event, { value }) {
        // Click on code folder (it is represented by a string, not an index)
        const {currentFolderName} = this.state
        if (typeof value === 'string') {
            const url = `${BACK_ROOT}/${this.props.match.params.id}/${currentFolderName}/${value}`;
            window.open(url, '_blank');
            // this.setState({
            //     phase: 'codelist',
            //     codeFolder: value
            // })
            return
        }
        //Click on a folder represented by an index
        const folder = this.state.data.folders[value]     
        if (folder.type === 'code') {
            this.setState({
                phase: 'codefolders',
                currentIndex: value,
                currentFolderName: folder.name
            })
        } else {
            this.setState({
                phase: 'contentlist',
                currentIndex: value,
                currentFolderName: folder.name
            })
        }
    }

    handleNavClick(event, { value }) {
        //this.updateData()
        if (value === 'app') {
            this.setState({
                phase: 'explorer',
                currentIndex: undefined,
                codeFolder: '',
                currentFolderName: ''
            })
        } else {
            this.setState({
                phase: 'codefolders',
                codeFolder: ''
            })
        }
    }

    updateData() {
        const { folders } = this.state.data
        request
            .put(API_ROOT + 'apps/update/' + this.props.match.params.id)
            .send({ folders: folders })
            .then((response) => {
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
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
    downloadClick(event, { value }){
        window.open(`${API_ROOT}apps/${this.props.match.params.id}/download/${value}`, '_blank');
    }

    // Switch display
    Display(props) {
        const { folders } = this.state.data
        const { currentIndex, phase, currentFolderName } = this.state
        // CurrentIndex can also be 0
        const currentFolder = currentIndex !== undefined ? folders[currentIndex] : undefined
        const { id } = this.props.match.params
        switch (phase) {
            case 'contentlist':
                return <ContentList content={currentFolder.content}
                onClick={this.handleDeleteContent}
                folder={currentFolderName}
                appid = {id}/>
            case 'newfolder':
                return <FolderForm addCallback={this.handleSubmitFolder} />
            // Explorer
            case 'codefolders':
                return <CodeFolders
                    handleClick={this.handleFolderClick}
                    downloadClick={this.downloadClick}
                    id={id}
                    currentFolderName={currentFolderName}
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
    }

    render() {
        console.log(this.state)
        const { name } = this.state.data
        const { ready, currentIndex, currentFolderName, codeFolder, phase } = this.state
        const { id } = this.props.match.params
        // currentIndex can be 0
        //const currentFolder = currentIndex !== undefined ? folders[currentIndex] : undefined
        return (
            <div>
                <Menu secondary>
                    <Menu.Item>
                        <Link to="/">
                            <Button icon labelPosition='left' onClick={this.handleBackClick}>
                                <Icon name='reply' />
                                Home
                            </Button>
                        </Link>
                    </Menu.Item>
                    {phase === 'contentlist' &&
                        <Menu.Item position="right">
                            <ModalDrop render={(header = "Upload content") => (<ContentDrop
                                index={currentIndex}
                                appid={id}
                                folderName={currentFolderName}
                                getData={this.getData} />
                            )} />
                        </Menu.Item>}
                </Menu>
                <Navigator
                    id={name}
                    folder={currentFolderName}
                    codeFolder={codeFolder}
                    handleClick={this.handleNavClick} />
                <Divider horizontal />
                <Segment color='teal' loading={!ready}>
                    <this.Display />
                </Segment>
            </div>
        );
    }
}
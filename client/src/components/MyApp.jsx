import React from 'react'
import Navigator from "./Navigator"
import FormFolder from "./FolderForm"
import ModalDrop from './ModalDrop'
import { Link } from 'react-router-dom'
import Explorer from './Explorer'
import ContentList from './ContentList'
import { Button, Icon, Menu, Divider, Segment } from 'semantic-ui-react'
import request from 'superagent'
import { API_ROOT } from '../api-config';
import CodeFolders from './CodeFolders';
import CodeList from './CodeList';

// Phase: ContentList/Explorer/NewFolder/codefolders/codelist
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
                        "phone": [],
                        "drone": []
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
        // Code folders
        if (typeof value === 'string') {
            this.setState({
                phase: 'codelist',
                codeFolder: value
            })
            return
        }
        const folder = this.state.data.folders[value]
        //console.log("MyApp handle folderclick",folder)      
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
        if(value==='app'){
            this.setState({
                phase: 'explorer',
                currentIndex: undefined,
                codeFolder:'',
                currentFolderName: ''
            })
        }else{
            this.setState({
                phase: 'codefolders',
                codeFolder:''
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

    // Switch display
    Display(props) {
        const { folders } = this.state.data
        const { currentIndex, phase, codeFolder } = this.state
        // CurrentIndex can also be 0
        const currentFolder = currentIndex !== undefined ? folders[currentIndex] : undefined
        switch (phase) {
            case 'contentlist':
                return <ContentList content={currentFolder.content} />
            case 'newfolder':
                return <FormFolder addCallback={this.handleSubmitFolder} />
            // Explorer
            case 'codefolders':
                return <CodeFolders
                    handleClick={this.handleFolderClick} />
            case 'codelist':
                return <CodeList
                    folderName={codeFolder}
                    code={currentFolder.content[codeFolder]}
                    index={currentIndex}
                    appid={this.props.match.params.id}
                    getData={this.getData} />
            default:
                return <Explorer
                    addCallback={this.handleAddFolder}
                    removeCallback={this.handleRemoveFolder}
                    folders={folders}
                    appid={this.props.match.params.id}
                    changeCallback={this.handleChangeFolderName}
                    handleClick={this.handleFolderClick} />
        }
    }

    render() {
        const { name, folders } = this.state.data
        const { ready, currentIndex, currentFolderName, codeFolder } = this.state
        // currentIndex can be 0
        const currentFolder = currentIndex !== undefined ? folders[currentIndex] : undefined
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
                    {currentFolder && currentFolder.type === 'content' &&
                        <Menu.Item position="right">
                            <ModalDrop
                                folderName={currentFolderName}
                                index={currentIndex}
                                appid={this.props.match.params.id}
                                getData={this.getData} />
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
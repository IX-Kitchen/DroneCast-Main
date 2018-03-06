import React from 'react'
import Navigator from "./Navigator"
import ModalDrop from './ModalDrop'
import { Link } from 'react-router-dom'
import Explorer from './Explorer'
import ContentList from './ContentList'
import { Button, Icon, Menu, Divider, Segment } from 'semantic-ui-react'
import request from 'superagent'
import { API_ROOT } from '../api-config';

/*
const json = {
    "appId": "Test",
    "folders": [
        {
            "name": "Folder1",
            "content": ["Video1", "Video2"]
        }
    ]
}
*/

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: { appId: "", folders: [] },
            currentIndex: undefined,
            ready: false
        }
        this.handleBackClick = this.handleBackClick.bind(this);
        this.getData = this.getData.bind(this);
        this.handleAddFolder = this.handleAddFolder.bind(this)
        this.handleRemoveFolder = this.handleRemoveFolder.bind(this)
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
                        appId: response.body.name,
                        folders: response.body.appdata.folders
                    }
                this.setState({ data: data, ready: true });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    handleAddFolder() {
        const name = "Folder" + (this.state.data.folders.length + 1);
        const newFolder = {
            "name": name,
            "content": []
        };
        const folders = [...this.state.data.folders, newFolder]
        const newJson = {
            ...this.state.data,
            folders: folders
        }
        this.setState({ data: newJson })
    }

    handleRemoveFolder() {
        let folders = this.state.data.folders.slice()
        folders.pop();
        let newJson = {
            ...this.state.data,
            folders: folders
        }
        this.setState({ data: newJson })
    }

    handleFolderClick(index) {
        this.setState({
            currentIndex: index
        })
    }

    handleNavClick(type) {
        this.setState({
            currentIndex: undefined
        })
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

    render() {

        const { appId, folders } = this.state.data
        const { ready, currentIndex } = this.state
        const currentFolder = currentIndex !== undefined ? folders[currentIndex] : undefined
        const currentFolderName = currentFolder ? currentFolder.name : undefined

        return (
            <div>
                <Menu secondary>
                    <Menu.Item>
                        <Link to="/">
                            <Button icon labelPosition='left' onClick={this.handleBackClick}>
                                <Icon name='reply' />
                                Back
                            </Button>
                        </Link>
                    </Menu.Item>
                    {currentIndex !== undefined &&
                        <Menu.Item position="right">
                            <ModalDrop
                                folderName={currentFolderName}
                                index={currentIndex}
                                appid={this.props.match.params.id}
                                getData={this.getData} />
                        </Menu.Item>}
                </Menu>
                <Navigator
                    id={appId}
                    folder={currentFolderName}
                    handleClick={(type) => this.handleNavClick(type)} />
                <Divider horizontal />
                <Segment color='teal' loading={!ready}>
                    {currentIndex !== undefined ? (
                        <ContentList content={currentFolder.content} />
                    ) : (

                            <Explorer
                                addCallback={this.handleAddFolder}
                                removeCallback={this.handleRemoveFolder}
                                folders={folders}
                                handleClick={(index) => this.handleFolderClick(index)} />
                        )}
                </Segment>
            </div>
        );
    }
}
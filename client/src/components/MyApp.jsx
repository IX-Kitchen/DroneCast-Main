import React from 'react'
import Navigator from "./Navigator"
import Dropzone from './Dropzone';
import { Link } from 'react-router-dom'
import Explorer from './Explorer'
import ContentList from './ContentList'
import { Button, Icon } from 'semantic-ui-react'
import request from 'superagent'

/*
const json = {
    "AppId": "Test",
    "folders": [
        {
            "name": "Folder1",
            "subfolders": [
                {
                    "name": "SubFolder1",
                    "content": ["Video1", "Video2"]
                }
            ]

        },
        {
            "name": "Folder2",
            "subfolders": [
                {
                    "name": "SubFolder1",
                    "content": ["Video1", "Video2"]
                }
            ]

        }
    ]
}
*/

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: { AppId: "", folders: [] },
            currentFolder: {
                "index": 0,
                "subindex": 0,
                "type": "Main"
            }
        }
        this.handleBackClick = this.handleBackClick.bind(this);
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        request
            .get('http://' + window.location.hostname + ':8080/api/apps/find/' + this.props.match.params.id)
            .then((response) => {
                const data =
                    {
                        AppId: response.body.name,
                        folders: response.body.appdata.folders
                    }
                this.setState({ data: data });
            })
            .catch((error) => {
                console.log(error)
                return [error]
            })
    }

    handleAddFolder() {
        let name = "Folder" + (this.state.data.folders.length + 1);
        let newFolder = {
            "name": name,
            "subfolders": [{
                "name": "SubFolder1",
                "content": []
            }]
        };
        const folders = [...this.state.data.folders, newFolder]
        let newJson = {
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

    handleAddSubFolder(index) {
        const folders = this.state.data.folders.slice()
        const folder = JSON.parse(JSON.stringify(folders[index]))
        let name = "SubFolder" + (folder.subfolders.length + 1);
        let newSubFolder = {
            "name": name,
            "content": []
        }
        const subfolders = [...folder.subfolders, newSubFolder]
        const newFolder = {
            ...folder,
            subfolders: subfolders
        };
        folders[index] = newFolder
        const newJson = {
            ...this.state.data,
            folders: folders
        }
        this.setState({ data: newJson })
    }
    handleRemoveSubFolder(index) {
        const folders = this.state.data.folders.slice()
        const folder = folders[index]
        const subfolders = folder.subfolders.slice(0, -1)
        let newFolder = {
            ...folder,
            subfolders: subfolders
        };
        folders[index] = newFolder
        let newJson = {
            ...this.state.data,
            folders: folders
        }
        this.setState({ data: newJson })
    }

    handleFolderClick(index) {
        const state = JSON.parse(JSON.stringify(this.state.currentFolder))
        let myIndex = this.state.currentFolder.index
        let mySubIndex = this.state.currentFolder.subindex
        let type
        switch (state.type) {
            case "Main":
                type = "Folder"
                myIndex = index
                break;
            case "Folder":
                type = "SubFolder"
                mySubIndex = index
                this.updateData()
                break;
            default:
                type = "Main"
                break

        }
        this.setState({
            currentFolder: {
                index: myIndex,
                subindex: mySubIndex,
                type: type
            }
        })
    }

    handleNavClick(type) {
        switch (type) {
            case "Main":

                break
            default:
                break
        }
        const state = JSON.parse(JSON.stringify(this.state.currentFolder))
        state.type = type
        this.setState({
            currentFolder: state
        })
    }

    updateData() {
        request
            .put('http://' + window.location.hostname + ':8080/api/apps/update/' + this.props.match.params.id)
            .send({ folders: this.state.data.folders })
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
        let add, remove, folders, folder, subfolder, thisFolder
        const { index, subindex } = this.state.currentFolder

        switch (this.state.currentFolder.type) {
            case "Main":
                add = () => this.handleAddFolder()
                remove = () => this.handleRemoveFolder()
                folders = this.state.data.folders
                break;
            case "Folder":
                add = () => this.handleAddSubFolder(index)
                remove = () => this.handleRemoveSubFolder(index)
                thisFolder = this.state.data.folders[index]
                folders = thisFolder.subfolders
                folder = thisFolder.name
                break;
            case "SubFolder":
                thisFolder = this.state.data.folders[index]
                folder = thisFolder.name
                thisFolder = thisFolder.subfolders[subindex]
                folders = thisFolder.content
                subfolder = thisFolder.name
                break
            default:
                break;

        }

        return (
            <div>
                <Link to="/">
                    <Button icon labelPosition='left' onClick={this.handleBackClick}>
                        <Icon name='reply' />
                        Back
                    </Button>
                </Link>
                <hr />
                <Navigator
                    id={this.state.data.AppId}
                    folder={folder}
                    subfolder={subfolder}
                    handleClick={(type) => this.handleNavClick(type)} />
                {this.state.currentFolder.type === "SubFolder" ? (
                    <div>
                        <Dropzone
                            index={index}
                            subindex={subindex}
                            appid={this.props.match.params.id}
                            getData={this.getData} />
                        <ContentList content={folders} />
                        <Button icon labelPosition='left' onClick={this.handleBackClick}>
                            <Icon name='upload' />
                            Back
                        </Button>
                    </div>

                ) : (
                        <Explorer
                            addCallback={add}
                            removeCallback={remove}
                            folders={folders}
                            handleClick={(index) => this.handleFolderClick(index)} />
                    )}

            </div>
        );
    }
}
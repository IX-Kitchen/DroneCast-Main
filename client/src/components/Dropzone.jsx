import React from 'react'
import DropzoneComponent from 'react-dropzone-component';
import './css/dropzone.min.css';
import './css/filepicker.css';
import { API_ROOT } from '../api-config';

//var myDropZone;

var componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: false,
    postUrl: API_ROOT + 'apps/upload'
};
var djsConfig = {
    acceptedFiles: "image/*, video/*",
    autoProcessQueue: true,
    addRemoveLinks: false,
    paramName: "imgUploader",
    dictDefaultMessage: "Drop your content here"
};

var eventHandlers = {
    //init: (dropzone) => { myDropZone = dropzone},
    error: (file, error, xhr) => console.log("Error component",error, xhr)
    //success: (file) => console.log("Success"),
}
export default class Dropzone extends React.Component {

    componentWillMount(){
        djsConfig.params = {
            appid: this.props.appid,
            index: this.props.index,
            folderName: this.props.folderName
        }
        eventHandlers.complete = this.props.getData;
    }
    
    render() {
        return (
            <DropzoneComponent config={componentConfig}
                eventHandlers={eventHandlers}
                djsConfig={djsConfig} />
        );
    }
}